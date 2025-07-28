# Quick Start Guide for Research Topic Validator

## 🚀 Your Flask Backend is Ready!

This Flask application successfully replicates your n8n workflow for research topic validation.

## 📁 Project Structure
```
├── .env                    # Environment variables (configure your API keys here)
├── .env.example           # Example environment file
├── app.py                 # Main Flask application
├── config.py              # Configuration settings
├── run.py                 # Startup script
├── test_api.py            # API testing script
├── requirements.txt       # Python dependencies
├── README.md             # Project documentation
├── .github/
│   └── copilot-instructions.md  # Copilot configuration
├── .vscode/
│   ├── tasks.json        # VS Code tasks
│   └── launch.json       # Debug configuration
└── venv/                 # Virtual environment
```

## ⚙️ Next Steps

### 1. Configure API Keys
Edit the `.env` file and add your API keys:
```env
BRAVE_SEARCH_API_KEY=your_actual_brave_api_key
APIFY_API_TOKEN=your_actual_apify_token
```

### 2. Run the Application
Option A: Use VS Code tasks
- Press `Ctrl+Shift+P`
- Type "Tasks: Run Task"
- Select "Run Flask App"

Option B: Use terminal
```bash
.\venv\Scripts\python.exe run.py
```

### 3. Test the API
After starting the server, run the test script:
```bash
.\venv\Scripts\python.exe test_api.py
```

Or test manually:
```bash
curl -X POST http://localhost:5000/research-topic \
  -H "Content-Type: application/json" \
  -d '{"topic": "Climate change is caused by human activities"}'
```

## 🔧 Development Features

### VS Code Tasks Available:
- **Run Flask App**: Start the development server
- **Test API**: Run the automated API tests
- **Install Dependencies**: Reinstall Python packages

### Debug Configuration:
- **Python: Flask**: Debug the main application
- **Python: Test API**: Debug the test script

### API Endpoints:
- `POST /research-topic` - Main validation endpoint
- `GET /health` - Health check
- `GET /` - API information

## 🌐 Workflow Replication

Your n8n workflow has been faithfully recreated:

1. **Webhook** → `POST /research-topic` endpoint
2. **AI Analysis** → Query generation using LLaMA 3.1
3. **Code Node** → JSON parsing logic
4. **Brave Search** → Brave Search API integration
5. **Apify Scraping** → Multi-URL content scraping
6. **Text Combination** → Content aggregation and cleaning
7. **Final AI Analysis** → Topic validation
8. **Webhook Response** → JSON response

## 🛡️ Error Handling

The application includes:
- API timeout configurations
- Fallback scraping with BeautifulSoup
- Configuration validation
- Proper error responses
- Request/response logging

## 🎯 Ready to Use!

Your Flask backend is production-ready with proper error handling, configuration management, and testing capabilities. Simply add your API keys and start validating research topics!

---

**Need help?** Check the `README.md` for detailed documentation or review the code comments in `app.py`.
