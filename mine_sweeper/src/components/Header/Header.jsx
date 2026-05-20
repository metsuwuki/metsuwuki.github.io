import { DIFFICULTIES } from '../../constants.js';
import { formatTime } from '../../utils/formatTime.js';
import icon from '../../../assets/icon.png';
import fullscreenIcon from '../../../assets/full.svg';
import soundOffIcon from '../../../assets/s-off.svg';
import soundOnIcon from '../../../assets/s-on.svg';

function Header({
  nickname,
  difficulty,
  flagsLeft,
  totalMines,
  time,
  status,
  locale,
  copy,
  muted,
  isFullscreen,
  onLocaleChange,
  onDifficultyChange,
  onOpenRules,
  onOpenLeaderboard,
  onRestart,
  onNewGame,
  onMute,
  onFullscreen,
}) {
  return (
    <header className="header">
      <div className="brand">
        <span className="brand__mark">
          <img src={icon} alt="" />
        </span>
        <div>
          <h1>Minesweeper</h1>
          <p>{nickname ? `${copy.player}: ${nickname}` : copy.chooseNickname}</p>
        </div>
      </div>

      <div className="stats" aria-label="Game statistics">
        <div className="stat">
          <span>{copy.mines}</span>
          <strong>{totalMines}</strong>
        </div>
        <div className="stat">
          <span>{copy.left}</span>
          <strong>{flagsLeft}</strong>
        </div>
        <div className="stat">
          <span>{copy.time}</span>
          <strong>{formatTime(time)}</strong>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar__top">
          <button className="ghost-button ghost-button--compact" type="button" onClick={onOpenRules}>
            {copy.rules}
          </button>
          <button className="ghost-button ghost-button--compact" type="button" onClick={onOpenLeaderboard}>
            {copy.leaderboard}
          </button>
        </div>

        <div className="game-controls">
          <div className="segmented" aria-label="Difficulty">
            {Object.entries(DIFFICULTIES).map(([key, option]) => (
              <button
                key={key}
                className={difficulty === key ? 'is-active' : ''}
                type="button"
                onClick={() => onDifficultyChange(key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="actions">
            <button className="ghost-button" type="button" onClick={onRestart}>
              {copy.restart}
            </button>
            <button className="primary-button" type="button" onClick={onNewGame}>
              {copy.newGame}
            </button>
          </div>
        </div>

        <div className="toolbar__utilities">
          <div className="site-locale-switch" role="group" aria-label={copy.language}>
            <button
              className={`site-locale-switch__button ${locale === 'en' ? 'is-active' : ''}`}
              type="button"
              aria-pressed={locale === 'en'}
              onClick={() => onLocaleChange('en')}
            >
              EN
            </button>
            <button
              className={`site-locale-switch__button ${locale === 'ru' ? 'is-active' : ''}`}
              type="button"
              aria-pressed={locale === 'ru'}
              onClick={() => onLocaleChange('ru')}
            >
              RU
            </button>
          </div>

          <button
            className="ghost-button ghost-button--compact icon-button"
            type="button"
            aria-label={muted ? copy.unmute : copy.mute}
            title={muted ? copy.unmute : copy.mute}
            onClick={onMute}
          >
            <img src={muted ? soundOffIcon : soundOnIcon} alt="" aria-hidden="true" />
          </button>

          <button
            className="ghost-button ghost-button--compact icon-button"
            type="button"
            aria-label={isFullscreen ? copy.exitFullscreen : copy.fullscreen}
            title={isFullscreen ? copy.exitFullscreen : copy.fullscreen}
            onClick={onFullscreen}
          >
            <img src={fullscreenIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
