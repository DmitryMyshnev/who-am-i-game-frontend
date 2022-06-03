import { Route, Routes } from 'react-router-dom';
import Homepage from './screens/home/home';
import Loading from './screens/loading/loading';
import PlayPage from './screens/play-page/play-page';
import LostGame from './screens/lost-game/lost-game';
import Victory from './screens/victory-screen/victroy-screen';
import './App.scss';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="loading" element={<Loading />} />
        <Route path="play" element={<PlayPage />} />
        <Route path="lost" element={<LostGame />} />
        <Route path="victory" element={<Victory />} />
      </Routes>
    </div>
  );
}

export default App;
