from fastapi import APIRouter, HTTPException
from app.schemas.brave_news import UserInput
from app.services.brave_news import (
    generate_search_query,
    fetch_brave_news,
    parse_analysis_response,
    perform_ai_analysis,
)
import json
import re

router = APIRouter()


@router.post("/full-analysis")
async def full_analysis(user_input: UserInput):
    try:
        generated_query_text = await generate_search_query(user_input.text)

        match = re.search(r"\{.*\}", generated_query_text, re.DOTALL)
        if match:
            try:
                parsed = json.loads(match.group())
                search_query = parsed.get("query", user_input.text)
            except json.JSONDecodeError:
                search_query = user_input.text
        else:
            search_query = user_input.text

        news_response = await fetch_brave_news(search_query)

        descriptions = [
            item.description for item in news_response.results if item.description
        ]
        merged_description = " ".join(descriptions)

        analysis_result = await perform_ai_analysis(user_input.text, merged_description)

        parsed_analysis = parse_analysis_response(analysis_result)

        return parsed_analysis

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
