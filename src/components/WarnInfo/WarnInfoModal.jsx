import warnIcon from '../../assets/warnIcon.png'
import closeBtn from '../../assets/closeBtn.png'
import { useRecoilState } from 'recoil';
import { infoModalState } from '../../recoil/atoms';

const dummyInfo = {
  nickName : 'plzmoney',
  profileUrl : 'https://image.cine21.com/resize/cine21/still/2005/1121/M0020066_focus52804[W578-].jpg',
  msgList : [
    'http://www.thisisfakecoin.com',
    '이거 정말 좋은 투자 정보야',
    '200% 수익률 보장된대',
    '너한테만 알려주는거니까 절대 다른사람한테 절대 알리면 안돼 비밀 지켜!'
  ],
  isSafeUrl : false,
  keywordList : [
    '투자',
    '높은 수익률',
    '비밀'
  ],
  isSafeUser : false
}

export default function WarnInfoModal() {
  const [, setModalOpen] = useRecoilState(infoModalState)

  return (
    // <div className='w-full h-full flex items-center justify-center'>
      <div className="flex w-[524px] h-[370px] drop-shadow-lg bg-white items-center justify-center">
        <div className="relative w-[500px] h-[346px] rounded-[10px] border-transparent bg-clip-border bg-gradient-to-r from-pink via-yellow to-purple flex items-center justify-center">
          <div className='bg-white p-[14px] w-[496px] h-[342px] rounded-[10px] flex flex-col gap-5'>

            {/* 닫기 버튼 */}
            <img src={closeBtn} onClick={() => setModalOpen(false)} className='absolute right-[10px] top-[10px] w-5 h-5' />

            {/* 유저 프로필 */}
            <div className='flex gap-4'>
              <img src={dummyInfo.profileUrl} className='w-20 h-20 rounded-full' />
              <div className='p-[10px] flex flex-col justify-between'>
                <div className='w-full text-xl font-plEB text-black'>@{dummyInfo.nickName}</div>
                <div className='w-full flex gap-3'>
                  <img src={warnIcon} className='w-[20px] h-[18px]' />
                  <div className='font-plR text-xs text-black'>의심스러운 대화 내용이 확인된 사용자입니다.</div>
                </div>
              </div>
            </div>

            {/* 대화 내역 분석 */}
            <div className='flex flex-col gap-[10px] justify-center'>
              <div className='text-base font-plSB text-black'>대화 내역 분석 결과</div>
              <ul className='flex flex-col gap-2 list-disc pl-4'>
                {dummyInfo.msgList.map((msgItem, idx) => (
                  <li key={idx} className='text-xs font-plR text-black'>{msgItem}</li>
                ))}
              </ul>
            </div>

            {/* 결과 박스 */}
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
