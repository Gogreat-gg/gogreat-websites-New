"""Backend API tests for GoGreat consulting site."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://business-leak-finder.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Root ----------
def test_root(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    assert "GoGreat" in r.json().get("message", "")


# ---------- Email side-effect non-blocking ----------
import time

def test_health_scan_response_is_fast_email_nonblocking(client):
    """Email dispatch must be fire-and-forget; POST should return promptly."""
    t0 = time.time()
    r = client.post(f"{API}/health-scan", json={"name": "TEST_Fast", "phone": "9000000099"})
    elapsed = time.time() - t0
    assert r.status_code == 200
    # If email were blocking (30s timeout), request would hang; assert < 5s
    assert elapsed < 5.0, f"Health-scan POST took {elapsed:.2f}s — email may be blocking"


def test_contact_response_is_fast_email_nonblocking(client):
    t0 = time.time()
    r = client.post(f"{API}/contact", json={"name": "TEST_Fast", "phone": "9000000098"})
    elapsed = time.time() - t0
    assert r.status_code == 200
    assert elapsed < 5.0, f"Contact POST took {elapsed:.2f}s — email may be blocking"


# ---------- Health Scan ----------
class TestHealthScan:
    def test_create_full_payload_and_persist(self, client):
        payload = {
            "turnover": "10-50L",
            "accounting": "Tally",
            "inventory": "Manual",
            "staff": "5-10",
            "followup": "WhatsApp",
            "technology": "Basic",
            "biggest_challenge": "TEST_cashflow",
            "future_goal": "Grow 2x",
            "name": "TEST_User",
            "company": "TEST_Co",
            "phone": "9876543210",
        }
        r = client.post(f"{API}/health-scan", json=payload)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == "TEST_User"
        assert data["phone"] == "9876543210"
        assert data["biggest_challenge"] == "TEST_cashflow"
        assert "id" in data and isinstance(data["id"], str)
        assert "created_at" in data
        # Verify persistence via GET list
        r2 = client.get(f"{API}/health-scan")
        assert r2.status_code == 200
        ids = [d["id"] for d in r2.json()]
        assert data["id"] in ids

    def test_create_minimal_only_name_phone(self, client):
        payload = {"name": "TEST_Min", "phone": "1112223333"}
        r = client.post(f"{API}/health-scan", json=payload)
        assert r.status_code == 200
        d = r.json()
        assert d["name"] == "TEST_Min"
        assert d["turnover"] == ""
        assert d["company"] == ""

    def test_missing_name_returns_422(self, client):
        r = client.post(f"{API}/health-scan", json={"phone": "9999999999"})
        assert r.status_code == 422

    def test_missing_phone_returns_422(self, client):
        r = client.post(f"{API}/health-scan", json={"name": "TEST_NoPhone"})
        assert r.status_code == 422

    def test_list_sorted_newest_first(self, client):
        r = client.get(f"{API}/health-scan")
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        if len(arr) >= 2:
            assert arr[0]["created_at"] >= arr[1]["created_at"]
        # ensure no mongo _id leaked
        for d in arr[:5]:
            assert "_id" not in d


# ---------- Contact ----------
class TestContact:
    def test_create_and_persist(self, client):
        payload = {
            "name": "TEST_Contact",
            "phone": "9000000001",
            "email": "test@example.com",
            "business": "TEST_Biz",
            "message": "TEST_message body",
        }
        r = client.post(f"{API}/contact", json=payload)
        assert r.status_code == 200, r.text
        d = r.json()
        assert d["name"] == "TEST_Contact"
        assert d["phone"] == "9000000001"
        assert d["email"] == "test@example.com"
        assert "id" in d and "created_at" in d
        r2 = client.get(f"{API}/contact")
        assert r2.status_code == 200
        assert d["id"] in [x["id"] for x in r2.json()]

    def test_missing_name_returns_422(self, client):
        r = client.post(f"{API}/contact", json={"phone": "9000000000"})
        assert r.status_code == 422

    def test_missing_phone_returns_422(self, client):
        r = client.post(f"{API}/contact", json={"name": "TEST_NoPh"})
        assert r.status_code == 422

    def test_list_sorted_newest_first(self, client):
        r = client.get(f"{API}/contact")
        assert r.status_code == 200
        arr = r.json()
        assert isinstance(arr, list)
        if len(arr) >= 2:
            assert arr[0]["created_at"] >= arr[1]["created_at"]
        for d in arr[:5]:
            assert "_id" not in d
