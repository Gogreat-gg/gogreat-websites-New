from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="GoGreat API")
api_router = APIRouter(prefix="/api")


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


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


# ---------- Routes ----------
@api_router.get("/")
async def root():
    return {"message": "GoGreat API running"}


@api_router.post("/health-scan", response_model=HealthScan)
async def create_health_scan(payload: HealthScanCreate):
    obj = HealthScan(**payload.model_dump())
    await db.health_scans.insert_one(obj.model_dump())
    return obj


@api_router.get("/health-scan", response_model=List[HealthScan])
async def list_health_scans():
    docs = await db.health_scans.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [HealthScan(**d) for d in docs]


@api_router.post("/contact", response_model=Contact)
async def create_contact(payload: ContactCreate):
    obj = Contact(**payload.model_dump())
    await db.contacts.insert_one(obj.model_dump())
    return obj


@api_router.get("/contact", response_model=List[Contact])
async def list_contacts():
    docs = await db.contacts.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return [Contact(**d) for d in docs]


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
