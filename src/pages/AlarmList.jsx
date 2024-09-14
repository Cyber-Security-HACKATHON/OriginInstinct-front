import { useEffect, useState } from 'react';
import mfIcon from '../assets/magnifyIcon.png'
import AlarmItem from '../components/AlarmList/AlarmItem.jsx';

export default function AlarmList() {

  const [result, setResult] = useState([])

  useEffect(() => {
    // 초기 로드: chrome storage에서 값 가져오기
    chrome?.storage?.local?.get('resultList', (result) => {
      console.log(result)
      setResult(result.resultList); // 초기 상태 설정
    });


    // chrome storage의 변경 감지 리스너 등록
    chrome?.storage?.onChanged.addListener((changes, areaName) => {
      console.log('handleStorageChange')
      if (areaName === 'local' && changes.resultList) {
        setResult(changes.resultList.newValue); // 상태 업데이트
      }
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      chrome?.storage?.onChanged.removeListener();
    };
  }, []); // 빈 배열로 설정하여 마운트/언마운트 시에만 실행


  // storageData가 변경될 때마다 실행되는 로직
  useEffect(() => {
    console.log('result storage 데이터가 변경되었습니다:', result);
      setResult
  }, [result]);

  return (
    <div className='flex flex-col w-full h-full'>
      <div className="p-3 pe-0 flex w-full h-12 bg-white justify-between items-center">
        <div className='flex gap-3 items-center'>
          <img src={mfIcon} className='w-4 h-4'/>
          <div className='font-plEB text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink via-yellow to-purple'>분석 결과</div>
        </div>
        <div className='w-96 h-[0.5px] bg-gradient-to-r from-pink via-yellow to-purple'/>
      </div>

      <div className="w-full h-[310px] bg-softGray p-2 overflow-scroll scrollbar-hide">
        <div className='flex flex-col gap-1 '>
          {result?.length > 0 ? result.map((dummyItem, idx) => (
            <AlarmItem key={idx} {...dummyItem} />
          )): 
          <div className='font-plSB text-base text-center'>'분석 결과가 존재하지 않습니다.'</div>
          } 
        </div>
      </div>
    </div>
  );
}
