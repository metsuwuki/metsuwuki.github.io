import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMotionSettings } from "../hooks/useMotionSettings";
import AboutSection from "./AboutSection";
import FeaturesSection from "./FeaturesSection";
import GuideSection from "./GuideSection";

function StoryScene({
  children,
  index,
  total,
  progress
}: {
  children: React.ReactNode;
  index: number;
  total: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const segment = 1 / total;
  const start = index * segment;
  const fadeIn = start + segment * 0.18;
  const fadeOut = start + segment * 0.82;
  const end = (index + 1) * segment;

  const opacity = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [index === 0 ? 1 : 0, 1, 1, index === total - 1 ? 1 : 0]
  );
  const y = useTransform(progress, [start, fadeIn, fadeOut, end], [36, 0, 0, -28]);
  const scale = useTransform(progress, [start, fadeIn, fadeOut, end], [0.97, 1, 1, 0.985]);

  return (
    <motion.div className="story-reel__scene" style={{ opacity, y, scale }}>
      {children}
    </motion.div>
  );
}

export default function StoryReel() {
  const { prefersReducedMotion } = useMotionSettings();
  const [isCompact, setIsCompact] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const media = window.matchMedia("(max-width: 1080px)");
    const update = () => setIsCompact(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  if (prefersReducedMotion || isCompact) {
    return (
      <>
        <AboutSection />
        <FeaturesSection />
        <GuideSection />
      </>
    );
  }

  const slides = [
    { id: "about", node: <AboutSection storyMode /> },
    { id: "channels", node: <FeaturesSection storyMode /> },
    { id: "voice", node: <GuideSection storyMode /> }
  ];

  return (
    <section className="story-reel" ref={containerRef}>
      <div className="story-reel__sticky">
        <div className="story-reel__slides">
          {slides.map((slide, index) => (
            <StoryScene
              key={slide.id}
              index={index}
              total={slides.length}
              progress={scrollYProgress}
            >
              {slide.node}
            </StoryScene>
          ))}
        </div>
      </div>

      <div className="story-reel__steps" aria-hidden="true">
        {slides.map((slide) => (
          <div key={slide.id} id={slide.id} className="story-reel__step" />
        ))}
      </div>
    </section>
  );
}
