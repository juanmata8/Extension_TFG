let html_data = '';

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'sendHtml') {
        html_data = message.data.value;
        sendResponse({status: 'html received'});
    }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getHtml') {
        sendResponse({html: html_data});
    }
});