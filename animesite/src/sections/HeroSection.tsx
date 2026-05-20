import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import animeLogo from "../../anime.mp4";
import introVideo from "../../intro.mp4";
import { PrimaryButton } from "../components/PrimaryButton";
import { UiIcon } from "../components/UiIcon";
import {
  channelGroups,
  heroSideChips,
  highlightCards,
  roleGroups,
  siteMeta,
  socialLinks,
  voiceGroups
} from "../data/siteContent";
import { useMotionSettings } from "../hooks/useMotionSettings";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }
};

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 9.75v4.5h3.15L12 18.45V5.55L7.15 9.75H4Z" fill="currentColor" />
      {muted ? (
        <>
          <path d="m16.1 9.1 4.8 4.8M20.9 9.1l-4.8 4.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M15.1 8.15a5.25 5.25 0 0 1 0 7.7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" fill="none" />
          <path d="M17.75 5.85a8.55 8.55 0 0 1 0 12.3" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" fill="none" opacity="0.72" />
        </>
      )}
    </svg>
  );
}

function StaggerGroup({
  children,
  className,
  once = true,
  amount = 0.25,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  once?: boolean;
  amount?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06, delayChildren: delay } } }}
    >
      {children}
    </motion.div>
  );
}

export default function HeroSection() {
  const { prefersReducedMotion } = useMotionSettings();
  const logoVideoRef = useRef<HTMLVideoElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const videos = [logoVideoRef.current, videoRef.current].filter(Boolean) as HTMLVideoElement[];

    for (const video of videos) {
      video.muted = isMuted;
      video.defaultMuted = isMuted;
      void video.play().catch(() => {});
    }
  }, [isMuted]);

  useEffect(() => {
    const retryPlayback = () => {
      if (document.hidden) return;

      for (const video of [logoVideoRef.current, videoRef.current]) {
        if (!video) continue;
        video.muted = isMuted;
        void video.play().catch(() => {});
      }
    };

    document.addEventListener("visibilitychange", retryPlayback);
    window.addEventListener("pageshow", retryPlayback);

    return () => {
      document.removeEventListener("visibilitychange", retryPlayback);
      window.removeEventListener("pageshow", retryPlayback);
    };
  }, [isMuted]);

  const toggleMute = () => setIsMuted((c) => !c);

  const heroInsights = [
    { value: channelGroups.reduce((acc, g) => acc + g.channels.length, 0), label: "structured channels" },
    { value: voiceGroups.length, label: "voice room formats" },
    { value: roleGroups.length, label: "self-role groups" }
  ];

  const MI = prefersReducedMotion ? {} : { variants: itemVariants };

  return (
    <section className="hero-section" id="overview">
      <div className="page-container hero-section__layout">

        {/* RIGHT: copy column */}
        <div className="hero-section__copy">

          {/* Group 1 — title block, once */}
          <StaggerGroup className="hero-copy-group" once={true} amount={0.3}>
            <motion.p className="hero-section__eyebrow" {...MI}>{siteMeta.heroEyebrow}</motion.p>
            <motion.h1 {...MI}>{siteMeta.heroTitle}</motion.h1>
            <motion.p className="hero-section__description" {...MI}>{siteMeta.heroDescription}</motion.p>
          </StaggerGroup>

          {/* Group 2 — chips */}
          {!prefersReducedMotion ? (
            <StaggerGroup className="hero-section__chips" amount={0.3}>
              {heroSideChips.map((chip) => (
                <motion.span key={chip} className="ornament-chip" variants={itemVariants}>{chip}</motion.span>
              ))}
            </StaggerGroup>
          ) : (
            <div className="hero-section__chips">
              {heroSideChips.map((chip) => <span key={chip} className="ornament-chip">{chip}</span>)}
            </div>
          )}

          {/* Group 3 — highlight cards */}
          {!prefersReducedMotion ? (
            <StaggerGroup className="hero-highlight-cards" amount={0.2}>
              {highlightCards.map((card) => (
                <motion.div key={card.title} className="hero-highlight-card" variants={itemVariants}>
                  <span className="hero-highlight-card__icon">
                    <UiIcon name={card.icon} />
                  </span>
                  <div>
                    <strong>{card.title}</strong>
                    <p>{card.text}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerGroup>
          ) : (
            <div className="hero-highlight-cards">
              {highlightCards.map((card) => (
                <div key={card.title} className="hero-highlight-card">
                  <span className="hero-highlight-card__icon">
                    <UiIcon name={card.icon} />
                  </span>
                  <div>
                    <strong>{card.title}</strong>
                    <p>{card.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Group 4 — insights */}
          {!prefersReducedMotion ? (
            <StaggerGroup className="hero-section__insights" amount={0.2} aria-label="Server highlights">
              {heroInsights.map((item) => (
                <motion.div key={item.label} className="hero-insight-card" variants={itemVariants}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </StaggerGroup>
          ) : (
            <div className="hero-section__insights" aria-label="Server highlights">
              {heroInsights.map((item) => (
                <div key={item.label} className="hero-insight-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Group 5 — subnote + actions, once */}
          <StaggerGroup className="hero-copy-group hero-copy-group--footer" once={true} amount={0.3}>
            <motion.p className="hero-section__subnote" {...MI}>
              Структура стала чище, вход понятнее, а фон наконец ощущается живым.
            </motion.p>
            <motion.div className="hero-section__actions" {...MI}>
              <PrimaryButton href={socialLinks.discord} target="_blank" rel="noreferrer" icon={<UiIcon name="discord" />}>
                Перейти в Discord
              </PrimaryButton>
              <PrimaryButton href="#channels" variant="secondary" icon={<UiIcon name="grid" />}>
                Смотреть каналы
              </PrimaryButton>
            </motion.div>
          </StaggerGroup>

        </div>

        {/* LEFT: visual card */}
        <motion.aside
          className="hero-visuals"
          {...(!prefersReducedMotion
            ? { initial: { opacity: 0, x: -16 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, amount: 0.1 }, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }
            : {})}
        >
          <article className="hero-card hero-card--feature">
            <div className="window-chrome" aria-hidden="true">
              <span /><span /><span />
            </div>

            <div className="hero-card__content">
              <div className="hero-card__header">
                <div>
                  <p className="hero-card__eyebrow">Атмосфера</p>
                  <h2>{siteMeta.brandName}</h2>
                </div>
              </div>

              <div className="hero-side-layout">
                <div className="portrait-card portrait-card--compact">
                  <video
                    ref={logoVideoRef}
                    src={animeLogo}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    preload="auto"
                    className="portrait-card__image"
                    style={{ display: "block" }}
                    onLoadedData={(event) => {
                      event.currentTarget.muted = isMuted;
                      void event.currentTarget.play().catch(() => {});
                    }}
                  />
                </div>
                <div className="hero-side-copy">
                  <h3>{siteMeta.heroSideTitle}</h3>
                  <p>{siteMeta.heroSideText}</p>
                </div>
              </div>

              <div className="hero-feature__divider" aria-hidden="true" />

              <div className="hero-feature__video-head">
                <div>
                  <p className="hero-card__eyebrow">Видео</p>
                  <h3>Превью сервера</h3>
                </div>
                <button
                  type="button"
                  className="video-sound-toggle"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Enable sound" : "Mute sound"}
                  title={isMuted ? "Enable sound" : "Mute sound"}
                >
                  <SoundIcon muted={isMuted} />
                </button>
              </div>

              <div className="hero-feature__media-card">
                <div className="window-chrome window-chrome--inner" aria-hidden="true">
                  <span /><span /><span />
                </div>
                <div className="hero-feature__media-inner">
                  <div className="video-frame video-frame--portrait">
                    <video
                      ref={videoRef}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      preload="auto"
                      onLoadedData={(event) => {
                        event.currentTarget.muted = isMuted;
                        void event.currentTarget.play().catch(() => {});
                      }}
                    >
                      <source src={introVideo} type="video/mp4" />
                    </video>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </motion.aside>

      </div>
    </section>
  );
}
