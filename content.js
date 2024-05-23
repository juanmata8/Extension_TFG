
const data_html = document.documentElement.innerHTML;

const data = { value: `${data_html}` }; // data to be sent to the server
chrome.runtime.sendMessage({action: 'sendHtml', data: data}, (response) => {
  console.log('html sent to background:', data);
  console.log('response:', response);
});