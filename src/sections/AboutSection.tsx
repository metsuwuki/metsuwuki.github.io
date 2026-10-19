import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type WheelEvent } from "react";
import { m } from "framer-motion";
import { GlassActionButton } from "../components/GlassActionButton";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageLocale } from "../i18n/pageLocale";
import { getRevealProps } from "../utils/motion";

import cIcon from "../assets/icons/c.svg";
import cppIcon from "../assets/icons/cpp.svg";
import csIcon from "../assets/icons/cs.svg";
import cssIcon from "../assets/icons/css.svg";
import goIcon from "../assets/icons/go.svg";
import htmlIcon from "../assets/icons/html.svg";
import javaIcon from "../assets/icons/java.svg";
import jsIcon from "../assets/icons/js.svg";
import kotlinIcon from "../assets/icons/kotlin.svg";
import luaIcon from "../assets/icons/lua.svg";
import pyIcon from "../assets/icons/py.svg";
import reactIcon from "../assets/icons/react.svg";
import rustIcon from "../assets/icons/rust.svg";
import scssIcon from "../assets/icons/scss.svg";
import tsIcon from "../assets/icons/ts.svg";
import type { AppCard } from "../data/siteContent";
import type { LocalizedSiteContent } from "../data/siteContent";

const languageLogos = [
  { name: "TypeScript", icon: tsIcon },
  { name: "JavaScript", icon: jsIcon },
  { name: "React", icon: reactIcon },
  { name: "HTML", icon: htmlIcon },
  { name: "CSS", icon: cssIcon },
  { name: "SCSS", icon: scssIcon },
  { name: "Python", icon: pyIcon },
  { name: "Rust", icon: rustIcon },
  { name: "Go", icon: goIcon },
  { name: "Java", icon: javaIcon },
  { name: "C++", icon: cppIcon },
  { name: "C#", icon: csIcon },
  { name: "Lua", icon: luaIcon },
  { name: "Kotlin", icon: kotlinIcon },
  { name: "C", icon: cIcon },
];

const creativeDirections = [
  { name: "3D Spaces", symbol: "◇" },
  { name: "Interiors", symbol: "⌂" },
  { name: "Visual Design", symbol: "✦" },
  { name: "Composition", symbol: "◫" },
  { name: "Materials", symbol: "◈" },
  { name: "Light", symbol: "☼" },
  { name: "Ideas", symbol: "∞" },
];

function getApplicationDepthOffset(index: number, active: number, length: number) {
  let offset = (index - active + length) % length;
  if (offset > length / 2) offset -= length;
  return offset;
}

function ApplicationDepthCarousel({ apps, siteMeta, openApp }: {
  apps: AppCard[];
  siteMeta: LocalizedSiteContent["siteMeta"];
  openApp: (app: AppCard) => void;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number; index: number } | null>(null);
  const lastWheel = useRef(0);
  const { prefersReducedMotion } = useMotionSettings();
  const select = useCallback((next: number) => setActive((next + apps.length) % apps.length), [apps.length]);

  useEffect(() => {
    if (prefersReducedMotion || paused || apps.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % apps.length), 7000);
    return () => window.clearInterval(timer);
  }, [apps.length, paused, prefersReducedMotion]);

  const tilt = (event: PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion) return;
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    card.style.setProperty("--app-rx", `${(0.5 - y) * 5}deg`);
    card.style.setProperty("--app-ry", `${(x - 0.5) * 7}deg`);
    card.style.setProperty("--app-mx", `${x * 100}%`);
    card.style.setProperty("--app-my", `${y * 100}%`);
  };
  const resetTilt = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty("--app-rx", "0deg");
    event.currentTarget.style.setProperty("--app-ry", "0deg");
  };

  return (
    <div className="applications-depth-carousel" id="applications-catalog" role="region" aria-roledescription="carousel" aria-label={siteMeta.appsTitle}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <div className="applications-depth-carousel__viewport" tabIndex={0}
        onPointerDown={(event) => { drag.current = { x: event.clientX, index: active }; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerUp={(event) => { if (!drag.current) return; const delta = event.clientX - drag.current.x; if (Math.abs(delta) > 40) select(drag.current.index + (delta < 0 ? 1 : -1)); drag.current = null; }}
        onWheel={(event) => { if (Math.abs(event.deltaX) + Math.abs(event.deltaY) < 12) return; const now = performance.now(); if (now - lastWheel.current < 420) return; lastWheel.current = now; select(active + (event.deltaX + event.deltaY > 0 ? 1 : -1)); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); select(active + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); select(active - 1); }
          if (event.key === "Home") { event.preventDefault(); select(0); }
          if (event.key === "End") { event.preventDefault(); select(apps.length - 1); }
        }}>
        {apps.map((app, index) => {
          const offset = getApplicationDepthOffset(index, active, apps.length);
          const distance = Math.abs(offset);
          const actionable = Boolean(app.downloadHref ?? app.githubHref ?? app.websiteHref ?? app.buyHref);
          return <div key={app.title} className={`applications-depth-carousel__item ${index === active ? "is-active" : ""}`}
            style={{ "--app-depth-offset": offset, "--app-depth-distance": distance, zIndex: apps.length - distance } as CSSProperties}
            aria-hidden={index !== active} onClick={() => select(index)}>
            <article className={`app-reflective-card app-card--${app.accent}`} onPointerMove={tilt} onPointerLeave={resetTilt}>
              <div className="app-reflective-card__shine" aria-hidden="true" />
              {actionable ? <button type="button" className="app-reflective-card__preview" onClick={() => openApp(app)} aria-label={`${app.title} ${siteMeta.appGithubLabel}`}>
                <img src={app.preview} alt={`${siteMeta.appPreviewAltPrefix} ${app.title}`} loading="lazy" />
                <span className="window-chrome" aria-hidden="true"><i /><i /><i /></span>
              </button> : <div className="app-reflective-card__preview app-reflective-card__preview--static">
                <img src={app.preview} alt={`${siteMeta.appPreviewAltPrefix} ${app.title}`} loading="lazy" />
                <span className="window-chrome" aria-hidden="true"><i /><i /><i /></span>
                <span className="app-reflective-card__coming-soon">COMING SOON</span>
              </div>}
              <div className="app-reflective-card__content">
                <div className="app-reflective-card__meta"><p className="app-card__eyebrow">{siteMeta.appCardEyebrow}</p><span>{app.version}</span></div>
                <div className="app-reflective-card__title"><img src={app.icon} alt="" /><h3>{app.title}</h3></div>
                <p className="app-reflective-card__subtitle">{app.subtitle}</p>
                <p>{app.text}</p>
                <div className="app-card__highlights">{app.highlights.map((item) => <span key={item} className="app-card__pill">{item}</span>)}</div>
                <div className="app-reflective-card__footer">
                  <div className="app-card__tags">{app.tags.map((tag) => <span key={tag} className="app-card__tag">{tag}</span>)}</div>
                  {app.buyHref ? <GlassActionButton href={app.buyHref} label={app.buyLabel ?? "Buy"} processingLabel={siteMeta.appBuyProcessingLabel} variant="buy" />
                    : app.downloadHref ? <GlassActionButton href={app.downloadHref} label={siteMeta.appDownloadLabel} processingLabel={siteMeta.appDownloadProcessingLabel} variant="download" /> : null}
                </div>
              </div>
            </article>
          </div>;
        })}
      </div>
      <div className="applications-depth-carousel__controls">
        <button type="button" onClick={() => select(active - 1)} aria-label="Previous application">←</button>
        <span aria-live="polite">{String(active + 1).padStart(2, "0")} / {String(apps.length).padStart(2, "0")}</span>
        <button type="button" onClick={() => select(active + 1)} aria-label="Next application">→</button>
      </div>
    </div>
  );
}

export function ApplicationCircularGallery({ apps, siteMeta, openApp }: {
  apps: AppCard[];
  siteMeta: LocalizedSiteContent["siteMeta"];
  openApp: (app: AppCard) => void;
}) {
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; index: number } | null>(null);
  const select = useCallback((next: number) => setActive((next + apps.length) % apps.length), [apps.length]);
  const app = apps[active];
  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { x: event.clientX, index: active };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const delta = event.clientX - drag.current.x;
    if (Math.abs(delta) > 36) select(drag.current.index + (delta < 0 ? 1 : -1));
    drag.current = null;
  };
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) + Math.abs(event.deltaY) > 12) select(active + (event.deltaX + event.deltaY > 0 ? 1 : -1));
  };

  return (
    <div className="applications-circular-gallery" id="applications-catalog" role="region" aria-roledescription="carousel" aria-label={siteMeta.appsTitle}>
      <div className="applications-circular-gallery__selector" tabIndex={0} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onWheel={onWheel}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") { event.preventDefault(); select(active + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); select(active - 1); }
        }}>
        <div className="applications-circular-gallery__ring">
          {apps.map((item, index) => {
            const offset = index - active;
            return (
              <button key={item.title} type="button" className={index === active ? "is-active" : ""}
                style={{ "--app-offset": offset } as CSSProperties} aria-current={index === active} onClick={() => select(index)}>
                <img src={item.icon} alt="" /><span>{item.title}</span><small>{item.version}</small>
              </button>
            );
          })}
        </div>
        <div className="applications-circular-gallery__nav">
          <button type="button" onClick={() => select(active - 1)} aria-label="Previous application">Ã¢â€ Â</button>
          <span>{String(active + 1).padStart(2, "0")} / {String(apps.length).padStart(2, "0")}</span>
          <button type="button" onClick={() => select(active + 1)} aria-label="Next application">Ã¢â€ â€™</button>
        </div>
      </div>

      <article className={`app-reflective-card app-card--${app.accent}`} aria-live="polite">
        <div className="app-reflective-card__shine" aria-hidden="true" />
        <button type="button" className="app-reflective-card__preview" onClick={() => openApp(app)} aria-label={`${app.title} ${siteMeta.appGithubLabel}`}>
          <img src={app.preview} alt={`${siteMeta.appPreviewAltPrefix} ${app.title}`} loading="lazy" />
          <span className="window-chrome" aria-hidden="true"><i /><i /><i /></span>
        </button>
        <div className="app-reflective-card__content">
          <p className="app-card__eyebrow">{siteMeta.appCardEyebrow} Ã‚Â· {app.version}</p>
          <div className="app-reflective-card__title"><img src={app.icon} alt="" /><h3>{app.title}</h3></div>
          <p>{app.text}</p>
          <div className="app-card__highlights">{app.highlights.map((item) => <span key={item} className="app-card__pill">{item}</span>)}</div>
          <div className="app-reflective-card__footer">
            <div className="app-card__tags">{app.tags.map((tag) => <span key={tag} className="app-card__tag">{tag}</span>)}</div>
            {app.buyHref ? <GlassActionButton href={app.buyHref} label={app.buyLabel ?? "Buy"} processingLabel={siteMeta.appBuyProcessingLabel} variant="buy" />
              : app.downloadHref ? <GlassActionButton href={app.downloadHref} label={siteMeta.appDownloadLabel} processingLabel={siteMeta.appDownloadProcessingLabel} variant="download" /> : null}
          </div>
        </div>
      </article>
    </div>
  );
}
export default function AboutSection() {
  const { content, profileId } = usePageLocale();
  const { appCards, featureCards, siteMeta } = content;
  const { prefersReducedMotion } = useMotionSettings();
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  function openApp(app: AppCard) {
    const target = app.downloadHref ?? app.githubHref ?? app.websiteHref ?? app.buyHref;
    if (target) window.open(target, "_blank", "noreferrer");
  }

  // The marquee's CSS animation otherwise keeps ticking forever, even while
  // scrolled well out of view Ã¢â‚¬â€ pause it via IntersectionObserver instead
  // (animation-timeline: view() doesn't fit here: it would turn the
  // time-driven infinite ticker into a scroll-position-scrubbed one).
  useEffect(() => {
    const el = marqueeRef.current;
    const track = el?.querySelector<HTMLElement>(".logo-marquee__track");
    if (!el || !track) return;

    const observer = new IntersectionObserver(([entry]) => {
      track.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="section-block section-block--airy" id="apps">
      <div className="page-container">
        <Reveal prefersReducedMotion={prefersReducedMotion}>
          <SectionHeading title={siteMeta.featureTitle} description={siteMeta.featureDescription} align="left" />
        </Reveal>

        <m.div className="logo-marquee" ref={marqueeRef} {...getRevealProps(prefersReducedMotion, 0.05)}>
          <div className="logo-marquee__track">
            <ul className="logo-marquee__group">
              {(profileId === "mika" ? creativeDirections : languageLogos).map((logo) => (
                <li className="logo-marquee__item" data-logo={logo.name} key={logo.name}>
                  {"icon" in logo ? <img src={logo.icon} alt="" loading="lazy" /> : <span className="logo-marquee__symbol" aria-hidden="true">{logo.symbol}</span>}
                </li>
              ))}
            </ul>
            <ul className="logo-marquee__group" aria-hidden="true">
              {(profileId === "mika" ? creativeDirections : languageLogos).map((logo) => (
                <li className="logo-marquee__item" data-logo={logo.name} key={`${logo.name}-duplicate`}>
                  {"icon" in logo ? <img src={logo.icon} alt="" loading="lazy" /> : <span className="logo-marquee__symbol" aria-hidden="true">{logo.symbol}</span>}
                </li>
              ))}
            </ul>
          </div>
        </m.div>

        <div className="destination-grid destination-grid--premium">
          {featureCards.map((card, index) => (
            <m.a
              key={card.title}
              {...getRevealProps(prefersReducedMotion, index * 0.06)}
              href={card.href}
              target={card.href?.startsWith("http") ? "_blank" : undefined}
              rel={card.href?.startsWith("http") ? "noreferrer" : undefined}
              className={`destination-card destination-card--${card.tone} ${card.href ? "" : "destination-card--static"}`}
            >
              <span className="destination-card__spin destination-card__spin--blur" aria-hidden="true" />
              <span className="destination-card__spin destination-card__spin--intense" aria-hidden="true" />
              <span className="destination-card__backdrop" aria-hidden="true" />
              <span className="destination-card__border" aria-hidden="true">
                <span className="destination-card__spin destination-card__spin--inside" aria-hidden="true" />
              </span>
              <span className="destination-card__surface">
                <img src={card.image} alt="" className="destination-card__image" loading="lazy" />
                <span className="destination-card__textbox">
                  <span className="destination-card__label">{card.title}</span>
                  <p>{card.text}</p>
                </span>
              </span>
            </m.a>
          ))}
        </div>

        <Reveal prefersReducedMotion={prefersReducedMotion}>
          <SectionHeading title={siteMeta.appsTitle} description={siteMeta.appsDescription} align="left" />
        </Reveal>

        <ApplicationDepthCarousel apps={appCards} siteMeta={siteMeta} openApp={openApp} />

      </div>
    </section>
  );
}
