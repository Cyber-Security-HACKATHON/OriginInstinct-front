import './crx-hotreload.js';

chrome.runtime.onInstalled.addListener(() => {
  console.log('React Extension Installed');
});
