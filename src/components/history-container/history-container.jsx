import HistoryItem from '../history-item/history-item';
import QuestionForm from '../question-form/question-form';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
  useCallback,
} from 'react';
import AnswerForm from '../answer-form/answer-form';
import MessageBlock from '../message-block/message-block';
import './history-container.scss';
import { answerQuestion, askQuestion } from '../../services/games-service';
import {
  ANSWERING,
  ASKING,
  GUESSING,
  NO,
  RESPONSE,
  WAITING,
} from '../../constants/constants';
import GameDataContext from '../../contexts/game-data-context';
import keyBy from 'lodash/keyBy';

function HistoryContainer({ currentPlayer, players, playerTurn }) {
  const { gameData, playerId, fetchGame } = useContext(GameDataContext);
  const bottomElement = useRef(null);
  const [loading, setLoading] = useState(false);
  const mode = currentPlayer.playerState;
  const playersByIds = gameData.playersById;
  const history = gameData.history.entries;
  const activeQuestion = history[history.length - 1];
  const answersById = useMemo(
    () => keyBy(activeQuestion?.answers, 'playerId') || {},
    [activeQuestion?.answers]
  );
  const playerAnswered = !!answersById[playerId];
  const allPlayersAnswered =
    activeQuestion?.answers.length >= gameData.players.length - 1;

  const allPlayers = useMemo(
    () => Object.values(gameData.playersById),
    [gameData.playersById]
  );

  useEffect(() => {
    const listBottom = bottomElement.current;

    if (!listBottom) return;

    listBottom.scrollIntoView({
      behavior: 'auto',
      block: 'end',
    });
  }, [history.length]);

  const submitAsk = useCallback(
    async (question) => {
      setLoading(true);
      try {
        await askQuestion(playerId, gameData.id, question);
        await fetchGame();
      } catch (error) {
        //to do: handle error
      }
      setLoading(false);
    },
    [fetchGame, gameData.id, playerId]
  );

  const submitAnswer = useCallback(
    async (answer) => {
      setLoading(true);
      try {
        await answerQuestion(playerId, gameData.id, answer);
        await fetchGame();
      } catch (error) {
        //to do: handle error
      }
      setLoading(false);
    },
    [fetchGame, gameData.id, playerId]
  );

  return (
    <div className="history">
      <div className="history_list">
        {history.map((item, index) => {
          if (!playersByIds[item.playerId]) {
            return null;
          }
          const last = history.length - 1 === index;

          return (
            <HistoryItem
              question={item}
              key={index}
              user={playersByIds[item.playerId]}
              users={last ? gameData.players : allPlayers}
              last={last}
            />
          );
        })}
        <div className="list_scroll_bottom" ref={bottomElement}></div>
      </div>
      <div className="history_bottom">
        {mode === ASKING && (history.length === 0 || allPlayersAnswered) && (
          <QuestionForm onSubmit={submitAsk} disabled={loading} />
        )}
        {mode === ANSWERING &&
          history.length !== 0 &&
          !playerAnswered &&
          !allPlayersAnswered && (
            <AnswerForm
              mode={activeQuestion?.isGuess ? GUESSING : mode}
              onSubmit={submitAnswer}
              disabled={loading}
            />
          )}
        {mode === ANSWERING && playerAnswered && (
          <MessageBlock
            mode={WAITING}
            message={answersById[playerId]?.answer}
          />
        )}
        {mode === ANSWERING &&
          history.length !== 0 &&
          allPlayersAnswered &&
          !playerAnswered && <MessageBlock mode={RESPONSE} message={NO} />}
      </div>
    </div>
  );
}

export default HistoryContainer;
