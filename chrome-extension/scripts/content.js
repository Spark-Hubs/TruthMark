let selectedText = '';
let triggerMethod = 'doubleClick';

// Create the popup container
const popup = document.createElement('div');
popup.className = 'truthmark-popup';
document.body.appendChild(popup);

// Create close button
const closeButton = document.createElement('button');
closeButton.className = 'truthmark-close-button';
closeButton.innerHTML = '×';
closeButton.addEventListener('click', () => {
  popup.style.display = 'none';
});
popup.appendChild(closeButton);

// Load trigger method from storage
chrome.storage.local.get(['triggerKey'], function(result) {
  if (result.triggerKey) {
    triggerMethod = result.triggerKey;
  }
});

// Handle text selection
document.addEventListener('mouseup', function(e) {
  const text = window.getSelection().toString().trim();
  if (text) {
    selectedText = text;
  }
});

// Handle different trigger methods
document.addEventListener('dblclick', function(e) {
  if (triggerMethod === 'doubleClick' && selectedText) {
    analyzeText();
  }
});

document.addEventListener('contextmenu', function(e) {
  if (triggerMethod === 'rightClick' && selectedText) {
    e.preventDefault();
    analyzeText();
  }
});

document.addEventListener('click', function(e) {
  if (triggerMethod === 'ctrlClick' && e.ctrlKey && selectedText) {
    analyzeText();
  }
});

async function analyzeText() {
  if (!selectedText) return;

  // Show loading state
  showPopup(`
    <div class="truthmark-loading">
      <div>🔍 Analyzing text...</div>
      <div class="truthmark-loading-bar">
        <div class="truthmark-loading-progress"></div>
      </div>
    </div>
  `);

  // Send message to background script
  chrome.runtime.sendMessage({
    action: 'analyzeText',
    text: selectedText
  }, function(response) {
    if (response.error) {
      showPopup(`
        <div class="truthmark-error">
          <h3>Error</h3>
          <p>${response.error}</p>
        </div>
      `);
    } else {
      showPopup(response.result);
    }
  });
}

function showPopup(content) {
  // Remove any existing content except the close button
  const closeButton = popup.querySelector('.truthmark-close-button');
  popup.innerHTML = '';
  popup.appendChild(closeButton);
  
  // Add the new content
  const contentDiv = document.createElement('div');
  contentDiv.innerHTML = content;
  popup.appendChild(contentDiv);
  
  // Show the popup
  popup.style.display = 'block';
} 