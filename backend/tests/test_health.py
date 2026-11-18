import asyncio

from httpx import ASGITransport, AsyncClient

from app.main import app


async def request(path: str):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        return await client.get(path)


async def send_character(payload: dict[str, object]):
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        return await client.post("/characters", json=payload)


def test_health_returns_ok():
    response = asyncio.run(request("/health"))

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_docs_and_openapi_are_available():
    docs_response = asyncio.run(request("/docs"))
    openapi_response = asyncio.run(request("/openapi.json"))

    assert docs_response.status_code == 200
    assert "swagger-ui" in docs_response.text
    assert openapi_response.status_code == 200
    assert "/health" in openapi_response.json()["paths"]


def test_character_can_be_created_and_retrieved():
    response = asyncio.run(
        send_character(
            {"name": "Elara", "race": "Humana", "class_name": "Maga", "level": 2}
        )
    )

    assert response.status_code == 201
    created = response.json()
    assert created["name"] == "Elara"
    assert asyncio.run(request(f"/characters/{created['id']}")).json() == created


def test_unknown_character_returns_not_found():
    response = asyncio.run(request("/characters/999999"))

    assert response.status_code == 404
