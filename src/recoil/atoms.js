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