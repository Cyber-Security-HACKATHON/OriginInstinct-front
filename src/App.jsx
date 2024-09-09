import { useRecoilValue } from 'recoil';
import AlarmList from './pages/AlarmList.jsx'
import WarnInfo from './pages/WarnInfo.jsx';
import NavBar from './components/NavBar/Button.jsx';
import { infoModalState } from './recoil/atoms.js';

function App() {
  const isOpen = useRecoilValue(infoModalState)
  
  return (
    <div className='relative'>
      {/* <NavBar /> */}
      <AlarmList />
      <div id='modalArea'></div>
      {isOpen && <WarnInfo />}
    </div>
  );
}

export default App;
