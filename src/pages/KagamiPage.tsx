import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode, type WheelEvent } from "react";
import { m } from "framer-motion";
import heroBg from "../../kagami/gta5bg.jpg";
import starImg from "../../kagami/star.png";
import metsukiImg from "../../metsuki.jpg";
import mikaImg from "../../mika.jpg";
import { useMotionSettings } from "../hooks/useMotionSettings";
import "./KagamiPage.css";

const discordInvite = "https://discord.gg/FFDcSZ4n2J";
const navigation = [
  ["Главная", "kg-hero"], ["О нас", "kg-philosophy"], ["Информация", "kg-information"],
  ["Руководство", "kg-leadership"], ["Контакты", "kg-contact"],
] as const;

const reveal = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0 } };

function BrandStar({ className = "" }: { className?: string }) {
  return <img className={`nexus-star ${className}`} src={starImg} alt="" aria-hidden="true" />;
}

function ReflectiveCard({ children, className = "", label }: { children: ReactNode; className?: string; label: string }) {
  const ref = useRef<HTMLElement>(null);
  const { prefersReducedMotion } = useMotionSettings();
  const move = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    ref.current.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
    ref.current.style.setProperty("--ry", `${(x - 0.5) * 10}deg`);
    ref.current.style.setProperty("--mx", `${x * 100}%`);
    ref.current.style.setProperty("--my", `${y * 100}%`);
  };
  const reset = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return <article ref={ref} className={`reflective-card ${className}`} aria-label={label} onPointerMove={move} onPointerLeave={reset}>{children}<span className="reflective-card__light" aria-hidden="true" /></article>;
}

type PathItem = { eyebrow: string; title: string; body: string; note: string };
const paths: PathItem[] = [
  { eyebrow: "01 / ДЕЙСТВИЕ", title: "Контракты", body: "Командное выполнение задач и участие в активностях организации.", note: "Для игроков, которым важны координация и общий результат." },
  { eyebrow: "02 / СВЯЗЬ", title: "Сообщество", body: "Общение, совместные поездки и время с участниками K✦GAMI.", note: "Для тех, кто ищет постоянный круг людей, а не разовую группу." },
  { eyebrow: "03 / РОСТ", title: "Развитие", body: "Вклад в движение организации вперёд и поддержка новых участников.", note: "Для инициативных игроков, готовых расти вместе с командой." },
  { eyebrow: "04 / АТМОСФЕРА", title: "События", body: "Совместные мероприятия, операции и внутренняя жизнь организации.", note: "Для тех, кто хочет быть частью общей истории." },
];

function getDepthOffset(index: number, active: number, length: number) {
  let offset = (index - active + length) % length;
  if (offset > length / 2) offset -= length;
  return offset;
}

function DepthCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; index: number } | null>(null);
  const lastWheel = useRef(0);
  const { prefersReducedMotion } = useMotionSettings();
  const select = useCallback((next: number) => setActive((next + paths.length) % paths.length), []);

  useEffect(() => {
    if (prefersReducedMotion || paused) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % paths.length), 6500);
    return () => window.clearInterval(timer);
  }, [paused, prefersReducedMotion]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, index: active };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) > 40) select(drag.current.index + (delta < 0 ? 1 : -1));
    drag.current = null;
  };
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) + Math.abs(event.deltaY) < 8) return;
    const now = performance.now();
    if (now - lastWheel.current < 420) return;
    lastWheel.current = now;
    select(active + (event.deltaY + event.deltaX > 0 ? 1 : -1));
  };

  return <div className="depth-carousel" role="region" aria-roledescription="карусель" aria-label="Направления участия"
    onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}
    onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
    <div className="depth-carousel__viewport" tabIndex={0} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onWheel={onWheel}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); select(active + 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); select(active - 1); }
        if (event.key === "Home") { event.preventDefault(); select(0); }
        if (event.key === "End") { event.preventDefault(); select(paths.length - 1); }
      }}>
      {paths.map((item, index) => {
        const offset = getDepthOffset(index, active, paths.length);
        const distance = Math.abs(offset);
        return <div key={item.title} className={`depth-carousel__item ${index === active ? "is-active" : ""}`}
          style={{ "--depth-offset": offset, "--depth-distance": distance, zIndex: paths.length - distance } as CSSProperties}
          aria-hidden={index !== active} onClick={() => select(index)}>
          <ReflectiveCard className="path-card" label={item.title}>
            <p className="nexus-kicker">{item.eyebrow}</p>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
            <div className="path-card__line" />
            <small>{item.note}</small>
          </ReflectiveCard>
        </div>;
      })}
    </div>
    <div className="depth-carousel__controls">
      <button type="button" onClick={() => select(active - 1)} aria-label="Предыдущее направление">←</button>
      <span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(paths.length).padStart(2, "0")}</span>
      <button type="button" onClick={() => select(active + 1)} aria-label="Следующее направление">→</button>
    </div>
  </div>;
}

export function CircularGallery() {
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; index: number } | null>(null);
  const select = useCallback((next: number) => setActive((next + paths.length) % paths.length), []);
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, index: active };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) > 40) select(drag.current.index + (delta < 0 ? 1 : -1));
    drag.current = null;
  };
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) + Math.abs(event.deltaY) < 8) return;
    select(active + (event.deltaY + event.deltaX > 0 ? 1 : -1));
  };

  return <div className="circular-gallery" role="region" aria-roledescription="карусель" aria-label="Направления участия">
    <div className="circular-gallery__viewport" tabIndex={0} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onWheel={onWheel}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") { event.preventDefault(); select(active + 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); select(active - 1); }
      }}>
      <div className="circular-gallery__orbit" style={{ "--active": active } as CSSProperties}>
        {paths.map((item, index) => {
          const relative = ((index - active + paths.length + 2) % paths.length) - 2;
          return <button key={item.title} type="button" className={`circular-gallery__item ${index === active ? "is-active" : ""}`}
            style={{ "--offset": relative } as CSSProperties} aria-label={`Выбрать: ${item.title}`} aria-current={index === active} onClick={() => select(index)}>
            <span>{item.eyebrow}</span><strong>{item.title}</strong>
          </button>;
        })}
      </div>
    </div>
    <ReflectiveCard className="path-card" label={paths[active].title}>
      <p className="nexus-kicker">{paths[active].eyebrow}</p>
      <h3>{paths[active].title}</h3>
      <p>{paths[active].body}</p>
      <div className="path-card__line" />
      <small>{paths[active].note}</small>
    </ReflectiveCard>
    <div className="circular-gallery__controls">
      <button type="button" onClick={() => select(active - 1)} aria-label="Предыдущее направление">←</button>
      <span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(paths.length).padStart(2, "0")}</span>
      <button type="button" onClick={() => select(active + 1)} aria-label="Следующее направление">→</button>
    </div>
  </div>;
}

function NexusNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("kg-hero");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { rootMargin: "-35% 0px -55%" });
    navigation.forEach(([, id]) => { const node = document.getElementById(id); if (node) observer.observe(node); });
    return () => { window.removeEventListener("scroll", onScroll); observer.disconnect(); };
  }, []);
  return <header className={`nexus-nav ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
    <a href="#kg-hero" className="nexus-nav__brand" onClick={() => setOpen(false)}>K<BrandStar />GAMI <span>/ THE NEXUS</span></a>
    <nav id="nexus-navigation" aria-label="Основная навигация">
      {navigation.map(([label, id]) => <a key={id} href={`#${id}`} className={active === id ? "is-active" : ""} onClick={() => setOpen(false)}>{label}</a>)}
    </nav>
    <a className="nexus-button nexus-button--small" href={discordInvite} target="_blank" rel="noreferrer">Вступить <span>↗</span></a>
    <button className="nexus-nav__toggle" type="button" aria-expanded={open} aria-controls="nexus-navigation" aria-label={open ? "Закрыть меню" : "Открыть меню"} onClick={() => setOpen(!open)}><i /><i /></button>
  </header>;
}

export default function KagamiPage() {
  const { prefersReducedMotion } = useMotionSettings();
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (prefersReducedMotion) return;
    const node = heroRef.current;
    if (!node) return;
    const move = (event: globalThis.PointerEvent) => {
      const x = event.clientX / window.innerWidth - 0.5;
      const y = event.clientY / window.innerHeight - 0.5;
      node.style.setProperty("--hero-x", `${x}`); node.style.setProperty("--hero-y", `${y}`);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [prefersReducedMotion]);

  return <div className="nexus-page">
    <NexusNav />
    <main>
      <section className="nexus-hero" id="kg-hero" ref={heroRef}>
        <div className="nexus-hero__bg" style={{ backgroundImage: `url(${heroBg})` }} aria-hidden="true" />
        <div className="nexus-hero__grid" aria-hidden="true" /><div className="nexus-hero__stars" aria-hidden="true" />
        <div className="nexus-hero__shade" aria-hidden="true" />
        <m.div className="nexus-hero__content" initial={prefersReducedMotion ? false : "hidden"} animate="visible" variants={{ visible: { transition: { staggerChildren: .11 } } }}>
          <m.p variants={reveal} transition={{ duration: .7 }} className="nexus-kicker">DIGITAL HEADQUARTERS · GTA 5 RP</m.p>
          <m.h1 variants={reveal} transition={{ duration: .8 }} className="nexus-hero__wordmark"><span>K</span><BrandStar className="nexus-star--hero" /><span>GAMI</span></m.h1>
          <m.p variants={reveal} transition={{ duration: .7 }} className="nexus-hero__motto">СИЛА · ЕДИНСТВО · АМБИЦИИ</m.p>
          <m.div variants={reveal} transition={{ duration: .7 }} className="nexus-hero__statement">Не просто команда.<br /><em>Своя история.</em></m.div>
          <m.p variants={reveal} transition={{ duration: .7 }} className="nexus-hero__copy">Организация для активных и целеустремлённых игроков, готовых развиваться, зарабатывать и двигаться вперёд вместе.</m.p>
          <m.div variants={reveal} transition={{ duration: .7 }} className="nexus-hero__actions"><a className="nexus-button" href="#kg-philosophy">Открыть Nexus</a><a className="nexus-link" href={discordInvite} target="_blank" rel="noreferrer">Discord ↗</a></m.div>
        </m.div>
        <a href="#kg-philosophy" className="nexus-scroll"><span>SCROLL TO ENTER</span><i /></a>
      </section>

      <section className="nexus-section nexus-philosophy" id="kg-philosophy">
        <div className="nexus-section__index">01 / МАНИФЕСТ</div>
        <m.div className="nexus-philosophy__intro" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .25 }} variants={reveal} transition={{ duration: .7 }}>
          <p className="nexus-kicker">ОБЩАЯ СИСТЕМА КООРДИНАТ</p><h2>Мы строим не тег.<br /><span>Мы строим среду.</span></h2>
        </m.div>
        <div className="nexus-philosophy__story">
          <p className="nexus-philosophy__lead">K✦GAMI объединяет людей вокруг дисциплины, уважения и общей цели.</p>
          <ol>
            <li><span>01</span><div><h3>Единство</h3><p>Каждый участник — часть команды. Сильная организация начинается с доверия и взаимной поддержки.</p></div></li>
            <li><span>02</span><div><h3>Развитие</h3><p>Мы растём вместе, делимся опытом и помогаем друг другу двигаться дальше.</p></div></li>
            <li><span>03</span><div><h3>Амбиции</h3><p>Общий вектор — движение вперёд без пустых обещаний и выдуманных достижений.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="nexus-section nexus-information" id="kg-information">
        <div className="nexus-section__index">02 / ИНФОРМАЦИЯ</div>
        <header className="nexus-section__header"><p className="nexus-kicker">ВЫБЕРИ СВОЙ ВЕКТОР</p><h2>Один Nexus.<br />Разные способы участия.</h2><p>Прокрути, перетащи или используй стрелки клавиатуры, чтобы познакомиться с направлениями.</p></header>
        <DepthCarousel />
      </section>

      <section className="nexus-section nexus-leadership" id="kg-leadership">
        <div className="nexus-section__index">03 / РУКОВОДСТВО</div>
        <header className="nexus-section__header"><p className="nexus-kicker">ДВА ХАРАКТЕРА · ОДИН ЗНАК</p><h2>Центр управления<br />K✦GAMI.</h2></header>
        <div className="nexus-leadership__duo">
          <ReflectiveCard className="leader-profile leader-profile--metsuki" label="Metsuki Kagami — основатель">
            <img src={metsukiImg} alt="Metsuki Kagami" loading="lazy" /><div className="leader-profile__scrim" /><div className="leader-profile__copy"><span>FOUNDER / 01</span><h3>Metsuki<br />Kagami</h3><p>Основатель организации</p></div>
          </ReflectiveCard>
          <div className="nexus-leadership__sigil"><BrandStar /><span>UNITY<br />PROTOCOL</span></div>
          <ReflectiveCard className="leader-profile leader-profile--mika" label="Mika Kagami — соосновательница">
            <img src={mikaImg} alt="Mika Kagami" loading="lazy" /><div className="leader-profile__scrim" /><div className="leader-profile__copy"><span>CO-FOUNDER / 02</span><h3>Mika<br />Kagami</h3><p>Соосновательница организации</p></div>
          </ReflectiveCard>
        </div>
      </section>

      <section className="nexus-section nexus-protocol">
        <div className="nexus-section__index">04 / ПРОТОКОЛ</div>
        <div className="nexus-protocol__copy"><p className="nexus-kicker">ПЕРЕД ВСТУПЛЕНИЕМ</p><h2>Ясные ожидания.<br />Честный старт.</h2><p>Организация ждёт активных и целеустремлённых игроков, готовых общаться, участвовать в общей жизни и уважать команду.</p></div>
        <dl><div><dt>01</dt><dd><strong>Активность</strong><span>Участие в делах организации, а не только присутствие в списке.</span></dd></div><div><dt>02</dt><dd><strong>Уважение</strong><span>Здоровое общение и ответственность за свои действия.</span></dd></div><div><dt>03</dt><dd><strong>Командность</strong><span>Готовность действовать сообща и помогать другим.</span></dd></div></dl>
      </section>

      <section className="nexus-join" id="kg-contact">
        <div className="nexus-join__halo" aria-hidden="true"><BrandStar /></div>
        <p className="nexus-kicker">КАНАЛ СВЯЗИ ОТКРЫТ</p><h2>Твоя глава<br /><em>начинается здесь.</em></h2>
        <p>Заявка подаётся через официальный Discord K✦GAMI. Там же можно уточнить актуальные требования и пройти собеседование.</p>
        <a className="nexus-button nexus-button--large" href={discordInvite} target="_blank" rel="noreferrer">Перейти в Discord <span>↗</span></a>
      </section>
    </main>
    <footer className="nexus-footer"><a href="#kg-hero">K<BrandStar />GAMI</a><p>СИЛА · ЕДИНСТВО · АМБИЦИИ</p><span>© {new Date().getFullYear()} K✦GAMI</span></footer>
  </div>;
}
