import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrolled } from "../hooks/useScrolled";
import heroBg from "../../gta5rp/gta5bg.jpg";
import starImg from "../../gta5rp/star.png";
import leaderImg from "../../metsuki.jpg";
import mikaImg from "../../mika.jpg";
import "./KagamiPage.css";

// в”Ђв”Ђ Framer variants в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// в”Ђв”Ђ SVG Icons в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

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

// в”Ђв”Ђ Star image helper в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
function KgStar({ className = "" }: { className?: string }) {
  return (
    <img
      src={starImg}
      className={`kg-star-img ${className}`}
      alt="в…"
      aria-hidden="true"
    />
  );
}

// в”Ђв”Ђ Sub-components в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ

function KagamiNav() {
  const isScrolled = useScrolled(40);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: "Р“Р»Р°РІРЅР°СЏ", href: "#kg-hero" },
    { label: "Рћ РЅР°СЃ", href: "#kg-about" },
    { label: "РРЅС„РѕСЂРјР°С†РёСЏ", href: "#kg-activities" },
    { label: "РљРѕРЅС‚Р°РєС‚С‹", href: "#kg-contacts" },
  ];

  return (
    <nav className={`kg-nav ${isScrolled ? "kg-nav--scrolled" : ""} ${menuOpen ? "kg-nav--open" : ""}`}>
      <div className="kg-nav__inner">
        <a href="/" className="kg-nav__back" title="РќР° РіР»Р°РІРЅСѓСЋ" aria-label="РќР° РіР»Р°РІРЅСѓСЋ">
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
        <a href="#kg-join" className="kg-btn kg-btn--primary kg-btn--sm" onClick={() => setMenuOpen(false)}>
          Р’РЎРўРЈРџРРўР¬ в†—
        </a>
        <button
          className="kg-burger"
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Р—Р°РєСЂС‹С‚СЊ РјРµРЅСЋ" : "РћС‚РєСЂС‹С‚СЊ РјРµРЅСЋ"}
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
            в†ђ metsuwuki.github.io
          </a>
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <a href="#kg-join" className="kg-btn kg-btn--primary" onClick={() => setMenuOpen(false)}>
            Р’РЎРўРЈРџРРўР¬
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
        <motion.p className="kg-eyebrow" variants={fadeUp}>Р”РћР‘Р Рћ РџРћР–РђР›РћР’РђРўР¬ Р’</motion.p>
        <motion.h1 className="kg-hero__title" variants={fadeUp}>
          K<span className="kg-star-wrap"><KgStar className="kg-star-img--hero" /></span>GAMI
        </motion.h1>
        <motion.p className="kg-hero__tagline" variants={fadeUp}>
          РЎРР›Рђ &bull; Р•Р”РРќРЎРўР’Рћ &bull; РђРњР‘РР¦РР
        </motion.p>
        <motion.p className="kg-hero__desc" variants={fadeUp}>
          РћСЂРіР°РЅРёР·Р°С†РёСЏ, РѕСЃРЅРѕРІР°РЅРЅР°СЏ СЃ С†РµР»СЊСЋ РѕР±СЉРµРґРёРЅРёС‚СЊ Р°РєС‚РёРІРЅС‹С…
          Рё С†РµР»РµСѓСЃС‚СЂРµРјР»С‘РЅРЅС‹С… РёРіСЂРѕРєРѕРІ, РіРѕС‚РѕРІС‹С… СЂР°Р·РІРёРІР°С‚СЊСЃСЏ,
          Р·Р°СЂР°Р±Р°С‚С‹РІР°С‚СЊ Рё СЃРѕР·РґР°РІР°С‚СЊ СЃРѕР±СЃС‚РІРµРЅРЅСѓСЋ РёСЃС‚РѕСЂРёСЋ.
        </motion.p>
        <motion.div className="kg-hero__btns" variants={fadeUp}>
          <a href="#kg-about" className="kg-btn kg-btn--outline">РЈР—РќРђРўР¬ Р‘РћР›Р¬РЁР•</a>
          <a href="#kg-join" className="kg-btn kg-btn--primary">Р’РЎРўРЈРџРРўР¬</a>
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
    { Icon: ShieldIcon, title: "Р”РРЎР¦РРџР›РРќРђ", text: "РџРѕСЂСЏРґРѕРє, СѓРІР°Р¶РµРЅРёРµ Рё РѕС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚СЊ." },
    { Icon: TeamIcon, title: "Р•Р”РРќРЎРўР’Рћ", text: "РљР°Р¶РґС‹Р№ СѓС‡Р°СЃС‚РЅРёРє вЂ” С‡Р°СЃС‚СЊ РєРѕРјР°РЅРґС‹." },
    { Icon: GrowthIcon, title: "Р РђР—Р’РРўРР•", text: "РњС‹ СЂР°СЃС‚С‘Рј РІРјРµСЃС‚Рµ Рё РїРѕРјРѕРіР°РµРј РґСЂСѓРі РґСЂСѓРіСѓ." },
    { Icon: CrownIcon, title: "РђРњР‘РР¦РР", text: "РњС‹ СЃС‚СЂРµРјРёРјСЃСЏ СЃС‚Р°С‚СЊ РѕРґРЅРѕР№ РёР· СЃРёР»СЊРЅРµР№С€РёС… РѕСЂРіР°РЅРёР·Р°С†РёР№." },
  ];

  return (
    <section className="kg-section" id="kg-about">
      <div className="kg-container">
        <div className="kg-section-label">РќРђРЁР РџР РРќР¦РРџР«</div>
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

          {/* Col 1 вЂ” what we do */}
          <motion.div
            className="kg-col-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <h2 className="kg-col-title">Р§Р•Рњ Р—РђРќРРњРђР•РўРЎРЇ <span>KAGAMI</span></h2>
            <div className="kg-activity-list">
              {[
                { Icon: BriefcaseIcon, title: "РљРћРќРўР РђРљРўР«", text: "Р’С‹РїРѕР»РЅРµРЅРёРµ Р·Р°РґР°РЅРёР№ Рё СѓС‡Р°СЃС‚РёРµ РІ СЂР°Р·Р»РёС‡РЅС‹С… Р°РєС‚РёРІРЅРѕСЃС‚СЏС…." },
                { Icon: TargetIcon, title: "РЎРћР’РњР•РЎРўРќР«Р• РњР•Р РћРџР РРЇРўРРЇ", text: "РџРѕРµР·РґРєРё, РѕРїРµСЂР°С†РёРё, РѕР±С‰РµРЅРёРµ Рё РІРµСЃС‘Р»РѕРµ РІСЂРµРјСЏ РІРјРµСЃС‚Рµ." },
                { Icon: StarIcon, title: "Р РђР—Р’РРўРР• РћР Р“РђРќРР—РђР¦РР", text: "РќРѕРІС‹Рµ СѓС‡Р°СЃС‚РЅРёРєРё, РґРѕСЃС‚РёР¶РµРЅРёСЏ Рё РґРІРёР¶РµРЅРёРµ РІРїРµСЂС‘Рґ." },
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

          {/* Col 2 вЂ” leadership */}
          <motion.div
            className="kg-col-card"
            id="kg-team"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <h2 className="kg-col-title">Р РЈРљРћР’РћР”РЎРўР’Рћ</h2>

            <div className="kg-leader-block">
              <p className="kg-rank-label">Р›РР”Р•Р Р«</p>
              <div className="kg-leaders-row">
                <div className="kg-leader-card">
                  <div className="kg-avatar kg-avatar--lg">
                    <img src={leaderImg} alt="Metsuki Kagami" />
                  </div>
                  <div className="kg-leader-name">Metsuki<br />Kagami</div>
                  <div className="kg-leader-role">РћСЃРЅРѕРІР°С‚РµР»СЊ</div>
                </div>
                <div className="kg-leader-card">
                  <div className="kg-avatar kg-avatar--lg">
                    <img src={mikaImg} alt="Mika Kagami" />
                  </div>
                  <div className="kg-leader-name">Mika<br />Kagami</div>
                  <div className="kg-leader-role">РЎРѕРѕСЃРЅРѕРІР°С‚РµР»СЊРЅРёС†Р°</div>
                </div>
              </div>
            </div>

            <div className="kg-rank-block">
              <p className="kg-rank-label">Р—РђРњР•РЎРўРРўР•Р›Р</p>
              <div className="kg-avatar-row">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="kg-avatar kg-avatar--slot">?</div>
                ))}
              </div>
            </div>

            <div className="kg-rank-block">
              <p className="kg-rank-label">РљРћРћР Р”РРќРђРўРћР Р«</p>
              <div className="kg-avatar-row">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="kg-avatar kg-avatar--slot">?</div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Col 3 вЂ” benefits */}
          <motion.div
            className="kg-col-card"
            id="kg-benefits"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={fadeUp}
          >
            <h2 className="kg-col-title">Р’ KAGAMI <span>РўР•Р‘РЇ Р–Р”РЃРў</span></h2>
            <div className="kg-benefits-grid">
              {[
                { Icon: CoinsIcon, title: "Р—РђР РђР‘РћРўРћРљ", text: "Р‘РѕР»СЊС€РёРµ РІРѕР·РјРѕР¶РЅРѕСЃС‚Рё Рё РєРѕРјР°РЅРґРЅР°СЏ СЂР°Р±РѕС‚Р°." },
                { Icon: ChatIcon, title: "РћР‘Р©Р•РќРР•", text: "РџСЂРёСЏС‚РЅРѕРµ РєРѕРјСЊСЋРЅРёС‚Рё Рё РЅРѕРІС‹Рµ РґСЂСѓР·СЊСЏ." },
                { Icon: ClipboardIcon, title: "РљРћРќРўР РђРљРўР«", text: "Р©РµРґСЂС‹Рµ РЅР°РіСЂР°РґС‹ Р·Р° Р·Р°РґР°РЅРёСЏ." },
                { Icon: RocketIcon, title: "Р РђР—Р’РРўРР•", text: "РџСЂРѕРєР°С‡РёРІР°Р№ СЃРµР±СЏ Рё РґРѕСЃС‚РёРіР°Р№ РЅРѕРІС‹С… РІС‹СЃРѕС‚." },
                { Icon: HandshakeIcon, title: "РџРћР”Р”Р•Р Р–РљРђ", text: "РџРѕРјРѕС‰СЊ Рё СЃРѕРІРµС‚С‹ РѕС‚ РѕРїС‹С‚РЅС‹С… РёРіСЂРѕРєРѕРІ." },
                { Icon: SparkleIcon, title: "РђРўРњРћРЎР¤Р•Р Рђ", text: "РЈРЅРёРєР°Р»СЊРЅС‹Р№ СЃС‚РёР»СЊ РѕСЂРіР°РЅРёР·Р°С†РёРё." },
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
            Р“РћРўРћР’ РЎРўРђРўР¬ Р§РђРЎРўР¬Р®<br /><span>K<KgStar className="kg-star-img--inline" />GAMI?</span>
          </motion.h2>
          <motion.p variants={fadeUp}>
            РџСЂРёСЃРѕРµРґРёРЅСЏР№СЃСЏ Рє РЅР°С€РµР№ РєРѕРјР°РЅРґРµ Рё РЅР°С‡РЅРё РїРёСЃР°С‚СЊ СЃРІРѕСЋ РёСЃС‚РѕСЂРёСЋ РІ РјРёСЂРµ GTA 5 RP.
          </motion.p>
          <motion.div className="kg-steps" variants={fadeUp}>
            <div className="kg-step">
              <div className="kg-step__num">01</div>
              <div className="kg-step__text">РџРѕРґР°Р№ Р·Р°СЏРІРєСѓ РІ Discord</div>
            </div>
            <div className="kg-step__arrow" aria-hidden="true">в†’</div>
            <div className="kg-step">
              <div className="kg-step__num">02</div>
              <div className="kg-step__text">РџРѕР»СѓС‡Рё СЂРѕР»СЊ РІ РґРёСЃРєРѕСЂРґРµ</div>
            </div>
            <div className="kg-step__arrow" aria-hidden="true">в†’</div>
            <div className="kg-step">
              <div className="kg-step__num">03</div>
              <div className="kg-step__text">Р”РѕР±СЂРѕ РїРѕР¶Р°Р»РѕРІР°С‚СЊ РІ СЃРµРјСЊСЋ</div>
            </div>
          </motion.div>
          <motion.a href="#kg-contacts" className="kg-btn kg-btn--primary kg-btn--lg" variants={fadeUp}>
            Р’РЎРўРЈРџРРўР¬
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
        { label: "Вступить", href: "#kg-join" },
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
            <p>РћСЂРіР°РЅРёР·Р°С†РёСЏ РґР»СЏ Р°РєС‚РёРІРЅС‹С… Рё С†РµР»РµСѓСЃС‚СЂРµРјР»С‘РЅРЅС‹С… РёРіСЂРѕРєРѕРІ GTA 5 RP.</p>
            <div className="kg-footer__tagline">РЎРР›Рђ &bull; Р•Р”РРќРЎРўР’Рћ &bull; РђРњР‘РР¦РР</div>
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

        </div>

        <div className="kg-footer__bottom">
          <span>В© 2024 Kв…GAMI вЂ” GTA 5 RP РЎРµРјСЊСЏ.</span>
          <a href="/" className="kg-footer__home">в†ђ РќР° РіР»Р°РІРЅСѓСЋ</a>
        </div>
      </div>
    </footer>
  );
}

// в”Ђв”Ђ Main page export в”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђв”Ђ
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

