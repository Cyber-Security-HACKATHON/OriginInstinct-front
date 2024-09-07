import './crx-hotreload.js';
import { infoModalState } from '../src/recoil/atoms.js';
import { useRecoilState } from 'recoil';

chrome.runtime.onInstalled.addListener(() => {
  console.log('React Extension Installed');
});
