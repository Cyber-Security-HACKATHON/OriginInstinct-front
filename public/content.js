// 데이터 서버로 전송
// function sendToServer(userId, otherId, chatList) {
//   const data = { userId, otherId, chatList };
//   fetch(/api/chat/analyze, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   })
//   .then(response => response.json())
//   .then(data => console.log('Success:', data))
//   .catch((error) => console.log('Error:', error));
// }

// 메시지를 저장할 배열, 아이디를 저장할 문자열
let chatList = [];
let otherId = '';
let userId = '';
let scrollInterval = null;  // 스크롤 간격 저장용
let currentUrl = window.location.href;  // 현재 URL 저장

// 내 아이디 추출 함수
function extractUserId() {
  const chatListDiv = document.querySelector('div[aria-label="대화 리스트"]');

  if (chatListDiv) {
    const spans = chatListDiv.querySelectorAll('div[role="button"] > div > span[dir="auto"] > span');

    if (spans.length > 0) {
      // 각 span 요소에서 텍스트 추출
      spans.forEach((span) => {
        const text = span.textContent.trim();
        if (text && userId === '') {
          userId = text
          console.log(`내 아이디: ${userId}`);
        }
      });
    } else {
      console.log("내 아이디를 찾을 수 없습니다");
    }
  } else {
    console.log("aria-label이 '대화 리스트'인 div를 찾을 수 없습니다.");
  }
}

// 상대방 아이디 추출 함수
function extractOtherId() {
  const idElement = Array.from(document.querySelectorAll('span[dir="auto"]'))
    .find(el => el.innerText.includes(" · Instagram"));

  if (idElement) {
    const text = idElement.innerText.split(" · ")[0].trim(); // 아이디 추출
    if (text && otherId === '') {
      otherId = text;
      console.log(`상대방 아이디: ${otherId}`);
    }
  } else {
    console.log("상대방 아이디를 찾을 수 없습니다.");
  }
}

// 메시지 추출 함수
function extractChatList() {
  if (isExtracting) return;  // 이미 추출 중이라면 중복 실행 방지

  const messageElements = document.querySelectorAll('div[dir="auto"]');
  if (messageElements.length === 0) {
    console.log("메시지를 찾을 수 없습니다.");
    return;
  }

  messageElements.forEach((element) => {
    const messageText = element.innerText.trim();
    if (messageText && !chatList.includes(messageText)) {
      chatList.push(messageText);
      console.log(`메시지: ${messageText}`);
      console.log('-------------------');
    }
  });
}

// 무한 스크롤 기능 추가 (자동 스크롤)
function scrollAndExtract() {
  // 메시지 입력창
  const messageInput = document.querySelector('div[aria-label="메시지"]');
  if (messageInput) {
    messageInput.setAttribute('contenteditable', 'false');
    messageInput.style.pointerEvents = 'none';  // 입력 비활성화
    messageInput.style.opacity = '0.5';  // 시각적으로 비활성화된 것처럼 보이게
    // messageInput.setAttribute('aria-placeholder', '메시지 입력 비활성화');
    console.log('메시지 입력이 비활성화되었습니다.');
  }

  // 특정 텍스트가 포함된 대화창 영역 선택
  const chatWindow = Array.from(document.querySelectorAll('div'))
    .find(el => el.getAttribute('aria-label') && el.getAttribute('aria-label').includes("나눈 대화의 메시지"));

  if (!chatWindow) {
    console.log("대화창을 찾을 수 없습니다.");
    return;
  }

  // chatWindow 내부에서 스크롤 가능한 자식 요소 찾기
  const scrollableElement = Array.from(chatWindow.querySelectorAll('div')).find(el => el.scrollHeight > el.clientHeight);

  if (scrollableElement) {
    console.log("스크롤 가능한 요소를 찾았습니다.");

    // 최상단으로 스크롤 올리기
    scrollableElement.scrollTop = 0;

    // 스크롤 후 일정 시간 대기
    setTimeout(() => {
      let previousHeight = scrollableElement.scrollHeight;
      let currentHeight = previousHeight;

      scrollInterval = setInterval(() => {
        // 스크롤을 끝까지 내림
        scrollableElement.scrollTop = scrollableElement.scrollHeight;

        // 스크롤 후 일정 시간 대기
        setTimeout(() => {
          currentHeight = scrollableElement.scrollHeight;

          // 스크롤 높이가 변하지 않으면 스크롤 중단
          if (previousHeight === currentHeight) {
            clearInterval(scrollInterval);
            console.log('모든 메시지를 크롤링했습니다.');
            extractChatList();  // 마지막으로 메시지 추출
            extractOtherId();        // 마지막으로 아이디 추출
            extractUserId();  // 내 아이디 추출

            // 끝나면 메시지 입력 활성화
            messageInput.setAttribute('contenteditable', 'true');
            messageInput.style.pointerEvents = 'auto';  // 입력 활성화
            messageInput.style.opacity = '1';  // 시각적으로 활성화
            // messageInput.setAttribute('aria-placeholder', '메시지 입력...');
            console.log('메시지 입력이 활성화되었습니다.');

            // 최종 메시지와 아이디 출력
            console.log('최종 메시지 목록:', chatList);
            console.log('최종 아이디 목록:', otherId);
            console.log('내 아이디:', userId);
          } else {
            previousHeight = currentHeight;
          }
        }, 1000); // 1초 뒤에 높이를 다시 확인
      }, 2000); // 2초 간격으로 스크롤
    }, 2000); // 2초 후 스크롤 시작
  } else {
    console.log("스크롤 가능한 자식 요소를 찾을 수 없습니다.");
  }
}

// 스크립트 종료 함수 (모든 옵저버 및 인터벌 중단)
function stopScript() {
  clearInterval(scrollInterval);       // 스크롤 중단
  mutationObserver.disconnect();       // DOM 감지 중단
  urlObserver.disconnect();            // URL 감지 중단
  console.log("스크립트가 중단되었습니다.");
}

// 페이지가 완전히 로드된 후 스크롤 및 메시지 추출
window.addEventListener('load', () => {
  setTimeout(() => {
    scrollAndExtract(); // 자동 스크롤 및 메시지 추출 시작
  }, 5000); // 5초 지연
});

// URL 변경 감지 (페이지 이동 또는 대화 상대 변경)
const urlObserver = new MutationObserver(() => {
  if (currentUrl !== window.location.href) {
    console.log("페이지가 변경되었습니다. 스크립트를 중단합니다.");
    stopScript();  // 스크립트 종료
    chatList.length = 0;            // 메시지 배열 초기화
    otherId = '';                  // 아이디 배열 초기화
    userId = '';  // 내 아이디 배열 초기화
    currentUrl = window.location.href; // URL 업데이트
  }
});

// 옵저버 설정
urlObserver.observe(document.body, { childList: true, subtree: true });

// DOM 변경 감지 및 메시지/아이디 추출
const mutationObserver = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList' && mutation.addedNodes.length) {
      console.log("새로운 메시지가 감지되었습니다.");
      extractChatList();  // 새로운 메시지 추출
    }
  }
});

// 옵저버 설정
mutationObserver.observe(document.body, { childList: true, subtree: true });
