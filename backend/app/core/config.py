from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    google_api_key: str
    google_news_api_url: str
    together_api_key: str
    together_api_url: str
    ai_timeout: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
