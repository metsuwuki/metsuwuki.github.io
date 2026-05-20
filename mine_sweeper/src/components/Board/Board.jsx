import Cell from '../Cell/Cell.jsx';
import { useEffect, useRef } from 'react';
import fullscreenIcon from '../../../assets/full.svg';
import soundOffIcon from '../../../assets/s-off.svg';
import soundOnIcon from '../../../assets/s-on.svg';
import { formatTime } from '../../utils/formatTime.js';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const touchDistance = (touches) => {
  const first = touches[0];
  const second = touches[1];
  return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
};

const touchCenter = (touches) => ({
  x: (touches[0].clientX + touches[1].clientX) / 2,
  y: (touches[0].clientY + touches[1].clientY) / 2,
});

function MineIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M11 2h2v4h-2V2Zm0 16h2v4h-2v-4ZM2 11h4v2H2v-2Zm16 0h4v2h-4v-2ZM4.22 5.64l1.42-1.42 2.82 2.83-1.41 1.41-2.83-2.82Zm11.32 11.31 1.41-1.41 2.83 2.82-1.42 1.42-2.82-2.83Zm2.82-12.73 1.42 1.42-2.83 2.82-1.41-1.41 2.82-2.83ZM7.05 15.54l1.41 1.41-2.82 2.83-1.42-1.42 2.83-2.82ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z"
      />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M6 3h2v18H6V3Zm3 1h10l-2.3 4L19 12H9V4Zm0 10h7v2H9v-2Z"
      />
    </svg>
  );
}

function Board({
  board,
  disabled,
  isReady,
  copy,
  isFullscreen,
  tapMode,
  shellRef,
  muted,
  mines,
  flagsLeft,
  time,
  onTapModeChange,
  onOpenCell,
  onFlagCell,
  onMute,
  onFullscreen,
  fullscreenOverlay,
}) {
  const boardZoomRef = useRef(null);
  const zoomRef = useRef({ scale: 1, x: 0, y: 0 });
  const gestureRef = useRef({
    distance: 0,
    scale: 1,
    x: 0,
    y: 0,
    centerX: 0,
    centerY: 0,
    panX: 0,
    panY: 0,
  });
  const cellSize = isFullscreen
    ? 'min(calc((100vw - 24px) / 25), calc((100vh - 112px) / 25))'
    : 'clamp(12px, min(calc((100vw - 56px) / 25), calc((100vh - 280px) / 25)), 30px)';

  const applyZoom = (nextZoom) => {
    const boardNode = boardZoomRef.current;
    if (!boardNode) return;

    const scale = clamp(nextZoom.scale, 1, 3.2);
    const maxX = Math.max((boardNode.offsetWidth * (scale - 1)) / 2, 0);
    const maxY = Math.max((boardNode.offsetHeight * (scale - 1)) / 2, 0);
    const x = scale === 1 ? 0 : clamp(nextZoom.x, -maxX, maxX);
    const y = scale === 1 ? 0 : clamp(nextZoom.y, -maxY, maxY);

    zoomRef.current = { scale, x, y };
    boardNode.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  useEffect(() => {
    if (isFullscreen) return;
    applyZoom({ scale: 1, x: 0, y: 0 });
  }, [isFullscreen]);

  const isHudTouch = (event) => event.target.closest?.('.fullscreen-game-hud');

  const handleTouchStart = (event) => {
    if (!isFullscreen || isHudTouch(event)) return;

    if (event.touches.length === 2) {
      const center = touchCenter(event.touches);
      gestureRef.current = {
        distance: touchDistance(event.touches),
        scale: zoomRef.current.scale,
        x: zoomRef.current.x,
        y: zoomRef.current.y,
        centerX: center.x,
        centerY: center.y,
        panX: 0,
        panY: 0,
      };
      return;
    }

    if (event.touches.length === 1 && zoomRef.current.scale > 1) {
      gestureRef.current = {
        ...gestureRef.current,
        distance: 0,
        x: zoomRef.current.x,
        y: zoomRef.current.y,
        panX: event.touches[0].clientX,
        panY: event.touches[0].clientY,
      };
    }
  };

  const handleTouchMove = (event) => {
    if (!isFullscreen || isHudTouch(event)) return;

    if (event.touches.length === 2 && gestureRef.current.distance > 0) {
      event.preventDefault();
      const center = touchCenter(event.touches);
      const nextScale = gestureRef.current.scale * (touchDistance(event.touches) / gestureRef.current.distance);
      applyZoom({
        scale: nextScale,
        x: gestureRef.current.x + (center.x - gestureRef.current.centerX),
        y: gestureRef.current.y + (center.y - gestureRef.current.centerY),
      });
      return;
    }

    if (event.touches.length === 1 && zoomRef.current.scale > 1 && gestureRef.current.panX !== 0) {
      event.preventDefault();
      applyZoom({
        scale: zoomRef.current.scale,
        x: gestureRef.current.x + (event.touches[0].clientX - gestureRef.current.panX),
        y: gestureRef.current.y + (event.touches[0].clientY - gestureRef.current.panY),
      });
    }
  };

  const handleTouchEnd = () => {
    gestureRef.current = {
      ...gestureRef.current,
      distance: 0,
      panX: 0,
      panY: 0,
    };
  };

  const handleCoveredStart = (event) => {
    event.preventDefault();
    if (disabled || event.button !== 0) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const cellSize = rect.width / 25;
    const col = Math.min(Math.floor((event.clientX - rect.left) / cellSize), 24);
    const row = Math.min(Math.floor((event.clientY - rect.top) / cellSize), 24);

    if (tapMode === 'flag') {
      onFlagCell(row, col);
      return;
    }

    onOpenCell(row, col);
  };

  return (
    <section className="board-area" aria-label="Minesweeper board">
      <div className="tap-mode-switch" role="group" aria-label="Mobile tap mode">
        <button
          className={tapMode === 'open' ? 'is-active' : ''}
          type="button"
          aria-label="Open cells"
          aria-pressed={tapMode === 'open'}
          title="Open cells"
          onClick={() => onTapModeChange('open')}
        >
          <MineIcon />
        </button>
        <button
          className={tapMode === 'flag' ? 'is-active' : ''}
          type="button"
          aria-label="Place flags"
          aria-pressed={tapMode === 'flag'}
          title="Place flags"
          onClick={() => onTapModeChange('flag')}
        >
          <FlagIcon />
        </button>
      </div>

      <div
        className="board-shell"
        ref={shellRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        style={{ '--cell-size': cellSize }}
      >
        <div className="fullscreen-game-hud">
          <div className="fullscreen-game-hud__stats">
            <span>{copy.mines}: <strong>{mines}</strong></span>
            <span>{copy.left}: <strong>{flagsLeft}</strong></span>
            <span>{copy.time}: <strong>{formatTime(time)}</strong></span>
          </div>
          <div className="fullscreen-game-hud__actions">
            <button
              className={`fullscreen-game-hud__button ${tapMode === 'open' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onTapModeChange('open')}
              aria-label="Open cells"
              aria-pressed={tapMode === 'open'}
            >
              <MineIcon />
            </button>
            <button
              className={`fullscreen-game-hud__button ${tapMode === 'flag' ? 'is-active' : ''}`}
              type="button"
              onClick={() => onTapModeChange('flag')}
              aria-label="Place flags"
              aria-pressed={tapMode === 'flag'}
            >
              <FlagIcon />
            </button>
            <button className="fullscreen-game-hud__button" type="button" onClick={onMute} aria-label={muted ? copy.unmute : copy.mute}>
              <img src={muted ? soundOffIcon : soundOnIcon} alt="" aria-hidden="true" />
            </button>
            <button className="fullscreen-game-hud__button" type="button" onClick={onFullscreen} aria-label={copy.exitFullscreen}>
              <img src={fullscreenIcon} alt="" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="board-zoom" ref={boardZoomRef}>
          <div className={`board ${isReady ? 'board--covered' : ''}`}>
            {board.flat().map((cell) => (
              <Cell
                key={cell.id}
                cell={cell}
                disabled={disabled}
                tapMode={tapMode}
                onOpen={onOpenCell}
                onFlag={onFlagCell}
              />
            ))}
            {isReady ? (
              <div
                className="tap-to-play"
                onMouseDown={(event) => {
                  handleCoveredStart(event);
                }}
                onContextMenu={(event) => event.preventDefault()}
              >
                <span>{copy.tapToPlay}</span>
              </div>
            ) : null}
          </div>
        </div>
        {fullscreenOverlay}
      </div>
    </section>
  );
}

export default Board;
