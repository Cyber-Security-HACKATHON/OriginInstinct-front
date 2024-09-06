import mfIcon from '../assets/magnifyIcon.png'
import miniWarnIcon from '../assets/miniWarnIcon.png'

const dummy = [
  {
    profileImg: 'https://i.namu.wiki/i/c1GTTKMxSQJhdu1ro8bu9KxQqe6csuMTxAA_V-TkxKS2D6CPzXFHXG8pG9PnAYeLFPOT-1vFSVDWmcEuT2fYTw.webp',
    warnLevel: 5,
    nickName: 'romance'
  },
  {
    profileImg: 'https://img.stibee.com/61433_1708300624.png',
    warnLevel: 4,
    nickName: 'scam'
  },
  {
    profileImg: 'https://pbs.twimg.com/media/EBNqodKUIAIiBva.jpg',
    warnLevel: 4,
    nickName: 'needmoney'
  },
  {
    profileImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAePok-dj2T_LvL8rGXqhiJPtGj7BsejYVAg&s',
    warnLevel: 2,
    nickName: 'plzcoin'
  },
  {
    profileImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpb4skzF1wAtnHi6JelKGl4PpSArhAApqK3g&s',
    warnLevel: 5,
    nickName: 'fxxkromance'
  },
  {
    profileImg: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRL6Hc1mSMjUJHiEkdQgMREQaXPhmsNkUOjy4c_cCB7DiBkurjNn4W_Nr-pGMeWsVY15lI&usqp=CAU',
    warnLevel: 2,
    nickName: 'fxxkscam'
  },
  {
    profileImg: 'https://media.themoviedb.org/t/p/w320_and_h180_bestv2/ihV2jiGNZdz278KoMkYauXD70lB.jpg',
    warnLevel: 5,
    nickName: 'plzmoney'
  },
]

export default function AlarmList() {

  return (
    <>
      <div className="p-3 pe-0 flex w-72 h-12 bg-white gap-3 justify-center items-center">
        <img src={mfIcon} className='w-4 h-4'/>
        <div className='font-plEB text-xl text-transparent bg-clip-text bg-gradient-to-r from-pink via-yellow to-purple'>분석 결과</div>
        <div className='w-40 h-[0.5px] bg-gradient-to-r from-pink via-yellow to-purple'/>
      </div>

      <div className="w-72 h-72 bg-softGray p-2 overflow-scroll scrollbar-hide">
        <div className='flex flex-col gap-1 '>
          {dummy.map((dummyItem, idx) => (
            <div key={idx} className='h-12 rounded-[10px] p-2 flex gap-2 items-center'>
              <div className='relative'>
                <img src={dummyItem.profileImg} className='rounded-full w-[30px] h-[30px]' />
                <div className={`flex items-center justify-center rounded-full w-4 h-4 z-10 absolute bottom-[-4px] right-[-4px] ${
                  dummyItem.warnLevel === 1
                  ? 'bg-softGray'
                  : dummyItem.warnLevel === 2
                  ? 'bg-yellow'
                  : dummyItem.warnLevel === 3
                  ? 'bg-purple'
                  : dummyItem.warnLevel === 4
                  ? 'bg-pink'
                  : 'bg-red-600'
                }`}>
                  <img src={miniWarnIcon} className='w-[10px]'/>
                </div>
              </div>
              <div className='font-plR text-xs text-black truncate'>
                <span className='font-plM'>@{dummyItem.nickName}</span> &nbsp; 주의가 필요한 사용자입니다.
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
