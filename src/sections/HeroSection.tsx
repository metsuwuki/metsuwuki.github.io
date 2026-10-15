import { m } from "framer-motion";
import type { Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { TypewriterText } from "../components/TypewriterText";
import { UiIcon } from "../components/UiIcon";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageViews } from "../hooks/usePageViews";
import { usePageLocale } from "../i18n/pageLocale";
import NebulaVisitorCounter from "../components/NebulaVisitorCounter";

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (index = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.46, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

function WarpBrandTitle({ text, reducedMotion }: { text: string; reducedMotion: boolean }) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const letterRefs = useRef<Array<HTMLSpanElement | null>>([]);

  useEffect(() => {
    if (reducedMotion) return;
    const root = rootRef.current;
    if (!root) return;
    const letters = letterRefs.current.filter((letter): letter is HTMLSpanElement => Boolean(letter));
    let frame = 0;
    const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5, active: 0 };
    const move = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointer.targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(rect.width, 1)));
      pointer.targetY = Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(rect.height, 1)));
      pointer.active = 1;
    };
    const leave = () => { pointer.active = 0; };
    const render = (time: number) => {
      pointer.x += ((pointer.active ? pointer.targetX : 0.5) - pointer.x) * 0.09;
      pointer.y += ((pointer.active ? pointer.targetY : 0.5) - pointer.y) * 0.09;
      letters.forEach((letter, index) => {
        const position = letters.length <= 1 ? 0.5 : index / (letters.length - 1);
        const distance = Math.abs(position - pointer.x);
        const influence = Math.max(0, 1 - distance / 0.31) * pointer.active;
        const idle = Math.sin(time * 0.0015 + index * 0.72) * 1.4;
        const bend = (pointer.y - 0.5) * -34 * influence;
        const wave = Math.sin((position - pointer.x) * Math.PI * 3) * 11 * influence;
        const scaleY = 1 + influence * 0.18;
        const rotate = (position - pointer.x) * influence * -13;
        letter.style.transform = `translate3d(0,${(idle + bend + wave).toFixed(2)}px,0) rotate(${rotate.toFixed(2)}deg) scaleY(${scaleY.toFixed(3)})`;
        letter.style.filter = `blur(${(influence * 0.28).toFixed(2)}px)`;
        letter.style.textShadow = `${((position - pointer.x) * influence * 10).toFixed(1)}px 0 rgba(111,219,255,${(0.12 + influence * 0.3).toFixed(2)}), ${((pointer.x - position) * influence * 10).toFixed(1)}px 0 rgba(211,91,255,${(0.18 + influence * 0.34).toFixed(2)})`;
      });
      frame = requestAnimationFrame(render);
    };
    root.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", leave);
    frame = requestAnimationFrame(render);
    return () => {
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return <span className="warp-brand-title" ref={rootRef} role="img" aria-label={text}>
    {Array.from(text).map((letter, index) => (
      <span className={`warp-brand-title__letter${index >= 4 && index <= 6 ? " is-accent" : ""}`}
        aria-hidden="true" key={`${letter}-${index}`}
        ref={(node) => { letterRefs.current[index] = node; }}>
        {letter}
      </span>
    ))}
  </span>;
}

export default function HeroSection() {
  const { content } = usePageLocale();
  const { siteMeta } = content;
  const { prefersReducedMotion } = useMotionSettings();
  const { count: uniqueVisitors, loading: statsLoading } = usePageViews();
  const isRussian = siteMeta.guestbookDateLocale === "ru-RU";
  const typedDescription = isRussian
    ? { prefix: "Создаю современные приложения с ", phrases: ["красивыми интерфейсами.", "масштабируемой архитектурой.", "высокой производительностью.", "продуманным UX."] }
    : { prefix: "Building modern applications with ", phrases: ["beautiful interfaces.", "scalable architectures.", "high performance.", "clean user experiences."] };

  const revealProps = prefersReducedMotion
    ? {}
    : {
        initial: "hidden" as const,
        animate: "visible" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
        variants: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
      };

  return (
    <section className="hero-section hero-section--reference" id="overview">
      <div className="hero-scroll-hint" aria-hidden="true"><span /></div>
      <div className="page-container hero-reference-grid">
        <m.div className="hero-reference-copy" {...revealProps}>
          <m.p className="hero-eyebrow" custom={0} variants={itemVariants}>{siteMeta.heroEyebrow}</m.p>
          <m.h1 custom={1} variants={itemVariants} className="hero-title--warp">
            <WarpBrandTitle text={siteMeta.heroTitle} reducedMotion={prefersReducedMotion} />
          </m.h1>
          <m.p className="hero-role" custom={2} variants={itemVariants}>
            {siteMeta.heroRole}
            <UiIcon name="terminal" className="hero-role__icon" />
          </m.p>
          <m.p className="hero-section__description hero-section__description--typed" custom={3} variants={itemVariants}>
            <TypewriterText className="typewriter-text" phrases={typedDescription.phrases}
              prefix={typedDescription.prefix} reducedMotion={prefersReducedMotion} />
          </m.p>
        </m.div>
        <m.aside
          className="hero-reference-rail hero-reference-rail--visitors"
          {...(!prefersReducedMotion ? {
            initial: { opacity: 0, x: 24 },
            animate: { opacity: 1, x: 0 },
            transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
          } : {})}
        >
          <div className="hero-visitors-nebula">
            <p className="hero-visitors-nebula__label">{siteMeta.uniqueVisitorsLabel}</p>
            <NebulaVisitorCounter
              label={siteMeta.uniqueVisitorsLabel}
              value={uniqueVisitors}
              locale={siteMeta.guestbookDateLocale}
              loading={statsLoading}
              reducedMotion={prefersReducedMotion}
            />
          </div>
        </m.aside>
      </div>
    </section>
  );
}
