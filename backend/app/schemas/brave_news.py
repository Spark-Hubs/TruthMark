from typing import List, Optional
from pydantic import BaseModel, HttpUrl


class NewsResult(BaseModel):
    title: str
    url: HttpUrl
    description: Optional[str]


class BraveNewsResponse(BaseModel):
    results: List[NewsResult]


class UserInput(BaseModel):
    text: str


class AIAnalysisResponse(BaseModel):
    analysis: str
