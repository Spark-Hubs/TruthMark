# Flask Backend for Research Topic Validation

This Flask application replicates the n8n workflow for research topic validation with AI analysis and web scraping.

## Features

- **Research Topic Validation**: Submit topics via POST endpoint
- **AI-Powered Query Generation**: Uses LLaMA 3.1 to generate search queries
- **Web Search Integration**: Brave Search API integration
- **Multi-Source Web Scraping**: Scrapes multiple URLs for comprehensive data
- **AI Analysis**: Validates claims using gathered information
- **JSON API Response**: Returns structured validation results

## Workflow

1. Receive research topic via webhook
2. Generate search query using AI
3. Search web using Brave Search
4. Scrape top 3 results
5. Combine and analyze content
6. Return validation analysis

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env`:
   ```
   BRAVE_SEARCH_API_KEY=your_brave_api_key
   APIFY_API_TOKEN=your_apify_token
   OLLAMA_API_URL=https://arzumanabbasov--ollama-server-ollamaserver-serve.modal.run
   ```

3. Run the application:
   ```bash
   python app.py
   ```

## API Endpoints

### POST /research-topic
Validates a research topic claim.

**Request Body:**
```json
{
  "topic": "Your research claim to validate"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "AI-generated validation analysis"
}
```

## Development

Run in development mode:
```bash
flask run --debug
```

The application will be available at `http://localhost:5000`
