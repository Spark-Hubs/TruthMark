"""
Configuration settings for the Research Validator Flask app
"""
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_DEBUG', 'True').lower() == 'true'
    
    # API Keys
    BRAVE_SEARCH_API_KEY = os.environ.get('BRAVE_SEARCH_API_KEY')
    APIFY_API_TOKEN = os.environ.get('APIFY_API_TOKEN')
    
    # External services
    OLLAMA_API_URL = os.environ.get('OLLAMA_API_URL', 
                                   'https://arzumanabbasov--ollama-server-ollamaserver-serve.modal.run')
    
    # Request timeouts
    SEARCH_TIMEOUT = 10
    SCRAPE_TIMEOUT = 15
    AI_TIMEOUT = 30
    
    # Content limits
    MAX_TEXT_LENGTH = 5000
    MAX_SEARCH_RESULTS = 3
    
    @staticmethod
    def validate_config():
        """Validate required configuration"""
        missing = []
        if not Config.BRAVE_SEARCH_API_KEY:
            missing.append('BRAVE_SEARCH_API_KEY')
        if not Config.APIFY_API_TOKEN:
            missing.append('APIFY_API_TOKEN')
        
        if missing:
            print(f"Warning: Missing environment variables: {', '.join(missing)}")
            print("Some features may not work properly.")
            
        return len(missing) == 0
