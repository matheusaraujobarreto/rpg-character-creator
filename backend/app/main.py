from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from app.schemas.character import CharacterCreate

app = FastAPI(title="Repositorio de RPG API")


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Confirma que a API esta em execucao."""
    return {"status": "ok"}


# Dados temporários: serão substituídos pelo PostgreSQL em uma etapa posterior.
characters = [
    {
        "id": 1,
        "name": "Arannis",
        "race": "Elfo",
        "class_name": "Mago",
        "level": 1,
    },
]


@app.get("/characters")
def list_characters() -> list[dict]:
    """Retorna os personagens temporários cadastrados."""
    return characters


@app.get("/characters/{character_id}")
def get_character(character_id: int) -> dict:
    """Retorna um personagem pelo seu identificador."""
    for character in characters:
        if character["id"] == character_id:
            return character

    raise HTTPException(status_code=404, detail="Personagem não encontrado")


@app.post("/characters", status_code=201)
def create_character(character_data: CharacterCreate) -> dict:
    """Cria um personagem apenas na memória durante esta etapa."""
    next_id = max((character["id"] for character in characters), default=0) + 1
    new_character = {"id": next_id, **character_data.model_dump()}
    characters.append(new_character)
    return new_character


@app.put("/characters/{character_id}")
def update_character(character_id: int, character_data: CharacterCreate) -> dict:
    """Substitui os dados de um personagem temporário existente."""
    for character in characters:
        if character["id"] == character_id:
            character.update(character_data.model_dump())
            return character

    raise HTTPException(status_code=404, detail="Personagem não encontrado")


# Servimos a prévia no mesmo host da API para o navegador poder usar fetch
# sem configurar CORS para uma segunda origem local.
frontend_directory = Path(__file__).resolve().parents[2] / "frontend"
app.mount("/site", StaticFiles(directory=frontend_directory, html=True), name="site")


