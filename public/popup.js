// 실행되고 검사 다 끝나면 버튼 검사시작으로 바뀌게

const button = document.getElementById('openModalBtn');
let isScanning = false; // 상태를 관리할 변수

let isScanning = false; // 상태를 관리할 변수
const button = document.getElementById('openModalBtn');

document.addEventListener('DOMContentLoaded', () => {
  button.addEventListener('click', () => {
    const action = isScanning ? 'startScan' : 'stopScan';
    chrome.runtime.sendMessage({ action: action });
    createModal();
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
  modalOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
  modalOverlay.style.display = 'flex';
  modalOverlay.style.justifyContent = 'center';
  modalOverlay.style.alignItems = 'center';
  modalOverlay.style.zIndex = '9999';

  const modalContent = document.createElement('div');
  modalContent.style.display = 'flex';
  modalContent.style.flexDirection = 'column';
  modalContent.style.justifyItems= 'center';
  modalContent.style.alignItems = 'center';
  modalContent.style.backgroundColor = 'white';
  modalContent.style.padding = '22px';
  modalContent.style.borderRadius = '8px';
  modalContent.style.textAlign = 'center';
  modalContent.style.width = '320px';
  modalContent.style.height = '180px';
  
  const title = document.createElement('h2');
  title.textContent = isScanning ? '검사 중단' : '대화 내역 활용 동의';
  title.style.fontSize = '20px';
  title.style.fontFamily = 'plSB';
  title.style.color = '#202020';
  title.style.marginBottom = '6px';
  modalContent.appendChild(title);

  const message = document.createElement('p');
  message.textContent = isScanning ? '정말 검사를 중단하시겠습니까?' : '스캠 판별을 위해 대화 내역을 수집합니다. \n 수집된 데이터는 검사 후 폐기합니다.';
  message.style.fontFamily = 'plR';
  message.style.color = '#202020';
  message.style.marginTop = '8px'
  message.style.marginBottom = '14px'

  modalContent.appendChild(message);

  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.justifyContent = 'between';
  btnContainer.style.marginTop = isScanning ? '14px' : '10px';

  modalContent.appendChild(btnContainer);

  // 동의 버튼 생성
  const agreeButton = document.createElement('button');
  agreeButton.textContent = isScanning ? '중단' : '동의';
  agreeButton.style.backgroundColor = isScanning ? '#dc3545' : '#4CAF50';
  agreeButton.style.display = 'flex';
  agreeButton.style.justifyContent = 'center';
  agreeButton.style.alignItems = 'center';
  agreeButton.style.width = '100px';
  agreeButton.style.height = '30px';
  agreeButton.style.fontFamily = 'plM';
  agreeButton.style.fontSize = '16px';
  agreeButton.style.color = 'white';
  agreeButton.style.padding = '8px 12px';
  agreeButton.style.margin = '0px 20px';
  agreeButton.style.border = 'none';
  agreeButton.style.borderRadius = '5px';
  agreeButton.style.cursor = 'pointer';

  agreeButton.onclick = () => {
    isScanning = !isScanning; // 상태 토글
    button.textContent = isScanning ? '검사 중단' : '검사 시작'; 

    console.log('동의 완료, 검사 시작');
    document.body.removeChild(modalOverlay);
  };
  btnContainer.appendChild(agreeButton);

  // 취소 버튼 생성
  const cancelButton = document.createElement('button');
  cancelButton.textContent = '취소';
  cancelButton.style.backgroundColor = '#ECECEC';
  cancelButton.style.color = '#444444';
  cancelButton.style.display = 'flex';
  cancelButton.style.justifyContent = 'center';
  cancelButton.style.alignItems = 'center';
  cancelButton.style.width = '100px';
  cancelButton.style.height = '30px';
  cancelButton.style.fontFamily = 'plM';
  cancelButton.style.fontSize = '16px';
  cancelButton.style.padding = '8px 12px';
  cancelButton.style.margin = '0px 20px';
  cancelButton.style.border = 'none';
  cancelButton.style.borderRadius = '5px';
  cancelButton.style.cursor = 'pointer';

  cancelButton.onclick = () => {
    document.body.removeChild(modalOverlay);
  };
  btnContainer.appendChild(cancelButton);

  // 모달 페이지에 추가
  modalOverlay.appendChild(modalContent);
  document.body.appendChild(modalOverlay);
}

function startScanning() {
  isScanning = true;
  button.textContent = '검사 중단';
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ['content.js']
    }).then(() => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          if (typeof scrollAndExtract === 'function') {
            scrollAndExtract(() => {
              chrome.runtime.sendMessage({ action: 'stopScan' });
            });
          } else {
            console.error('scrollAndExtract 함수가 존재하지 않습니다.');
          }
        }
      });
    }).catch((error) => {
      console.error('Error injecting content.js:', error);
    });
  });
}

function stopScanning() {
  isScanning = false;
  button.textContent = '검사 시작';
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        if (typeof stopScript === 'function') {
          stopScript();
        } else {
          console.error('stopScript 함수가 존재하지 않습니다.');
        }
      }
    });
  });
}
