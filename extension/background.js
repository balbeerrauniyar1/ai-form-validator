// Background service worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Form Validator extension installed');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'validateForm') {
    // Process validation request
    console.log('Validation request received:', request.data);
    sendResponse({ success: true });
  }
});
