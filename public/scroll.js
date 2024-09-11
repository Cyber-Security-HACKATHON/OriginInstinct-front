// 스크롤바를 최상단으로 올려서 로드 후 더 위로 올라갈 수 있는 경우 안 올라가고 중간부터 메시지 크롤링하는 문제 -> 스크롤 계속 올려서 확인하는 수밖에 없나?

function scrollAndExtract() {
  if (!isReady) return;

  const messageInput = document.querySelector('div[aria-label="메시지"]');
  if (messageInput) {
    messageInput.setAttribute('contenteditable', 'false');
    messageInput.style.pointerEvents = 'none';
    messageInput.style.opacity = '0.5';
    console.log('메시지 입력이 비활성화되었습니다.');
  }

  const chatWindow = Array.from(document.querySelectorAll('div'))
    .find(el => el.getAttribute('aria-label') && el.getAttribute('aria-label').includes("나눈 대화의 메시지"));

  if (!chatWindow) {
    console.log("대화창을 찾을 수 없습니다.");
    return;
  }

  const ariaLabel = chatWindow.getAttribute('aria-label');
  otherNickname = ariaLabel.split('과 나눈 대화의 메시지')[0];
  console.log(`상대방 닉네임: ${otherNickname}`);

  const scrollableElement = Array.from(chatWindow.querySelectorAll('div')).find(el => el.scrollHeight > el.clientHeight);

  if (scrollableElement) {
    console.log("스크롤 가능한 요소를 찾았습니다.");

    scrollableElement.scrollTop = 0; // 스크롤을 최상단으로 이동

    setTimeout(() => {
      if (!isReady) return;

      let previousHeight = scrollableElement.scrollHeight;
      let currentHeight = previousHeight;

      // 스크롤 안정화 대기
      let stabilizationCount = 0;
      const stabilizeInterval = setInterval(() => {
        if (!isReady) {
          clearInterval(stabilizeInterval);
          return;
        }

        scrollableElement.scrollTop = scrollableElement.scrollHeight; // 스크롤을 다시 내림

        setTimeout(() => {
          if (!isReady) {
            clearInterval(stabilizeInterval);
            return;
          }

          currentHeight = scrollableElement.scrollHeight;

          if (previousHeight === currentHeight) {
            stabilizationCount++;
          } else {
            stabilizationCount = 0;
            previousHeight = currentHeight;
          }

          if (stabilizationCount >= 2) { // 스크롤이 안정화되었는지 확인
            clearInterval(stabilizeInterval);
            console.log('모든 메시지를 크롤링했습니다.');
            extractChatList();
            extractOtherId();
            extractUserId();

            messageInput.setAttribute('contenteditable', 'true');
            messageInput.style.pointerEvents = 'auto';
            messageInput.style.opacity = '1';
            console.log('메시지 입력이 활성화되었습니다.');

            console.log('최종 메시지 목록:', chatList);
            console.log('최종 상대방 아이디:', otherId);
            console.log('최종 내 아이디:', userId);

            isReady = true;
          }
        }, 1000); // 1초 대기
      }, 2000); // 2초 대기
    }, 2000); // 2초 대기
  } else {
    console.log("스크롤 가능한 자식 요소를 찾을 수 없습니다.");
  }
}
