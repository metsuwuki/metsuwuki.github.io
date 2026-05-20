import { useMemo } from 'react';

const DEMO_FLAG_POSITIONS = new Set([0, 1, 5, 7, 8]);
const DEMO_MINE_PATTERNS = [
  [0, 1, 3, 5, 8],
  [0, 2, 5, 6, 7],
  [1, 2, 3, 6, 8],
  [0, 3, 5, 7, 8],
  [1, 3, 5, 6, 8],
  [0, 2, 3, 5, 7],
];

const createDemoMinePositions = () => {
  const pattern = DEMO_MINE_PATTERNS[Math.floor(Math.random() * DEMO_MINE_PATTERNS.length)];
  return new Set(pattern);
};

function RulesModal({ isOpen, locale, onClose }) {
  const demoMinePositions = useMemo(() => createDemoMinePositions(), [isOpen]);

  if (!isOpen) return null;

  const text = {
    en: {
      title: 'Game rules',
      subtitle: 'Minesweeper is a logic game: read the numbers, mark mines, and open every safe cell.',
      controlsTitle: 'How to play',
      controls: [
        {
          title: 'Left click',
          body: 'Open a cell. If it is empty, nearby empty cells open automatically.',
          label: 'Open',
        },
        {
          title: 'Right click',
          body: 'Place or remove a flag on a cell that you think hides a mine.',
          label: 'Flag',
        },
      ],
      numbersTitle: 'How numbers work',
      numbersBody:
        'A number shows how many mines are hidden in the 8 cells around it: above, below, left, right, and diagonals.',
      numberExampleTitle: 'Example: number 5',
      numberExampleBody:
        'If a cell says 5, then exactly 5 of the 8 surrounding cells contain mines. In this demo, the blinking marks show one possible hidden mine layout.',
      chordTitle: 'Fast opening',
      chordBody:
        'You can left click an already opened number. If the same amount of flags or revealed mines is around it, all other untouched neighboring cells open automatically.',
      steps: [
        {
          title: 'Start carefully',
          body: 'Open cells until you see numbers. Empty zones help reveal space quickly.',
        },
        {
          title: 'Use flags',
          body: 'When the numbers prove a mine location, mark it with a flag.',
        },
        {
          title: 'Win condition',
          body: 'You win after opening every safe cell. Opening a mine loses the game.',
        },
      ],
      samples: {
        left: 'Left',
        right: 'Right',
        hidden: 'Hidden',
        flag: 'Flag',
        open: 'Open',
        mine: 'Mine',
        neighbor: 'Mine zone',
      },
    },
    ru: {
      title: 'Правила игры',
      subtitle: 'Сапёр — это логическая игра: читай цифры, отмечай мины и открывай все безопасные клетки.',
      controlsTitle: 'Как играть',
      controls: [
        {
          title: 'Левый клик',
          body: 'Открывает клетку. Если клетка пустая, соседние пустые клетки раскрываются автоматически.',
          label: 'Открыть',
        },
        {
          title: 'Правый клик',
          body: 'Ставит или убирает флаг на клетке, где ты подозреваешь мину.',
          label: 'Флаг',
        },
      ],
      numbersTitle: 'Как работают цифры',
      numbersBody:
        'Цифра показывает, сколько мин спрятано в 8 клетках вокруг нее: сверху, снизу, слева, справа и по диагоналям.',
      numberExampleTitle: 'Пример: цифра 5',
      numberExampleBody:
        'Если на клетке написано 5, значит ровно 5 из 8 соседних клеток вокруг нее содержат мины. В примере мигающие отметки показывают один возможный расклад скрытых мин.',
      chordTitle: 'Быстрое открытие',
      chordBody:
        'Можно нажать левым кликом по уже открытой цифре. Если вокруг нее стоит столько же флагов или раскрытых мин, сколько показывает цифра, все остальные соседние клетки откроются автоматически.',
      steps: [
        {
          title: 'Начинай аккуратно',
          body: 'Открывай клетки, пока не появятся цифры. Пустые зоны быстро раскрывают часть поля.',
        },
        {
          title: 'Используй флаги',
          body: 'Когда цифры точно указывают на мину, отмечай эту клетку флагом.',
        },
        {
          title: 'Условие победы',
          body: 'Победа наступает, когда открыты все безопасные клетки. Открытая мина — поражение.',
        },
      ],
      samples: {
        left: 'Левый',
        right: 'Правый',
        hidden: 'Закрыта',
        flag: 'Флаг',
        open: 'Открыта',
        mine: 'Мина',
        neighbor: 'Зона мин',
      },
    },
  }[locale];

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className="modal rules-modal" role="dialog" aria-modal="true" aria-labelledby="rules-title">
        <div className="modal__glow" />
        <div className="modal__chrome" aria-label="Window controls">
          <button className="modal__dot modal__dot--close" type="button" aria-label="Close rules" onClick={onClose}>
            <span />
          </button>
          <span className="modal__dot modal__dot--minimize" />
          <span className="modal__dot modal__dot--maximize" />
        </div>

        <h2 id="rules-title">{text.title}</h2>
        <p>{text.subtitle}</p>

        <div className="rules-section">
          <h3>{text.controlsTitle}</h3>
          <div className="rules-control-grid">
            {text.controls.map((control, index) => (
              <article className="rules-control-card" key={control.title}>
                <div className={`mouse-card ${index === 0 ? 'mouse-card--left' : 'mouse-card--right'}`}>
                  <span />
                  <strong>{control.label}</strong>
                </div>
                <div>
                  <h4>{control.title}</h4>
                  <p>{control.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="rules-section">
          <h3>{text.numbersTitle}</h3>
          <p>{text.numbersBody}</p>
          <div className="number-demo">
            <div className="number-demo__grid" aria-label={text.numberExampleTitle}>
              {Array.from({ length: 9 }, (_, index) => {
                if (index === 4) {
                  return (
                    <span className="rules-cell rules-cell--open rules-cell--center" key={index}>
                      5
                    </span>
                  );
                }

                const className = [
                  'rules-cell',
                  'rules-cell--neighbor',
                  DEMO_FLAG_POSITIONS.has(index) ? 'rules-cell--flag' : '',
                  demoMinePositions.has(index) ? 'rules-cell--hidden-mine' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return <span className={className} key={index} />;
              })}
            </div>
            <div className="number-demo__copy">
              <strong>{text.numberExampleTitle}</strong>
              <p>{text.numberExampleBody}</p>
              <strong>{text.chordTitle}</strong>
              <p>{text.chordBody}</p>
            </div>
          </div>
        </div>

        <div className="rules-flow" aria-label="Gameplay examples">
          <div className="rules-flow__item">
            <div className="rules-sample-grid">
              <span className="rules-cell rules-cell--hidden" />
              <span className="rules-cell rules-cell--hidden" />
              <span className="rules-cell rules-cell--hidden" />
              <span className="rules-cell rules-cell--hidden" />
            </div>
            <strong>{text.samples.hidden}</strong>
          </div>
          <div className="rules-flow__item">
            <div className="rules-sample-grid">
              <span className="rules-cell rules-cell--hidden" />
              <span className="rules-cell rules-cell--flag" />
              <span className="rules-cell rules-cell--hidden" />
              <span className="rules-cell rules-cell--hidden" />
            </div>
            <strong>{text.samples.flag}</strong>
          </div>
          <div className="rules-flow__item">
            <div className="rules-sample-grid">
              <span className="rules-cell rules-cell--open">1</span>
              <span className="rules-cell rules-cell--open">2</span>
              <span className="rules-cell rules-cell--open" />
              <span className="rules-cell rules-cell--hidden" />
            </div>
            <strong>{text.samples.open}</strong>
          </div>
          <div className="rules-flow__item">
            <div className="rules-sample-grid">
              <span className="rules-cell rules-cell--open">1</span>
              <span className="rules-cell rules-cell--mine" />
              <span className="rules-cell rules-cell--open">2</span>
              <span className="rules-cell rules-cell--hidden" />
            </div>
            <strong>{text.samples.mine}</strong>
          </div>
        </div>

        <div className="rules-steps">
          {text.steps.map((step, index) => (
            <article className="rules-step" key={step.title}>
              <span>{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default RulesModal;
