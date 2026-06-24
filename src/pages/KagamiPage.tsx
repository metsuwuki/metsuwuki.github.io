import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrolled } from "../hooks/useScrolled";
import heroBg from "../../gta5rp/gta5bg.png";
import leaderImg from "../../metsuki.jpg";
import "./KagamiPage.css";

// ── Framer variants ──────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Sub-components ───────────────────────────────────────────

function KagamiNav() {
  const isScrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Главная", href: "#kg-hero" },
    { label: "О нас", href: "#kg-about" },
    { label: "Состав", href: "#kg-team" },
    { label: "Контракты", href: "#kg-activities" },
    { label: "Преимущества", href: "#kg-benefits" },
    { label: "Контакты", href: "#kg-contacts" },
  ];

  return (
    <nav className={`kg-nav ${isScrolled ? "kg-nav--scrolled" : ""} ${menuOpen ? "kg-nav--open" : ""}`}>
      <div className="kg-nav__inner">
        <a href="/" className="kg-nav__back" title="На главную">← Назад</a>
        <a href="#kg-hero" className="kg-logo" onClick={() => setMenuOpen(false)}>
          K<span>★</span>GAMI
        </a>
        <ul className="kg-nav__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a href="#kg-join" className="kg-btn kg-btn--primary kg-btn--sm" onClick={() => setMenuOpen(false)}>
          ПОДАТЬ ЗАЯВКУ ↗
        </a>
        <button
          className="kg-burger"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={menuOpen ? "is-open" : ""} />
          <span className={menuOpen ? "is-open" : ""} />
          <span className={menuOpen ? "is-open" : ""} />
        </button>
      </div>
      {menuOpen && (
        <div className="kg-nav__mobile">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="#kg-join" className="kg-btn kg-btn--primary" onClick={() => setMenuOpen(false)}>
            ПОДАТЬ ЗАЯВКУ
          </a>
        </div>
      )}
    </nav>
  );
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; vy: number; alpha: number; alphaDir: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        vy: -(Math.random() * 0.4 + 0.15),
        alpha: Math.random() * 0.5 + 0.1,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y += p.vy;
        p.alpha += p.alphaDir * 0.004;
        if (p.alpha >= 0.65 || p.alpha <= 0.05) p.alphaDir *= -1;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,85,247,${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="kg-hero__particles" aria-hidden="true" />;
}

function KagamiHero() {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      if (bgRef.current && window.scrollY < window.innerHeight) {
        bgRef.current.style.transform = `scale(1.06) translateY(${window.scrollY * 0.22}px)`;
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <section className="kg-hero" id="kg-hero">
      <div
        className="kg-hero__bg"
        ref={bgRef}
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-hidden="true"
      />
      <div className="kg-hero__overlay" aria-hidden="true" />
      <ParticleField />

      <motion.div
        className="kg-hero__content"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p className="kg-eyebrow" variants={fadeUp}>ДОБРО ПОЖАЛОВАТЬ В</motion.p>
        <motion.h1 className="kg-hero__title" variants={fadeUp}>
          K<span className="kg-star-glow">★</span>GAMI
        </motion.h1>
        <motion.p className="kg-hero__tagline" variants={fadeUp}>
          СИЛА &bull; ЕДИНСТВО &bull; АМБИЦИИ
        </motion.p>
        <motion.p className="kg-hero__desc" variants={fadeUp}>
          Организация, основанная с целью объединить активных<br />
          и целеустремлённых игроков, готовых развиваться,<br />
          зарабатывать и создавать собственную историю.
        </motion.p>
        <motion.div className="kg-hero__btns" variants={fadeUp}>
          <a href="#kg-about" className="kg-btn kg-btn--outline">УЗНАТЬ БОЛЬШЕ</a>
          <a href="#kg-join" className="kg-btn kg-btn--primary">ПОДАТЬ ЗАЯВКУ</a>
        </motion.div>
      </motion.div>

      <div className="kg-scroll-hint" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}

function KagamiPrinciples() {
  const principles = [
    { icon: "🛡️", title: "ДИСЦИПЛИНА", text: "Порядок, уважение и ответственность." },
    { icon: "👥", title: "ЕДИНСТВО", text: "Каждый участник — часть команды." },
    { icon: "📈", title: "РАЗВИТИЕ", text: "Мы растём вместе и помогаем друг другу." },
    { icon: "👑", title: "АМБИЦИИ", text: "Мы стремимся стать одной из сильнейших организаций." },
  ];

  return (
    <section className="kg-section" id="kg-about">
      <div className="kg-container">
        <div className="kg-section-label">НАШИ ПРИНЦИПЫ</div>
        <motion.div
          className="kg-principles"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={stagger}
        >
          {principles.map((p) => (
            <motion.div key={p.title} className="kg-principle-card" variants={fadeUp}>
              <div className="kg-principle-card__icon">{p.icon}</div>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function KagamiActivities() {
  return (
    <section className="kg-section" id="kg-activities">
      <div className="kg-container">
        <div className="kg-cols">

          {/* Col 1 — what we do */}
          <motion.div
            className="kg-col-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <h2 className="kg-col-title">ЧЕМ ЗАНИМАЕТСЯ <span>KAGAMI</span></h2>
            <div className="kg-activity-list">
              {[
                { icon: "💼", title: "КОНТРАКТЫ", text: "Выполнение заданий и участие в различных активностях." },
                { icon: "🎯", title: "СОВМЕСТНЫЕ МЕРОПРИЯТИЯ", text: "Поездки, операции, общение и весёлое время вместе." },
                { icon: "⭐", title: "РАЗВИТИЕ ОРГАНИЗАЦИИ", text: "Новые участники, достижения и движение вперёд." },
              ].map((item) => (
                <div key={item.title} className="kg-activity-item">
                  <div className="kg-activity-item__icon">{item.icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Col 2 — leadership */}
          <motion.div
            className="kg-col-card"
            id="kg-team"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <h2 className="kg-col-title">РУКОВОДСТВО</h2>

            <div className="kg-leader-block">
              <p className="kg-rank-label">ЛИДЕР</p>
              <div className="kg-leader-main">
                <div className="kg-avatar kg-avatar--lg">
                  <img src={leaderImg} alt="Metsuki Kagami" />
                </div>
                <div>
                  <div className="kg-leader-name">Metsuki<br />Kagami</div>
                  <div className="kg-leader-role">Основатель организации</div>
                </div>
              </div>
            </div>

            <div className="kg-rank-block">
              <p className="kg-rank-label">ЗАМЕСТИТЕЛИ</p>
              <div className="kg-avatar-row">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="kg-avatar kg-avatar--slot">?</div>
                ))}
              </div>
            </div>

            <div className="kg-rank-block">
              <p className="kg-rank-label">КООРДИНАТОРЫ</p>
              <div className="kg-avatar-row">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="kg-avatar kg-avatar--slot">?</div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Col 3 — benefits */}
          <motion.div
            className="kg-col-card"
            id="kg-benefits"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <h2 className="kg-col-title">В KAGAMI <span>ТЕБЯ ЖДЁТ</span></h2>
            <div className="kg-benefits-grid">
              {[
                { icon: "💰", title: "ЗАРАБОТОК", text: "Большие возможности и командная работа." },
                { icon: "💬", title: "ОБЩЕНИЕ", text: "Приятное комьюнити и новые друзья." },
                { icon: "📋", title: "КОНТРАКТЫ", text: "Щедрые награды за задания." },
                { icon: "🚀", title: "РАЗВИТИЕ", text: "Прокачивай себя и достигай новых высот." },
                { icon: "🤝", title: "ПОДДЕРЖКА", text: "Помощь и советы от опытных игроков." },
                { icon: "✨", title: "АТМОСФЕРА", text: "Уникальный стиль организации." },
              ].map((b) => (
                <div key={b.title} className="kg-benefit-item">
                  <div className="kg-benefit-item__icon">{b.icon}</div>
                  <div>
                    <h4>{b.title}</h4>
                    <p>{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

function KagamiJoin() {
  return (
    <section className="kg-section kg-join" id="kg-join">
      <div className="kg-join__glow" aria-hidden="true" />
      <div className="kg-container">
        <motion.div
          className="kg-join__inner"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={stagger}
        >
          <motion.div className="kg-join__star" variants={fadeUp} aria-hidden="true">★</motion.div>
          <motion.h2 variants={fadeUp}>
            ГОТОВ СТАТЬ ЧАСТЬЮ<br /><span>K★GAMI?</span>
          </motion.h2>
          <motion.p variants={fadeUp}>
            Присоединяйся к нашей команде и начни писать свою историю в мире GTA 5 RP.
          </motion.p>
          <motion.div className="kg-steps" variants={fadeUp}>
            <div className="kg-step">
              <div className="kg-step__num">01</div>
              <div className="kg-step__text">Подай заявку в Discord</div>
            </div>
            <div className="kg-step__arrow" aria-hidden="true">→</div>
            <div className="kg-step">
              <div className="kg-step__num">02</div>
              <div className="kg-step__text">Пройди собеседование</div>
            </div>
            <div className="kg-step__arrow" aria-hidden="true">→</div>
            <div className="kg-step">
              <div className="kg-step__num">03</div>
              <div className="kg-step__text">Добро пожаловать в семью</div>
            </div>
          </motion.div>
          <motion.a href="#kg-contacts" className="kg-btn kg-btn--primary kg-btn--lg" variants={fadeUp}>
            ПОДАТЬ ЗАЯВКУ
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function VkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.16h-1.56c-.59 0-.77-.47-1.83-1.54-1.04-1.09-1.43-.93-1.43.2v1.4c0 .34-.1.54-1.01.54-1.5 0-3.15-.9-4.31-2.58-1.75-2.46-2.23-4.3-2.23-4.68 0-.2.08-.39.47-.39h1.56c.35 0 .48.16.62.54.68 1.96 1.83 3.68 2.3 3.68.18 0 .26-.08.26-.54V9.68c-.06-1-.59-1.08-.59-1.43 0-.2.16-.39.42-.39h2.45c.29 0 .39.15.39.47v3.12c0 .29.13.39.21.39.18 0 .33-.1.66-.43 1.02-1.14 1.75-2.9 1.75-2.9.1-.2.27-.39.62-.39h1.56c.47 0 .57.24.47.54-.2.9-2.12 3.62-2.12 3.62-.17.28-.22.41 0 .72.16.23.68.7 1.03 1.12.64.73 1.13 1.35 1.26 1.77.14.41-.09.62-.47.62z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function KagamiFooter() {
  const cols = [
    {
      title: "НАВИГАЦИЯ",
      links: [
        { label: "Главная", href: "#kg-hero" },
        { label: "О нас", href: "#kg-about" },
        { label: "Состав", href: "#kg-team" },
        { label: "Контракты", href: "#kg-activities" },
      ],
    },
    {
      title: "ОРГАНИЗАЦИЯ",
      links: [
        { label: "Принципы", href: "#kg-about" },
        { label: "Преимущества", href: "#kg-benefits" },
        { label: "Вступить", href: "#kg-join" },
        { label: "Руководство", href: "#kg-team" },
      ],
    },
  ];

  return (
    <footer className="kg-footer" id="kg-contacts">
      <div className="kg-footer__glow" aria-hidden="true" />
      <div className="kg-container">
        <div className="kg-footer__grid">
          <div className="kg-footer__brand">
            <div className="kg-footer__logo">K<span>★</span>GAMI</div>
            <p>Организация для активных и целеустремлённых игроков GTA 5 RP.</p>
            <div className="kg-footer__tagline">СИЛА &bull; ЕДИНСТВО &bull; АМБИЦИИ</div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="kg-footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}><a href={l.href}>{l.label}</a></li>
                ))}
              </ul>
            </div>
          ))}

          <div className="kg-footer__col">
            <h4>НАШИ КОНТАКТЫ</h4>
            <div className="kg-socials">
              {([
                { label: "Discord", Icon: DiscordIcon },
                { label: "Telegram", Icon: TelegramIcon },
                { label: "VK", Icon: VkIcon },
                { label: "YouTube", Icon: YoutubeIcon },
              ] as const).map(({ label, Icon }) => (
                <a key={label} href="#" className="kg-social-link" title={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="kg-footer__bottom">
          <span>© 2024 K★GAMI — GTA 5 RP Семья.</span>
          <a href="/" className="kg-footer__home">← На главную</a>
        </div>
      </div>
    </footer>
  );
}

// ── Main page export ─────────────────────────────────────────
export default function KagamiPage() {
  return (
    <div className="kagami-page">
      <KagamiNav />
      <KagamiHero />
      <KagamiPrinciples />
      <KagamiActivities />
      <KagamiJoin />
      <KagamiFooter />
    </div>
  );
}
