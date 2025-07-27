import httpx
from bs4 import BeautifulSoup

from app.core.config import settings
from app.schemas.brave_news import BraveNewsResponse, NewsResult

BRAVE_API_URL = "https://api.search.brave.com/res/v1/news/search"


async def fetch_brave_news(query: str) -> BraveNewsResponse:
    headers = {
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
        "x-subscription-token": settings.brave_api_key,
    }
    params = {
        "q": query,
        "search_lang": "tr",
        "ui_lang": "tr-TR",
        "country": "TR",
        "count": 10,
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(BRAVE_API_URL, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()

    brave_news = BraveNewsResponse(**data)

    brave_news.results = await enrich_news_with_scraped_content(brave_news.results)

    return brave_news


async def scrape_article_content(url: str) -> str:
    """Scrapes the article content from the given URL using httpx and BeautifulSoup."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            soup = BeautifulSoup(resp.text, "html.parser")

            paragraphs = soup.find_all("p")
            article_text = "\n".join(
                p.get_text(strip=True) for p in paragraphs if p.get_text(strip=True)
            )
            return article_text[:1000]
    except Exception:
        return ""


async def enrich_news_with_scraped_content(
    news_results: list[NewsResult],
) -> list[NewsResult]:
    enriched_results = []

    for news in news_results:
        content = await scrape_article_content(str(news.url))
        enriched_news = news.model_copy(update={"scraped_content": content})
        enriched_results.append(enriched_news)

    return enriched_results
