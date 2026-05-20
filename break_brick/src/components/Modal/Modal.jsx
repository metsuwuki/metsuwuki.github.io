function Modal({ isOpen, title, message, score, nickname, copy, leaderboard, personalLeaderboard, leaderboardMode, nicknameError, onNicknameChange, onSubmitNickname, onClose, onRestart }) {
  if (!isOpen) return null;
  const isLogin = !nickname;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => !isLogin && event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__glow" />
        {!isLogin ? (
          <div className="modal__chrome" aria-label="Window controls">
            <button className="modal__dot modal__dot--close" type="button" aria-label="Close result" onClick={onClose}>
              <span />
            </button>
            <span className="modal__dot modal__dot--minimize" />
            <span className="modal__dot modal__dot--maximize" />
          </div>
        ) : null}
        <h2 id="modal-title">{title}</h2>
        <p>{message}</p>

        {isLogin ? (
          <form className="login-form" onSubmit={onSubmitNickname}>
            <input autoFocus minLength="2" maxLength="24" name="nickname" placeholder={copy.nicknamePlaceholder} required onChange={onNicknameChange} />
            {nicknameError ? <span className="login-form__error">{nicknameError}</span> : null}
            <button className="primary-button" type="submit">{copy.start}</button>
          </form>
        ) : (
          <>
            <div className="result-time">Score: {score}</div>
            <div className="leaderboard">
              <div className="leaderboard__head">
                <h3>{copy.globalLeaderboard}</h3>
                <span>{leaderboardMode}</span>
              </div>
              {leaderboard.length > 0 ? (
                <ol>
                  {leaderboard.map((item, index) => (
                    <li key={item.id}>
                      <em>{index + 1}</em>
                      <span className={item.nickname === "MetsUwUki" ? "leaderboard-owner-name" : ""}>{item.nickname}</span>
                      <strong>{item.score}</strong>
                    </li>
                  ))}
                </ol>
              ) : <div className="empty-state">{copy.noScores}</div>}
            </div>
            <div className="leaderboard leaderboard--personal">
              <div className="leaderboard__head"><h3>{copy.personalLeaderboard}</h3></div>
              {personalLeaderboard.length > 0 ? (
                <ol>
                  {personalLeaderboard.map((item) => (
                    <li key={item.id}>
                      <em>{item.games_played}</em>
                      <span className={item.nickname === "MetsUwUki" ? "leaderboard-owner-name" : ""}>{item.nickname}</span>
                      <strong>{item.score}</strong>
                    </li>
                  ))}
                </ol>
              ) : <div className="empty-state">{copy.noScores}</div>}
            </div>
            <button className="primary-button modal__button" type="button" onClick={onRestart}>{copy.playAgain}</button>
          </>
        )}
      </section>
    </div>
  );
}

export default Modal;
