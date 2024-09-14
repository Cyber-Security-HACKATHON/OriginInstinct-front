// chrome.runtime.getManifest().options.apiBaseUrl;
// const baseUrl = chrome.runtime.getManifest().options.apiBaseUrl;

if (!window.hasRun) {
  window.hasRun = true;

  // 메시지를 저장할 배열, 아이디를 저장할 문자열
  let chatList = [];
  let otherId = '';
  let userId = '';
  let otherNickname = ''; // 상대방 닉네임(상대방 메시지만 뽑는데 필요)
  let scrollInterval = null;  // 스크롤 간격 저장용
  let currentUrl = window.location.href;  // 현재 URL 저장
  let isExtracting = false;
  let isReady = true; // 추출 함수를 포함한 scrollAndExtract 플래그

  chrome.storage.local.set({ 'scamPercent' : {
    'scamCount': 0,
    'totalCount': 0
  }})

  chrome.storage.local.set({ 'isDone' : false })

  chrome.storage.local.set({ 'resultList' : [] })

  // 데이터 서버로 전송
  function sendToServer(userId, otherId, chatList) {
    const data = { 
      'userId': userId, 
      'otherId': otherId, 
      'data': chatList[chatList.length-1] 
    };  
    fetch('http://localhost:8080/api/chat/analyze', {
      method: 'POST',  
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',

      },
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(async (data) => {
      chrome.storage.local.set({ 'analyzeResult' : {
        'isScam': data.isScam,
        'badUrl': data.badUrl,
        'chatResponse': data.chatResponse,
        'originChat': data.originChat,
        'badOriginUrl': data.badOriginUrl
      }})

      const resultInfo = await chrome.storage.local.get('resultList')
      console.log('resultinfo', resultInfo)

      const result = resultInfo?.resultList || [];

      chrome.storage.local.set({ 'resultList' : [data, ...result]})

      const percentInfo = chrome.storage.local.get(['scamPercent'])
      const scamCountValue = percentInfo.scamCount
      const totalCountValue = percentInfo.totalCount

      if (data.chatResponse.result === 1) {
        chrome.storage.local.set({ 'scamPercent' : {
          'scamCount': scamCountValue + 1,
          'totalCount': totalCountValue + 1
        }})
      } else {
        chrome.storage.local.set({ 'scamPercent' : {
          'scamCount': scamCountValue,
          'totalCount': totalCountValue + 1
        }})
      }
    })
    .then(() => {
      console.log('setting isDone')
      chrome.storage.local.set({ 'isDone' : true });
    })
    .catch((error) => console.log('Error:', error));
  }
  
  // 내 아이디 추출 함수(창 작아져서 반응형으로 내 아이디 부분 사라지면 없다고 나옴)
  function extractUserId() {
    const chatListDiv = document.querySelector('div[aria-label="대화 리스트"]');

    if (chatListDiv) {
      const spans = chatListDiv.querySelectorAll('div[role="button"] > div > span[dir="auto"] > span');

      if (spans.length > 0) {
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
      // 닉네임을 설정하지 않은 경우
      otherId = otherNickname;
      console.log(`상대방의 아이디=닉네임: ${otherId}`);
    }
  }

  // 메시지 추출 함수
  function extractChatList() {
    if (isExtracting) return;  // 이미 추출 중이라면 중복 실행 방지
    isExtracting = true;

    const messageElements = document.querySelectorAll('div[data-scope="messages_table"] div[dir="auto"]');

    if (messageElements.length === 0) {
      console.log("메시지를 찾을 수 없습니다.");
      isExtracting = false;
      return;
    }
    
    let isInTargetMessages = false; // 현재 대화가 상대방 메시지 영역인지 여부
    
    // if (h5Element && h5Element.textContent !== '보낸 메시지')이렇게 했을때 forEach때문에 도중에 내가 보낸게 나오면 그 뒤부터는 짤림 -> 결론: 플래그가 필요했다
    messageElements.forEach(messageElement => {
      const h5Element = messageElement.closest('div[data-scope="messages_table"]').querySelector('h5[dir="auto"] span');

      if (h5Element) {
        // 말풍선마다 보낸사람 닉네임 추출
        const sender = h5Element.textContent.trim();

        if (sender === otherNickname) {
          // 상대방의 메시지 영역에 진입
          isInTargetMessages = true;
        } else {
          isInTargetMessages = false;
        }
      }
  
      // 상대방 메시지 영역에 있을 때만 추출
      if (isInTargetMessages) {
        const messageText = messageElement.textContent.trim();
        // !chatList.includes(messageText)
        if (messageText ) {
          chatList.push(messageText);
          console.log(`메시지: ${messageText}`);
          console.log('---------------------');
        }
      }

    });
    sendToServer(userId, otherId, chatList);
    console.log('전송완료');
    isExtracting = false;
    console.log('진짜최종', chatList);  // 다끝나고 최종버전 찍기(이거 안찍어서 한시간넘게 헛짓함)
  }

  // 무한 스크롤 기능 추가 (자동 스크롤)
  function scrollAndExtract() {
    if (!isReady) return;
  
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
  
    // 상대방 닉네임 저장하기
    const ariaLabel = chatWindow.getAttribute('aria-label');
    otherNickname = ariaLabel.split('과 나눈 대화의 메시지')[0];
    console.log(`상대방 닉네임: ${otherNickname}`);
  
    // chatWindow 내부에서 스크롤 가능한 자식 요소 찾기
    const scrollableElement = Array.from(chatWindow.querySelectorAll('div')).find(el => el.scrollHeight > el.clientHeight);

    if (scrollableElement) {
      console.log("스크롤 가능한 요소를 찾았습니다.");
  
      // 최상단으로 스크롤 올리기
      scrollableElement.scrollTop = 0;
  
      // 스크롤 후 일정 시간 대기
      setTimeout(() => {
        if (!isReady) return;

        let previousHeight = scrollableElement.scrollHeight;
        let currentHeight = previousHeight;

        scrollInterval = setInterval(() => {
          if (!isReady) return;
  
          // 스크롤을 끝까지 내림
          scrollableElement.scrollTop = scrollableElement.scrollHeight;
  
          // 스크롤 후 일정 시간 대기
          setTimeout(() => {
            if (!isReady) return;

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
              // console.log('최종 메시지 목록:', chatList);
              // console.log('최종 상대방 아이디:', otherId);
              // console.log('최종 내 아이디:', userId);

              // 플래그 초기화
              isReady = true;
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
    isReady = false;
    isExtracting = false;
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
      stopScript();
      window.hasRun = false;  //
      chatList.length = 0;
      otherId = '';
      userId = '';
      otherNickname = '';
      currentUrl = window.location.href;
    }
  });

  // 옵저버 설정
  urlObserver.observe(document.body, { childList: true, subtree: true });

  const mutationObserver = new MutationObserver((mutationsList) => {
    let newMessagesDetected = false;  // 새 메시지 감지
  
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.matches('div[data-virtualized="false"]')) {
            const elements = document.querySelectorAll('div[data-scope="messages_table"] div[dir="auto"]');
            let isInTargetMessages = false;
            elements.forEach(messageElement => {
              const h5Element = messageElement.closest('div[data-scope="messages_table"]').querySelector('h5[dir="auto"] span');
        
              if (h5Element) {
                // 말풍선마다 보낸사람 닉네임 추출
                const sender = h5Element.textContent.trim();
        
                if (sender === otherNickname) {
                  // 상대방의 메시지 영역에 진입
                  isInTargetMessages = true;
                  newMessagesDetected = true;
                } else if (sender === '보낸 메시지') {
                  // 내가 보낸 메시지인 경우 처리 안 함
                  isInTargetMessages = false;
                } else {
                  isInTargetMessages = false;
                }
              }
            });
          }
        });
      }
    }
  
    if (newMessagesDetected) {
      // 일정 시간 대기 후 extractChatList() 호출 (DOM 변화가 완료된 후)
      setTimeout(() => {
        if (isExtracting === false) {
          extractChatList();  // 새로운 메시지 추출
        }
      }, 500); // 500ms 대기
    }
  });

  // DOM 변경 감지 및 메시지/아이디 추출
  // const mutationObserver = new MutationObserver((mutationsList) => {
  //   let newMessagesDetected = false;  // 새 메시지 감지

  //   for (const mutation of mutationsList) {
  //     // if (mutation.type === 'childList' && mutation.addedNodes.length) {
  //     if (mutation.type === 'childList') {
  //       mutation.addedNodes.forEach(node => {
  //         if (node.nodeType === 1 && node.matches('div[data-virtualized="false"]')) {
  //           const elements = document.querySelectorAll('div[data-scope="messages_table"] div[dir="auto"]');
  //           let isInTargetMessages = false;
  //           elements.forEach(messageElement => {
  //             const h5Element = messageElement.closest('div[data-scope="messages_table"]').querySelector('h5[dir="auto"] span');
        
  //             if (h5Element) {
  //               // 말풍선마다 보낸사람 닉네임 추출
  //               const sender = h5Element.textContent.trim();
        
  //               if (sender === otherNickname) {
  //                 // 상대방의 메시지 영역에 진입
  //                 isInTargetMessages = true;
  //                 newMessagesDetected = true;
  //               } else {
  //                 isInTargetMessages = false;
  //               }
  //             }
  //           });
  //         }
  //       });
  //     }
  //   }
    
  //   if (newMessagesDetected) {
  //     // 일정 시간 대기 후 extractChatList() 호출 (DOM 변화가 완료된 후)
  //     // console.log('새 메시지');
  //     // console.log(isExtracting);
  //     setTimeout(() => {
  //       if (isExtracting === false) {
  //         extractChatList();  // 새로운 메시지 추출
  //       }
  //     }, 500); // 500ms 대기
  //   }
  // });
  
  // 옵저버 설정
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}
