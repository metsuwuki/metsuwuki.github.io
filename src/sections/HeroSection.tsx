import { motion } from "framer-motion";
import portraitImage from "../../metsuki.jpg";
import userIcon from "../assets/icons/user.svg";
import { UiIcon } from "../components/UiIcon";
import { socialLinks } from "../data/siteContent";
import { useDiscordPresence } from "../hooks/useDiscordPresence";
import { usePageViews } from "../hooks/usePageViews";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageLocale } from "../i18n/pageLocale";

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function HeroSection() {
  const { locale, content } = usePageLocale();
  const { siteMeta, techGroups } = content;
  const { prefersReducedMotion } = useMotionSettings();
  const presence = useDiscordPresence(siteMeta.discordPresenceId, locale);
  const titleParts = siteMeta.heroTitle.split("UwU");
  const statusLabel = presence.label;
  const statusState = presence.state;
  const { count: uniqueVisitors, loading: statsLoading } = usePageViews();
  const profileAccent = { "--profile-accent": presence.accentColor } as React.CSSProperties;

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } }
        }
      };

  return (
    <section className="hero-section hero-section--minimal" id="overview">
      <div className="page-container hero-section__layout hero-section__layout--minimal">
        <motion.aside
          className="hero-visuals hero-visuals--minimal"
          {...(!prefersReducedMotion
            ? {
                initial: { opacity: 0, x: -30 },
                animate: { opacity: 1, x: 0 },
                whileInView: { opacity: 1, x: 0 },
                viewport: { once: true, amount: 0.2 },
                transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
              }
            : {})}
        >
          <article className="hero-card hero-card--portrait">
            <div className="window-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>

            <div className="hero-card__content">
              <div className="hero-portrait-frame">
                <div className="hero-card__orb hero-card__orb--one" aria-hidden="true" />
                <div className="hero-card__orb hero-card__orb--two" aria-hidden="true" />
                <img src={portraitImage} alt={siteMeta.portraitAlt} className="hero-portrait-frame__image" />
                <div className="hero-portrait-frame__glow" aria-hidden="true" />
                <div className={`hero-mini-status hero-mini-status--${statusState}`}>
                  <span className="hero-mini-status__dot" aria-hidden="true" />
                  {statusLabel}
                </div>
              </div>

              <div className="hero-profile-bar" style={profileAccent}>
                <article className="hero-visitor-stat" aria-live="polite">
                  <div className="hero-visitor-stat__icon">
                    <img src={userIcon} alt="" className="hero-visitor-stat__icon-svg" aria-hidden="true" />
                  </div>
                  <div className="hero-visitor-stat__body">
                    <p className="hero-visitor-stat__title">{siteMeta.uniqueVisitorsLabel}</p>
                    <strong className="hero-visitor-stat__value">
                      {statsLoading ? "..." : Intl.NumberFormat(siteMeta.guestbookDateLocale).format(uniqueVisitors ?? 0)}
                    </strong>
                  </div>
                </article>

                <a
                  href={socialLinks.discordProfile}
                  target="_blank"
                  rel="noreferrer"
                  className="button button--ghost hero-contact-button"
                >
                  <UiIcon name="discord" className="button__leading-icon" />
                  <span>{siteMeta.writeLabel}</span>
                </a>
              </div>
            </div>
          </article>
        </motion.aside>

        <motion.div className="hero-section__copy hero-section__copy--minimal" {...revealProps}>
          <motion.h1 variants={itemVariants}>
            {titleParts[0]}
            <span className="hero-title__accent">UwU</span>
            {titleParts[1]}
          </motion.h1>
          <motion.p className="hero-role" variants={itemVariants}>
            {siteMeta.heroRole}
          </motion.p>
          <motion.p className="hero-section__description" variants={itemVariants}>
            {siteMeta.heroDescription}
          </motion.p>

          <motion.div className="tech-groups" variants={itemVariants}>
            {techGroups.map((group) => (
              <section key={group.title} className="tech-group">
                <p className="tech-group__title">{group.title}</p>
                <div className="tech-group__items">
                  {group.items.map((item) => (
                    <span key={item.label} className={`tech-pill tech-pill--${item.tone}`} aria-label={item.label}>
                      <span className="tech-pill__icon" aria-hidden="true">
                        <img src={item.icon} alt="" loading="lazy" />
                      </span>
                      <span className="tech-pill__label">{item.label}</span>
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
