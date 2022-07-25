import CountdownTimer from '../timer/timer-countdown/timer-countdown';
import PlayerCard from '../player-card/player-card';
import ModalContext from '../../contexts/modal-context';
import './users-container.scss';
import { useContext, useCallback } from 'react';
import {
  ANSWERING,
  ASKING,
  GUESSING,
  INACTIVE,
} from '../../constants/constants';
import GameDataContext from '../../contexts/game-data-context';
import { useNavigate } from 'react-router-dom';

function UsersContainer({ currentPlayer, players, playerTurn }) {
  const modalActive = useContext(ModalContext)[0];
  const { gameData, leaveGame } = useContext(GameDataContext);
  const history = gameData.history.entries;
  const activeQuestion = history[history.length - 1];
  const allPlayersAnswered =
    activeQuestion?.answers.length >= gameData.players.length - 1;
  const questionAsked = activeQuestion?.playerId === playerTurn.id;
  const navigate = useNavigate();

  const onTimerFinish = useCallback(
    async function () {
      if (
        (currentPlayer.playerState === ASKING ||
          currentPlayer.playerState === GUESSING) &&
        questionAsked
      ) {
        return;
      }

      if (
        currentPlayer.playerState === ANSWERING &&
        (activeQuestion?.playerId === currentPlayer.id ||
          activeQuestion?.answers.some(
            (ans) => ans.playerId === currentPlayer.id
          ))
      ) {
        return;
      }

      try {
        await leaveGame();
        navigate(INACTIVE);
      } catch {
        //todo: handle errors
      }
    },
    [
      activeQuestion?.answers,
      activeQuestion?.playerId,
      currentPlayer.id,
      currentPlayer.playerState,
      leaveGame,
      navigate,
      questionAsked,
    ]
  );

  return (
    <div className="users">
      <div className="users__timer-container">
        <p className="users__turn">TURN TIME</p>
        <CountdownTimer
          small={'v-small'}
          time={questionAsked && !allPlayersAnswered ? 20 : 60}
          paused={modalActive}
          onFinish={onTimerFinish}
          reset={playerTurn.id}
        />
      </div>
      {currentPlayer && (
        <PlayerCard
          className="in-users-container"
          avatarClassName={currentPlayer.avatar}
          name={currentPlayer.name}
          assignedCharacter="This is you"
          active={currentPlayer.id === playerTurn?.id}
          playerStatusClassName={currentPlayer.character ? 'yes' : null}
        />
      )}
      <hr />
      <div className="users__list">
        {players
          ? players.map((player, index) => (
              <PlayerCard
                className="in-users-container"
                key={player.id}
                name={player.name}
                avatarClassName={player.avatar}
                assignedCharacter={player.character}
                active={player.id === playerTurn?.id}
                playerStatusClassName={currentPlayer.character ? 'yes' : null}
              />
            ))
          : null}
      </div>
    </div>
  );
}

export default UsersContainer;
