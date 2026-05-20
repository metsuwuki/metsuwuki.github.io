import { useEffect, useMemo, useRef, useState } from "react";
import icon from "../../assets/icon.png";
import electroIcon from "../../assets/electro.svg";
import lampOffIcon from "../../assets/lamp.svg";
import lampOnIcon from "../../assets/lamp-on.svg";
import fullscreenIcon from "../../../mine_sweeper/assets/full.svg";
import soundOffIcon from "../../../mine_sweeper/assets/s-off.svg";
import soundOnIcon from "../../../mine_sweeper/assets/s-on.svg";
import { calculateScore, computeFlow, createLevel, DIFFICULTIES, getCellBaseMask, rotateCell } from "../game.js";
import { fetchLeaderboard, isLeaderboardRemote, submitScore } from "../leaderboard.js";
import { isMuted, playRotate, toggleMute } from "../audio.js";

const mainSiteUrl = import.meta.env.VITE_MAIN_SITE_URL || "/";
const savedNickname = () => localStorage.getItem("neon-flow-nickname") || "";
const savedDifficulty = () => localStorage.getItem("neon-flow-difficulty") || "easy";

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function maskBits(mask) {
  return [1, 2, 4, 8].filter((bit) => mask & bit);
}

function branchEndpoint(bit) {
  if (bit === 1) return [50, -1];
  if (bit === 2) return [101, 50];
  if (bit === 4) return [50, 101];
  return [-1, 50];
}

function continuousPath(bits) {
  const [first, second] = bits;
  const [x1, y1] = branchEndpoint(first);
  const [x2, y2] = branchEndpoint(second);
  return `M ${x1} ${y1} L 50 50 L ${x2} ${y2}`;
}

function branchPath(bit) {
  const [x, y] = branchEndpoint(bit);
  return `M 50 50 L ${x} ${y}`;
}

function WireShape({ mask }) {
  const bits = maskBits(mask);
  if (!bits.length) return null;

  const isStraight = bits.length === 2 && ((bits.includes(1) && bits.includes(4)) || (bits.includes(2) && bits.includes(8)));

  return (
    <svg className="neon-wire" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      {bits.length === 1 ? (
        <path d={branchPath(bits[0])} />
      ) : isStraight || bits.length === 2 ? (
        <path d={continuousPath(bits)} />
      ) : (
        <>
          {bits.map((bit) => {
            return <path key={bit} d={branchPath(bit)} />;
          })}
          <circle cx="50" cy="50" r="2.5" />
        </>
      )}
    </svg>
  );
}

function App() {
  const boardShellRef = useRef(null);
  const [difficulty, setDifficulty] = useState(savedDifficulty);
  const [level, setLevel] = useState(() => createLevel(savedDifficulty()));
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [nickname, setNickname] = useState(savedNickname);
  const [draftNickname, setDraftNickname] = useState(savedNickname);
  const [muted, setMuted] = useState(isMuted);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [isNativeFullscreen, setIsNativeFullscreen] = useState(false);
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false);
  const [submittedLevelId, setSubmittedLevelId] = useState("");
  const flow = useMemo(() => computeFlow(level), [level]);
  const score = useMemo(
    () => calculateScore({ size: level.size, seconds, moves, lampsLit: flow.lampsLit }),
    [flow.lampsLit, level.size, moves, seconds]
  );
  const showNicknameModal = !nickname.trim();
  const showWinModal = flow.won && !showNicknameModal;
  const isFullscreen = isNativeFullscreen || isPseudoFullscreen;

  const cellSize = isFullscreen
    ? `min(calc((100vw - 24px) / ${level.size}), calc((100vh - 112px) / ${level.size}))`
    : level.size >= 20
      ? "clamp(15px, 4.15vw, 30px)"
      : level.size >= 14
        ? "clamp(20px, 5vw, 38px)"
        : "clamp(32px, 8vw, 58px)";

  useEffect(() => {
    if (flow.won) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [flow.won, level.id]);

  useEffect(() => {
    fetchLeaderboard(difficulty).then(setLeaderboard).catch(() => setLeaderboard([]));
  }, [difficulty, submittedLevelId]);

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
    if (!flow.won || submittedLevelId === level.id || !nickname.trim()) return;
    setSubmittedLevelId(level.id);
    submitScore({
      nickname,
      difficulty,
      score,
      durationSeconds: seconds,
      moves,
      gridSize: level.size,
      lampsTotal: level.lampsTotal,
      lampsLit: flow.lampsLit
    }).then(() => fetchLeaderboard(difficulty).then(setLeaderboard).catch(() => undefined));
  }, [difficulty, flow.lampsLit, flow.won, level.id, level.lampsTotal, level.size, moves, nickname, score, seconds, submittedLevelId]);

  function startNew(nextDifficulty = difficulty) {
    localStorage.setItem("neon-flow-difficulty", nextDifficulty);
    setDifficulty(nextDifficulty);
    setLevel(createLevel(nextDifficulty));
    setMoves(0);
    setSeconds(0);
    setSubmittedLevelId("");
  }

  function handleRotate(row, col) {
    const cell = level.grid[row][col];
    if (!cell.type.startsWith("wire") || flow.won || showNicknameModal) return;
    setLevel((current) => rotateCell(current, row, col));
    setMoves((value) => value + 1);
    playRotate();
  }

  function saveNickname(event) {
    event.preventDefault();
    const value = draftNickname.trim().slice(0, 24);
    if (value.length < 2) return;
    localStorage.setItem("neon-flow-nickname", value);
    setNickname(value);
  }

  function closeGame() {
    if (window.history.length > 1) window.history.back();
    else window.location.href = mainSiteUrl;
  }

  function handleFullscreen() {
    const shell = boardShellRef.current;
    if (!shell) return;

    if (document.fullscreenElement || document.webkitFullscreenElement) {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
      return;
    }

    if (isPseudoFullscreen) {
      setIsPseudoFullscreen(false);
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
  }

  function handleMute() {
    setMuted(toggleMute());
  }

  const statusModal = showNicknameModal || showWinModal ? (
    <div className="modal-backdrop neon-modal-backdrop" role="presentation">
      <section className="modal neon-modal" role="dialog" aria-modal="true" aria-labelledby="neon-modal-title">
        <div className="modal__glow" />
        {showWinModal ? (
          <div className="modal__chrome" aria-label="Window controls">
            <button className="modal__dot modal__dot--close" type="button" aria-label="Close result" onClick={() => startNew()}>
              <span />
            </button>
            <span className="modal__dot modal__dot--minimize" />
            <span className="modal__dot modal__dot--maximize" />
          </div>
        ) : null}

        <h2 id="neon-modal-title">{showNicknameModal ? "Neon Flow" : "Flow complete"}</h2>
        <p>
          {showNicknameModal
            ? "Choose a nickname to start the circuit."
            : "All lamps received the current. Keep the flow going with a new level."}
        </p>

        {showNicknameModal ? (
          <form className="login-form neon-login-form" onSubmit={saveNickname}>
            <input
              autoFocus
              minLength={2}
              maxLength={24}
              name="nickname"
              value={draftNickname}
              placeholder="nickname"
              required
              onChange={(event) => setDraftNickname(event.target.value)}
            />
            <button className="primary-button" type="submit">Start</button>
          </form>
        ) : (
          <>
            <div className="neon-result-grid">
              <span>Score <strong>{score}</strong></span>
              <span>Time <strong>{formatTime(seconds)}</strong></span>
              <span>Moves <strong>{moves}</strong></span>
              <span>Mode <strong>{difficulty}</strong></span>
            </div>

            <div className="leaderboard neon-modal-leaderboard">
              <div className="leaderboard__head">
                <h3>{difficulty} records</h3>
                <span>{isLeaderboardRemote ? "online" : "local"}</span>
              </div>
              {leaderboard.length > 0 ? (
                <ol>
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <li key={`${entry.nickname}-${index}`}>
                      <em>{index + 1}</em>
                      <span>{entry.nickname}</span>
                      <strong>{entry.best_score}</strong>
                    </li>
                  ))}
                </ol>
              ) : (
                <div className="empty-state">No records yet.</div>
              )}
            </div>

            <button className="primary-button modal__button" type="button" onClick={() => startNew()}>
              Next level
            </button>
          </>
        )}
      </section>
    </div>
  ) : null;

  return (
    <main className="app neon-flow-app">
      <div className="app__halo app__halo--one" />
      <div className="app__halo app__halo--two" />

      <section className="game-card neon-flow-shell" style={{ "--flow-color": level.flowColor ?? "#8fd8ff" }}>
        <button className="game-card__close neon-close" type="button" aria-label="Close game" onClick={closeGame}><span /></button>
        <span className="game-card__orb game-card__orb--yellow" />
        <span className="game-card__orb game-card__orb--green" />

        <header className="header neon-header">
          <div className="brand">
            <span className="brand__mark neon-brand-mark">
              <img src={icon} alt="" />
            </span>
            <div>
              <h1>Neon Flow</h1>
              <p>{nickname ? `Player: ${nickname}` : "Choose a nickname to start"}</p>
            </div>
          </div>

          <div className="stats" aria-label="Game statistics">
            <div className="stat">
              <span>Time</span>
              <strong>{formatTime(seconds)}</strong>
            </div>
            <div className="stat">
              <span>Moves</span>
              <strong>{moves}</strong>
            </div>
            <div className="stat">
              <span>Lamps</span>
              <strong>{flow.lampsLit}/{level.lampsTotal}</strong>
            </div>
          </div>

          <div className="toolbar">
            <div className="toolbar__top">
              <button className="ghost-button ghost-button--compact" type="button" onClick={() => setIsLeaderboardModalOpen(true)}>
                Records
              </button>
            </div>

            <div className="game-controls">
              <div className="segmented" aria-label="Difficulty">
                {Object.keys(DIFFICULTIES).map((item) => (
                  <button key={item} type="button" className={item === difficulty ? "is-active" : ""} onClick={() => startNew(item)}>
                    {item}
                  </button>
                ))}
              </div>

              <div className="actions">
                <button className="ghost-button" type="button" onClick={() => startNew()}>
                  Restart
                </button>
                <button className="primary-button" type="button" onClick={() => startNew()}>
                  New level
                </button>
              </div>
            </div>

            <div className="toolbar__utilities">
              <div className="stat neon-score-stat">
                <span>Score</span>
                <strong>{score}</strong>
              </div>
              <button
                className="ghost-button ghost-button--compact icon-button"
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                title={muted ? "Unmute" : "Mute"}
                onClick={handleMute}
              >
                <img src={muted ? soundOffIcon : soundOnIcon} alt="" aria-hidden="true" />
              </button>
              <button
                className="ghost-button ghost-button--compact icon-button"
                type="button"
                aria-label={isFullscreen ? "Window" : "Fullscreen"}
                title={isFullscreen ? "Window" : "Fullscreen"}
                onClick={handleFullscreen}
              >
                <img src={fullscreenIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
        </header>

        <div className={`neon-board-shell ${isPseudoFullscreen ? "is-pseudo-fullscreen" : ""}`} ref={boardShellRef}>
          <div className="fullscreen-game-hud" aria-hidden={!isFullscreen}>
            <div className="fullscreen-game-hud__stats">
              <span>Score: <strong>{score}</strong></span>
              <span>Time: <strong>{formatTime(seconds)}</strong></span>
              <span>Moves: <strong>{moves}</strong></span>
              <span>Lamps: <strong>{flow.lampsLit}/{level.lampsTotal}</strong></span>
            </div>
            <div className="fullscreen-game-hud__actions">
              <button className="fullscreen-game-hud__button" type="button" onClick={handleMute} aria-label={muted ? "Unmute" : "Mute"}>
                <img src={muted ? soundOffIcon : soundOnIcon} alt="" aria-hidden="true" />
              </button>
              <button className="fullscreen-game-hud__button" type="button" onClick={handleFullscreen} aria-label={isFullscreen ? "Window" : "Fullscreen"}>
                <img src={fullscreenIcon} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div
            className={`neon-board neon-board--${difficulty}`}
            style={{ "--grid-size": level.size, "--cell-size": cellSize, "--flow-color": level.flowColor ?? "#8fd8ff" }}
            aria-label="Neon Flow board"
          >
            {level.grid.map((row) =>
              row.map((cell) => {
                const key = `${cell.row}:${cell.col}`;
                const active = flow.active.has(key);
                const activeColors = flow.cellColors.get(key) ?? [];
                const lit = flow.litLamps.has(key);
                const mask = getCellBaseMask(cell);
                const canRotate = cell.type.startsWith("wire") && !flow.won;
                const cellColor = activeColors[0] ?? cell.flowColor ?? level.flowColor ?? "#78dce8";
                return (
                  <button
                    key={cell.id}
                    type="button"
                    className={`neon-cell neon-cell--${cell.type} ${canRotate ? "is-rotatable" : ""} ${active ? "is-active" : ""} ${lit ? "is-lit" : ""}`}
                    style={{ "--flow-color": cellColor }}
                    onClick={() => handleRotate(cell.row, cell.col)}
                    disabled={!canRotate}
                    aria-label={`${cell.type.replace("-", " ")} ${active ? "powered" : "unpowered"}`}
                  >
                    <span className="neon-cell__plate" style={{ transform: `rotate(${(cell.rotation ?? 0) * 90}deg)` }}>
                      <WireShape mask={mask} />
                    </span>
                    {cell.type === "source" ? (
                      <span className="neon-node neon-node--source">
                        <img className="neon-cell__asset neon-cell__asset--source" src={electroIcon} alt="" />
                      </span>
                    ) : null}
                    {cell.type === "lamp" ? (
                      <span className={`neon-node neon-node--lamp ${lit ? "is-lit" : ""}`}>
                        <img className="neon-cell__asset neon-cell__asset--lamp" src={lit ? lampOnIcon : lampOffIcon} alt="" />
                      </span>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
          {isFullscreen ? statusModal : null}
        </div>

        {!isFullscreen ? statusModal : null}

        {isLeaderboardModalOpen ? (
          <div className="modal-backdrop neon-modal-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsLeaderboardModalOpen(false);
          }}>
            <section className="modal neon-modal" role="dialog" aria-modal="true" aria-labelledby="neon-records-title">
              <div className="modal__glow" />
              <div className="modal__chrome" aria-label="Window controls">
                <button className="modal__dot modal__dot--close" type="button" aria-label="Close records" onClick={() => setIsLeaderboardModalOpen(false)}>
                  <span />
                </button>
                <span className="modal__dot modal__dot--minimize" />
                <span className="modal__dot modal__dot--maximize" />
              </div>
              <h2 id="neon-records-title">{difficulty} records</h2>
              <p>{isLeaderboardRemote ? "Online leaderboard" : "Local leaderboard"}</p>
              <div className="leaderboard neon-modal-leaderboard">
                {leaderboard.length > 0 ? (
                  <ol>
                    {leaderboard.map((entry, index) => (
                      <li key={`${entry.nickname}-${index}`}>
                        <em>{index + 1}</em>
                        <span>{entry.nickname}</span>
                        <strong>{entry.best_score}</strong>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="empty-state">No records yet.</div>
                )}
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}

export default App;
