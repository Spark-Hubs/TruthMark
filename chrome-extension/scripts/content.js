let selectedText = '';
let triggerMethod = 'doubleClick';
let lastSelectedText = ''; // Store the last valid selection
let doubleClickTimeout = null; // For handling double-click timing
let isDoubleClicking = false; // Track double-click state

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

// Function to clear text selection
function clearSelection() {
  if (window.getSelection) {
    window.getSelection().removeAllRanges();
  } else if (document.selection) {
    document.selection.empty();
  }
}

// Function to get current selection text
function getCurrentSelection() {
  if (window.getSelection) {
    return window.getSelection().toString().trim();
  } else if (document.selection) {
    return document.selection.createRange().text.trim();
  }
  return '';
}

// Handle text selection
document.addEventListener('mouseup', function(e) {
  if (!isDoubleClicking) {
    const text = getCurrentSelection();
    if (text) {
      selectedText = text;
      lastSelectedText = text; // Store the last valid selection
    }
  }
});

// Handle different trigger methods
document.addEventListener('dblclick', function(e) {
  if (triggerMethod === 'doubleClick') {
    e.preventDefault(); // Prevent default double-click behavior
    isDoubleClicking = true;
    
    // Temporarily prevent text selection
    document.body.classList.add('truthmark-no-select');
    
    // Clear any selection that might have been created by double-click
    clearSelection();
    
    // Use the last valid selection instead of current selection
    if (lastSelectedText) {
      selectedText = lastSelectedText;
      analyzeText();
    } else {
      // Fallback: try to get current selection after a brief delay
      setTimeout(() => {
        const currentText = getCurrentSelection();
        if (currentText) {
          selectedText = currentText;
          analyzeText();
        }
      }, 10);
    }
    
    // Reset double-click state and remove no-select class after a brief delay
    setTimeout(() => {
      document.body.classList.remove('truthmark-no-select');
      isDoubleClicking = false;
    }, 100);
  }
});

// Alternative approach: Handle double-click with timeout
document.addEventListener('mousedown', function(e) {
  if (triggerMethod === 'doubleClick') {
    // Clear any existing timeout
    if (doubleClickTimeout) {
      clearTimeout(doubleClickTimeout);
    }
    
    // Set a timeout to check for double-click
    doubleClickTimeout = setTimeout(() => {
      // This is a single click, not a double click
      doubleClickTimeout = null;
    }, 300); // 300ms is typical double-click threshold
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