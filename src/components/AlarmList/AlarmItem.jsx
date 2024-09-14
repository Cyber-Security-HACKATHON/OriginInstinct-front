import { useRecoilState } from 'recoil';
import warnIcon from '../../assets/warnIcon.png'
import yseIcon from '../../assets/yes.png'
import { infoModalState } from '../../recoil/atoms.js';

export default function AlarmItem({ isScam, badOriginUrl, badUrl, chatResponse, originChat }) {
  const [, setModalOpen] = useRecoilState(infoModalState)

  // const clickHandler = () => {
  //   setModalOpen(true)
  // }

  return (
    <button onClick={() => setModalOpen(true)} className='h-12 rounded-[10px] p-3 flex gap-5 items-center'>
      <div className='relative'>
        {chatResponse.result === 1 ?
          <img src={warnIcon} className='w-[20px] h-[20px]' /> :
          <img src={yseIcon} className='w-[20px] h-[20px]' />
        }

      </div>
      <div className='font-plR text-xs text-black truncate '>
        <div className='font-plR'><span className='font-plSB'>"{originChat}" </span> : {chatResponse.result === 1 ? '주의가 필요한 사용자입니다.' : '검증된 사용자입니다.'}</div>
      </div>
    </button>
  );
}
