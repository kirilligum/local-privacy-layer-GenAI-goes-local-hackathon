chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
});

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
