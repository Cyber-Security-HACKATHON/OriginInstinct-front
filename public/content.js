import './content.css'
import { infoModalState } from '../src/recoil/atoms'
import { useRecoilState } from 'recoil'
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import WarnInfoModal from '../src/pages/WarnInfo'; // WarnInfoModal 컴포넌트를 불러옵니다.

const storage = window.localStorage.getItem('localStorage')

if (storage) {
  console.log(storage)
  if (storage.infoModalState === true) {
    addModal()
  }
}

export default function addModal() {
  let modalArea = document.getElementById('modalArea')

  if (modalArea) {
    const root = ReactDOM.createRoot(modalArea);
    root.render(<WarnInfoModal />)
  }

}
