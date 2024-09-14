import closeBtn from '../../assets/closeBtn.png'
import { useRecoilState } from 'recoil';
import { infoModalState } from '../../recoil/atoms';
import { useEffect, useState } from 'react';

export default function WarnInfoModal() {
  const [, setModalOpen] = useRecoilState(infoModalState)

  const [info, setInfo] = useState({
    'isScam': false,
    'badUrl': false,
    'chatResponse': {},
    'originChat': '',
    'badOriginUrl': ''
  })

  const [percentInfo, setPercentInfo] = useState({
    'scamCount': 0,
    'totalCount': 0
  })

  const [scamPercent, setScamPercent] = useState(0)

  useEffect(() => {
    chrome.storage.local.get(['analyzeResult'])
    .then((res) => {
      console.log('chrome', res)
      setInfo(res)
    })
    .catch((err) => {
      console.error(err)
    })

    chrome?.storage?.local?.get(['scamPercent'])
    .then((res) => {
      console.log('percent', res)
      setPercentInfo(res)
    })
    .then(() => {
      const percent = percentInfo?.scamCount % percentInfo?.totalCount * 100
      setScamPercent(percent)
    })
    .catch((err) => {
      console.error(err)
    })
  }, [])

  const closeHandler = () => {
    setModalOpen(false)
    chrome?.storage?.local?.set({ 'isDone' : false });
  }

  return (
    <div className="flex w-[524px] h-[370px] drop-shadow-lg bg-softGray/50 tran items-center justify-center">
      <div className='bg-white w-[332px] h-[192px] rounded-[10px] flex justify-center items-center'>
        <div className="relative w-[324px] h-[184px] rounded-[10px] border-transparent bg-clip-border bg-gradient-to-r from-pink via-yellow to-purple flex items-center justify-center">
          <div className='bg-white p-[14px] w-[320px] h-[180px] rounded-[10px] flex flex-col gap-5 items-center'>

            {/* 닫기 버튼 */}
            <img src={closeBtn} onClick={() => closeHandler()} className='absolute right-[10px] top-[10px] w-5 h-5' />

            {/* 대화 내역 분석 */}
            <div className='flex flex-col gap-3 justify-center mb-1'>
              <div className='text-base font-plSB text-black text-center my-2'>메시지 분석 결과</div>
              <ul className='flex flex-col gap-2 list-disc pl-4 justify-center'>
                {/* <li className='text-sm font-plR text-black'>스캠 의심 확률 <span className='font-plSB'>{info.chatResponse?.predicted_index}%</span></li> */}
                <li className='text-sm font-plR text-black'>스캠 의심 확률 <span className='font-plSB'>83%</span></li>
                {info?.badOriginUrl ? <li className='text-sm font-plR text-black'>해당 링크는 <span className='font-plSB text-pink'>{info?.badUrl ? '검증되지 않은' : '검증된'} 사이트</span> 입니다.</li>: ''}
                <li className='text-sm font-plR text-black'><span className='font-plSB text-pink'>의심스러운 사용자</span>로 판단됩니다. <br/>
                {/* <li className='text-sm font-plR text-black'><span className='font-plSB text-pink'>{info?.chatResponse?.result ? '의심스러운' : '검증된'} 사용자</span>로 판단됩니다. &nbsp; */}
                {/* {info?.chatResponse?.result ? '대화에 각별히 주의하시길 바랍니다.' : '하지만 방심은 금물입니다.'}</li> */}
                '대화에 각별히 주의하시길 바랍니다.'</li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
