import { Route, Routes, Navigate } from 'react-router-dom';
import Homepage from './screens/home/home';
import Loading from './screens/loading/loading';
import PlayPage from './screens/play-page/play-page';
import LostGame from './screens/lost-game/lost-game';
import Victory from './screens/victory-screen/victroy-screen';
import InactivityKick from './screens/inactiviy-kick/inactivity-kick';
import Lobby from './screens/lobby/lobby';
import GameDataContext from './contexts/game-data-context';
import MainLobby from './screens/main-lobby/main-lobby';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';
import './App.scss';

function App() {
  const [gameData, setGameData] = useState({
    data: {
      status: null,
    },
  });
  const [playerId] = useState(uuidv4());

  function resetData() {
    setGameData({
      data: {
        status: null,
      },
    });
  }

  return (
    <div className="App">
      <GameDataContext.Provider
        value={{ gameData, setGameData, playerId, resetData }}
      >
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/main-lobby" element={<MainLobby />} />
          <Route path="loading" element={<Loading />} />
          <Route path="lobby" element={<Lobby />} />
          <Route path="play" element={<PlayPage />} />
          <Route path="defeat" element={<LostGame />} />
          <Route path="victory" element={<Victory />} />
          <Route path="inactive" element={<InactivityKick />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </GameDataContext.Provider>
    </div>
  );
}

export default App;
