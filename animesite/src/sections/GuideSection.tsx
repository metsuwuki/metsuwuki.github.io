import { motion } from "framer-motion";
import { UiIcon } from "../components/UiIcon";
import { roleGroups, siteMeta, voiceGroups } from "../data/siteContent";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { getRevealProps } from "../utils/motion";

export default function GuideSection({ storyMode = false }: { storyMode?: boolean }) {
  const { prefersReducedMotion } = useMotionSettings();
  const staticMode = prefersReducedMotion || storyMode;

  return (
    <section className={`section-block ${storyMode ? "section-block--story" : ""}`} id="voice">
      <div className="page-container section-grid">
        <motion.article {...getRevealProps(staticMode)} className="section-panel wing-card wing-card--violet guide-panel">
          <div className="window-chrome" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="wing-card__content">
            <div className="wing-card__header">
              <div>
                <h3 className="icon-heading">
                  <span>
                    <UiIcon name="mic" />
                  </span>
                  {siteMeta.guideSectionVoiceTitle}
                </h3>
              </div>
              <span>05</span>
            </div>

            <p className="wing-card__summary">{siteMeta.guideSectionVoiceDesc}</p>

            <div className="voice-grid">
              {voiceGroups.map((group) => (
                <article key={group.title} className="voice-card">
                  <div className="voice-card__content">
                    <h3 className="icon-heading">
                      <span>
                        <UiIcon name={group.icon} />
                      </span>
                      {group.title}
                    </h3>
                    <p>{group.text}</p>
                    <ul className="voice-card__list">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.article>

        <motion.article {...getRevealProps(staticMode, 0.08)} className="section-panel wing-card wing-card--cyan guide-panel">
          <div className="window-chrome" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <div className="wing-card__content">
            <div className="wing-card__header">
              <div>
                <h3 className="icon-heading">
                  <span>
                    <UiIcon name="bell" />
                  </span>
                  Выбери, кто ты на сервере
                </h3>
              </div>
              <span>06</span>
            </div>

            <p className="wing-card__summary">Три группы ролей - устройство, игры и пинги.</p>

            <div className="role-grid">
              {roleGroups.map((role) => (
                <article key={role.title} className="role-card">
                  <div className="role-card__content">
                    <h3 className="icon-heading">
                      <span>
                        <UiIcon name={role.icon} />
                      </span>
                      {role.title}
                    </h3>
                    <p>{role.text}</p>
                    <ul className="role-card__list">
                      {role.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </motion.article>
      </div>
    </section>
  );
}
