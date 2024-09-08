async function main() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PASTE') {
      const area = document.getElementById('prompt-textarea');
      if (area) {
        area.value = message.text;
        area.style.height = '500px';
      }
      const div = document.querySelector('.ql-editor');
      if (div) {
        div.textContent = message.text;
      }
    }
  });
}

main();
