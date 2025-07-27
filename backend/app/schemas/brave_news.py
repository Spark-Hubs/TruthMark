from typing import List, Optional

from pydantic import BaseModel, HttpUrl


class Thumbnail(BaseModel):
    src: Optional[HttpUrl] = None


class NewsResult(BaseModel):
    type: str
    title: str
    url: HttpUrl
    description: str
    age: str
    page_age: str
    thumbnail: Optional[Thumbnail] = None
    scraped_content: Optional[str] = None


class Query(BaseModel):
    original: str
    spellcheck_off: bool
    show_strict_warning: bool


class BraveNewsResponse(BaseModel):
    type: str
    query: Query
    results: List[NewsResult]
