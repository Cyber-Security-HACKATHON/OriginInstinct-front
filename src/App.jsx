import { useRecoilState } from 'recoil';
import AlarmList from './pages/AlarmList.jsx'
import WarnInfo from './pages/WarnInfo.jsx';
import { infoModalState } from './recoil/atoms.js';
import { useEffect, useState } from 'react';

function App() {
  const [isOpen, setIsOpen] = useRecoilState(infoModalState)
  const [storageData, setStorageData] = useState(0)

  useEffect(() => {
    // 초기 로드: chrome storage에서 값 가져오기
    chrome?.storage?.local?.get('isDone', (result) => {
      console.log(result)
      setStorageData(result.isDone); // 초기 상태 설정
    });

    const doneHandler = (changes, areaName) => {
      console.log('handleStorageChange')
      if (areaName === 'local' && changes.isDone) {
        setStorageData(changes.isDone.newValue); // 상태 업데이트
      }
    }

    // chrome storage의 변경 감지 리스너 등록
    chrome?.storage?.onChanged.addListener((changes, areaName) => {
      console.log('handleStorageChange')
      if (areaName === 'local' && changes.isDone) {
        setStorageData(changes.isDone.newValue); // 상태 업데이트
      }
    });
    // chrome?.storage?.onChanged.addListener(modalHandler());

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      chrome?.storage?.onChanged.removeListener();
      // chrome?.storage?.onChanged.removeListener(modalHandler());
    };
  }, []); // 빈 배열로 설정하여 마운트/언마운트 시에만 실행


  // storageData가 변경될 때마다 실행되는 로직
  useEffect(() => {
    console.log('Chrome storage 데이터가 변경되었습니다:', storageData);
    if (storageData === true) {
      // setIsOpen(true)
    }
  }, [storageData]); // storageData가 변경될 때마다 실행


  return (
    <div className='relative'>
      <AlarmList />
      <div id='modalArea'></div>
      {isOpen && <WarnInfo />}
    </div>
  );
}

export default App;
