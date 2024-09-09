import warnIcon from '../../assets/warnIcon.png'
import closeBtn from '../../assets/closeBtn.png'
import { useRecoilState } from 'recoil';
import { consentModalState } from '../../recoil/atoms';

export default function WarnInfoModal() {
  const [, setModalOpen] = useRecoilState(consentModalState)

  return (
    // <div className='w-full h-full flex items-center justify-center'>
      <div className="flex w-[524px] h-[370px] drop-shadow-lg bg-white items-center justify-center">
        <div className="relative w-[500px] h-[346px] rounded-[10px] border-transparent bg-clip-border bg-gradient-to-r from-pink via-yellow to-purple flex items-center justify-center">
          <div className='bg-white p-[14px] w-[496px] h-[342px] rounded-[10px] flex flex-col gap-5'>

            {/* 닫기 버튼 */}
            <img src={closeBtn} onClick={() => setModalOpen(false)} className='absolute right-[10px] top-[10px] w-5 h-5' />

            {/* 주의 문구 */}
            <div className='flex flex-col gap-[10px] justify-center'>
              <div className='text-base font-plSB text-black'>사전 안내 사항</div>
              <ul className='flex flex-col gap-2 list-disc pl-4'>
                <li>ㅇㅇㅇ</li>
                <li>ㅇㅇㅇ</li>
                <li>ㅇㅇㅇ</li>
                <li>ㅇㅇㅇ</li>
              </ul>
            </div>

            {/* 동의 버튼 */}
            <div className='font-plR text-xs text-black flex flex-col gap-[5px] px-[14px] py-[6px] bg-softGray justify-center'>
              <div className=''>해당 링크는 <span className='font-plSB text-pink'>{dummyInfo.isSafeUrl ? '검증된' : '검증되지 않은'} 사이트</span> 입니다.</div>
              <div className=''>의심 키워드 {dummyInfo.keywordList.map((keyword, idx) => (
                <span>#<span key={idx} className='font-plSB'>{keyword} &nbsp;</span></span>
              ))}</div>
              <div>
                <span className='font-plSB text-pink'>{dummyInfo.isSafeUser ? '검증된' : '의심스러운'} 사용자</span>로 판단됩니다. &nbsp;
                {dummyInfo.isSafeUrl ? '하지만 방심은 금물입니다.' : '대화에 각별히 주의하시길 바랍니다.'}
              </div>
            </div>

          </div>
        </div>
      </div>
    // </div>
  );
}
