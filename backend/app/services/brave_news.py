import httpx
from app.core.config import settings
from app.schemas.brave_news import BraveNewsResponse


async def generate_search_query(text: str) -> str:
    payload = {
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "messages": [
            {
                "role": "user",
                "content": (
                    f"To validate this claim is true or not generate a search query so I can put google and get info about it : {text}.\n\n"
                    "Response Format :\n"
                    '{\nquery : "query text here"\n}\n\n'
                    "DO NOT ADD OTHER EXPLAINATION"
                ),
            }
        ],
        "stream": False,
    }

    headers = {
        "Authorization": f"Bearer {settings.together_api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=settings.ai_timeout) as client:
        response = await client.post(
            settings.together_api_url, headers=headers, json=payload
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]


async def fetch_brave_news(query: str) -> BraveNewsResponse:
    params = {
        "q": query,
        "search_lang": "tr",
        "ui_lang": "tr-TR",
        "country": "TR",
        "count": 10,
    }

    headers = {
        "x-subscription-token": settings.brave_api_key,
    }

    async with httpx.AsyncClient(timeout=settings.ai_timeout) as client:
        response = await client.get(
            settings.brave_news_api_url, params=params, headers=headers
        )
        response.raise_for_status()
        data = response.json()

    results = []
    for item in data.get("results", []):
        results.append(
            {
                "title": item.get("title"),
                "url": item.get("url"),
                "description": item.get("description"),
            }
        )
    return BraveNewsResponse(results=results)


async def perform_ai_analysis(query: str, combined_text: str) -> str:
    payload = {
        "model": "meta-llama/llama-3.3-70b-instruct:free",
        "messages": [
            {
                "role": "user",
                "content": f"Now based on given query and info validate the query:\n\nQuery: {query}\nInfo: {combined_text}",
            }
        ],
        "stream": False,
    }

    headers = {
        "Authorization": f"Bearer {settings.together_api_key}",
        "Content-Type": "application/json",
    }

    async with httpx.AsyncClient(timeout=settings.ai_timeout) as client:
        response = await client.post(
            settings.together_api_url, headers=headers, json=payload
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]
