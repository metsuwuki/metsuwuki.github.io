import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrolled } from "../hooks/useScrolled";
import heroBg from "../../gta5rp/gta5bg.jpg";
import starImg from "../../gta5rp/star.png";
import leaderImg from "../../metsuki.jpg";
import mikaImg from "../../mika.jpg";
import "./KagamiPage.css";

const kagamiDiscordInvite = "https://discord.gg/FFDcSZ4n2J";

// ── Framer variants ──────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── SVG Icons ────────────────────────────────────────────────

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 2L4 5.5V11c0 5 3.5 9.3 8 10.5C16.5 20.3 20 16 20 11V5.5L12 2z" />
    </svg>
  );
}

function TeamIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M2 21v-1a7 7 0 0 1 14 0v1" />
      <path d="M17 13a5 5 0 0 1 5 5v1" />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </svg>
  );
}

function CrownIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 19h20v2H2z" />
      <path d="M2 19L5 9l5 5 4-8 4 8 3-5z" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="8" width="20" height="14" rx="2" />
      <path d="M16 8V6a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <line x1="12" y1="13" x2="12" y2="17" />
      <line x1="10" y1="15" x2="14" y2="15" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function CoinsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <line x1="16.71" y1="13.88" x2="17.71" y2="13.88" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="10" x2="15" y2="10" />
      <line x1="9" y1="14" x2="13" y2="14" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="13" y2="16" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

function HandshakeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
      <path d="m9 13 2 2 4-4" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 3v4" />
      <path d="M3 5h4" />
      <path d="M19 17v4" />
      <path d="M17 19h4" />
    </svg>
  );
}

// ── Star image helper ─────────────────────────────────────────
function KgStar({ className = "" }: { className?: string }) {
  return (
    <img
      src={starImg}
      className={`kg-star-img ${className}`}
      alt="★"
      aria-hidden="true"
    />
  );
}

// ── Sub-components ───────────────────────────────────────────

function KagamiNav() {
  const isScrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Главная", href: "#kg-hero" },
    { label: "О нас", href: "#kg-about" },
    { label: "Информация", href: "#kg-activities" },
    { label: "Контакты", href: "#kg-contacts" },
  ];

  return (
    <nav className={`kg-nav ${isScrolled ? "kg-nav--scrolled" : ""} ${menuOpen ? "kg-nav--open" : ""}`}>
      <div className="kg-nav__inner">
        <a href="/" className="kg-nav__back" title="На главную" aria-label="На главную">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" width="18" height="18" aria-hidden="true">
            <path d="M3 10h14M3 10l5-5M3 10l5 5" />
          </svg>
        </a>
        <a href="#kg-hero" className="kg-logo" onClick={() => setMenuOpen(false)}>
          K<KgStar className="kg-star-img--logo" />GAMI
        </a>
        <ul className="kg-nav__links">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
            </li>
          ))}
        </ul>
        <a
          href={kagamiDiscordInvite}
          target="_blank"
          rel="noreferrer"
          className="kg-btn kg-btn--primary kg-btn--sm"
          onClick={() => setMenuOpen(false)}
        >
          ВСТУПИТЬ ↗
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
          <a href="/" className="kg-nav__mobile-back" onClick={() => setMenuOpen(false)}>
            ← metsuwuki.github.io
          </a>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a
            href={kagamiDiscordInvite}
            target="_blank"
            rel="noreferrer"
            className="kg-btn kg-btn--primary"
            onClick={() => setMenuOpen(false)}
          >
            ВСТУПИТЬ
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
        ctx.fillStyle = `rgba(165,139,255,${p.alpha})`;
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

function VacantSlot() {
  return (
    <div className="kg-vacant-card">
      <div className="kg-vacant-card__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.582-7 8-7s8 3 8 7" />
        </svg>
      </div>
      <span className="kg-vacant-card__label">Вакантно</span>
    </div>
  );
}

function KagamiHero() {
  const bgRef = useRef<HTMLDivElement>(null);
  const fadeGroupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        if (y < vh) {
          const progress = y / vh;
          if (bgRef.current) {
            bgRef.current.style.transform = `scale(1.06) translateY(${y * 0.22}px)`;
          }
          if (fadeGroupRef.current) {
            fadeGroupRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.8));
          }
        }
      });
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="kg-hero" id="kg-hero">
      <div className="kg-hero__fade-group" ref={fadeGroupRef} aria-hidden="true">
        <div className="kg-hero__bg" ref={bgRef} style={{ backgroundImage: `url(${heroBg})` }} />
        <div className="kg-hero__overlay" />
      </div>
      <ParticleField />

      <motion.div
        className="kg-hero__content"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.p className="kg-eyebrow" variants={fadeUp}>ДОБРО ПОЖАЛОВАТЬ В</motion.p>
        <motion.h1 className="kg-hero__title" variants={fadeUp}>
          K<span className="kg-star-wrap"><KgStar className="kg-star-img--hero" /></span>GAMI
        </motion.h1>
        <motion.p className="kg-hero__tagline" variants={fadeUp}>
          СИЛА &bull; ЕДИНСТВО &bull; АМБИЦИИ
        </motion.p>
        <motion.p className="kg-hero__desc" variants={fadeUp}>
          Организация, основанная с целью объединить активных
          и целеустремлённых игроков, готовых развиваться,
          зарабатывать и создавать собственную историю.
        </motion.p>
        <motion.div className="kg-hero__btns" variants={fadeUp}>
          <a href="#kg-about" className="kg-btn kg-btn--outline">УЗНАТЬ БОЛЬШЕ</a>
          <a href={kagamiDiscordInvite} target="_blank" rel="noreferrer" className="kg-btn kg-btn--primary">ВСТУПИТЬ</a>
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
    { Icon: ShieldIcon, title: "ДИСЦИПЛИНА", text: "Порядок, уважение и ответственность." },
    { Icon: TeamIcon, title: "ЕДИНСТВО", text: "Каждый участник — часть команды." },
    { Icon: GrowthIcon, title: "РАЗВИТИЕ", text: "Мы растём вместе и помогаем друг другу." },
    { Icon: CrownIcon, title: "АМБИЦИИ", text: "Мы стремимся стать одной из сильнейших организаций." },
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
              <div className="kg-principle-card__icon"><p.Icon /></div>
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
                { Icon: BriefcaseIcon, title: "КОНТРАКТЫ", text: "Выполнение заданий и участие в различных активностях." },
                { Icon: TargetIcon, title: "СОВМЕСТНЫЕ МЕРОПРИЯТИЯ", text: "Поездки, операции, общение и весёлое время вместе." },
                { Icon: StarIcon, title: "РАЗВИТИЕ ОРГАНИЗАЦИИ", text: "Новые участники, достижения и движение вперёд." },
              ].map((item) => (
                <div key={item.title} className="kg-activity-item">
                  <div className="kg-activity-item__icon"><item.Icon /></div>
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
              <p className="kg-rank-label">ЛИДЕРЫ</p>
              <div className="kg-leaders-row">
                <div className="kg-leader-card">
                  <div className="kg-avatar kg-avatar--lg">
                    <img src={leaderImg} alt="Metsuki Kagami" />
                  </div>
                  <div className="kg-leader-name">Metsuki<br />Kagami</div>
                  <div className="kg-leader-role">Основатель</div>
                </div>
                <div className="kg-leader-card">
                  <div className="kg-avatar kg-avatar--lg">
                    <img src={mikaImg} alt="Mika Kagami" />
                  </div>
                  <div className="kg-leader-name">Mika<br />Kagami</div>
                  <div className="kg-leader-role">Соосновательница</div>
                </div>
              </div>
            </div>

            <div className="kg-rank-block">
              <p className="kg-rank-label">ЗАМЕСТИТЕЛИ</p>
              <div className="kg-vacant-row">
                {[0, 1, 2].map((i) => <VacantSlot key={i} />)}
              </div>
            </div>

            <div className="kg-rank-block">
              <p className="kg-rank-label">КООРДИНАТОРЫ</p>
              <div className="kg-vacant-row">
                {[0, 1, 2, 3].map((i) => <VacantSlot key={i} />)}
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
                { Icon: CoinsIcon, title: "ЗАРАБОТОК", text: "Большие возможности и командная работа." },
                { Icon: ChatIcon, title: "ОБЩЕНИЕ", text: "Приятное комьюнити и новые друзья." },
                { Icon: ClipboardIcon, title: "КОНТРАКТЫ", text: "Щедрые награды за задания." },
                { Icon: RocketIcon, title: "РАЗВИТИЕ", text: "Прокачивай себя и достигай новых высот." },
                { Icon: HandshakeIcon, title: "ПОДДЕРЖКА", text: "Помощь и советы от опытных игроков." },
                { Icon: SparkleIcon, title: "АТМОСФЕРА", text: "Уникальный стиль организации." },
              ].map((b) => (
                <div key={b.title} className="kg-benefit-item">
                  <div className="kg-benefit-item__icon"><b.Icon /></div>
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
          <motion.div className="kg-join__star" variants={fadeUp} aria-hidden="true">
            <KgStar className="kg-star-img--join" />
          </motion.div>
          <motion.h2 variants={fadeUp}>
            ГОТОВ СТАТЬ ЧАСТЬЮ<br /><span> K<KgStar className="kg-star-img--inline" />GAMI?</span>
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
              <div className="kg-step__text">Получи роль в дискорде</div>
            </div>
            <div className="kg-step__arrow" aria-hidden="true">→</div>
            <div className="kg-step">
              <div className="kg-step__num">03</div>
              <div className="kg-step__text">Добро пожаловать в семью</div>
            </div>
          </motion.div>
          <motion.a
            href={kagamiDiscordInvite}
            target="_blank"
            rel="noreferrer"
            className="kg-btn kg-btn--primary kg-btn--lg"
            variants={fadeUp}
          >
            ВСТУПИТЬ
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function KagamiFooter() {
  const cols = [
    {
      title: "НАВИГАЦИЯ",
      links: [
        { label: "Главная", href: "#kg-hero" },
        { label: "О нас", href: "#kg-about" },
        { label: "Информация", href: "#kg-activities" },
        { label: "Вступить", href: kagamiDiscordInvite },
      ],
    },
    {
      title: "ОРГАНИЗАЦИЯ",
      links: [
        { label: "Принципы", href: "#kg-about" },
        { label: "Лидеры", href: "#kg-team" },
        { label: "Преимущества", href: "#kg-benefits" },
        { label: "Контакты", href: "#kg-contacts" },
      ],
    },
  ];

  return (
    <footer className="kg-footer" id="kg-contacts">
      <div className="kg-footer__glow" aria-hidden="true" />
      <div className="kg-container">
        <div className="kg-footer__grid">
          <div className="kg-footer__brand">
            <div className="kg-footer__logo">K<KgStar className="kg-star-img--footer" />GAMI</div>
            <p>Организация для активных и целеустремлённых игроков GTA 5 RP.</p>
            <div className="kg-footer__tagline">СИЛА &bull; ЕДИНСТВО &bull; АМБИЦИИ</div>
          </div>

          {cols.map((col) => (
            <div key={col.title} className="kg-footer__col">
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        <div className="kg-footer__bottom">
          <span>(c) 2024 K★GAMI - GTA 5 RP семья.</span>
          <a href="/" className="kg-footer__home">&lt;- На главную</a>
        </div>
      </div>
    </footer>
  );
}

// Main page export
export default function KagamiPage() {
  return (
    <div className="kagami-page">
      <div className="kg-bg-grid" aria-hidden="true" />
      <KagamiNav />
      <KagamiHero />
      <KagamiPrinciples />
      <KagamiActivities />
      <KagamiJoin />
      <KagamiFooter />
    </div>
  );
}

