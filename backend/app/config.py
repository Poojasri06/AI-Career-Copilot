from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    model_name: str = "gpt-4o-mini"
    database_url: str = "sqlite:///./job_assistant.db"
    cors_origins: str = "http://localhost:5173"
    match_threshold: int = 70
    jwt_secret: str = "change-this-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 180

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
