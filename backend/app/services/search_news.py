import ast
import json
import httpx
from app.core.config import settings
from app.schemas.search_news import GoogleNewsResponse


async def generate_search_query(text: str) -> str:
    payload = {
        "model": "moonshotai/kimi-k2:free",
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


async def fetch_google_news(query: str) -> GoogleNewsResponse:
    params = {
        "q": query,
        "search_lang": "tr",
        "ui_lang": "tr-TR",
        "country": "TR",
        "count": 10,
    }

    headers = {
        "x-subscription-token": settings.google_api_key,
    }

    async with httpx.AsyncClient(timeout=settings.ai_timeout) as client:
        response = await client.get(
            settings.google_news_api_url, params=params, headers=headers
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
    return GoogleNewsResponse(results=results)


def parse_analysis_response(raw_response: str) -> dict:
    try:
        # Clean the response
        cleaned_response = raw_response.strip()

        # Try to parse as JSON first (fallback for when AI ignores instructions)
        if cleaned_response.startswith("{") and cleaned_response.endswith("}"):
            try:
                parsed_json = json.loads(cleaned_response)
                # Validate required fields
                required_fields = [
                    "truthScore",
                    "verdict",
                    "confidence",
                    "analysis",
                    "context",
                    "sources",
                ]
                for field in required_fields:
                    if field not in parsed_json:
                        raise ValueError(f"Missing field in JSON response: {field}")

                # Ensure proper types
                if not isinstance(parsed_json["truthScore"], int):
                    parsed_json["truthScore"] = int(parsed_json["truthScore"])
                if not isinstance(parsed_json["sources"], list):
                    parsed_json["sources"] = []

                return parsed_json
            except (json.JSONDecodeError, ValueError, TypeError) as e:
                # Fall through to key-value parsing
                pass

        # Original key-value parsing logic
        parts = cleaned_response.split(", ")
        parsed = {}

        for part in parts:
            if ": " not in part:
                continue
            key, value = part.split(": ", 1)

            if key == "truthScore":
                parsed[key] = int(value)
            elif key == "verdict":
                parsed[key] = value.strip().lower()
            elif key == "confidence":
                parsed[key] = value.strip().lower()
            elif key == "sources":
                try:
                    parsed[key] = ast.literal_eval(value)
                    if not isinstance(parsed[key], list):
                        parsed[key] = []
                except Exception:
                    parsed[key] = []
            else:
                parsed[key] = value.strip()

        # Validate required fields
        required_fields = [
            "truthScore",
            "verdict",
            "confidence",
            "analysis",
            "context",
            "sources",
        ]
        for field in required_fields:
            if field not in parsed:
                raise ValueError(f"Missing field in AI response: {field}")

        return parsed

    except Exception as e:
        raise ValueError(f"Failed to parse AI response: {e}")


async def perform_ai_analysis(query: str, combined_text: str) -> str:
    payload = {
        "model": "moonshotai/kimi-k2:free",
        "messages": [
            {
                "role": "system",
                "content": (
                    "CRITICAL: You must return EXACTLY this format - no JSON braces, no markdown, no explanations:\n"
                    'truthScore: 75, verdict: true, confidence: high, analysis: "Your analysis here", context: "Context here", sources: ["source1", "source2"]\n\n'
                    "STRICT RULES:\n"
                    "1. Start directly with 'truthScore:' - NO other text before it\n"
                    "2. Use comma and space between each field: ', '\n"
                    "3. NO curly braces { }\n"
                    "4. NO square brackets except for sources list\n"
                    "5. Put quotes around text values for analysis and context\n"
                    "6. truthScore: integer 0-100\n"
                    "7. verdict: must be exactly 'true', 'false', or 'unverifiable'\n"
                    "8. confidence: must be exactly 'low', 'medium', or 'high'\n"
                    '9. sources: list format like ["url1", "url2"] or [] if none\n'
                    "10. Everything on ONE line\n\n"
                    "EXAMPLE OUTPUT:\n"
                    'truthScore: 85, verdict: true, confidence: high, analysis: "The claim is supported by multiple sources", context: "Current economic data shows", sources: ["reuters.com", "bloomberg.com"]'
                ),
            },
            {
                "role": "user",
                "content": f'Analyze this claim for truthfulness: "{query}"\n\nBased on this information: "{combined_text}"\n\nRespond in the exact format specified above.',
            },
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
        content = data["choices"][0]["message"]["content"]
        print(f"AI Response: {content}")

        return content
