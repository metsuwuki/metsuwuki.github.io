import { useCallback, useEffect, useRef, useState, type PointerEvent, type WheelEvent } from "react";
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

const creativeBrands = ["Figma", "Blender", "Photoshop", "Illustrator", "Cinema 4D", "3ds Max"] as const;

function CreativeBrandMark({ name }: { name: typeof creativeBrands[number] }) {
  if (name === "Figma") return <svg viewBox="0 0 40 40" aria-hidden="true" className="creative-brand-mark creative-brand-mark--figma"><circle cx="14" cy="8" r="6"/><circle cx="26" cy="8" r="6"/><circle cx="14" cy="20" r="6"/><circle cx="26" cy="20" r="6"/><circle cx="14" cy="32" r="6"/></svg>;
  if (name === "Blender") return <svg viewBox="0 0 40 40" aria-hidden="true" className="creative-brand-mark creative-brand-mark--blender"><path d="M5 18h18l-8-6m8 6-6-11"/><ellipse cx="24" cy="22" rx="11" ry="8"/><circle cx="24" cy="22" r="4"/></svg>;
  if (name === "Cinema 4D") return <span className="creative-brand-mark creative-brand-mark--cinema" aria-hidden="true"><i /></span>;
  return <span className={`creative-brand-mark creative-brand-mark--${name === "Photoshop" ? "photoshop" : name === "Illustrator" ? "illustrator" : "max"}`} aria-hidden="true">{name === "Photoshop" ? "Ps" : name === "Illustrator" ? "Ai" : "3ds"}</span>;
}

function getApplicationOffset(index: number, active: number, length: number) {
  let offset = (index - active + length) % length;
  if (offset > length / 2) offset -= length;
  return offset;
}

/**
 * Flat, layout-driven application carousel.
 * All cards share one grid cell, so the stage is exactly as tall as the
 * tallest card (no fixed heights, no clipped content). Only transform and
 * opacity are animated — no 3D, filters or blend modes — so the browser keeps
 * a few small compositor layers instead of large blurred ones.
 */
function ApplicationCarousel({ apps, siteMeta, openApp }: {
  apps: AppCard[];
  siteMeta: LocalizedSiteContent["siteMeta"];
  openApp: (app: AppCard) => void;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; id: number; moved: boolean } | null>(null);
  const lastWheel = useRef(0);
  const { prefersReducedMotion } = useMotionSettings();
  const select = useCallback((next: number) => setActive((next + apps.length) % apps.length), [apps.length]);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Autoplay only while the carousel is actually visible and not being interacted with.
  useEffect(() => {
    if (prefersReducedMotion || paused || !onScreen || apps.length < 2) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % apps.length), 7000);
    return () => window.clearInterval(timer);
  }, [apps.length, onScreen, paused, prefersReducedMotion]);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, id: event.pointerId, moved: false };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state || state.moved || Math.abs(event.clientX - state.x) < 12) return;
    // Capture only once a real swipe starts, so plain clicks still reach buttons and links.
    state.moved = true;
    event.currentTarget.setPointerCapture(state.id);
  };
  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    const delta = event.clientX - state.x;
    if (Math.abs(delta) > 40) select(active + (delta < 0 ? 1 : -1));
  };
  // Only horizontal wheel/trackpad gestures switch cards; vertical scrolling keeps scrolling the page.
  const onWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 20) return;
    const now = performance.now();
    if (now - lastWheel.current < 450) return;
    lastWheel.current = now;
    select(active + (event.deltaX > 0 ? 1 : -1));
  };

  return (
    <div ref={rootRef} className="applications-depth-carousel" id="applications-catalog" role="region" aria-roledescription="carousel" aria-label={siteMeta.appsTitle}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <div className="applications-depth-carousel__viewport" tabIndex={0}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}
        onPointerCancel={() => { drag.current = null; }} onWheel={onWheel}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === "ArrowRight") { event.preventDefault(); select(active + 1); }
          if (event.key === "ArrowLeft") { event.preventDefault(); select(active - 1); }
          if (event.key === "Home") { event.preventDefault(); select(0); }
          if (event.key === "End") { event.preventDefault(); select(apps.length - 1); }
        }}>
        {apps.map((app, index) => {
          const offset = getApplicationOffset(index, active, apps.length);
          const isActive = offset === 0;
          const actionable = Boolean(app.downloadHref ?? app.githubHref ?? app.websiteHref ?? app.buyHref);
          const previewAlt = `${siteMeta.appPreviewAltPrefix} ${app.title}`;
          return <div key={app.title} className={`applications-depth-carousel__item ${isActive ? "is-active" : ""}`}
            data-offset={Math.max(-2, Math.min(2, offset))} aria-hidden={!isActive}>
            <article className={`app-reflective-card app-card--${app.accent}`}
              ref={(node) => { if (node) node.inert = !isActive; }}>
              {actionable ? <button type="button" className="app-reflective-card__preview" onClick={() => openApp(app)} aria-label={`${app.title} ${siteMeta.appGithubLabel}`}>
                <img src={app.preview} alt={previewAlt} loading="lazy" decoding="async" width={1120} height={630} />
              </button> : <div className="app-reflective-card__preview app-reflective-card__preview--static">
                <img src={app.preview} alt={previewAlt} loading="lazy" decoding="async" width={1120} height={630} />
                <span className="app-reflective-card__coming-soon">COMING SOON</span>
              </div>}
              <div className="app-reflective-card__content">
                <div className="app-reflective-card__meta"><p className="app-card__eyebrow">{siteMeta.appCardEyebrow}</p>{app.version && <span>{app.version}</span>}</div>
                <div className="app-reflective-card__title"><img src={app.icon} alt="" width={38} height={38} /><h3>{app.title}</h3></div>
                <p className="app-reflective-card__subtitle">{app.subtitle}</p>
                <p className="app-reflective-card__text">{app.text}</p>
                <ul className="app-card__highlights">{app.highlights.map((item) => <li key={item} className="app-card__pill">{item}</li>)}</ul>
                <div className="app-reflective-card__footer">
                  <div className="app-card__tags">{app.tags.map((tag) => <span key={tag} className="app-card__tag">{tag}</span>)}</div>
                  {app.buyHref ? <GlassActionButton href={app.buyHref} label={app.buyLabel ?? "Buy"} processingLabel={siteMeta.appBuyProcessingLabel} variant="buy" />
                    : app.downloadHref ? <GlassActionButton href={app.downloadHref} label={siteMeta.appDownloadLabel} processingLabel={siteMeta.appDownloadProcessingLabel} variant="download" /> : null}
                </div>
              </div>
            </article>
            {!isActive && <button type="button" className="applications-depth-carousel__peek" tabIndex={-1}
              aria-label={app.title} onClick={() => select(index)} />}
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
  // scrolled well out of view — pause it via IntersectionObserver instead
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
              {profileId === "mika" ? creativeBrands.map((name) => (
                <li className="logo-marquee__item logo-marquee__item--creative" data-logo={name} key={name} aria-label={name}>
                  <CreativeBrandMark name={name} />
                </li>
              )) : languageLogos.map((logo) => (
                <li className="logo-marquee__item" data-logo={logo.name} key={logo.name}><img src={logo.icon} alt="" loading="lazy" /></li>
              ))}
            </ul>
            <ul className="logo-marquee__group" aria-hidden="true">
              {profileId === "mika" ? creativeBrands.map((name) => (
                <li className="logo-marquee__item logo-marquee__item--creative" data-logo={name} key={`${name}-duplicate`}>
                  <CreativeBrandMark name={name} />
                </li>
              )) : languageLogos.map((logo) => (
                <li className="logo-marquee__item" data-logo={logo.name} key={`${logo.name}-duplicate`}><img src={logo.icon} alt="" loading="lazy" /></li>
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

        <ApplicationCarousel apps={appCards} siteMeta={siteMeta} openApp={openApp} />

      </div>
    </section>
  );
}
