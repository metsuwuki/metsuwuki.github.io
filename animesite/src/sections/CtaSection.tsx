import { motion } from "framer-motion";
import { UiIcon } from "../components/UiIcon";
import { PrimaryButton } from "../components/PrimaryButton";
import { siteMeta, socialLinks } from "../data/siteContent";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { getRevealProps } from "../utils/motion";

export default function CtaSection() {
  const { prefersReducedMotion } = useMotionSettings();

  return (
    <section className="section-block" id="join">
      <div className="page-container">
        <motion.div {...getRevealProps(prefersReducedMotion)} className="cta-panel">
          <div className="window-chrome" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="cta-panel__content">
            <p className="panel-eyebrow">Вступить</p>
            <h2>{siteMeta.ctaTitle}</h2>
            <p>{siteMeta.ctaText}</p>

            <div className="cta-panel__actions">
              <PrimaryButton href={socialLinks.discord} target="_blank" rel="noreferrer" icon={<UiIcon name="discord" />}>
                Открыть Discord
              </PrimaryButton>
              <PrimaryButton
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                icon={<UiIcon name="github" />}
              >
                GitHub
              </PrimaryButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
