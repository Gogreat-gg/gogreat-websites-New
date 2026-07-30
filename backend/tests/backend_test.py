"""Backend API tests for GoGreat consulting site (Iteration 3: JWT admin auth + status tags)."""
import os
import time
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://business-leak-finder.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "hello@gogreat.in"
ADMIN_PASSWORD = "Greatsec@123"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def token(client):
    r = client.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="module")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ---------- Root ----------
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "GoGreat" in r.json().get("message", "")


# ---------- Admin login ----------
class TestAdminLogin:
    def test_login_success(self, client):
        r = client.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        d = r.json()
        assert d["email"] == ADMIN_EMAIL
        assert isinstance(d["token"], str) and len(d["token"]) > 20

    def test_login_wrong_password(self, client):
        r = client.post(f"{API}/admin/login", json={"email": ADMIN_EMAIL, "password": "WRONG"})
        assert r.status_code == 401

    def test_login_wrong_email(self, client):
        r = client.post(f"{API}/admin/login", json={"email": "nobody@example.com", "password": ADMIN_PASSWORD})
        assert r.status_code == 401


# ---------- Auth protection on GET ----------
class TestProtection:
    def test_get_health_scan_requires_auth(self, client):
        r = client.get(f"{API}/health-scan")
        assert r.status_code == 401

    def test_get_contact_requires_auth(self, client):
        r = client.get(f"{API}/contact")
        assert r.status_code == 401

    def test_get_health_scan_with_token(self, client, auth_headers):
        r = client.get(f"{API}/health-scan", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_get_contact_with_token(self, client, auth_headers):
        r = client.get(f"{API}/contact", headers=auth_headers)
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_invalid_token_rejected(self, client):
        r = client.get(f"{API}/health-scan", headers={"Authorization": "Bearer garbage.token.here"})
        assert r.status_code == 401


# ---------- Public POST still works ----------
class TestPublicPost:
    def test_health_scan_post_public_fast(self, client):
        t0 = time.time()
        r = client.post(f"{API}/health-scan", json={"name": "TEST_Public", "phone": "9000000099"})
        elapsed = time.time() - t0
        assert r.status_code == 200
        assert elapsed < 5.0
        d = r.json()
        assert d["status"] == "new"  # default status

    def test_contact_post_public_fast(self, client):
        t0 = time.time()
        r = client.post(f"{API}/contact", json={"name": "TEST_Public", "phone": "9000000098"})
        elapsed = time.time() - t0
        assert r.status_code == 200
        assert elapsed < 5.0
        assert r.json()["status"] == "new"


# ---------- Health Scan create/persist ----------
class TestHealthScan:
    def test_create_full_and_persist(self, client, auth_headers):
        payload = {
            "turnover": "10-50L", "accounting": "Tally", "inventory": "Manual",
            "staff": "5-10", "followup": "WhatsApp", "technology": "Basic",
            "biggest_challenge": "TEST_cashflow", "future_goal": "Grow 2x",
            "name": "TEST_User", "company": "TEST_Co", "phone": "9876543210",
        }
        r = client.post(f"{API}/health-scan", json=payload)
        assert r.status_code == 200
        data = r.json()
        assert data["name"] == "TEST_User"
        assert data["status"] == "new"
        r2 = client.get(f"{API}/health-scan", headers=auth_headers)
        assert r2.status_code == 200
        assert data["id"] in [d["id"] for d in r2.json()]

    def test_missing_name_returns_422(self, client):
        r = client.post(f"{API}/health-scan", json={"phone": "9999999999"})
        assert r.status_code == 422

    def test_missing_phone_returns_422(self, client):
        r = client.post(f"{API}/health-scan", json={"name": "TEST_NoPhone"})
        assert r.status_code == 422

    def test_list_no_mongo_id(self, client, auth_headers):
        r = client.get(f"{API}/health-scan", headers=auth_headers)
        assert r.status_code == 200
        for d in r.json()[:5]:
            assert "_id" not in d


# ---------- Contact create/persist ----------
class TestContact:
    def test_create_and_persist(self, client, auth_headers):
        payload = {"name": "TEST_Contact", "phone": "9000000001",
                   "email": "test@example.com", "business": "TEST_Biz",
                   "message": "TEST_message body"}
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert d["name"] == "TEST_Contact"
        assert d["status"] == "new"
        r2 = client.get(f"{API}/contact", headers=auth_headers)
        assert d["id"] in [x["id"] for x in r2.json()]

    def test_missing_name(self, client):
        r = client.post(f"{API}/contact", json={"phone": "9000000000"})
        assert r.status_code == 422

    def test_missing_phone(self, client):
        r = client.post(f"{API}/contact", json={"name": "TEST_NoPh"})
        assert r.status_code == 422


# ---------- Status PATCH ----------
class TestStatusUpdate:
    def test_patch_health_scan_requires_auth(self, client):
        # need an id first
        r = client.post(f"{API}/health-scan", json={"name": "TEST_S", "phone": "1"})
        sid = r.json()["id"]
        r2 = client.patch(f"{API}/health-scan/{sid}", json={"status": "contacted"})
        assert r2.status_code == 401

    def test_patch_health_scan_success_and_persist(self, client, auth_headers):
        r = client.post(f"{API}/health-scan", json={"name": "TEST_S2", "phone": "2"})
        sid = r.json()["id"]
        r2 = client.patch(f"{API}/health-scan/{sid}", json={"status": "contacted"}, headers=auth_headers)
        assert r2.status_code == 200, r2.text
        assert r2.json()["status"] == "contacted"
        # verify persistence
        listing = client.get(f"{API}/health-scan", headers=auth_headers).json()
        found = next((x for x in listing if x["id"] == sid), None)
        assert found and found["status"] == "contacted"

    def test_patch_health_scan_invalid_status(self, client, auth_headers):
        r = client.post(f"{API}/health-scan", json={"name": "TEST_S3", "phone": "3"})
        sid = r.json()["id"]
        r2 = client.patch(f"{API}/health-scan/{sid}", json={"status": "banana"}, headers=auth_headers)
        assert r2.status_code == 400

    def test_patch_health_scan_unknown_id(self, client, auth_headers):
        r = client.patch(f"{API}/health-scan/does-not-exist-uuid", json={"status": "closed"}, headers=auth_headers)
        assert r.status_code == 404

    def test_patch_contact_requires_auth(self, client):
        r = client.post(f"{API}/contact", json={"name": "TEST_C", "phone": "1"})
        cid = r.json()["id"]
        r2 = client.patch(f"{API}/contact/{cid}", json={"status": "contacted"})
        assert r2.status_code == 401

    def test_patch_contact_success(self, client, auth_headers):
        r = client.post(f"{API}/contact", json={"name": "TEST_C2", "phone": "2"})
        cid = r.json()["id"]
        r2 = client.patch(f"{API}/contact/{cid}", json={"status": "closed"}, headers=auth_headers)
        assert r2.status_code == 200
        assert r2.json()["status"] == "closed"

    def test_patch_contact_invalid_status(self, client, auth_headers):
        r = client.post(f"{API}/contact", json={"name": "TEST_C3", "phone": "3"})
        cid = r.json()["id"]
        r2 = client.patch(f"{API}/contact/{cid}", json={"status": "archived"}, headers=auth_headers)
        assert r2.status_code == 400

    def test_patch_contact_unknown_id(self, client, auth_headers):
        r = client.patch(f"{API}/contact/no-such-id", json={"status": "new"}, headers=auth_headers)
        assert r.status_code == 404
