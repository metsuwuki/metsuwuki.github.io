import { getFixedClan, playerRoleLabels, playerRoleOrder } from "../data/fixedClans";
import type { ClanKey, ClanRecord, PlayerRecord, PlayerWithRelations } from "../types";
import TownHallIcon from "./TownHallIcon";

type ClanCardProps = {
  allClans: ClanRecord[];
  clan: ClanRecord;
  isAdmin: boolean;
  isDropTarget: boolean;
  onAddPlayer: (clanKey: ClanKey) => void;
  onBlacklistPlayer: (player: PlayerWithRelations) => void;
  onDeletePlayer: (player: PlayerWithRelations) => void;
  onDragStart: (playerId: string) => void;
  onDropPlayer: (clanKey: ClanKey) => void;
  onEditPlayer: (player: PlayerWithRelations) => void;
  onMovePlayer: (player: PlayerWithRelations, clanKey: ClanKey) => void;
  onToggleWarReady: (player: PlayerWithRelations) => void;
  players: PlayerWithRelations[];
};

export default function ClanCard({
  allClans,
  clan,
  isAdmin,
  isDropTarget,
  onAddPlayer,
  onBlacklistPlayer,
  onDeletePlayer,
  onDragStart,
  onDropPlayer,
  onEditPlayer,
  onMovePlayer,
  onToggleWarReady,
  players
}: ClanCardProps) {
  const targetClan = allClans.find((item) => item.key !== clan.key);
  const sortedPlayers = [...players].sort((first, second) => {
    const roleDiff = playerRoleOrder[first.role] - playerRoleOrder[second.role];
    return roleDiff || first.nickname.localeCompare(second.nickname, "ru");
  });
  const readyPlayersCount = players.filter((player) => player.war_ready !== false).length;

  return (
    <article
      className={`clan-card ${isDropTarget ? "is-drop-target" : ""}`}
      onDragOver={(event) => {
        if (isAdmin) event.preventDefault();
      }}
      onDrop={() => onDropPlayer(clan.key)}
    >
      <header className="clan-card__header">
        <div className="clan-card__badge">
          <img src={clan.image} alt={`${clan.name} badge`} />
        </div>
        <div className="clan-card__title">
          <span className="eyebrow">Информация</span>
          <h2>{clan.name}</h2>
          <div className="clan-card__meta">
            <span>Количество Игроков: {players.length}</span>
            <span className="clan-card__meta-ready">Зелёный щит: {readyPlayersCount}</span>
          </div>
        </div>
      </header>

      <div className="clan-card__toolbar">
        <strong>Состав</strong>
        <button className="cc-button cc-button--secondary" type="button" onClick={() => onAddPlayer(clan.key)} disabled={!isAdmin}>
          Добавить игрока
        </button>
      </div>

      <div className="player-list">
        {sortedPlayers.length === 0 ? (
          <div className="empty-state">
            <strong>Состав пуст</strong>
            <span>{isAdmin ? "Добавьте игрока вручную." : "Игроки появятся после настройки администратором."}</span>
          </div>
        ) : (
          sortedPlayers.map((player) => {
            const currentClan = getFixedClan(player.current_clan_key);
            const homeClan = getFixedClan(player.home_clan_key);
            const isHomeClan = player.home_clan_key === player.current_clan_key;
            const warReady = player.war_ready !== false;
            const clanTenure = formatClanTenure(player);

            return (
              <div
                className={`player-card ${isHomeClan ? "" : "player-card--away"}`}
                draggable={isAdmin}
                key={player.id}
                onDragStart={() => onDragStart(player.id)}
                aria-label={`${player.nickname}, Town Hall ${player.town_hall_level}`}
              >
                <div className="player-card__th-wrap">
                  <button
                    className={`war-shield-button ${warReady ? "war-shield-button--ready" : "war-shield-button--blocked"}`}
                    type="button"
                    aria-label={warReady ? "Зелёный щит" : "Красный щит"}
                    aria-pressed={warReady}
                    title={warReady ? "Готов к войне" : "Не готов к войне"}
                    disabled={!isAdmin}
                    onClick={(event) => {
                      event.stopPropagation();
                      onToggleWarReady(player);
                    }}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24">
                      <path d="M12 3.1L19 5.9V11.1C19 15.45 16.25 19.25 12 20.9C7.75 19.25 5 15.45 5 11.1V5.9L12 3.1Z" />
                      <path d="M9.15 11.85L11.15 13.85L15.35 9.65" />
                    </svg>
                  </button>
                  <TownHallIcon className="player-card__th" level={player.town_hall_level} />
                  <span>{player.town_hall_level}</span>
                </div>
                <div className="player-card__body">
                  <div className="player-card__top">
                    <strong>{player.nickname}</strong>
                  </div>
                  <span className="player-card__tag">
                    {player.player_tag} · {playerRoleLabels[player.role]}
                    <img className="player-card__clan-icon" src={currentClan.image} alt={currentClan.name} />
                  </span>
                  <div className="player-card__badges">
                    <span className="player-badge">{player.account_type === "twink" ? "Твинк" : "Основа"}</span>
                    <span className={`player-badge ${isHomeClan ? "player-badge--home" : "player-badge--away"}`}>
                      {isHomeClan ? "В своём клане" : "Не в своём клане"}
                    </span>
                    {player.account_type === "twink" ? (
                      <span className="player-badge">Твинк от: {player.main_nickname ?? "не выбрано"}</span>
                    ) : (
                      <span className="player-badge">Твинки: {player.alt_count}</span>
                    )}
                  </div>
                  {!isHomeClan ? (
                    <span className="player-card__clan-status">
                      Основной: {homeClan.name} · Сейчас: {currentClan.name}
                    </span>
                  ) : null}
                  {clanTenure ? (
                    <span className={`player-card__tenure ${isHomeClan ? "" : "player-card__tenure--paused"}`}>
                      {isHomeClan ? "В клане" : "Стаж остановлен"}: {clanTenure}
                    </span>
                  ) : null}
                </div>
                {isAdmin ? (
                  <div className="player-card__actions">
                    {targetClan ? (
                      <button className="mini-button" type="button" onClick={() => onMovePlayer(player, targetClan.key)}>
                        Переместить
                      </button>
                    ) : null}
                    <button className="mini-button" type="button" onClick={() => onEditPlayer(player)}>
                      Редактировать
                    </button>
                    <button className="mini-button mini-button--danger" type="button" onClick={() => onDeletePlayer(player)}>
                      Удалить
                    </button>
                    <button className="mini-button mini-button--blacklist" type="button" onClick={() => onBlacklistPlayer(player)}>
                      В ЧС
                    </button>
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </article>
  );
}

function formatClanTenure(player: PlayerRecord): string {
  if (!player.joined_home_clan_at) return "";

  const start = parseDateOnly(player.joined_home_clan_at);
  const end =
    player.home_clan_key === player.current_clan_key
      ? new Date()
      : player.home_clan_timer_paused_at
        ? new Date(player.home_clan_timer_paused_at)
        : new Date();

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return "";

  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  let days = end.getDate() - start.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
  }

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const parts = [];
  if (years > 0) parts.push(`${years} г.`);
  if (months > 0) parts.push(`${months} мес.`);
  if (days > 0 || parts.length === 0) parts.push(`${days} дн.`);
  return parts.join(" ");
}

function parseDateOnly(value: string): Date {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}
