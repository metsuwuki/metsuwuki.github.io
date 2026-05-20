function RulesModal({ isOpen, locale, onClose }) {
  if (!isOpen) return null;
  const text = {
    en: {
      title: "Game rules",
      subtitle: "Aim from the bottom, break numbered bricks, collect +1 balls, and survive as long as possible.",
      sections: [
        ["Aim and shoot", "Drag or move over the canvas to show the trajectory. Release to launch the full ball chain."],
        ["Brick numbers", "Every hit removes 1 point. When a brick reaches 0 it bursts into particles and adds score."],
        ["Turn flow", "After all balls return, a new row appears and the old rows move down. A brick touching the lower danger line ends the run."],
        ["Bonuses and combo", "+1 pickups permanently add another ball. Consecutive hits increase combo and score feedback."]
      ],
      samples: ["Aim", "Hit", "+1 ball", "Game over"]
    },
    ru: {
      title: "Правила игры",
      subtitle: "Целься снизу, разбивай блоки с числами, собирай +1 шар и держись как можно дольше.",
      sections: [
        ["Прицел и запуск", "Веди по canvas, чтобы увидеть траекторию. Отпусти, чтобы запустить цепочку шариков."],
        ["Числа на блоках", "Каждое попадание снимает 1 очко прочности. На 0 блок взрывается частицами и дает score."],
        ["Ход игры", "Когда все шарики вернулись, появляется новый ряд, а старые блоки опускаются. Блок у нижней линии означает game over."],
        ["Бонусы и combo", "+1 pickup навсегда добавляет шарик. Серия попаданий усиливает combo и прирост score."]
      ],
      samples: ["Прицел", "Удар", "+1 шар", "Конец"]
    }
  }[locale] ?? {};

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal rules-modal" role="dialog" aria-modal="true" aria-labelledby="rules-title">
        <div className="modal__glow" />
        <div className="modal__chrome" aria-label="Window controls">
          <button className="modal__dot modal__dot--close" type="button" aria-label="Close rules" onClick={onClose}><span /></button>
          <span className="modal__dot modal__dot--minimize" />
          <span className="modal__dot modal__dot--maximize" />
        </div>
        <h2 id="rules-title">{text.title}</h2>
        <p>{text.subtitle}</p>
        <div className="rules-flow" aria-label="Gameplay examples">
          {text.samples.map((sample, index) => (
            <div className="rules-flow__item brick-rule-sample" key={sample}>
              <span className={`brick-rule-icon brick-rule-icon--${index}`} />
              <strong>{sample}</strong>
            </div>
          ))}
        </div>
        <div className="rules-steps">
          {text.sections.map(([title, body], index) => (
            <article className="rules-step" key={title}>
              <span>{index + 1}</span>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RulesModal;
