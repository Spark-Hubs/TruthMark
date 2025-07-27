from fastapi import APIRouter, HTTPException, Query

from app.schemas.brave_news import BraveNewsResponse
from app.services.brave_news import fetch_brave_news

router = APIRouter()


@router.get("/news", response_model=BraveNewsResponse)
async def get_news(q: str = Query(..., min_length=1)):
    try:
        news_response = await fetch_brave_news(q)
        return news_response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
