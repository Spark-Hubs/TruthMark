from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    brave_api_key: str
    brave_news_api_url: str
    together_api_key: str
    together_api_url: str
    ai_timeout: int = 60

    class Config:
        env_file = ".env"


settings = Settings()
