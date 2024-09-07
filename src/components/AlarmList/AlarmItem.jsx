import { useRecoilState } from 'recoil';
import miniWarnIcon from '../../assets/miniWarnIcon.png'
import { infoModalState } from '../../recoil/atoms.js';

export default function AlarmItem({ profileImg, warnLevel, nickName }) {
  const [, setModalOpen] = useRecoilState(infoModalState)

  return (
    <button onClick={() => setModalOpen(true)} className='h-12 rounded-[10px] p-2 flex gap-2 items-center'>
      <div className='relative'>
        <img src={profileImg} className='rounded-full w-[30px] h-[30px]' />
        <div className={`flex items-center justify-center rounded-full w-4 h-4 z-10 absolute bottom-[-4px] right-[-4px] ${
          warnLevel === 1
          ? 'bg-softGray'
          : warnLevel === 2
          ? 'bg-yellow'
          : warnLevel === 3
          ? 'bg-purple'
          : warnLevel === 4
          ? 'bg-pink'
          : 'bg-red-600'
        }`}>
          <img src={miniWarnIcon} className='w-[10px]'/>
        </div>
      </div>
      <div className='font-plR text-xs text-black truncate'>
        <span className='font-plM'>@{nickName}</span> &nbsp; 주의가 필요한 사용자입니다.
      </div>
    </button>
  );
}
