import { useEffect } from "react";
import duoImg from "../../assets/duo.jpg";
import carImg from "../../assets/car.jpg";
import cityImg from "../../assets/city.jpg";
import vinewoodImg from "../../assets/vinewood.jpg";
import "./KagamiPage.css";

/** Единственное место, где задаётся ссылка-приглашение в Discord. */
export const DISCORD_URL = "https://discord.gg/FFDcSZ4n2J";

const FONTS_HREF = "https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap&subset=cyrillic";

type Activity = { title: string; text: string; image: string; position?: string; alt: string; icon: JSX.Element };

const activities: Activity[] = [
  {
    title: "Ролевая игра",
    text: "Создание историй, развитие персонажей и влияния в городе.",
    image: vinewoodImg,
    alt: "Холмы Вайнвуда на закате",
    icon: <path fill="currentColor" d="M2 7c3-2 7-2 10 0 3-2 7-2 10 0v4c0 4-3 6-5 6s-3-2-5-2-3 2-5 2-5-2-5-6zm5 3a1.5 1.5 0 1 0 0 3h2a1.5 1.5 0 0 0 0-3zm8 0a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 0 0-3z" />,
  },
  {
    title: "Операции",
    text: "Совместные действия, проекты и крупные события.",
    image: carImg,
    alt: "Машина на ночной улице Лос-Сантоса",
    icon: <path fill="currentColor" d="M4 2h2v20H4zm3 1h13l-3 4.5L20 12H7z" />,
  },
  {
    title: "Сообщество",
    text: "Поддержка, взаимодействие и единые цели.",
    image: duoImg,
    position: "center 25%",
    alt: "Metsuki и Mika Kagami",
    icon: <path fill="currentColor" d="M12 4a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zM5 7a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm14 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM12 12.5c3.5 0 6 2 6 4.5v2H6v-2c0-2.5 2.5-4.5 6-4.5zM0 19v-1.5C0 15.6 1.8 14 4.4 13.7A6 6 0 0 0 4 17v2zm24 0h-4v-2a6 6 0 0 0-.4-3.3c2.6.3 4.4 1.9 4.4 3.8z" />,
  },
  {
    title: "Развитие",
    text: "Внутренний рост, проекты и новые возможности.",
    image: cityImg,
    alt: "Ночной силуэт Лос-Сантоса",
    icon: <path fill="currentColor" d="M3 14h4v8H3zm7-5h4v13h-4zm7-6h4v19h-4z" />,
  },
];

const leaders = [
  { name: "Metsuki Kagami", role: "Основатель", side: "left" },
  { name: "Mika Kagami", role: "Сооснователь", side: "right" },
] as const;

const requirements = [
  { title: "Активность", text: "Участие в делах, а не строчка в списке" },
  { title: "Уважение", text: "К правилам и участникам" },
  { title: "Командность", text: "Готовность действовать сообща" },
];

function Star({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 1.5l2.6 7.1 7.4.3-5.8 4.6 2 7.3L12 16.6l-6.2 4.2 2-7.3L2 8.9l7.4-.3z" /></svg>;
}

function DiscordIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M20.32 4.37a19.8 19.8 0 0 0-4.89-1.52.07.07 0 0 0-.08.04c-.21.38-.44.87-.61 1.25a18.3 18.3 0 0 0-5.49 0 12.6 12.6 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.7 19.7 0 0 0-4.88 1.52.07.07 0 0 0-.03.03C.53 9.05-.32 13.58.1 18.06a.08.08 0 0 0 .03.06 19.9 19.9 0 0 0 5.99 3.03.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-2a.08.08 0 0 0-.04-.1 13.1 13.1 0 0 1-1.87-.9.08.08 0 0 1 0-.12l.37-.3a.07.07 0 0 1 .08 0c3.93 1.8 8.18 1.8 12.06 0a.07.07 0 0 1 .08 0l.37.3a.08.08 0 0 1 0 .12c-.6.35-1.22.65-1.87.9a.08.08 0 0 0-.04.1c.36.7.77 1.37 1.22 2a.08.08 0 0 0 .09.03 19.8 19.8 0 0 0 6-3.03.08.08 0 0 0 .03-.05c.5-5.18-.84-9.68-3.55-13.66a.06.06 0 0 0-.03-.03zM8.02 15.33c-1.18 0-2.16-1.08-2.16-2.42s.96-2.42 2.16-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.34-.96 2.42-2.16 2.42zm7.97 0c-1.18 0-2.15-1.08-2.15-2.42s.95-2.42 2.15-2.42c1.21 0 2.18 1.1 2.16 2.42 0 1.34-.94 2.42-2.16 2.42z" /></svg>;
}

function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="1.5" y="1.5" width="21" height="21" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function DiscordButton({ children, className = "" }: { children: string; className?: string }) {
  return <a className={`kg-btn kg-btn--primary ${className}`} href={DISCORD_URL} target="_blank" rel="noopener noreferrer"><DiscordIcon />{children}</a>;
}

function Logo() {
  return <a href="#kg-top" className="kg-logo" aria-label="KAGAMI — наверх"><span>KAGAMI</span><Star /></a>;
}

function useKagamiDocument() {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = "KAGAMI — GTA 5 RP Crew";
    document.documentElement.classList.add("kg-route");

    let link = document.querySelector<HTMLLinkElement>("link[data-kg-fonts]");
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      link.dataset.kgFonts = "";
      document.head.appendChild(link);
    }

    return () => {
      document.title = previousTitle;
      document.documentElement.classList.remove("kg-route");
    };
  }, []);
}

function Header() {
  return <header className="kg-header">
    <div className="kg-wrap kg-nav">
      <Logo />
      <DiscordButton className="kg-nav__discord">Discord</DiscordButton>
    </div>
  </header>;
}

export default function KagamiPage() {
  useKagamiDocument();

  return <div className="kg">
    <div className="kg-grain" aria-hidden="true" />

    <Header />

    <main>
      <section className="kg-hero" id="kg-top" aria-labelledby="kg-title">
        <div className="kg-hero__bg" style={{ backgroundImage: `url(${cityImg})` }} aria-hidden="true" />
        <img className="kg-hero__art" src={duoImg} alt="Metsuki и Mika Kagami — лидеры KAGAMI" />
        <div className="kg-wrap kg-hero__inner">
          <div className="kg-hero__text">
            <p className="kg-status"><i aria-hidden="true" />Набор открыт</p>
            <svg className="kg-crown" viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d="M6 44 L4 12 L22 28 L40 4 L56 28 L76 12 L72 44 Z" /></svg>
            <h1 id="kg-title" className="kg-display kg-hero__title">KAGAMI</h1>
            <p className="kg-hero__sub"><span className="kg-slashes" aria-hidden="true">////</span><span className="kg-display">RP Crew</span></p>
            <p className="kg-hero__lead">Семья на просторах Лос-Сантоса. Роль, взаимодействие, развитие и свои правила.</p>
            <div className="kg-hero__ctas">
              <DiscordButton>Вступить в Discord →</DiscordButton>
              <a className="kg-btn kg-btn--ghost" href="#kg-activity">Узнать больше</a>
            </div>
          </div>
        </div>
      </section>

      <div className="kg-wrap kg-split">
        <section id="kg-activity" className="kg-activity" aria-labelledby="kg-activity-title">
          <h2 id="kg-activity-title" className="kg-display kg-h2">Наша деятельность<span className="kg-slashes" aria-hidden="true">///</span></h2>
          <ul className="kg-cards">
            {activities.map((item) => <li key={item.title} className="kg-card">
              <img className="kg-card__img" src={item.image} alt={item.alt} loading="lazy" decoding="async" style={item.position ? { objectPosition: item.position } : undefined} />
              <div className="kg-card__body">
                <h3 className="kg-display"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{item.icon}</svg>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>)}
          </ul>
        </section>

        <section id="kg-leaders" className="kg-leaders" aria-labelledby="kg-leaders-title">
          <h2 id="kg-leaders-title" className="kg-display kg-h2">Руководство</h2>
          <div className="kg-polaroids">
            {leaders.map((leader) => <figure key={leader.name} className={`kg-polaroid kg-polaroid--${leader.side}`}>
              <span className="kg-tape" aria-hidden="true" />
              <img src={duoImg} alt={`${leader.name} — ${leader.role.toLowerCase()}`} loading="lazy" decoding="async" />
              <figcaption><span className="kg-display">{leader.name}</span></figcaption>
              <span className="kg-polaroid__role">{leader.role}</span>
            </figure>)}
          </div>
        </section>
      </div>

      <section className="kg-join" id="kg-join" aria-labelledby="kg-join-title">
        <div className="kg-join__img" style={{ backgroundImage: `url(${carImg})` }} role="img" aria-label="Машина на ночной улице Лос-Сантоса" />
        <div className="kg-wrap kg-join__inner">
          <h2 id="kg-join-title" className="kg-display kg-join__title">Вступай<br />в <em>KAGAMI</em></h2>
          <ul className="kg-checks">
            {requirements.map((item) => <li key={item.title}><CheckIcon /><div><b>{item.title}</b><span>{item.text}</span></div></li>)}
          </ul>
          <div className="kg-join__cta">
            <DiscordButton className="kg-btn--large">Подать заявку</DiscordButton>
            <small>Заявка и собеседование — в Discord</small>
          </div>
        </div>
      </section>
    </main>

    <footer className="kg-footer">
      <div className="kg-wrap kg-footer__inner">
        <Logo />
        <span className="kg-footer__tag">GTA RP Crew</span>
        <span className="kg-footer__copy">© 2026 KAGAMI</span>
      </div>
    </footer>
  </div>;
}
