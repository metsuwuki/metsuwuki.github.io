import { motion } from "framer-motion";
import { TypewriterText } from "../components/TypewriterText";
import type { Variants } from "framer-motion";
import { UiIcon } from "../components/UiIcon";
import { VisitorsTrendChart } from "../components/VisitorsTrendChart";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageViews } from "../hooks/usePageViews";
import { usePageLocale } from "../i18n/pageLocale";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.46, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function HeroSection() {
  const { content } = usePageLocale();
  const { siteMeta } = content;
  const { prefersReducedMotion } = useMotionSettings();
  const { count: uniqueVisitors, monthlySeries, loading: statsLoading } = usePageViews();
  const titleParts = siteMeta.heroTitle.split("UwU");
  const isRussian = siteMeta.guestbookDateLocale === "ru-RU";
  const typedDescription = isRussian
    ? {
        prefix: "Создаю современные приложения с ",
        phrases: [
          "красивыми интерфейсами.",
          "масштабируемой архитектурой.",
          "высокой производительностью.",
          "продуманным UX.",
        ],
      }
    : {
        prefix: "Building modern applications with ",
        phrases: [
          "beautiful interfaces.",
          "scalable architectures.",
          "high performance.",
          "clean user experiences.",
        ],
      };

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        },
      };

  return (
    <section className="hero-section hero-section--reference" id="overview">
      <div className="hero-scroll-hint" aria-hidden="true"><span /></div>
      <div className="page-container hero-reference-grid">
        <motion.div className="hero-reference-copy" {...revealProps}>
          <motion.p className="hero-eyebrow" custom={0} variants={itemVariants}>
            {siteMeta.heroEyebrow}
          </motion.p>

          <motion.h1 custom={1} variants={itemVariants}>
            {titleParts[0]}
            <span className="hero-title__accent">UwU</span>
            {titleParts[1]}
          </motion.h1>

          <motion.p className="hero-role" custom={2} variants={itemVariants}>
            {siteMeta.heroRole}
            <UiIcon name="terminal" className="hero-role__icon" />
          </motion.p>

          <motion.p className="hero-section__description hero-section__description--typed" custom={3} variants={itemVariants}>
            <TypewriterText
              className="typewriter-text"
              phrases={typedDescription.phrases}
              prefix={typedDescription.prefix}
              reducedMotion={prefersReducedMotion}
            />
          </motion.p>
        </motion.div>

        <motion.aside
          className="hero-reference-rail hero-reference-rail--visitors"
          {...(!prefersReducedMotion
            ? {
                initial: { opacity: 0, x: 24 },
                animate: { opacity: 1, x: 0 },
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              }
            : {})}
        >
          <section className="hero-visitors-card" aria-live="polite">
            <div className="hero-visitors-card__copy">
              <p>{siteMeta.uniqueVisitorsLabel}</p>
              <span>{siteMeta.uniqueVisitorsDescription}</span>
              <strong>{statsLoading ? "..." : Intl.NumberFormat(siteMeta.guestbookDateLocale).format(uniqueVisitors ?? 0)}</strong>
              <em>{siteMeta.guestbookDateLocale === "ru-RU" ? "Аналитика за 30 дней" : "30-day analytics"}</em>
            </div>
            <div className="hero-visitors-card__visual">
              <VisitorsTrendChart points={monthlySeries} />
            </div>
          </section>
        </motion.aside>
      </div>
    </section>
  );
}

