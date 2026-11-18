from pydantic import BaseModel, Field


class CharacterCreate(BaseModel):
    """Dados necessarios para criar um personagem."""

    name: str = Field(min_length=1, max_length=100)
    race: str = Field(min_length=1, max_length=50)
    class_name: str = Field(min_length=1, max_length=50)
    level: int = Field(ge=1, le=20)
