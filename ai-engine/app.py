from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json
import os
import re
import logging
from datetime import datetime
from dotenv import load_dotenv
from bs4 import BeautifulSoup
from apify_client import ApifyClient
from config import Config

# Load environment variables
load_dotenv()

# Configure logging with UTF-8 encoding
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('research_validator.log', encoding='utf-8')
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# Validate configuration on startup
Config.validate_config()
logger.info("[STARTUP] Research Validator Flask App Starting Up")
logger.info(f"Debug mode: {Config.DEBUG}")
logger.info(f"Brave API configured: {'YES' if Config.BRAVE_SEARCH_API_KEY else 'NO'}")
logger.info(f"Apify API configured: {'YES' if Config.APIFY_API_TOKEN else 'NO'}")

# Configuration from config class
BRAVE_API_KEY = Config.BRAVE_SEARCH_API_KEY
APIFY_TOKEN = Config.APIFY_API_TOKEN
OLLAMA_API_URL = Config.OLLAMA_API_URL

class ResearchValidator:
    def __init__(self):
        self.apify_client = ApifyClient(APIFY_TOKEN) if APIFY_TOKEN else None
        logger.info(f"ResearchValidator initialized with Apify: {'YES' if self.apify_client else 'NO'}")
    
    def generate_search_query(self, topic):
        """Generate search query using AI analysis similar to n8n workflow"""
        logger.info(f"[STEP 1] Generating search query for topic: '{topic}'")
        try:
            payload = {
                "model": "llama3.1:8b",
                "messages": [
                    {
                        "role": "user",
                        "content": f"To validate this claim is true or not generate a search query so I can put google and get info about it : {topic}.\n\nResponse Format :\n{{\nquery : \"query text here\"\n}}\n\nDO NOT ADD OTHER EXPLAINATION"
                    }
                ],
                "stream": False
            }
            
            logger.info(f"[AI] Sending AI request to: {OLLAMA_API_URL}")
            response = requests.post(
                f"{OLLAMA_API_URL}/v1/chat/completions",
                json=payload,
                timeout=Config.AI_TIMEOUT
            )
            response.raise_for_status()
            logger.info(f"[AI] Response received (status: {response.status_code})")
            
            content = response.json()['choices'][0]['message']['content']
            logger.info(f"[AI] Raw response: {content[:200]}...")
            
            # Parse JSON response safely
            try:
                query_data = json.loads(content)
                generated_query = query_data.get('query', topic)
                logger.info(f"[SUCCESS] Generated search query: '{generated_query}'")
                return generated_query
            except json.JSONDecodeError as json_error:
                logger.warning(f"[WARNING] JSON parsing failed: {json_error}")
                logger.info(f"[FALLBACK] Using original topic: '{topic}'")
                return topic
                
        except Exception as e:
            logger.error(f"[ERROR] Error generating search query: {e}")
            return topic
    
    def brave_search(self, query):
        """Search using Brave Search API"""
        logger.info(f"[SEARCH] STEP 2: Performing Brave Search for: '{query}'")
        try:
            headers = {
                'Accept': 'application/json',
                'Accept-Encoding': 'gzip',
                'X-Subscription-Token': BRAVE_API_KEY
            }
            
            params = {
                'q': query,
                'count': 3,
                'search_lang': 'en',
                'country': 'US',
                'safesearch': 'moderate',
                'textDecorations': False,
                'spellcheck': True
            }
            
            logger.info(f"[API] Sending Brave Search request...")
            response = requests.get(
                'https://api.search.brave.com/res/v1/news/search',
                headers=headers,
                params=params,
                timeout=Config.SEARCH_TIMEOUT
            )
            response.raise_for_status()
            logger.info(f"[OK] Brave Search response received (status: {response.status_code})")
            
            data = response.json()
            results = data.get('results', [])
            logger.info(f"[DATA] Found {len(results)} search results")
            
            for i, result in enumerate(results[:3]):
                logger.info(f"  {i+1}. {result.get('title', 'No title')[:50]}...")
                logger.info(f"     URL: {result.get('url', 'No URL')}")
            
            search_result = {
                'query': {'original': query},
                'results': results[:3]  # Take top 3 results
            }
            logger.info(f"[OK] Returning {len(search_result['results'])} results for scraping")
            return search_result
            
        except Exception as e:
            logger.error(f"[NO] Error in Brave search: {e}")
            return {'query': {'original': query}, 'results': []}
    
    def scrape_url_content(self, url):
        """Scrape URL using Apify (if available) or fallback to BeautifulSoup"""
        logger.info(f"[SCRAPE] STEP 3: Scraping content from: {url}")
        try:
            # Try Apify first if available
            if self.apify_client:
                try:
                    logger.info("[TOOL] Attempting Apify scraping...")
                    # Use Website Content Crawler - more reliable than web-scraper
                    run_input = {
                        "startUrls": [{"url": url}],
                        "maxCrawlPages": 1,
                        "crawlerType": "cheerio"
                    }
                    
                    logger.info(f"[API] Calling Apify actor with input: {run_input}")
                    run = self.apify_client.actor("apify/website-content-crawler").call(run_input=run_input)
                    logger.info(f"[OK] Apify run completed: {run.get('id', 'unknown')}")
                    
                    # Get the scraped data
                    items = list(self.apify_client.dataset(run["defaultDatasetId"]).iterate_items())
                    logger.info(f"[DATA] Apify returned {len(items)} items")
                    
                    if items and len(items) > 0:
                        item = items[0]
                        logger.info(f"[HTML] First item keys: {list(item.keys())}")
                        # Extract text from Apify response
                        text_content = item.get('text', '')
                        if text_content:
                            text_length = len(text_content)
                            truncated_length = min(text_length, Config.MAX_TEXT_LENGTH)
                            logger.info(f"[OK] Apify extracted {text_length} characters, truncated to {truncated_length}")
                            logger.info(f"[CONTENT] Content preview: {text_content[:150]}...")
                            return {'text': text_content[:Config.MAX_TEXT_LENGTH]}
                        else:
                            logger.warning("[WARNING] Apify returned empty text content")
                    else:
                        logger.warning("[WARNING] Apify returned no items")
                    
                except Exception as apify_error:
                    logger.error(f"[NO] Apify scraping failed for {url}: {apify_error}")
                    logger.info("[FALLBACK] Continuing to BeautifulSoup fallback...")
            else:
                logger.info("[INFO] Apify client not available, using BeautifulSoup")
            
            # Fallback: Enhanced BeautifulSoup scraping
            logger.info("[TOOL] Attempting BeautifulSoup scraping...")
            response = requests.get(url, timeout=Config.SCRAPE_TIMEOUT, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Accept-Encoding': 'gzip, deflate',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1'
            })
            response.raise_for_status()
            logger.info(f"[OK] HTTP response received (status: {response.status_code}, size: {len(response.content)} bytes)")
            
            soup = BeautifulSoup(response.content, 'html.parser')
            logger.info("[HTML] HTML parsed with BeautifulSoup")
            
            # Remove unwanted elements
            removed_count = 0
            for element in soup(['script', 'style', 'nav', 'header', 'footer', 'aside', 'advertisement', 'ads']):
                element.decompose()
                removed_count += 1
            logger.info(f"[CLEAN] Removed {removed_count} unwanted HTML elements")
            
            # Try to find main content areas first
            content_selectors = [
                'article', 'main', '[role="main"]', '.content', '.post-content', 
                '.entry-content', '.article-content', '.story-content', '.text-content'
            ]
            
            text_content = ""
            selector_used = None
            for selector in content_selectors:
                elements = soup.select(selector)
                if elements:
                    selector_used = selector
                    for element in elements:
                        text_content += element.get_text() + " "
                    break
            
            if selector_used:
                logger.info(f"[FOUND] Content found using selector: '{selector_used}'")
            else:
                logger.info("[FOUND] No specific content selector matched, using all text")
                text_content = soup.get_text()
            
            # Clean up text
            lines = (line.strip() for line in text_content.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            # Additional cleaning
            text = re.sub(r'\s+', ' ', text)  # Multiple spaces to single space
            text = re.sub(r'\n+', ' ', text)  # Multiple newlines to single space
            text = text.strip()
            
            original_length = len(text)
            final_length = min(original_length, Config.MAX_TEXT_LENGTH)
            logger.info(f"[OK] BeautifulSoup extracted {original_length} characters, truncated to {final_length}")
            logger.info(f"[CONTENT] Content preview: {text[:150]}...")
            
            return {'text': text[:Config.MAX_TEXT_LENGTH]}  # Limit text length
            
        except Exception as e:
            logger.error(f"[NO] Error scraping {url}: {e}")
            return {'text': ''}
    
    def combine_texts(self, scraped_data):
        """Combine all scraped texts similar to n8n workflow"""
        logger.info(f"[COMBINE] STEP 4: Combining texts from {len(scraped_data)} sources")
        combined_text = ""
        total_original_length = 0
        
        for i, data in enumerate(scraped_data):
            text = data.get('text', '')
            text_length = len(text)
            total_original_length += text_length
            logger.info(f"  Source {i+1}: {text_length} characters")
            if text_length > 0:
                logger.info(f"  Preview: {text[:100]}...")
            
            # Triple the text as in n8n workflow
            combined_text += text + " " + text + " " + text + " "
        
        logger.info(f"[DATA] Total original content: {total_original_length} characters")
        logger.info(f"[DATA] After tripling: {len(combined_text)} characters")
        
        # Clean the text
        cleaned_text = re.sub(r'[^a-zA-Z0-9. ]', '', combined_text)
        cleaned_text = re.sub(r'\s+', ' ', cleaned_text).strip()
        
        logger.info(f"[DATA] After cleaning: {len(cleaned_text)} characters")
        logger.info(f"[COMBINE] Combined text preview: {cleaned_text[:200]}...")
        
        return {'text': cleaned_text}
    
    def ai_analysis(self, query, combined_text):
        """Perform AI analysis to validate the query"""
        logger.info(f"[AI] STEP 5: Performing AI analysis for validation")
        logger.info(f"[TEXT] Query: {query}")
        logger.info(f"[DATA] Combined text length: {len(combined_text)} characters")
        logger.info(f"[CONTENT] Text preview: {combined_text[:150]}...")
        
        try:
            payload = {
                "model": "llama3.1:8b",
                "messages": [
                    {
                        "role": "user",
                        "content": f"Now based on given query and info validate the query:\n\nQuery: {query}\nInfo: {combined_text}"
                    }
                ],
                "stream": False
            }
            
            logger.info(f"[API] Sending final AI analysis request...")
            response = requests.post(
                f"{OLLAMA_API_URL}/v1/chat/completions",
                json=payload,
                timeout=Config.AI_TIMEOUT
            )
            response.raise_for_status()
            logger.info(f"[OK] AI analysis response received (status: {response.status_code})")
            
            analysis_result = response.json()['choices'][0]['message']['content']
            logger.info(f"[RESULT] Analysis result length: {len(analysis_result)} characters")
            logger.info(f"[TEXT] Analysis preview: {analysis_result[:200]}...")
            
            return analysis_result
            
        except Exception as e:
            logger.error(f"[NO] Error in AI analysis: {e}")
            return "Error performing analysis"

# Initialize the validator
logger.info("[INIT] Initializing ResearchValidator...")
validator = ResearchValidator()
logger.info("[OK] ResearchValidator ready")

@app.route('/research-topic', methods=['POST'])
def research_topic():
    """Main endpoint that replicates the n8n workflow"""
    request_id = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
    logger.info(f"[STARTUP] NEW REQUEST [{request_id}] - Research topic validation started")
    
    try:
        # Get the topic from request body
        data = request.get_json()
        if not data or 'topic' not in data:
            logger.error(f"[NO] [{request_id}] Missing topic in request body")
            return jsonify({'error': 'Missing topic in request body'}), 400
        
        topic = data['topic']
        logger.info(f"[TEXT] [{request_id}] Topic received: '{topic}'")
        
        # Step 1: Generate search query using AI
        logger.info(f"[SEARCH] [{request_id}] Starting Step 1: AI Query Generation")
        search_query = validator.generate_search_query(topic)
        logger.info(f"[OK] [{request_id}] Step 1 completed: '{search_query}'")
        
        # Step 2: Perform Brave search
        logger.info(f"[WEB] [{request_id}] Starting Step 2: Brave Search")
        search_results = validator.brave_search(search_query)
        logger.info(f"[OK] [{request_id}] Step 2 completed: {len(search_results['results'])} results")
        
        # Step 3: Scrape the top 3 URLs
        logger.info(f"[SCRAPE] [{request_id}] Starting Step 3: URL Scraping")
        scraped_data = []
        for i, result in enumerate(search_results['results'][:Config.MAX_SEARCH_RESULTS]):
            url = result.get('url', '')
            if url:
                logger.info(f"[COMBINE] [{request_id}] Scraping URL {i+1}/{Config.MAX_SEARCH_RESULTS}: {url}")
                scraped_content = validator.scrape_url_content(url)
                scraped_data.append(scraped_content)
                logger.info(f"[OK] [{request_id}] URL {i+1} scraped: {len(scraped_content.get('text', ''))} characters")
        
        logger.info(f"[OK] [{request_id}] Step 3 completed: {len(scraped_data)} URLs scraped")
        
        # Step 4: Combine all texts
        logger.info(f"[COMBINE] [{request_id}] Starting Step 4: Text Combination")
        combined_text = validator.combine_texts(scraped_data)
        logger.info(f"[OK] [{request_id}] Step 4 completed: {len(combined_text['text'])} total characters")
        
        # Step 5: Perform AI analysis
        logger.info(f"[AI] [{request_id}] Starting Step 5: Final AI Analysis")
        analysis = validator.ai_analysis(search_results['query']['original'], combined_text['text'])
        logger.info(f"[OK] [{request_id}] Step 5 completed: Analysis generated")
        
        # Step 6: Return response
        response_data = {
            'success': True,
            'analysis': analysis,
            'metadata': {
                'request_id': request_id,
                'original_topic': topic,
                'search_query': search_query,
                'urls_scraped': len(scraped_data),
                'total_content_length': len(combined_text['text'])
            }
        }
        
        logger.info(f"[SUCCESS] [{request_id}] REQUEST COMPLETED SUCCESSFULLY")
        logger.info(f"[DATA] [{request_id}] Response size: {len(str(response_data))} characters")
        
        return jsonify(response_data)
        
    except Exception as e:
        logger.error(f"[CRITICAL] [{request_id}] CRITICAL ERROR: {e}")
        logger.exception(f"Full traceback for request {request_id}:")
        return jsonify({
            'success': False,
            'error': str(e),
            'request_id': request_id
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    logger.info("[HEALTH] Health check requested")
    return jsonify({'status': 'healthy', 'service': 'research-validator', 'timestamp': datetime.now().isoformat()})

@app.route('/', methods=['GET'])
def root():
    """Root endpoint with API information"""
    logger.info("[INFO] API info requested")
    return jsonify({
        'service': 'Research Topic Validator',
        'version': '1.0.0',
        'status': 'running',
        'timestamp': datetime.now().isoformat(),
        'endpoints': {
            'POST /research-topic': 'Validate research topics',
            'GET /health': 'Health check',
            'GET /': 'This information'
        },
        'configuration': {
            'brave_api_configured': bool(BRAVE_API_KEY),
            'apify_configured': bool(APIFY_TOKEN),
            'ollama_url': OLLAMA_API_URL,
            'max_search_results': Config.MAX_SEARCH_RESULTS,
            'max_text_length': Config.MAX_TEXT_LENGTH
        }
    })

if __name__ == '__main__':
    logger.info("[START] Starting Flask development server...")
    app.run(debug=True, host='0.0.0.0', port=5000)
