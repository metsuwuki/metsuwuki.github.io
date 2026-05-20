import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Header from "../Header/Header.jsx";
import Modal from "../Modal/Modal.jsx";
import RulesModal from "../RulesModal/RulesModal.jsx";
import LeaderboardModal from "../LeaderboardModal/LeaderboardModal.jsx";
import fullscreenIcon from "../../../assets/full.svg";
import soundOffIcon from "../../../assets/s-off.svg";
import soundOnIcon from "../../../assets/s-on.svg";
import { attachInput } from "../../game/input.js";
import { createAudioManager } from "../../game/audio.js";
import { createGameState, startRun } from "../../game/state.js";
import { updatePhysics } from "../../game/physics.js";
import { render } from "../../game/renderer.js";
import { updateParticles } from "../../game/particles.js";
import { GAME_HEIGHT, GAME_STATUS, GAME_WIDTH } from "../../game/constants.js";
import { fetchLeaderboard, fetchPersonalLeaderboard, isLeaderboardRemote, isNicknameTaken, submitScore } from "../../services/leaderboard.js";

const savedNickname = () => localStorage.getItem("brick-breaker-nickname") || "";
const savedLocale = () => localStorage.getItem("brick-breaker-locale") || "en";
const savedHighScore = () => Number(localStorage.getItem("brick-breaker-high-score") || 0);
const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || "/";

const COPY = {
  en: {
    player: "Player", chooseNickname: "Choose a nickname to start", score: "Score", highScore: "High", balls: "Balls", combo: "Combo",
    language: "Game language", rules: "Rules", leaderboard: "Leaderboard", restart: "Restart", pause: "Pause", resume: "Resume",
    mute: "Mute", unmute: "Sound", fullscreen: "Fullscreen", exitFullscreen: "Window", nicknamePlaceholder: "Your nickname", nicknameTaken: "This nickname is already taken.", start: "Start",
    welcomeTitle: "Welcome", welcomeMessage: "Enter a nickname for the leaderboard.", gameOverTitle: "Game over",
    gameOverMessage: "The bricks reached the danger line. One more run?", playAgain: "Play again", globalLeaderboard: "Global records",
    personalLeaderboard: "Your record", noScores: "No scores yet", startHint: "Drag to aim. Release to shoot."
  },
  ru: {
    player: "Игрок", chooseNickname: "Выбери никнейм для старта", score: "Счет", highScore: "Рекорд", balls: "Шары", combo: "Комбо",
    language: "Язык игры", rules: "Правила", leaderboard: "Лидеры", restart: "Рестарт", pause: "Пауза", resume: "Продолжить",
    mute: "Звук выкл.", unmute: "Звук", fullscreen: "На весь экран", exitFullscreen: "Окно", nicknamePlaceholder: "Твой никнейм", nicknameTaken: "Этот ник уже занят.", start: "Старт",
    welcomeTitle: "Добро пожаловать", welcomeMessage: "Введи никнейм для таблицы лидеров.", gameOverTitle: "Игра окончена",
    gameOverMessage: "Блоки дошли до нижней линии. Еще один забег?", playAgain: "Играть снова", globalLeaderboard: "Общие рекорды",
    personalLeaderboard: "Твой рекорд", noScores: "Рекордов пока нет", startHint: "Потяни для прицела. Отпусти для запуска."
  }
};

function App() {
  const canvasRef = useRef(null);
  const boardShellRef = useRef(null);
  const stateRef = useRef(createGameState());
  const audioRef = useRef(null);
  const [nickname, setNickname] = useState(savedNickname);
  const [draftNickname, setDraftNickname] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [locale, setLocale] = useState(savedLocale);
  const [snapshot, setSnapshot] = useState(() => ({ ...stateRef.current }));
  const [highScore, setHighScore] = useState(savedHighScore);
  const [leaderboard, setLeaderboard] = useState([]);
  const [personalLeaderboard, setPersonalLeaderboard] = useState([]);
  const [leaderboardError, setLeaderboardError] = useState("");
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [muted, setMuted] = useState(() => localStorage.getItem("brick-breaker-muted") === "true");
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const copy = COPY[locale] || COPY.en;
  const isFullscreen = isNativeFullscreen || isPseudoFullscreen;

  const leaderboardMode = useMemo(() => leaderboardError ? "Local fallback" : isLeaderboardRemote ? "Online" : "Local", [leaderboardError]);

  const loadLeaderboard = useCallback(async () => {
    try {
      setLeaderboardError("");
      const [scores, personalScores] = await Promise.all([
        fetchLeaderboard(),
        nickname ? fetchPersonalLeaderboard(nickname) : Promise.resolve([])
      ]);
      setLeaderboard(scores);
      setPersonalLeaderboard(personalScores);
    } catch (error) {
      setLeaderboardError(error.message);
    }
  }, [nickname]);

  const beginRun = useCallback(() => {
    if (!audioRef.current) audioRef.current = createAudioManager();
    audioRef.current?.unlock();
    startRun(stateRef.current);
    setIsResultModalOpen(false);
    setSnapshot({ ...stateRef.current });
    audioRef.current?.click();
  }, []);

  const handleNicknameSubmit = async (event) => {
    event.preventDefault();
    setNicknameError("");
    const value = draftNickname.trim();
    if (value.length < 2) return;
    const taken = await isNicknameTaken(value);
    if (taken) {
      setNicknameError(copy.nicknameTaken);
      return;
    }
    localStorage.setItem("brick-breaker-nickname", value);
    setNickname(value);
    fetchPersonalLeaderboard(value).then(setPersonalLeaderboard).catch(() => setPersonalLeaderboard([]));
  };

  useEffect(() => {
    audioRef.current = createAudioManager();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsNativeFullscreen((document.fullscreenElement || document.webkitFullscreenElement) === boardShellRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("game-fullscreen-lock", isPseudoFullscreen);
    document.body.classList.toggle("game-fullscreen-lock", isPseudoFullscreen);
    return () => {
      document.documentElement.classList.remove("game-fullscreen-lock");
      document.body.classList.remove("game-fullscreen-lock");
    };
  }, [isPseudoFullscreen]);

  useEffect(() => {
    loadLeaderboard();
  }, [loadLeaderboard]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!audioRef.current) {
      audioRef.current = createAudioManager();
    }
    const context = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = GAME_WIDTH * dpr;
    canvas.height = GAME_HEIGHT * dpr;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);

    const detach = attachInput(canvas, stateRef.current, audioRef.current, beginRun);
    let frame = 0;
    let last = performance.now();
    let snapshotTimer = 0;

    const tick = (time) => {
      const state = stateRef.current;
      const dt = Math.min(0.033, (time - last) / 1000);
      last = time;
      if (state.status !== GAME_STATUS.PAUSED && state.status !== GAME_STATUS.OVER && nickname) {
        updatePhysics(state, dt, audioRef.current);
        updateParticles(state, dt);
      }
      render(context, state);
      snapshotTimer += dt;
      if (snapshotTimer > 0.1) {
        snapshotTimer = 0;
        setSnapshot({ ...state });
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      detach();
    };
  }, [beginRun, nickname]);

  useEffect(() => {
    const state = snapshot;
    if (state.status !== GAME_STATUS.OVER || state.submitted || !nickname) return;
    const finalScore = state.score;
    const finalBestCombo = state.bestCombo;
    stateRef.current.submitted = true;
    const nextHigh = Math.max(highScore, finalScore);
    setHighScore(nextHigh);
    localStorage.setItem("brick-breaker-high-score", String(nextHigh));
    submitScore({ nickname, score: finalScore, bestCombo: finalBestCombo })
      .then(loadLeaderboard)
      .catch((error) => setLeaderboardError(error.message));
    if ((document.fullscreenElement || document.webkitFullscreenElement) === boardShellRef.current) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    }
    setIsPseudoFullscreen(false);
    setIsResultModalOpen(true);
  }, [snapshot, nickname, highScore, loadLeaderboard]);

  const handlePause = () => {
    const state = stateRef.current;
    if (state.status === GAME_STATUS.PAUSED) state.status = state.previousStatus || GAME_STATUS.AIMING;
    else if (state.status !== GAME_STATUS.OVER && state.status !== GAME_STATUS.READY) {
      state.previousStatus = state.status;
      state.status = GAME_STATUS.PAUSED;
    }
    setSnapshot({ ...state });
  };

  const handleFullscreen = () => {
    const shell = boardShellRef.current;
    if (!shell) return;

    audioRef.current?.unlock();
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
    if (window.history.length > 1) window.history.back();
    else window.location.href = mainSiteUrl;
  };

  const showModal = !nickname || isResultModalOpen;

  return (
    <main className="app">
      <div className="app__halo app__halo--one" />
      <div className="app__halo app__halo--two" />
      <div className="game-card brick-game-card">
        <button className="game-card__close" type="button" aria-label="Close game" onClick={handleCloseGame}><span /></button>
        <span className="game-card__orb game-card__orb--yellow" />
        <span className="game-card__orb game-card__orb--green" />
        <Header
          nickname={nickname}
          score={snapshot.score}
          highScore={Math.max(highScore, snapshot.score)}
          balls={snapshot.ballsTotal}
          bonusBalls={snapshot.pendingBallPickups}
          combo={snapshot.combo}
          status={snapshot.status}
          locale={locale}
          copy={copy}
          muted={muted}
          isFullscreen={isFullscreen}
          onLocaleChange={(nextLocale) => {
            localStorage.setItem("brick-breaker-locale", nextLocale);
            setLocale(nextLocale);
          }}
          onOpenRules={() => setIsRulesModalOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardModalOpen(true)}
          onRestart={beginRun}
          onPause={handlePause}
          onMute={() => {
            if (!audioRef.current) audioRef.current = createAudioManager();
            audioRef.current.unlock();
            setMuted(audioRef.current.toggle());
          }}
          onFullscreen={handleFullscreen}
        />
        <div className={`brick-board-shell ${isPseudoFullscreen ? "is-pseudo-fullscreen" : ""}`} ref={boardShellRef}>
          <div className="fullscreen-game-hud" aria-hidden={!isFullscreen}>
            <div className="fullscreen-game-hud__stats">
              <span>{copy.score}: <strong>{snapshot.score}</strong></span>
              <span>{copy.highScore}: <strong>{Math.max(highScore, snapshot.score)}</strong></span>
              <span>{copy.balls}: <strong>{snapshot.ballsTotal}{snapshot.pendingBallPickups ? ` +${snapshot.pendingBallPickups}` : ""}</strong></span>
              <span>{copy.combo}: <strong>{snapshot.combo}</strong></span>
            </div>
            <div className="fullscreen-game-hud__actions">
              <button className="fullscreen-game-hud__button" type="button" onClick={() => {
                if (!audioRef.current) audioRef.current = createAudioManager();
                audioRef.current.unlock();
                setMuted(audioRef.current.toggle());
              }} aria-label={muted ? copy.unmute : copy.mute}>
                <img src={muted ? soundOffIcon : soundOnIcon} alt="" aria-hidden="true" />
              </button>
              <button className="fullscreen-game-hud__button" type="button" onClick={handleFullscreen} aria-label={copy.exitFullscreen}>
                <img src={fullscreenIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
          <canvas ref={canvasRef} className="brick-canvas" width={GAME_WIDTH} height={GAME_HEIGHT} aria-label="Brick Breaker game canvas" />
          {snapshot.status === GAME_STATUS.READY ? <button className="tap-to-play brick-start-overlay" type="button" onClick={beginRun}><span>{copy.startHint}</span></button> : null}
          {snapshot.status === GAME_STATUS.PAUSED ? <button className="tap-to-play brick-start-overlay" type="button" onClick={handlePause}><span>{copy.resume}</span></button> : null}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        title={!nickname ? copy.welcomeTitle : copy.gameOverTitle}
        message={!nickname ? copy.welcomeMessage : copy.gameOverMessage}
        score={snapshot.score}
        nickname={nickname}
        copy={copy}
        leaderboard={leaderboard}
        personalLeaderboard={personalLeaderboard}
        leaderboardMode={leaderboardMode}
        nicknameError={nicknameError}
        onNicknameChange={(event) => setDraftNickname(event.target.value)}
        onSubmitNickname={handleNicknameSubmit}
        onClose={() => setIsResultModalOpen(false)}
        onRestart={beginRun}
      />
      <RulesModal isOpen={isRulesModalOpen} locale={locale} onClose={() => setIsRulesModalOpen(false)} />
      <LeaderboardModal isOpen={isLeaderboardModalOpen} copy={copy} leaderboard={leaderboard} personalLeaderboard={personalLeaderboard} leaderboardMode={leaderboardMode} onClose={() => setIsLeaderboardModalOpen(false)} />
    </main>
  );
}

export default App;
