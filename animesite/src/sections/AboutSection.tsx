import { motion } from "framer-motion";
import { UiIcon } from "../components/UiIcon";
import { rules } from "../data/siteContent";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { getRevealProps } from "../utils/motion";

export default function AboutSection({ storyMode = false }: { storyMode?: boolean }) {
  const { prefersReducedMotion } = useMotionSettings();
  const staticMode = prefersReducedMotion || storyMode;

  return (
    <section className={`section-block ${storyMode ? "section-block--story" : ""}`} id="about">
      <div className="page-container">
        <motion.div {...getRevealProps(staticMode)} className="about-stack">
          <article className="section-panel rules-panel">
            <div className="window-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <div className="section-panel__content">
              <p className="panel-eyebrow">Правила</p>
              <ul className="rules-list">
                {rules.map((rule) => (
                  <li key={rule.title}>
                    <span className="rules-list__icon">
                      <UiIcon name={rule.icon} />
                    </span>
                    <div className="rules-list__body">
                      <strong>{rule.title}</strong>
                      <span>{rule.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </motion.div>
      </div>
    </section>
  );
}
