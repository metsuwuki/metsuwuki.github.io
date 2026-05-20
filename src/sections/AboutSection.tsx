import { motion } from "framer-motion";
import { SectionHeading } from "../components/SectionHeading";
import { UiIcon } from "../components/UiIcon";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageLocale } from "../i18n/pageLocale";
import { getRevealProps } from "../utils/motion";

import downloadIcon from "../assets/icons/download.svg";
import logIcon from "../assets/icons/log.svg";
import peIcon from "../assets/icons/pe.svg";
import previewIcon from "../assets/icons/preview.svg";
import shieldWarnIcon from "../assets/icons/shield_warn.svg";
import runtimeIcon from "../assets/icons/runtime.svg";
import importsIcon from "../assets/icons/imports.svg";
import folderScanIcon from "../assets/icons/forlder_scaning.svg";
import deleteIcon from "../assets/icons/delete.svg";
import fileIcon from "../assets/icons/file.svg";
import processIcon from "../assets/icons/process.svg";
import stressIcon from "../assets/icons/stress_scenario.svg";
import windowsIcon from "../assets/icons/windows.svg";

const tagIcons: Record<string, string> = {
  Export: downloadIcon,
  Logs: logIcon,
  PE: peIcon,
  Preview: previewIcon,
  Quarantine: shieldWarnIcon,
  Runtime: runtimeIcon
};

const highlightIcons: Record<string, string> = {
  "entropy and imports": importsIcon,
  "folder scanning": folderScanIcon,
  "forced delete": deleteIcon,
  "html/json/markdown": fileIcon,
  "process terminate": processIcon,
  "stress scenarios": stressIcon
};

export default function AboutSection() {
  const { content } = usePageLocale();
  const { appCards, siteMeta } = content;
  const { prefersReducedMotion } = useMotionSettings();

  return (
    <section className="section-block section-block--airy" id="apps">
      <div className="page-container">
        <motion.div {...getRevealProps(prefersReducedMotion)}>
          <SectionHeading title={siteMeta.appsTitle} description={siteMeta.appsDescription} align="left" />
        </motion.div>

        <div className="app-showcase-grid">
          {appCards.map((app, index) => (
            <motion.article
              key={app.title}
              {...getRevealProps(prefersReducedMotion, index * 0.08)}
              className={`app-card app-card--${app.accent}`}
            >
              <div className="app-card__inner">
                <div className="window-chrome app-card__chrome" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="app-card__preview">
                  <img src={app.preview} alt={`${siteMeta.appPreviewAltPrefix} ${app.title}`} loading="lazy" />
                  <div className="app-card__preview-shade" aria-hidden="true" />
                </div>

                <div className="app-card__body">
                <div className="app-card__top">
                  <div className="app-card__title-wrap">
                    <div className={`app-card__title-icon app-card__title-icon--${app.accent}`}>
                      <img src={app.icon} alt="" aria-hidden="true" />
                    </div>
                    <p className="app-card__eyebrow">{siteMeta.appCardEyebrow}</p>
                    <h3>{app.title}</h3>
                  </div>
                  <span className="app-card__version">{app.version}</span>
                </div>

                <p className="app-card__text">{app.text}</p>

                <div className="app-card__highlights">
                  {app.highlights.map((item) => (
                    <span key={item} className="app-card__pill">
                      <span className="app-card__pill-icon" aria-hidden="true">
                        <img src={highlightIcons[item] ?? fileIcon} alt="" loading="lazy" />
                      </span>
                      {item}
                    </span>
                  ))}
                </div>

                <div className="app-card__footer">
                  <div className="app-card__tags">
                    {app.tags.map((tag) => (
                      <span key={tag} className="app-card__tag">
                        <span className="app-card__pill-icon" aria-hidden="true">
                          <img src={tagIcons[tag] ?? fileIcon} alt="" loading="lazy" />
                        </span>
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={app.downloadHref}
                    target="_blank"
                    rel="noreferrer"
                    className={`button button--ghost app-card__button app-card__button--${app.accent}`}
                  >
                    <UiIcon name="download" className="button__leading-icon" />
                    <span>{siteMeta.appDownloadLabel}</span>
                  </a>
                </div>
              </div>
              <div className={`app-card__platform app-card__platform--${app.accent}`} aria-hidden="true">
                <span className="app-card__platform-rays" />
                <img src={windowsIcon} alt="" loading="lazy" />
              </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
