import { motion } from "framer-motion";
import { MatrixRain } from "../components/MatrixRain";
import { SectionHeading } from "../components/SectionHeading";
import { UiIcon } from "../components/UiIcon";
import { securityThreats, securityTips } from "../data/siteContent";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { getRevealProps } from "../utils/motion";

export default function SecuritySection({ storyMode = false }: { storyMode?: boolean }) {
  const { prefersReducedMotion } = useMotionSettings();
  const staticMode = prefersReducedMotion || storyMode;

  return (
    <section className={`section-block sec-section ${storyMode ? "section-block--story" : ""}`} id="security">
      <div className="page-container">

        {/* Алерт-баннер */}
        <motion.div {...getRevealProps(staticMode)} className="sec-alert">
          <div className="sec-alert__icon" aria-hidden="true">
            <UiIcon name="warning" />
          </div>
          <div className="sec-alert__body">
            <strong>Участились взломы аккаунтов Discord</strong>
            <span>Аккаунт могут угнать меньше чем за час, даже если ты ни на что не нажимал. 2FA не спасет при краже токена - будь внимателен.</span>
          </div>
        </motion.div>

        {/* Два блока: угрозы + защита */}
        <div className="section-grid section-grid--balanced sec-grid">
          <motion.div {...getRevealProps(staticMode, 0.06)} className="section-panel sec-panel">
            <div className="window-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <MatrixRain />
            <div className="sec-panel__content">
              <SectionHeading
                eyebrow="Как взламывают"
                title="Методы атак"
                description="10 реальных способов, которыми угоняют аккаунты Discord."
                align="left"
              />
              <ul className="sec-list sec-list--threat">
                {securityThreats.map((item) => (
                  <li key={item.title}>
                    <span className="sec-list__icon">
                      <UiIcon name={item.icon} />
                    </span>
                    <div className="sec-list__body">
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div {...getRevealProps(staticMode, 0.12)} className="section-panel sec-panel sec-panel--offset">
            <div className="window-chrome" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <MatrixRain />
            <div className="sec-panel__content">
              <SectionHeading
                eyebrow="Как защититься"
                title="Меры защиты"
                description="10 шагов, которые снижают риск взлома до минимума."
                align="left"
              />
              <ul className="sec-list sec-list--tip">
                {securityTips.map((item) => (
                  <li key={item.title}>
                    <span className="sec-list__icon">
                      <UiIcon name={item.icon} />
                    </span>
                    <div className="sec-list__body">
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
