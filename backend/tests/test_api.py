import httpx
import pytest

from backend.main import app


@pytest.fixture
def transport() -> httpx.ASGITransport:
    return httpx.ASGITransport(app=app)


@pytest.mark.asyncio
async def test_health_is_available(transport: httpx.ASGITransport) -> None:
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_query_returns_citations_and_trace(transport: httpx.ASGITransport) -> None:
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/api/v1/query", json={"question": "trophozoite with two nuclei and diarrhea", "specimen": "stool"})
    payload = response.json()
    assert response.status_code == 200
    assert payload["findings"][0]["organism"] == "Giardia duodenalis"
    assert payload["citations"][0]["source"] == "CDC"
    assert payload["retrieval_trace"]["grader_decision"] == "sufficient"


@pytest.mark.asyncio
async def test_query_rejects_short_questions(transport: httpx.ASGITransport) -> None:
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/api/v1/query", json={"question": "?"})
    assert response.status_code == 422
