import { useEffect, useRef } from "react";
import { m } from "framer-motion";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageLocale } from "../i18n/pageLocale";
import { getRevealProps } from "../utils/motion";

import cIcon from "../assets/icons/c.svg";
import cppIcon from "../assets/icons/cpp.svg";
import csIcon from "../assets/icons/cs.svg";
import cssIcon from "../assets/icons/css.svg";
import downloadIcon from "../assets/icons/download.svg";
import goIcon from "../assets/icons/go.svg";
import htmlIcon from "../assets/icons/html.svg";
import javaIcon from "../assets/icons/java.svg";
import jsIcon from "../assets/icons/js.svg";
import kotlinIcon from "../assets/icons/kotlin.svg";
import logIcon from "../assets/icons/log.svg";
import luaIcon from "../assets/icons/lua.svg";
import peIcon from "../assets/icons/pe.svg";
import pyIcon from "../assets/icons/py.svg";
import previewIcon from "../assets/icons/preview.svg";
import reactIcon from "../assets/icons/react.svg";
import rustIcon from "../assets/icons/rust.svg";
import scssIcon from "../assets/icons/scss.svg";
import shieldWarnIcon from "../assets/icons/shield_warn.svg";
import runtimeIcon from "../assets/icons/runtime.svg";
import importsIcon from "../assets/icons/imports.svg";
import folderScanIcon from "../assets/icons/forlder_scaning.svg";
import deleteIcon from "../assets/icons/delete.svg";
import fileIcon from "../assets/icons/file.svg";
import processIcon from "../assets/icons/process.svg";
import stressIcon from "../assets/icons/stress_scenario.svg";
import tsIcon from "../assets/icons/ts.svg";
import windowsIcon from "../assets/icons/windows.svg";
import type { AppCard } from "../data/siteContent";

const tagIcons: Record<string, string> = {
  Export: downloadIcon,
  Logs: logIcon,
  PE: peIcon,
  Preview: previewIcon,
  Quarantine: shieldWarnIcon,
  Runtime: runtimeIcon
};

const highlightIcons: Record<string, string> = {
  "entropy and imports": importsIcon,
  "folder scanning": folderScanIcon,
  "forced delete": deleteIcon,
  "html/json/markdown": fileIcon,
  "process terminate": processIcon,
  "stress scenarios": stressIcon
};

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

export default function AboutSection() {
  const { content } = usePageLocale();
  const { appCards, featureCards, siteMeta } = content;
  const { prefersReducedMotion } = useMotionSettings();
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  function openApp(app: AppCard) {
    const target = app.downloadHref ?? app.githubHref ?? app.websiteHref ?? app.buyHref;
    if (target) window.open(target, "_blank", "noreferrer");
  }

  // The marquee's CSS animation otherwise keeps ticking forever, even while
  // scrolled well out of view — pause it via IntersectionObserver instead
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
              {languageLogos.map((logo) => (
                <li className="logo-marquee__item" data-logo={logo.name} key={logo.name}>
                  <img src={logo.icon} alt="" loading="lazy" />
                </li>
              ))}
            </ul>
            <ul className="logo-marquee__group" aria-hidden="true">
              {languageLogos.map((logo) => (
                <li className="logo-marquee__item" data-logo={logo.name} key={`${logo.name}-duplicate`}>
                  <img src={logo.icon} alt="" loading="lazy" />
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
              <span className="destination-card__halo" aria-hidden="true" />
              <img src={card.image} alt="" className="destination-card__image" loading="lazy" />
              <span className="destination-card__label">{card.title}</span>
              <p>{card.text}</p>
              <span className="destination-card__meta" aria-hidden="true">
                <span>{card.href?.startsWith("http") ? "External" : "Section"}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
              </span>
            </m.a>
          ))}
        </div>

        <Reveal prefersReducedMotion={prefersReducedMotion}>
          <SectionHeading title={siteMeta.appsTitle} description={siteMeta.appsDescription} align="left" />
        </Reveal>

        <div className="app-showcase-grid" id="applications-catalog">
          {appCards.map((app, index) => (
            <m.article
              key={app.title}
              {...getRevealProps(prefersReducedMotion, index * 0.08)}
              className={`app-card app-card--${app.accent}`}
              role="link"
              tabIndex={0}
              aria-label={`${app.title} ${siteMeta.appGithubLabel}`}
              onClick={() => openApp(app)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openApp(app);
                }
              }}
            >
              <div className="app-card__inner">
                <div className="window-chrome app-card__chrome" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="app-card__preview">
                  <img src={app.preview} alt={`${siteMeta.appPreviewAltPrefix} ${app.title}`} loading="lazy" />
                  <div className="app-card__preview-shade" aria-hidden="true" />
                </div>

                <div className="app-card__body">
                <div className="app-card__top">
                  <div className="app-card__title-wrap">
                    <div className={`app-card__title-icon app-card__title-icon--${app.accent}`}>
                      <img src={app.icon} alt="" aria-hidden="true" />
                    </div>
                    <p className="app-card__eyebrow">{siteMeta.appCardEyebrow}</p>
                    <h3>{app.title}</h3>
                  </div>
                  {app.version ? (
                    <div className="app-card__meta-badges">
                      <span className="app-card__version">{app.version}</span>
                    </div>
                  ) : null}
                </div>

                <p className="app-card__text">{app.text}</p>

                <div className="app-card__highlights">
                  {app.highlights.map((item) => (
                    <span key={item} className="app-card__pill">
                      <span className="app-card__pill-icon" aria-hidden="true">
                        <img src={highlightIcons[item] ?? fileIcon} alt="" loading="lazy" />
                      </span>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="app-card__footer">
                  <div className="app-card__tags">
                    {app.tags.map((tag) => (
                      <span key={tag} className="app-card__tag">
                        <span className="app-card__pill-icon" aria-hidden="true">
                          <img src={tagIcons[tag] ?? fileIcon} alt="" loading="lazy" />
                        </span>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {app.buyHref ? (
                    <div className="app-card__actions">
                      <a
                        className={`button app-card__button app-card__button--${app.accent}`}
                        href={app.buyHref}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(event) => event.stopPropagation()}
                      >
                        {app.buyLabel ?? "Buy"}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
              <div className={`app-card__platform app-card__platform--${app.accent}`} aria-hidden="true">
                <span className="app-card__platform-rays" />
                <img src={windowsIcon} alt="" loading="lazy" />
              </div>
              </div>
            </m.article>
          ))}
        </div>
      </div>
    </section>
  );
}
