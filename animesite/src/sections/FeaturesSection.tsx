import { motion } from "framer-motion";
import { SectionHeading } from "../components/SectionHeading";
import { UiIcon } from "../components/UiIcon";
import { channelGroups, siteMeta } from "../data/siteContent";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { getRevealProps } from "../utils/motion";

export default function FeaturesSection({ storyMode = false }: { storyMode?: boolean }) {
  const { prefersReducedMotion } = useMotionSettings();
  const staticMode = prefersReducedMotion || storyMode;

  return (
    <section className={`section-block ${storyMode ? "section-block--story" : ""}`} id="channels">
      <div className="page-container">
        <motion.div {...getRevealProps(staticMode)}>
          <SectionHeading eyebrow="Каналы" title={siteMeta.featuresSectionTitle} description={siteMeta.featuresSectionDesc} />
        </motion.div>

        <div className="wings-grid">
          {channelGroups.map((group, index) => (
            <motion.article
              key={group.title}
              {...getRevealProps(staticMode, index * 0.06)}
              className={`wing-card wing-card--${group.accent}`}
            >
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
                        <UiIcon name={group.icon} />
                      </span>
                      {group.title}
                    </h3>
                  </div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>

                <p className="wing-card__summary">{group.summary}</p>

                <div className="channel-list">
                  {group.channels.map((channel) => (
                    <article
                      key={channel.name}
                      className="channel-item"
                    >
                      <strong>{channel.name}</strong>
                      <span>{channel.description}</span>
                    </article>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
