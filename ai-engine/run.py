#!/usr/bin/env python3
"""
Startup script for the Research Validator Flask application
"""
import os
import sys
from app import app, Config

def main():
    """Start the Flask application with proper configuration"""
    print("🚀 Starting Research Topic Validator...")
    print("=" * 50)
    
    # Check if virtual environment is activated
    if not hasattr(sys, 'real_prefix') and not (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix):
        print("⚠️  Warning: Virtual environment may not be activated")
        print("   Run: .\\venv\\Scripts\\Activate.ps1")
        print()
    
    # Validate configuration
    if Config.validate_config():
        print("✅ Configuration validated successfully")
    else:
        print("⚠️  Some API keys are missing - limited functionality")
    
    print(f"📡 Server will start at: http://localhost:5000")
    print(f"🔧 Debug mode: {Config.DEBUG}")
    print("=" * 50)
    print()
    print("Endpoints:")
    print("  POST /research-topic  - Validate research topics")
    print("  GET  /health         - Health check")
    print("  GET  /               - API information")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Start the Flask application
    app.run(
        debug=Config.DEBUG,
        host='0.0.0.0',
        port=5000
    )

if __name__ == "__main__":
    main()
