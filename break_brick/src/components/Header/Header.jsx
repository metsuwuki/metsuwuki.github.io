import gameIcon from "../../../assets/icon.png";
import fullscreenIcon from "../../../assets/full.svg";
import soundOffIcon from "../../../assets/s-off.svg";
import soundOnIcon from "../../../assets/s-on.svg";

function Header({ nickname, score, highScore, balls, bonusBalls, combo, status, locale, copy, muted, isFullscreen, onLocaleChange, onOpenRules, onOpenLeaderboard, onRestart, onPause, onMute, onFullscreen }) {
  return (
    <header className="header brick-header">
      <div className="brand">
        <span className="brand__mark brick-brand-mark">
          <img src={gameIcon} alt="" aria-hidden="true" />
        </span>
        <div>
          <h1>Brick Breaker</h1>
          <p>{nickname ? `${copy.player}: ${nickname}` : copy.chooseNickname}</p>
        </div>
      </div>

      <div className="stats" aria-label="Game statistics">
        <div className="stat">
          <span>{copy.score}</span>
          <strong>{score}</strong>
        </div>
        <div className="stat">
          <span>{copy.highScore}</span>
          <strong>{highScore}</strong>
        </div>
        <div className="stat">
          <span>{copy.balls}</span>
          <strong>{balls}{bonusBalls ? ` +${bonusBalls}` : ""}</strong>
        </div>
        <div className="stat">
          <span>{copy.combo}</span>
          <strong>{combo}</strong>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar__top">
          <button className="ghost-button ghost-button--compact" type="button" onClick={onOpenRules}>{copy.rules}</button>
          <button className="ghost-button ghost-button--compact" type="button" onClick={onOpenLeaderboard}>{copy.leaderboard}</button>
        </div>
        <div className="game-controls">
          <div className="segmented" aria-label="Game mode">
            <button className="is-active" type="button">Endless</button>
          </div>
          <div className="actions">
            <button className="ghost-button" type="button" onClick={onPause}>{status === "paused" ? copy.resume : copy.pause}</button>
            <button className="primary-button" type="button" onClick={onRestart}>{copy.restart}</button>
          </div>
        </div>
        <div className="toolbar__utilities">
          <div className="site-locale-switch" role="group" aria-label={copy.language}>
            <button className={`site-locale-switch__button ${locale === "en" ? "is-active" : ""}`} type="button" onClick={() => onLocaleChange("en")}>EN</button>
            <button className={`site-locale-switch__button ${locale === "ru" ? "is-active" : ""}`} type="button" onClick={() => onLocaleChange("ru")}>RU</button>
          </div>
          <button className="ghost-button ghost-button--compact icon-button" type="button" onClick={onMute} aria-label={muted ? copy.unmute : copy.mute} title={muted ? copy.unmute : copy.mute}>
            <img src={muted ? soundOffIcon : soundOnIcon} alt="" aria-hidden="true" />
          </button>
          <button className="ghost-button ghost-button--compact icon-button" type="button" onClick={onFullscreen} aria-label={isFullscreen ? copy.exitFullscreen : copy.fullscreen} title={isFullscreen ? copy.exitFullscreen : copy.fullscreen}>
            <img src={fullscreenIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
