chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    analyzeText(request.text, request.apiKey)
      .then(result => sendResponse({ result }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Required for async response
  }
});

async function analyzeText(text, apiKey) {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Please select some text to analyze');
    }

    if (!apiKey) {
      throw new Error('Please set your Perplexity API key in the extension settings');
    }

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: `You are a fact-checking assistant. Your task is to analyze text and return a JSON object with the following EXACT structure:

{
  "truthScore": 75,  // A number between 0-100 indicating truthfulness
  "verdict": "true", // Must be one of: "true", "false", "mixed", "unverifiable"
  "confidence": "high", // Must be one of: "high", "medium", "low"
  "analysis": "Detailed explanation of the analysis...",
  "sources": ["Source 1", "Source 2"], // Array of sources
  "context": "Additional context if needed" // Optional context
}

IMPORTANT:
1. Return ONLY the JSON object, no additional text
2. All fields must be present
3. truthScore must be a number between 0-100
4. verdict must be one of the specified values
5. confidence must be one of the specified values
6. analysis must be a string
7. sources must be an array of strings
8. context must be a string`
          },
          {
            role: 'user',
            content: `Analyze this text for truthfulness and return a JSON object with the exact structure specified above: "${text}"`
          }
        ],
        temperature: 0.2,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      if (response.status === 401) {
        throw new Error('Invalid API key. Please check your Perplexity API key in the extension settings.');
      }
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    console.log('API Response:', data);

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid API response format');
    }

    const content = data.choices[0].message.content;
    console.log('Raw Content:', content);

    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in content:', content);
      throw new Error('Could not parse the analysis result');
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
      console.log('Parsed Result:', JSON.stringify(result, null, 2));
    } catch (e) {
      console.error('JSON Parse Error:', e);
      console.error('Failed to parse:', jsonMatch[0]);
      throw new Error('Invalid JSON format in response');
    }

    // Validate required fields
    const requiredFields = ['truthScore', 'verdict', 'confidence', 'analysis'];
    const missingFields = requiredFields.filter(field => {
      const value = result[field];
      return value === undefined || value === null || value === '';
    });
    
    if (missingFields.length > 0) {
      console.error('Missing fields:', missingFields);
      console.error('Current result:', JSON.stringify(result, null, 2));
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate field types
    if (typeof result.truthScore !== 'number' || result.truthScore < 0 || result.truthScore > 100) {
      console.error('Invalid truthScore:', result.truthScore);
      throw new Error('Invalid truthScore value');
    }

    if (!['true', 'false', 'mixed', 'unverifiable'].includes(result.verdict)) {
      console.error('Invalid verdict:', result.verdict);
      throw new Error('Invalid verdict value');
    }

    if (!['high', 'medium', 'low'].includes(result.confidence)) {
      console.error('Invalid confidence:', result.confidence);
      throw new Error('Invalid confidence value');
    }

    // Ensure optional fields exist
    if (!result.sources) result.sources = [];
    if (!result.context) result.context = '';

    return formatResponse(result);
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error(error.message);
  }
}

function formatResponse(result) {
  // Default values for missing fields
  const defaultResult = {
    truthScore: 0,
    verdict: 'unverifiable',
    confidence: 'low',
    analysis: 'Unable to analyze the text.',
    sources: [],
    context: ''
  };

  // Merge with defaults to handle undefined values
  result = { ...defaultResult, ...result };

  const verdictEmoji = {
    'true': '✅',
    'false': '❌',
    'mixed': '⚠️',
    'unverifiable': '🔍'
  };

  const confidenceColor = {
    'high': '#10b981',
    'medium': '#f59e0b',
    'low': '#ef4444'
  };

  const confidenceBgColor = {
    'high': 'rgba(16, 185, 129, 0.1)',
    'medium': 'rgba(245, 158, 11, 0.1)',
    'low': 'rgba(239, 68, 68, 0.1)'
  };

  return `
    <div class="truthmark-result">
      <div class="truthmark-header">
        <div class="truthmark-verdict">${verdictEmoji[result.verdict] || verdictEmoji.unverifiable}</div>
        <div>
          <h3 class="truthmark-title">Truth Analysis</h3>
          <div class="truthmark-confidence" style="color: ${confidenceColor[result.confidence]}; background: ${confidenceBgColor[result.confidence]}">
            ${result.confidence.charAt(0).toUpperCase() + result.confidence.slice(1)} Confidence
          </div>
        </div>
      </div>
      
      <div class="truthmark-score">
        <div class="truthmark-score-bar">
          <div class="truthmark-progress">
            <div class="truthmark-progress-fill" style="width: ${result.truthScore}%"></div>
          </div>
          <div class="truthmark-score-value">${result.truthScore}%</div>
        </div>
      </div>
      
      <div class="truthmark-analysis">
        <p>${result.analysis}</p>
      </div>
      
      ${result.sources && result.sources.length > 0 ? `
        <div class="truthmark-sources">
          <h4>Sources</h4>
          <ul>
            ${result.sources.map(source => `<li>${source}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
      
      ${result.context ? `
        <div class="truthmark-context">
          <p>${result.context}</p>
        </div>
      ` : ''}
    </div>
  `;
} 