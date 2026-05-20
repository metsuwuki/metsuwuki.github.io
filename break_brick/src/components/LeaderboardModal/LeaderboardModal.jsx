function LeaderboardModal({ isOpen, copy, leaderboard, personalLeaderboard, leaderboardMode, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal leaderboard-modal" role="dialog" aria-modal="true" aria-labelledby="leaderboard-title">
        <div className="modal__glow" />
        <div className="modal__chrome" aria-label="Window controls">
          <button className="modal__dot modal__dot--close" type="button" aria-label="Close leaderboard" onClick={onClose}><span /></button>
          <span className="modal__dot modal__dot--minimize" />
          <span className="modal__dot modal__dot--maximize" />
        </div>
        <h2 id="leaderboard-title">{copy.leaderboard}</h2>
        <p>{leaderboardMode}</p>
        <div className="leaderboard leaderboard--standalone">
          <div className="leaderboard__head"><h3>{copy.globalLeaderboard}</h3></div>
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
        <div className="leaderboard leaderboard--standalone leaderboard--personal">
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
      </section>
    </div>
  );
}

export default LeaderboardModal;
