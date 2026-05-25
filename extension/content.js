// Detect forms and fields on the page
function detectForms() {
  const forms = document.querySelectorAll('form');
  const formData = [];
  
  forms.forEach((form, idx) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    formData.push({
      id: idx,
      fields: inputs.length,
      name: form.name || form.id || `Form ${idx + 1}`,
    });
  });
  
  return formData;
}

// Validate form fields
function validateForm() {
  const forms = document.querySelectorAll('form');
  if (forms.length === 0) {
    return { success: false, message: 'No forms found' };
  }
  
  const formData = [];
  forms.forEach((form) => {
    const inputs = form.querySelectorAll('input, textarea, select');
    const data = {};
    
    inputs.forEach((input) => {
      data[input.name || input.id || 'unnamed'] = input.value;
    });
    
    formData.push(data);
  });
  
  // Send to API for validation
  sendValidationRequest(formData);
  
  return { success: true, data: formData };
}

async function sendValidationRequest(formData) {
  try {
    const token = localStorage.getItem('firebaseToken'); // Assuming token is stored
    const response = await fetch('https://your-app-domain.com/api/check-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ formData: formData[0] }),
    });
    
    if (response.ok) {
      const result = await response.json();
      highlightErrors(result.results);
    }
  } catch (error) {
    console.error('Validation request failed:', error);
  }
}

function highlightErrors(results) {
  Object.entries(results).forEach(([fieldName, result]: any) => {
    const input = document.querySelector(`[name="${fieldName}"]`);
    if (input && !result.isValid) {
      input.style.border = '2px solid #ef4444';
      input.setAttribute('data-validation-error', result.errors.join('; '));
    }
  });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'detectForms') {
    sendResponse({ forms: detectForms() });
  } else if (request.action === 'validateForm') {
    sendResponse(validateForm());
  }
});
