import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Board from '../Board/Board.jsx';
import Header from '../Header/Header.jsx';
import Modal from '../Modal/Modal.jsx';
import RulesModal from '../RulesModal/RulesModal.jsx';
import LeaderboardModal from '../LeaderboardModal/LeaderboardModal.jsx';
import { BOARD_SIZE, DIFFICULTIES, GAME_STATUS } from '../../constants.js';
import { countFlags, createEmptyBoard, createBoard, hasWon, openCell, toggleFlag } from '../../utils/gameLogic.js';
import { fetchLeaderboard, fetchPersonalLeaderboard, isLeaderboardRemote, isNicknameTaken, submitScore } from '../../services/leaderboard.js';
import { audioManager } from '../../services/audio.js';

const savedNickname = () => localStorage.getItem('minesweeper-nickname') || '';
const savedLocale = () => localStorage.getItem('minesweeper-locale') || 'en';
const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || '/';

const COPY = {
  en: {
    player: 'Player',
    chooseNickname: 'Choose a nickname to start',
    mines: 'Mines',
    left: 'Left',
    time: 'Time',
    language: 'Game language',
    mute: 'Mute',
    unmute: 'Sound',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Window',
    rules: 'Rules',
    playNow: 'Play now',
    tapToPlay: 'Click anywhere to start the game',
    restart: 'Restart',
    newGame: 'New Game',
    nicknamePlaceholder: 'Your nickname',
    nicknameTaken: 'This nickname is already taken.',
    start: 'Start',
    leaderboard: 'Leaderboard',
    personalLeaderboard: 'Your records',
    globalLeaderboard: 'Global records',
    noScores: 'No scores yet',
    playAgain: 'Play Again',
    welcomeTitle: 'Welcome',
    welcomeMessage: 'Enter a nickname for the leaderboard.',
    winTitle: 'You won',
    winMessage: 'All safe cells are open. Clean work.',
    loseTitle: 'Game over',
    loseMessage: 'A mine was opened. Ready for another run?',
    status: {
      ready: 'ready',
      playing: 'playing',
      won: 'won',
      lost: 'lost',
    },
  },
  ru: {
    player: 'Игрок',
    chooseNickname: 'Выбери никнейм для старта',
    mines: 'Мины',
    left: 'Осталось',
    time: 'Время',
    language: 'Язык игры',
    mute: 'Звук выкл.',
    unmute: 'Звук',
    fullscreen: 'На весь экран',
    exitFullscreen: 'Окно',
    rules: 'Правила',
    playNow: 'Играть сейчас',
    tapToPlay: 'Нажми в любое место для начала игры',
    restart: 'Рестарт',
    newGame: 'Новая игра',
    nicknamePlaceholder: 'Твой никнейм',
    nicknameTaken: 'Этот ник уже занят.',
    start: 'Старт',
    leaderboard: 'Лидеры',
    personalLeaderboard: 'Твои рекорды',
    globalLeaderboard: 'Общие рекорды',
    noScores: 'Рекордов пока нет',
    playAgain: 'Играть снова',
    welcomeTitle: 'Добро пожаловать',
    welcomeMessage: 'Введи никнейм для таблицы лидеров.',
    winTitle: 'Победа',
    winMessage: 'Все безопасные клетки открыты. Чистая работа.',
    loseTitle: 'Игра окончена',
    loseMessage: 'Ты открыл мину. Готов к новой попытке?',
    status: {
      ready: 'готово',
      playing: 'игра',
      won: 'победа',
      lost: 'поражение',
    },
  },
};

function App() {
  const boardShellRef = useRef(null);
  const [nickname, setNickname] = useState(savedNickname);
  const [draftNickname, setDraftNickname] = useState('');
  const [nicknameError, setNicknameError] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [board, setBoard] = useState(() => createEmptyBoard(BOARD_SIZE));
  const [status, setStatus] = useState(GAME_STATUS.READY);
  const [time, setTime] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [personalLeaderboard, setPersonalLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState('');
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [locale, setLocale] = useState(savedLocale);
  const [tapMode, setTapMode] = useState('open');
  const [muted, setMuted] = useState(audioManager.muted);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);

  const totalMines = DIFFICULTIES[difficulty].mines;
  const flagsLeft = Math.max(totalMines - countFlags(board), 0);
  const isFinished = status === GAME_STATUS.WON || status === GAME_STATUS.LOST;
  const showModal = !nickname || (status === GAME_STATUS.WON && isResultModalOpen);
  const copy = COPY[locale] || COPY.en;
  const isFullscreen = isNativeFullscreen || isPseudoFullscreen;

  const leaderboardMode = useMemo(() => {
    if (leaderboardError) return 'Local fallback';
    return isLeaderboardRemote ? 'Online' : 'Local';
  }, [leaderboardError]);

  const loadLeaderboard = useCallback(async () => {
    try {
      setLeaderboardError('');
      const [scores, personalScores] = await Promise.all([
        fetchLeaderboard(difficulty),
        nickname ? fetchPersonalLeaderboard(nickname) : Promise.resolve([]),
      ]);
      setLeaderboard(scores);
      setPersonalLeaderboard(personalScores);
    } catch (error) {
      setLeaderboardError(error.message);
      setLeaderboard([]);
      setPersonalLeaderboard([]);
    }
  }, [difficulty, nickname]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard(BOARD_SIZE));
    setStatus(GAME_STATUS.READY);
    setTime(0);
    setTapMode('open');
    setIsResultModalOpen(false);
  }, []);

  useEffect(() => {
    resetGame();
    loadLeaderboard();
  }, [difficulty, loadLeaderboard, resetGame]);

  useEffect(() => {
    if (status !== GAME_STATUS.PLAYING) return undefined;

    const timerId = window.setInterval(() => {
      setTime((currentTime) => currentTime + 1);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [status]);

  useEffect(() => {
    if (status !== GAME_STATUS.WON || !nickname) return;

    submitScore({ nickname, difficulty, timeSeconds: time })
      .then(loadLeaderboard)
      .catch((error) => setLeaderboardError(error.message));
  }, [status, nickname, difficulty, time, loadLeaderboard]);

  useEffect(() => {
    if (status === GAME_STATUS.WON || status === GAME_STATUS.LOST) {
      if (status === GAME_STATUS.WON) {
        setIsResultModalOpen(true);
        return undefined;
      }

      if ((document.fullscreenElement || document.webkitFullscreenElement) === boardShellRef.current) {
        (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      }
      setIsPseudoFullscreen(false);
      const timerId = window.setTimeout(resetGame, 520);
      return () => window.clearTimeout(timerId);
    }
    return undefined;
  }, [resetGame, status]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen((document.fullscreenElement || document.webkitFullscreenElement) === boardShellRef.current);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('game-fullscreen-lock', isPseudoFullscreen);
    document.body.classList.toggle('game-fullscreen-lock', isPseudoFullscreen);
    return () => {
      document.documentElement.classList.remove('game-fullscreen-lock');
      document.body.classList.remove('game-fullscreen-lock');
    };
  }, [isPseudoFullscreen]);

  const ensureBoard = (row, col) => {
    if (status !== GAME_STATUS.READY) return board;

    const nextBoard = createBoard({
      size: BOARD_SIZE,
      mines: totalMines,
      safeCell: { row, col },
    });

    setStatus(GAME_STATUS.PLAYING);
    return nextBoard;
  };

  const handleOpenCell = (row, col) => {
    if (!nickname || isFinished) return;
    audioManager.unlock();

    const activeBoard = ensureBoard(row, col);
    const result = openCell(activeBoard, row, col);

    if (result.hitMine) {
      audioManager.mine();
      setBoard(result.board);
      setStatus(GAME_STATUS.LOST);
      return;
    }

    audioManager.open();
    setBoard(result.board);
    if (hasWon(result.board)) {
      setStatus(GAME_STATUS.WON);
    }
  };

  const handleFlagCell = (row, col) => {
    if (!nickname || status === GAME_STATUS.LOST || status === GAME_STATUS.WON) return;
    audioManager.unlock();
    audioManager.flag();

    if (status === GAME_STATUS.READY) {
      setStatus(GAME_STATUS.PLAYING);
      setBoard(toggleFlag(createBoard({ size: BOARD_SIZE, mines: totalMines }), row, col));
      return;
    }

    setBoard((currentBoard) => toggleFlag(currentBoard, row, col));
  };

  const handleNicknameSubmit = async (event) => {
    event.preventDefault();
    setNicknameError('');

    const value = draftNickname.trim();
    if (value.length < 2) return;

    const taken = await isNicknameTaken(value);
    if (taken) {
      setNicknameError(copy.nicknameTaken);
      return;
    }

    localStorage.setItem('minesweeper-nickname', value);
    setNickname(value);
    fetchPersonalLeaderboard(value).then(setPersonalLeaderboard).catch(() => setPersonalLeaderboard([]));
  };

  const handleLocaleChange = (nextLocale) => {
    localStorage.setItem('minesweeper-locale', nextLocale);
    setLocale(nextLocale);
  };

  const handleMute = () => {
    audioManager.unlock();
    setMuted(audioManager.toggle());
  };

  const handleFullscreen = () => {
    const shell = boardShellRef.current;
    if (!shell) return;
    audioManager.unlock();

    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
      return;
    }

    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      return;
    }

    const requestFullscreen = shell.requestFullscreen || shell.webkitRequestFullscreen;
    if (!requestFullscreen) {
      setIsPseudoFullscreen(true);
      return;
    }

    Promise.resolve(requestFullscreen.call(shell)).catch(() => {
      setIsPseudoFullscreen(true);
    });
  };

  const handleCloseGame = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = mainSiteUrl;
  };

  const modalTitle = !nickname
    ? copy.welcomeTitle
    : status === GAME_STATUS.WON
      ? copy.winTitle
      : copy.loseTitle;

  const modalMessage = !nickname
    ? copy.welcomeMessage
    : status === GAME_STATUS.WON
      ? copy.winMessage
      : copy.loseMessage;

  const statusModal = (
    <Modal
      isOpen={showModal}
      title={modalTitle}
      message={modalMessage}
      resultTime={status === GAME_STATUS.WON ? time : undefined}
      nickname={nickname}
      copy={copy}
      leaderboard={leaderboard}
      personalLeaderboard={personalLeaderboard}
      leaderboardMode={leaderboardMode}
      nicknameError={nicknameError}
      onNicknameChange={(event) => setDraftNickname(event.target.value)}
      onSubmitNickname={handleNicknameSubmit}
      onClose={() => setIsResultModalOpen(false)}
      onRestart={resetGame}
    />
  );

  return (
    <main className="app">
      <div className="app__halo app__halo--one" />
      <div className="app__halo app__halo--two" />

      <div className="game-card">
        <button className="game-card__close" type="button" aria-label="Close game" onClick={handleCloseGame}>
          <span />
        </button>
        <span className="game-card__orb game-card__orb--yellow" />
        <span className="game-card__orb game-card__orb--green" />

        <Header
          nickname={nickname}
          difficulty={difficulty}
          flagsLeft={flagsLeft}
          totalMines={totalMines}
          time={time}
          status={status}
          locale={locale}
          copy={copy}
          muted={muted}
          isFullscreen={isFullscreen}
          onLocaleChange={handleLocaleChange}
          onDifficultyChange={setDifficulty}
          onOpenRules={() => setIsRulesModalOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
          onRestart={resetGame}
          onNewGame={resetGame}
          onMute={handleMute}
          onFullscreen={handleFullscreen}
        />

        <Board
          board={board}
          disabled={!nickname || isFinished}
          isReady={status === GAME_STATUS.READY}
          copy={copy}
          isFullscreen={isFullscreen}
          isPseudoFullscreen={isPseudoFullscreen}
          tapMode={tapMode}
          shellRef={boardShellRef}
          muted={muted}
          mines={totalMines}
          flagsLeft={flagsLeft}
          time={time}
          onTapModeChange={setTapMode}
          onOpenCell={handleOpenCell}
          onFlagCell={handleFlagCell}
          onMute={handleMute}
          onFullscreen={handleFullscreen}
          fullscreenOverlay={isFullscreen ? statusModal : null}
        />
      </div>

      {!isFullscreen ? statusModal : null}
      <RulesModal isOpen={isRulesModalOpen} locale={locale} onClose={() => setIsRulesModalOpen(false)} />
      <LeaderboardModal
        isOpen={isLeaderboardModalOpen}
        copy={copy}
        leaderboard={leaderboard}
        personalLeaderboard={personalLeaderboard}
        leaderboardMode={leaderboardMode}
        onClose={() => setIsLeaderboardModalOpen(false)}
      />
    </main>
  );
}

export default App;
