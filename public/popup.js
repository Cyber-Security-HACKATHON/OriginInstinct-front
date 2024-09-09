// popup에서 모달 바로 생성->content.js 함수 실행
// content_scripts에 주입하면 CSP 제약이 없지만 무조건 페이지 로드시 content.js 실행
// content_scripts를 없애면 사용자가 원할 때 실행이 가능하지만 CSP 제약 걸림

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('openModalBtn');
  let isScanning = false; // 상태를 관리할 변수

  button.addEventListener('click', () => {
    isScanning = !isScanning; // 상태 토글
    const action = isScanning ? 'startScan' : 'stopScan';
    chrome.runtime.sendMessage({ action: action });
    // chrome.runtime.sendMessage({ action: 'createModal' });
    createModal();
    button.textContent = isScanning ? '검사 중단' : '검사 시작';
  });
});

function createModal() {
  const modalOverlay = document.createElement('div');
  modalOverlay.id = 'custom-modal-overlay';
  modalOverlay.style.position = 'fixed';
  modalOverlay.style.top = '0';
  modalOverlay.style.left = '0';
  modalOverlay.style.width = '100%';
  modalOverlay.style.height = '100%';
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '9999';

  const modalContent = document.createElement('div');
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '20px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.textAlign = 'center';
  
  const title = document.createElement('h2');
  title.textContent = '사전 동의 필요';
  modalContent.appendChild(title);

  const message = document.createElement('p');
  message.textContent = '검사를 시작하려면 동의해주세요.';
  modalContent.appendChild(message);

  // 동의 버튼 생성
  const agreeButton = document.createElement('button');
  agreeButton.textContent = '동의';
  agreeButton.style.backgroundColor = '#4CAF50';
  agreeButton.style.color = 'white';
  agreeButton.style.padding = '10px 20px';
  agreeButton.style.margin = '10px';
  agreeButton.style.border = 'none';
  agreeButton.style.borderRadius = '5px';
  agreeButton.style.cursor = 'pointer';

  // 동의 버튼 클릭 시 추출 함수 실행 및 모달 닫기
  agreeButton.onclick = () => {
    console.log('동의 완료, 검사 시작');
    document.body.removeChild(modalOverlay);
    // scrollAndExtract(); // 검사 실행 함수 호출
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['content.js'] // content.js를 주입하여 페이지에 함수 정의(이거 안하고 바로 func() => 보내니까 함수 없다고 오류뜬다(기존에 주입돼있어야함))
      }).then(() => {
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          func: () => {
            if (typeof scrollAndExtract === 'function') {
              scrollAndExtract();
            } else {
              console.error('scrollAndExtract 함수가 존재하지 않습니다.');
            }
          }
        });
      }).catch((error) => {
        console.error('Error injecting content.js:', error);
      });
    });
  };
  modalContent.appendChild(agreeButton);

  // 취소 버튼 생성
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '취소';
  cancelButton.style.backgroundColor = '#f44336';
  cancelButton.style.color = 'white';
  cancelButton.style.padding = '10px 20px';
  cancelButton.style.margin = '10px';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '5px';
  cancelButton.style.cursor = 'pointer';

  // 취소 버튼 클릭 시 모달 제거
  cancelButton.onclick = () => {
    console.log('검사 취소');
    document.body.removeChild(modalOverlay);
  };
  modalContent.appendChild(cancelButton);

  // 모달 페이지에 추가
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}