import mfIcon from '../assets/magnifyIcon.png'
import AlarmItem from '../components/AlarmList/AlarmItem.jsx';

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
          {dummy.map((dummyItem, idx) => (
            <AlarmItem key={idx} {...dummyItem} />
          ))}
        </div>
      </div>
    </div>
  );
}
