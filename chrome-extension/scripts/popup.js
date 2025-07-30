document.addEventListener('DOMContentLoaded', function() {
  const triggerSelect = document.getElementById('triggerKey');

  // Load saved settings
  chrome.storage.local.get(['triggerKey'], function(result) {
    if (result.triggerKey) {
      triggerSelect.value = result.triggerKey;
    }
  });

  // Save trigger preference
  triggerSelect.addEventListener('change', function() {
    chrome.storage.local.set({ triggerKey: this.value });
  });
}); 