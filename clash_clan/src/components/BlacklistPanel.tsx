import type { BlacklistRecord } from "../types";
import TownHallIcon from "./TownHallIcon";

type BlacklistPanelProps = {
  items: BlacklistRecord[];
};

export default function BlacklistPanel({ items }: BlacklistPanelProps) {
  return (
    <section className="blacklist-panel">
      <div className="section-title">
        <span className="eyebrow">Модерация</span>
        <h2>Черный Список</h2>
      </div>
      {items.length === 0 ? (
        <div className="empty-state empty-state--wide">
          <strong>Черный список пуст</strong>
          <p>Игроки добавленые в черный список будут отображены здесь</p>
        </div>
      ) : (
        <div className="blacklist-grid">
          {items.map((item) => (
            <article className="blacklist-item" key={item.id}>
              <TownHallIcon className="blacklist-item__th" level={item.town_hall_level} />
              <div>
                <strong>{item.nickname}</strong>
                <span>{item.player_tag} · TH{item.town_hall_level}</span>
                {item.reason ? <span>{item.reason}</span> : null}
              </div>
              <time>{new Date(item.created_at).toLocaleDateString("ru-RU")}</time>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
