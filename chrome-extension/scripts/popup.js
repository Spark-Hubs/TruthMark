document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const saveButton = document.getElementById('saveKey');
  const testButton = document.getElementById('testKey');
  const triggerSelect = document.getElementById('triggerKey');
  const statusDiv = document.getElementById('status');

  // Load saved settings
  chrome.storage.local.get(['apiKey', 'triggerKey'], function(result) {
    if (result.apiKey) {
      apiKeyInput.value = result.apiKey;
    }
    if (result.triggerKey) {
      triggerSelect.value = result.triggerKey;
    }
  });

  // Save API key
  saveButton.addEventListener('click', function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key', 'error');
      return;
    }

    chrome.storage.local.set({ apiKey: apiKey }, function() {
      showStatus('API key saved successfully!', 'success');
    });
  });

  // Test API key
  testButton.addEventListener('click', async function() {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      showStatus('Please enter an API key first', 'error');
      return;
    }

    showStatus('Testing connection...', 'info');
    
    try {
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
              content: 'You are a fact-checking assistant.'
            },
            {
              role: 'user',
              content: 'Test connection'
            }
          ]
        })
      });

      if (response.ok) {
        showStatus('Connection successful!', 'success');
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      showStatus('Connection failed. Please check your API key.', 'error');
    }
  });

  // Save trigger preference
  triggerSelect.addEventListener('change', function() {
    chrome.storage.local.set({ triggerKey: this.value });
  });

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    
    // Hide status after 3 seconds
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
}); 