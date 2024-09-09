import React from "react";
import { useRecoilState } from "recoil";
import { isScanningState } from "../../recoil/atoms";

// 여기서 요청 전달이 안되고있음...

export default function Button() {
  const [isScanning, setIsScanning] = useRecoilState(isScanningState);

  const handleClick = () => {
    if (isScanning) {
      // 중단 버튼 클릭 시
      chrome.runtime.sendMessage({ action: 'stopScan' });
      console.log("검사 중단");
    } else {
      // 검사 시작 버튼 클릭 시
      chrome.runtime.sendMessage({ action: 'startScan' });
      console.log("검사 시작");
    }
    // 상태를 반대로 토글
    setIsScanning(!isScanning);
    
    // 모달 생성 요청
    chrome.runtime.sendMessage({ action: 'createModal' });
  };

  return(
    <button onClick={handleClick} id="runScriptButton">
      {isScanning ? '검사 중단' : '검사 시작'}
    </button>
  );
}