import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

# Base directory pointing to workspace root
WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent
ENV_PATH = WORKSPACE_ROOT / ".env"

class Settings(BaseSettings):
    # Neo4j AuraDB credentials
    neo4j_uri: str = Field(default="", alias="NEO4J_URI")
    neo4j_username: str = Field(default="", alias="NEO4J_USERNAME")
    neo4j_password: str = Field(default="", alias="NEO4J_PASSWORD")
    neo4j_database: str = Field(default="neo4j", alias="NEO4J_DATABASE")

    # Gemini API credentials
    gemini_api_key: str = Field(default="", alias="GEMINI_API_KEY")
    gemini_model: str = Field(default="", alias="GEMINI_MODEL")

    # App settings
    port: int = Field(default=8000, alias="PORT")
    host: str = Field(default="127.0.0.1", alias="HOST")
    app_name: str = "SkillRoute India"
    app_version: str = "1.0.0"

    model_config = SettingsConfigDict(
        env_file=str(ENV_PATH) if ENV_PATH.exists() else None,
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def has_neo4j_config(self) -> bool:
        return bool(self.neo4j_uri.strip() and self.neo4j_username.strip() and self.neo4j_password.strip())

    @property
    def has_gemini_config(self) -> bool:
        return bool(self.gemini_api_key.strip() and self.gemini_model.strip())

    def masked_neo4j_uri(self) -> str:
        if not self.neo4j_uri:
            return "not-configured"
        # Mask host if needed
        return self.neo4j_uri.split("@")[-1] if "@" in self.neo4j_uri else self.neo4j_uri[:15] + "..."

settings = Settings()
