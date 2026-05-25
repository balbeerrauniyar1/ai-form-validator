// Detect forms on the page
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  chrome.tabs.sendMessage(tabs[0].id, { action: 'detectForms' }, (response) => {
    if (response && response.forms) {
      const formCount = response.forms.length;
      document.getElementById('formCount').textContent = formCount;
      
      const formsList = document.getElementById('formsList');
      if (formCount > 0) {
        formsList.innerHTML = response.forms
          .map((form, i) => `<div>• Form ${i + 1}: ${form.fields} fields</div>`)
          .join('');
      } else {
        formsList.textContent = 'No forms found on this page';
      }
    }
  });
});

function validateForm() {
  const statusDiv = document.getElementById('status');
  statusDiv.className = 'status loading';
  statusDiv.textContent = 'Validating form...';
  statusDiv.style.display = 'block';
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: 'validateForm' }, (response) => {
      if (response && response.success) {
        statusDiv.className = 'status success';
        statusDiv.textContent = '✓ Form validation successful!';
      } else {
        statusDiv.className = 'status error';
        statusDiv.textContent = '✗ Validation failed or no forms found';
      }
    });
  });
}

function openApp() {
  const appUrl = 'https://your-app-domain.com'; // Replace with actual app URL
  chrome.tabs.create({ url: appUrl });
}
