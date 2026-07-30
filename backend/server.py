from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import hmac
import logging
import asyncio
import httpx
import jwt
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Emergent managed email proxy (constant — must survive deployment)
EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ.get("EMAIL_FROM_NAME", "GoGreat")
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "hello@gogreat.in")

# Admin auth (single admin from env)
JWT_SECRET = os.environ.get("JWT_SECRET", "change-me")
JWT_ALGORITHM = "HS256"
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "hello@gogreat.in").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
bearer_scheme = HTTPBearer(auto_error=False)


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "type": "access",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def require_admin(creds: Optional[HTTPAuthorizationCredentials] = Depends(bearer_scheme)):
    if creds is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired. Please log in again.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    if payload.get("sub", "").lower() != ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Not authorized")
    return payload["sub"]


app = FastAPI(title="GoGreat API")
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


async def send_lead_email(subject: str, html_content: str, reply_to: Optional[str] = None):
    """Fire-and-forget lead notification email. Never raises to the caller."""
    if not EMAIL_KEY:
        logging.warning("EMERGENT_EMAIL_KEY not set; skipping email notification")
        return
    payload = {
        "to": [OWNER_EMAIL],
        "subject": subject,
        "html": html_content,
        "from_name": EMAIL_FROM_NAME,
    }
    if reply_to:
        payload["contact_email"] = reply_to
    try:
        async with httpx.AsyncClient(timeout=30) as hc:
            resp = await hc.post(
                f"{EMAIL_BASE_URL}/api/v1/email/send",
                headers={"X-Email-Key": EMAIL_KEY},
                json=payload,
            )
        resp.raise_for_status()
    except Exception as e:  # noqa: BLE001
        logging.error(f"Lead email send failed: {e}")


def _row(label: str, value: str) -> str:
    value = value or "—"
    return (
        f'<tr><td style="padding:8px 12px;border:1px solid #e5e5e5;'
        f'background:#f7f8ff;font-weight:600;color:#0a0a0a;width:38%">{label}</td>'
        f'<td style="padding:8px 12px;border:1px solid #e5e5e5;color:#404040">{value}</td></tr>'
    )


# ---------- Models ----------
class HealthScanCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    turnover: str = ""
    accounting: str = ""
    inventory: str = ""
    staff: str = ""
    followup: str = ""
    technology: str = ""
    biggest_challenge: str = ""
    future_goal: str = ""
    name: str
    company: str = ""
    phone: str


class HealthScan(HealthScanCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    status: str = "new"


class ContactCreate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    name: str
    phone: str
    email: Optional[str] = ""
    business: Optional[str] = ""
    message: str = ""


class Contact(ContactCreate):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: str = Field(default_factory=now_iso)
    status: str = "new"


class LoginRequest(BaseModel):
    email: str
    password: str


class StatusUpdate(BaseModel):
    status: str


ALLOWED_STATUSES = {"new", "contacted", "closed"}


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "GoGreat API running"}


@api_router.post("/health-scan", response_model=HealthScan)
async def create_health_scan(payload: HealthScanCreate):
    obj = HealthScan(**payload.model_dump())
    await db.health_scans.insert_one(obj.model_dump())
    html = (
        f'<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto">'
        f'<h2 style="color:#0033FF;margin:0 0 4px">New Free Health Scan lead</h2>'
        f'<p style="color:#404040;margin:0 0 16px">A business owner just completed the Vaniga Nala Aayvu scan.</p>'
        f'<table style="border-collapse:collapse;width:100%;font-size:14px">'
        f'{_row("Name", obj.name)}{_row("Business", obj.company)}{_row("Phone", obj.phone)}'
        f'{_row("Annual turnover", obj.turnover)}{_row("Accounting", obj.accounting)}'
        f'{_row("Inventory", obj.inventory)}{_row("Staff / KPI", obj.staff)}'
        f'{_row("Customer follow-up", obj.followup)}{_row("Technology", obj.technology)}'
        f'{_row("Biggest challenge", obj.biggest_challenge)}{_row("6-month goal", obj.future_goal)}'
        f'</table></div>'
    )
    asyncio.create_task(send_lead_email(f"New Health Scan — {obj.name} ({obj.company or 'MSME'})", html))
    return obj


@api_router.post("/admin/login")
async def admin_login(payload: LoginRequest):
    email_ok = payload.email.strip().lower() == ADMIN_EMAIL
    pass_ok = hmac.compare_digest(payload.password, ADMIN_PASSWORD) if ADMIN_PASSWORD else False
    if not (email_ok and pass_ok):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(ADMIN_EMAIL)
    return {"token": token, "email": ADMIN_EMAIL}


@api_router.get("/health-scan", response_model=List[HealthScan])
async def list_health_scans(_: str = Depends(require_admin)):
    docs = await db.health_scans.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [HealthScan(**d) for d in docs]


@api_router.patch("/health-scan/{scan_id}", response_model=HealthScan)
async def update_health_scan_status(scan_id: str, payload: StatusUpdate, _: str = Depends(require_admin)):
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.health_scans.find_one_and_update(
        {"id": scan_id}, {"$set": {"status": payload.status}},
        projection={"_id": 0}, return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Scan not found")
    return HealthScan(**res)


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    obj = Contact(**payload.model_dump())
    await db.contacts.insert_one(obj.model_dump())
    html = (
        f'<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto">'
        f'<h2 style="color:#0033FF;margin:0 0 4px">New contact enquiry</h2>'
        f'<table style="border-collapse:collapse;width:100%;font-size:14px">'
        f'{_row("Name", obj.name)}{_row("Phone", obj.phone)}{_row("Email", obj.email)}'
        f'{_row("Business", obj.business)}{_row("Message", obj.message)}'
        f'</table></div>'
    )
    asyncio.create_task(send_lead_email(f"New Contact — {obj.name}", html, reply_to=obj.email or None))
    return obj


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts(_: str = Depends(require_admin)):
    docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Contact(**d) for d in docs]


@api_router.patch("/contact/{contact_id}", response_model=Contact)
async def update_contact_status(contact_id: str, payload: StatusUpdate, _: str = Depends(require_admin)):
    if payload.status not in ALLOWED_STATUSES:
        raise HTTPException(status_code=400, detail="Invalid status")
    res = await db.contacts.find_one_and_update(
        {"id": contact_id}, {"$set": {"status": payload.status}},
        projection={"_id": 0}, return_document=True,
    )
    if not res:
        raise HTTPException(status_code=404, detail="Contact not found")
    return Contact(**res)


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO,
                    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
