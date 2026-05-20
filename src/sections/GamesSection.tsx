import { motion } from "framer-motion";
import { useState } from "react";
import { SectionHeading } from "../components/SectionHeading";
import { gameCards } from "../data/siteContent";
import { useBrickBreakerLeaderboard } from "../hooks/useBrickBreakerLeaderboard";
import { useMinesweeperLeaderboard } from "../hooks/useMinesweeperLeaderboard";
import { useNeonFlowLeaderboard } from "../hooks/useNeonFlowLeaderboard";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageLocale } from "../i18n/pageLocale";
import { getRevealProps } from "../utils/motion";

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDifficulty(value: string): string {
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : "Game";
}

const leaderboardFilters = ["all", "hard", "medium", "easy"] as const;
type LeaderboardFilter = (typeof leaderboardFilters)[number];
const neonFilters = ["easy", "medium", "hard", "expert"] as const;
type NeonFilter = (typeof neonFilters)[number];
const leaderboardGames = ["minesweeper", "brick", "neon"] as const;
type LeaderboardGame = (typeof leaderboardGames)[number];

export default function GamesSection() {
  const { content } = usePageLocale();
  const { siteMeta } = content;
  const { prefersReducedMotion } = useMotionSettings();
  const [leaderboardFilter, setLeaderboardFilter] = useState<LeaderboardFilter>("all");
  const [neonFilter, setNeonFilter] = useState<NeonFilter>("easy");
  const [isLeaderboardsModalOpen, setIsLeaderboardsModalOpen] = useState(false);
  const [leaderboardGame, setLeaderboardGame] = useState<LeaderboardGame>("minesweeper");
  const { scores, gamesPlayed, isLoading, error } = useMinesweeperLeaderboard(10, leaderboardFilter);
  const {
    scores: brickScores,
    gamesPlayed: brickGamesPlayed,
    isLoading: isBrickLoading,
    error: brickError
  } = useBrickBreakerLeaderboard(10);
  const {
    scores: neonScores,
    gamesPlayed: neonGamesPlayed,
    isLoading: isNeonLoading,
    error: neonError
  } = useNeonFlowLeaderboard(10, neonFilter);

  const filterLabels: Record<LeaderboardFilter, string> = {
    all: siteMeta.gamesFilterAll,
    hard: siteMeta.gamesFilterHard,
    medium: siteMeta.gamesFilterMedium,
    easy: siteMeta.gamesFilterEasy
  };
  const leaderboardGameLabels: Record<LeaderboardGame, string> = {
    minesweeper: siteMeta.gamesMinesweeperTitle,
    brick: siteMeta.gamesBrickBreakerTitle,
    neon: siteMeta.gamesNeonFlowTitle
  };

  return (
    <section className="section-block section-block--airy games-section" id="games">
      <div className="page-container">
        <motion.div {...getRevealProps(prefersReducedMotion)}>
          <SectionHeading title={siteMeta.gamesTitle} description={siteMeta.gamesDescription} align="left" />
        </motion.div>

        <div className="games-layout">
          <div className="game-cards-stack">
            <motion.a
              {...getRevealProps(prefersReducedMotion, 0.08)}
              className="game-preview-card game-preview-card--minesweeper"
              href={gameCards.mineSweeper.href}
              aria-label={`${siteMeta.gamesPlayLabel}: ${siteMeta.gamesMinesweeperTitle}`}
            >
              <div className="window-chrome game-preview-card__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="game-preview-card__body">
                <div className="game-preview-card__identity">
                  <span className="game-preview-card__icon">
                    <img src={gameCards.mineSweeper.icon} alt="" aria-hidden="true" />
                  </span>
                  <div>
                    <p>{siteMeta.gamesCardEyebrow}</p>
                    <h3>{siteMeta.gamesMinesweeperTitle}</h3>
                  </div>
                </div>

                <div className="game-preview-card__board" aria-hidden="true">
                  <img className="game-preview-card__image" src={gameCards.mineSweeper.preview} alt="" loading="lazy" />
                </div>

                <p className="game-preview-card__text">{siteMeta.gamesMinesweeperText}</p>
                <span className="game-preview-card__button">{siteMeta.gamesPlayLabel}</span>
              </div>
            </motion.a>

            <motion.a
              {...getRevealProps(prefersReducedMotion, 0.12)}
              className="game-preview-card game-preview-card--brick"
              href={gameCards.brickBreaker.href}
              aria-label={`${siteMeta.gamesPlayLabel}: ${siteMeta.gamesBrickBreakerTitle}`}
            >
              <div className="window-chrome game-preview-card__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="game-preview-card__body">
                <div className="game-preview-card__identity">
                  <span className="game-preview-card__icon game-preview-card__icon--brick">
                    <img src={gameCards.brickBreaker.icon} alt="" aria-hidden="true" />
                  </span>
                  <div>
                    <p>{siteMeta.gamesCardEyebrow}</p>
                    <h3>{siteMeta.gamesBrickBreakerTitle}</h3>
                  </div>
                </div>

                <div className="game-preview-card__board game-preview-card__board--brick" aria-hidden="true">
                  <img className="game-preview-card__image" src={gameCards.brickBreaker.preview} alt="" loading="lazy" />
                </div>

                <p className="game-preview-card__text">{siteMeta.gamesBrickBreakerText}</p>
                <span className="game-preview-card__button">{siteMeta.gamesPlayLabel}</span>
              </div>
            </motion.a>

            <motion.a
              {...getRevealProps(prefersReducedMotion, 0.16)}
              className="game-preview-card game-preview-card--neon"
              href={gameCards.lightFlow.href}
              aria-label={`${siteMeta.gamesPlayLabel}: ${siteMeta.gamesNeonFlowTitle}`}
            >
              <div className="window-chrome game-preview-card__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>

              <div className="game-preview-card__body">
                <div className="game-preview-card__identity">
                  <span className="game-preview-card__icon game-preview-card__icon--neon">
                    <img src={gameCards.lightFlow.icon} alt="" aria-hidden="true" />
                  </span>
                  <div>
                    <p>{siteMeta.gamesCardEyebrow}</p>
                    <h3>{siteMeta.gamesNeonFlowTitle}</h3>
                  </div>
                </div>

                <div className="game-preview-card__board game-preview-card__board--neon" aria-hidden="true">
                  <img className="game-preview-card__image" src={gameCards.lightFlow.preview} alt="" loading="lazy" />
                </div>

                <p className="game-preview-card__text">{siteMeta.gamesNeonFlowText}</p>
                <span className="game-preview-card__button">{siteMeta.gamesPlayLabel}</span>
              </div>
            </motion.a>
          </div>

          <div className="game-leaderboards-stack">
            <motion.aside
              {...getRevealProps(prefersReducedMotion, 0.16)}
              className="game-leaderboard-panel game-leaderboard-panel--minesweeper"
              aria-live="polite"
            >
            <div className="window-chrome game-leaderboard-panel__chrome" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="game-leaderboard-panel__head">
              <div>
                <p>{siteMeta.gamesLeaderboardDescription}</p>
                <h3>{siteMeta.gamesLeaderboardTitle}</h3>
              </div>
              <div className="game-leaderboard-stat">
                <span>{siteMeta.gamesPlayedLabel}</span>
                <strong>{gamesPlayed}</strong>
              </div>
            </div>

            <div className="game-leaderboard-filters" aria-label={siteMeta.gamesDifficultyLabel}>
              {leaderboardFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={filter === leaderboardFilter ? "is-active" : ""}
                  onClick={(event) => {
                    event.preventDefault();
                    setLeaderboardFilter(filter);
                  }}
                >
                  {filterLabels[filter]}
                </button>
              ))}
            </div>

            {isLoading ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardLoading}</p> : null}
            {!isLoading && error ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardError}</p> : null}
            {!isLoading && !error && scores.length === 0 ? (
              <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardEmpty}</p>
            ) : null}

            {!isLoading && !error && scores.length > 0 ? (
              <div className="game-leaderboard-list" role="table" aria-label={siteMeta.gamesLeaderboardTitle}>
                <div className="game-leaderboard-list__head" role="row">
                  <span>{siteMeta.gamesRankLabel}</span>
                  <span>{siteMeta.gamesNicknameLabel}</span>
                  <span>{siteMeta.gamesTimeLabel}</span>
                  <span>{siteMeta.gamesDifficultyLabel}</span>
                </div>
                {scores.map((score, index) => (
                  <div key={score.id} className={`game-leaderboard-row game-leaderboard-row--rank-${index + 1}`} role="row">
                    <span className="game-leaderboard-list__rank">{index + 1}</span>
                    <span
                      className={`game-leaderboard-list__name ${
                        score.nickname === "MetsUwUki" ? "game-leaderboard-list__name--owner" : ""
                      }`}
                    >
                      {score.nickname}
                    </span>
                    <strong>{formatTime(score.time_seconds)}</strong>
                    <span className="game-leaderboard-list__mode">{formatDifficulty(score.difficulty)}</span>
                  </div>
                ))}
              </div>
            ) : null}

            </motion.aside>

            <motion.aside
              {...getRevealProps(prefersReducedMotion, 0.2)}
              className="game-leaderboard-panel game-leaderboard-panel--brick"
              aria-live="polite"
            >
              <div className="window-chrome game-leaderboard-panel__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            <div className="game-leaderboard-panel__head">
              <div>
                <p>{siteMeta.gamesBrickLeaderboardDescription}</p>
                <h3>{siteMeta.gamesBrickLeaderboardTitle}</h3>
              </div>
              <div className="game-leaderboard-stat">
                <span>{siteMeta.gamesPlayedLabel}</span>
                <strong>{brickGamesPlayed}</strong>
              </div>
            </div>

            {isBrickLoading ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardLoading}</p> : null}
            {!isBrickLoading && brickError ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardError}</p> : null}
            {!isBrickLoading && !brickError && brickScores.length === 0 ? (
              <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardEmpty}</p>
            ) : null}

            {!isBrickLoading && !brickError && brickScores.length > 0 ? (
              <div className="game-leaderboard-list game-leaderboard-list--brick" role="table" aria-label={siteMeta.gamesBrickLeaderboardTitle}>
                <div className="game-leaderboard-list__head" role="row">
                  <span>{siteMeta.gamesRankLabel}</span>
                  <span>{siteMeta.gamesNicknameLabel}</span>
                  <span>{siteMeta.gamesScoreLabel}</span>
                  <span>{siteMeta.gamesComboLabel}</span>
                </div>
                {brickScores.map((score, index) => (
                  <div key={score.id} className={`game-leaderboard-row game-leaderboard-row--rank-${index + 1}`} role="row">
                    <span className="game-leaderboard-list__rank">{index + 1}</span>
                    <span className={`game-leaderboard-list__name ${score.nickname === "MetsUwUki" ? "game-leaderboard-list__name--owner" : ""}`}>
                      {score.nickname}
                    </span>
                    <strong>{score.score}</strong>
                    <span className="game-leaderboard-list__mode">{score.best_combo ?? 0}</span>
                  </div>
                ))}
              </div>
            ) : null}
            </motion.aside>

            <motion.aside
              {...getRevealProps(prefersReducedMotion, 0.24)}
              className="game-leaderboard-panel game-leaderboard-panel--neon"
              aria-live="polite"
            >
              <div className="window-chrome game-leaderboard-panel__chrome" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div className="game-leaderboard-panel__head">
                <div>
                  <p>{siteMeta.gamesNeonFlowLeaderboardDescription}</p>
                  <h3>{siteMeta.gamesNeonFlowLeaderboardTitle}</h3>
                </div>
                <div className="game-leaderboard-stat">
                  <span>{siteMeta.gamesPlayedLabel}</span>
                  <strong>{neonGamesPlayed}</strong>
                </div>
              </div>

              <div className="game-leaderboard-filters" aria-label={siteMeta.gamesDifficultyLabel}>
                {neonFilters.map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={filter === neonFilter ? "is-active" : ""}
                    onClick={(event) => {
                      event.preventDefault();
                      setNeonFilter(filter);
                    }}
                  >
                    {formatDifficulty(filter)}
                  </button>
                ))}
              </div>

              {isNeonLoading ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardLoading}</p> : null}
              {!isNeonLoading && neonError ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardError}</p> : null}
              {!isNeonLoading && !neonError && neonScores.length === 0 ? (
                <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardEmpty}</p>
              ) : null}

              {!isNeonLoading && !neonError && neonScores.length > 0 ? (
                <div className="game-leaderboard-list game-leaderboard-list--neon" role="table" aria-label={siteMeta.gamesNeonFlowLeaderboardTitle}>
                  <div className="game-leaderboard-list__head" role="row">
                    <span>{siteMeta.gamesRankLabel}</span>
                    <span>{siteMeta.gamesNicknameLabel}</span>
                    <span>{siteMeta.gamesScoreLabel}</span>
                    <span>{siteMeta.gamesTimeLabel}</span>
                  </div>
                  {neonScores.map((score, index) => (
                    <div key={`${score.nickname}-${score.difficulty}`} className={`game-leaderboard-row game-leaderboard-row--rank-${index + 1}`} role="row">
                      <span className="game-leaderboard-list__rank">{index + 1}</span>
                      <span className={`game-leaderboard-list__name ${score.nickname === "MetsUwUki" ? "game-leaderboard-list__name--owner" : ""}`}>
                        {score.nickname}
                      </span>
                      <strong>{score.best_score}</strong>
                      <span className="game-leaderboard-list__mode">{formatTime(score.best_time_seconds)}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </motion.aside>
          </div>
        </div>

        <motion.div {...getRevealProps(prefersReducedMotion, 0.2)} className="game-leaderboards-launch">
          <button className="game-leaderboards-launch__button" type="button" onClick={() => setIsLeaderboardsModalOpen(true)}>
            {siteMeta.gamesLeaderboardTitle}
          </button>
          <span>
            {siteMeta.gamesMinesweeperTitle}: {gamesPlayed} / {siteMeta.gamesBrickBreakerTitle}: {brickGamesPlayed} / {siteMeta.gamesNeonFlowTitle}: {neonGamesPlayed}
          </span>
        </motion.div>

        {isLeaderboardsModalOpen ? (
          <div
            className="game-leaderboards-modal-backdrop"
            role="presentation"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsLeaderboardsModalOpen(false);
            }}
          >
            <section className="game-leaderboards-modal" role="dialog" aria-modal="true" aria-labelledby="game-leaderboards-modal-title">
              <div className="game-leaderboards-modal__chrome" aria-hidden="true">
                <button type="button" aria-label="Close leaderboards" onClick={() => setIsLeaderboardsModalOpen(false)}>
                  <span />
                </button>
                <span />
                <span />
              </div>

              <div className="game-leaderboards-modal__head">
                <div>
                  <p>{siteMeta.gamesLeaderboardDescription}</p>
                  <h3 id="game-leaderboards-modal-title">{siteMeta.gamesLeaderboardTitle}</h3>
                </div>
                <div className="game-leaderboard-stat">
                  <span>{siteMeta.gamesPlayedLabel}</span>
                  <strong>{gamesPlayed + brickGamesPlayed + neonGamesPlayed}</strong>
                </div>
              </div>

              <div className="game-leaderboards-modal__tabs" aria-label={siteMeta.gamesLeaderboardTitle}>
                {leaderboardGames.map((game) => (
                  <button
                    key={game}
                    type="button"
                    className={game === leaderboardGame ? "is-active" : ""}
                    onClick={() => setLeaderboardGame(game)}
                  >
                    {leaderboardGameLabels[game]}
                  </button>
                ))}
              </div>

              {leaderboardGame === "minesweeper" ? (
                <div className="game-leaderboards-modal__panel" aria-live="polite">
                  <div className="game-leaderboard-filters" aria-label={siteMeta.gamesDifficultyLabel}>
                    {leaderboardFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        className={filter === leaderboardFilter ? "is-active" : ""}
                        onClick={() => setLeaderboardFilter(filter)}
                      >
                        {filterLabels[filter]}
                      </button>
                    ))}
                  </div>

                  {isLoading ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardLoading}</p> : null}
                  {!isLoading && error ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardError}</p> : null}
                  {!isLoading && !error && scores.length === 0 ? (
                    <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardEmpty}</p>
                  ) : null}

                  {!isLoading && !error && scores.length > 0 ? (
                    <div className="game-leaderboard-list" role="table" aria-label={siteMeta.gamesLeaderboardTitle}>
                      <div className="game-leaderboard-list__head" role="row">
                        <span>{siteMeta.gamesRankLabel}</span>
                        <span>{siteMeta.gamesNicknameLabel}</span>
                        <span>{siteMeta.gamesTimeLabel}</span>
                        <span>{siteMeta.gamesDifficultyLabel}</span>
                      </div>
                      {scores.map((score, index) => (
                        <div key={score.id} className={`game-leaderboard-row game-leaderboard-row--rank-${index + 1}`} role="row">
                          <span className="game-leaderboard-list__rank">{index + 1}</span>
                          <span className={`game-leaderboard-list__name ${score.nickname === "MetsUwUki" ? "game-leaderboard-list__name--owner" : ""}`}>
                            {score.nickname}
                          </span>
                          <strong>{formatTime(score.time_seconds)}</strong>
                          <span className="game-leaderboard-list__mode">{formatDifficulty(score.difficulty)}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {leaderboardGame === "brick" ? (
                <div className="game-leaderboards-modal__panel" aria-live="polite">
                  {isBrickLoading ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardLoading}</p> : null}
                  {!isBrickLoading && brickError ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardError}</p> : null}
                  {!isBrickLoading && !brickError && brickScores.length === 0 ? (
                    <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardEmpty}</p>
                  ) : null}

                  {!isBrickLoading && !brickError && brickScores.length > 0 ? (
                    <div className="game-leaderboard-list game-leaderboard-list--brick" role="table" aria-label={siteMeta.gamesBrickLeaderboardTitle}>
                      <div className="game-leaderboard-list__head" role="row">
                        <span>{siteMeta.gamesRankLabel}</span>
                        <span>{siteMeta.gamesNicknameLabel}</span>
                        <span>{siteMeta.gamesScoreLabel}</span>
                        <span>{siteMeta.gamesComboLabel}</span>
                      </div>
                      {brickScores.map((score, index) => (
                        <div key={score.id} className={`game-leaderboard-row game-leaderboard-row--rank-${index + 1}`} role="row">
                          <span className="game-leaderboard-list__rank">{index + 1}</span>
                          <span className={`game-leaderboard-list__name ${score.nickname === "MetsUwUki" ? "game-leaderboard-list__name--owner" : ""}`}>
                            {score.nickname}
                          </span>
                          <strong>{score.score}</strong>
                          <span className="game-leaderboard-list__mode">{score.best_combo ?? 0}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {leaderboardGame === "neon" ? (
                <div className="game-leaderboards-modal__panel" aria-live="polite">
                  <div className="game-leaderboard-filters" aria-label={siteMeta.gamesDifficultyLabel}>
                    {neonFilters.map((filter) => (
                      <button
                        key={filter}
                        type="button"
                        className={filter === neonFilter ? "is-active" : ""}
                        onClick={() => setNeonFilter(filter)}
                      >
                        {formatDifficulty(filter)}
                      </button>
                    ))}
                  </div>

                  {isNeonLoading ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardLoading}</p> : null}
                  {!isNeonLoading && neonError ? <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardError}</p> : null}
                  {!isNeonLoading && !neonError && neonScores.length === 0 ? (
                    <p className="game-leaderboard-panel__state">{siteMeta.gamesLeaderboardEmpty}</p>
                  ) : null}

                  {!isNeonLoading && !neonError && neonScores.length > 0 ? (
                    <div className="game-leaderboard-list game-leaderboard-list--neon" role="table" aria-label={siteMeta.gamesNeonFlowLeaderboardTitle}>
                      <div className="game-leaderboard-list__head" role="row">
                        <span>{siteMeta.gamesRankLabel}</span>
                        <span>{siteMeta.gamesNicknameLabel}</span>
                        <span>{siteMeta.gamesScoreLabel}</span>
                        <span>{siteMeta.gamesTimeLabel}</span>
                      </div>
                      {neonScores.map((score, index) => (
                        <div key={`${score.nickname}-${score.difficulty}`} className={`game-leaderboard-row game-leaderboard-row--rank-${index + 1}`} role="row">
                          <span className="game-leaderboard-list__rank">{index + 1}</span>
                          <span className={`game-leaderboard-list__name ${score.nickname === "MetsUwUki" ? "game-leaderboard-list__name--owner" : ""}`}>
                            {score.nickname}
                          </span>
                          <strong>{score.best_score}</strong>
                          <span className="game-leaderboard-list__mode">{formatTime(score.best_time_seconds)}</span>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </section>
  );
}
