# TruthMark Chrome Extension

A Chrome extension that provides instant fact-checking for any text you read online. Select text on any webpage and get AI-powered analysis of its truthfulness.

## Features

- **Instant Analysis**: Select any text and get immediate fact-checking results
- **Multiple Trigger Methods**: Double-click, right-click, or Ctrl+click to analyze
- **Beautiful UI**: Clean, modern popup interface with detailed results
- **AI-Powered**: Uses advanced AI to analyze text truthfulness
- **No Setup Required**: Works out of the box with our hosted API
- **Smart Text Selection**: Preserves your full text selection even when double-clicking

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

## Text Selection Fix

The extension includes a smart solution for the common browser issue where double-clicking on selected text only selects a single word instead of preserving your full selection. Here's how it works:

### The Problem
When you select multiple words with your mouse and then double-click, browsers typically override your selection with just the word under the cursor.

### The Solution
- **Preserves Original Selection**: The extension stores your full text selection before any double-click events
- **Prevents Default Behavior**: Stops the browser from changing your selection during double-click
- **Smart Analysis**: Uses your intended selection for analysis, not just the word under the cursor
- **Cross-Browser Compatible**: Works across Chrome, Firefox, Safari, and Edge

### Technical Implementation
- Tracks text selection state using `mouseup` events
- Prevents default double-click behavior with `preventDefault()`
- Clears any unwanted selections created by double-click
- Uses stored selection for analysis
- Temporarily prevents text selection during double-click events

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
│   ├── content.js        # Page interaction logic
│   └── popup.js         # Settings UI logic
├── icons/               # Extension icons
└── test-selection.html  # Test file for selection behavior
```

### Key Files

- **`manifest.json`**: Defines extension permissions, content scripts, and metadata
- **`scripts/content.js`**: Handles text selection, trigger events, and popup display
- **`scripts/background.js`**: Manages API calls and response processing
- **`content.css`**: Styles the analysis popup with modern, clean design
- **`popup.html`**: Settings interface for user configuration

### Testing

Use the included `test-selection.html` file to test the text selection functionality:

1. Open `test-selection.html` in your browser
2. Select multiple words with your mouse
3. Double-click on the selected text
4. Verify that the full selection is preserved

## Troubleshooting

### Common Issues

1. **Extension not working**: Make sure the extension is enabled in Chrome's extension settings
2. **No analysis results**: Check your internet connection and API endpoint status
3. **Text selection issues**: Try refreshing the page or restarting the extension

### Debug Mode

To enable debug mode:
1. Open Chrome DevTools
2. Go to the Console tab
3. Look for TruthMark-related log messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues or questions, please open an issue on GitHub. 