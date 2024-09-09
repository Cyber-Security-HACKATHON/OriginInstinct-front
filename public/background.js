import './crx-hotreload.js';

chrome.runtime.onInstalled.addListener(() => {
  console.log('React Extension Installed');
});

chrome.action.onClicked.addListener((tab) => {
  if (tab.url.includes("instagram.com/direct/t/")) {
      chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
      });
  } else {
      console.log("Instagram DM 페이지에서만 사용할 수 있습니다.");
  }
});