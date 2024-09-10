// 실행되고 검사 다 끝나면 버튼 검사시작으로 바뀌게

const button = document.getElementById('openModalBtn');
let isScanning = false; // 상태를 관리할 변수

document.addEventListener('DOMContentLoaded', () => {
  button.addEventListener('click', () => {
    if (!isScanning) {
      // 검사 시작 버튼 클릭 - 모달을 열고 동의 받기
      chrome.runtime.sendMessage({ action: 'startScan' });
      createModal();
    } else {
      // 검사 중단 버튼 클릭 - stopScript 실행
      stopScanning();
    }
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

  agreeButton.onclick = () => {
    startScanning();
    document.body.removeChild(modalOverlay);
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

  cancelButton.onclick = () => {
    document.body.removeChild(modalOverlay);
  };
  modalContent.appendChild(cancelButton);

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
