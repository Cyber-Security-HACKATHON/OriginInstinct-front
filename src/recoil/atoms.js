import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist';

// const { persistAtom } = recoilPersist();
const { persistAtom } = recoilPersist({
  key: "localStorage", // 고유한 key 값
  storage: localStorage,
})

export const infoModalState = atom({
  key: 'infoModalState',
  default: false,
	effects_UNSTABLE: [persistAtom],
});

export const isScanningState = atom({
  key: 'isScanningState',
  default: false  // 초기값(실행 전)
});

export const consentModalState = atom({
  key: 'consentModalState',
  default: false
});

export const analyzeResult = atom({
  key: 'analyzeResult',
  default: {
    'isScam': false,
    'chatList': [],
    'isBadUrl': false
  },
  storage: localStorage
})