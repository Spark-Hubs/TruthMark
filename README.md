# TruthMark Chrome Extension

A Chrome extension that provides instant fact-checking for any text you read online. Select text on any webpage and get AI-powered analysis of its truthfulness.

## Features

- **Instant Analysis**: Select any text and get immediate fact-checking results
- **Multiple Trigger Methods**: Double-click, right-click, or Ctrl+click to analyze
- **Beautiful UI**: Clean, modern popup interface with detailed results
- **AI-Powered**: Uses advanced AI to analyze text truthfulness
- **No Setup Required**: Works out of the box with our hosted API

## How It Works

1. **Select Text**: Highlight any text on a webpage
2. **Trigger Analysis**: Use your chosen trigger method (double-click, right-click, or Ctrl+click)
3. **Get Results**: View detailed analysis including:
   - Truth score (0-100%)
   - Verdict (true/false/mixed/unverifiable)
   - Confidence level (high/medium/low)
   - Detailed analysis
   - Sources (when available)
   - Additional context

## Installation

### For Development

1. Clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the `chrome-extension` folder
5. The extension will appear in your toolbar

### For Users

The extension will be available on the Chrome Web Store once published.

## Architecture

### Chrome Extension Components

- **Background Script** (`scripts/background.js`): Handles API calls to our fact-checking service
- **Content Script** (`scripts/content.js`): Injects into web pages, handles user interactions
- **Popup UI** (`popup.html`): Settings interface for trigger method configuration
- **Styling** (`content.css`): Beautiful UI for the analysis popup

### API Integration

The extension connects to our FastAPI backend service at:
```
https://piglet-big-snail.ngrok-free.app/api/full-analysis
```

**Request Format:**
```json
{
  "text": "Text to analyze"
}
```

**Response Format:**
```json
{
  "truthScore": 20,
  "verdict": "false",
  "confidence": "high",
  "analysis": "Detailed analysis of the text...",
  "context": "Additional context if needed",
  "sources": ["Source 1", "Source 2"]
}
```

## Configuration

### Trigger Methods

You can choose how to activate the analysis:

- **Double Click**: Double-click on selected text
- **Right Click**: Right-click on selected text
- **Ctrl + Click**: Hold Ctrl and click on selected text

### Settings

Access settings by clicking the TruthMark icon in your toolbar. You can:
- Change the trigger method
- View usage instructions

## Development

### Project Structure

```
chrome-extension/
├── manifest.json          # Extension configuration
├── popup.html            # Settings popup
├── content.css           # Styling for analysis popup
├── scripts/
│   ├── background.js     # API integration
│   ├── content.js        # Page interaction
│   └── popup.js         # Settings management
└── icons/               # Extension icons
```

### Key Files

- **`manifest.json`**: Defines permissions, scripts, and extension metadata
- **`background.js`**: Makes API calls to our fact-checking service
- **`content.js`**: Detects text selection and shows results
- **`popup.html`**: Settings interface for trigger configuration

## API Response Handling

The extension properly handles the API response format:

- **truthScore**: Number between 0-100 (displayed as progress bar)
- **verdict**: One of "true", "false", "mixed", "unverifiable" (with emojis)
- **confidence**: One of "high", "medium", "low" (with color coding)
- **analysis**: Detailed explanation of the analysis
- **sources**: Array of source URLs (optional)
- **context**: Additional context information (optional)

## Error Handling

The extension includes comprehensive error handling for:
- Network failures
- Invalid API responses
- Missing text selection
- API service unavailability

## Security

- Uses HTTPS for all API communications
- No sensitive data is stored locally
- Follows Chrome extension security best practices
- Implements proper Content Security Policy

## Browser Compatibility

- Chrome 88+
- Edge 88+ (Chromium-based)
- Other Chromium-based browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions, please open an issue on GitHub.
