import type { ReactNode } from "react";
import { CursorTrailCanvas } from "../components/CursorTrailCanvas";
import { ParticleCanvas } from "../components/ParticleCanvas";
import { SiteHeader } from "../components/SiteHeader";
import { UiIcon } from "../components/UiIcon";
import { socialLinks } from "../data/siteContent";
import { usePageLocale } from "../i18n/pageLocale";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const { content } = usePageLocale();
  const { siteMeta } = content;
  const isRussian = siteMeta.guestbookDateLocale === "ru-RU";
  const footerNavColumns = [
    {
      title: isRussian ? "Проекты" : "Projects",
      links: [
        { label: isRussian ? "Приложения" : "Applications", href: socialLinks.apps },
        { label: "GitHub", href: socialLinks.github, external: true },
      ],
    },
    {
      title: isRussian ? "Контакты" : "Contacts",
      links: [
        { label: "Discord", href: socialLinks.discordProfile, external: true },
        { label: isRussian ? "Книга гостей" : "Guestbook", href: socialLinks.guestbook },
      ],
    },
  ];

  return (
    <div className="page-shell">
      <div className="page-shell__backdrop" aria-hidden="true">
        <div className="page-shell__scene" />
        <ParticleCanvas />
        <div className="page-shell__scene-glow" />
        <div className="page-shell__fireflies page-shell__fireflies--one" />
        <div className="page-shell__fireflies page-shell__fireflies--two" />
        <div className="page-shell__vignette" />
        <div className="page-shell__mist page-shell__mist--one" />
        <div className="page-shell__mist page-shell__mist--two" />
        <div className="page-shell__mist page-shell__mist--three" />
        <div className="page-shell__aurora page-shell__aurora--one" />
        <div className="page-shell__aurora page-shell__aurora--two" />
        <div className="page-shell__smoke page-shell__smoke--one" />
        <div className="page-shell__smoke page-shell__smoke--two" />
        <div className="page-shell__beam page-shell__beam--one" />
        <div className="page-shell__beam page-shell__beam--two" />
        <div className="page-shell__orb page-shell__orb--one" />
        <div className="page-shell__orb page-shell__orb--two" />
        <div className="page-shell__orb page-shell__orb--three" />
        <div className="page-shell__halo page-shell__halo--one" />
        <div className="page-shell__halo page-shell__halo--two" />
        <div className="page-shell__ribbon page-shell__ribbon--one" />
        <div className="page-shell__ribbon page-shell__ribbon--two" />
        <div className="page-shell__spark page-shell__spark--one" />
        <div className="page-shell__spark page-shell__spark--two" />
        <div className="page-shell__spark page-shell__spark--three" />
        <div className="page-shell__spark page-shell__spark--four" />
        <div className="page-shell__grid" />
      </div>
      <CursorTrailCanvas />

      <SiteHeader />

      <main>{children}</main>

      <footer className="site-footer" id="contact">
        <div className="page-container">
          <div className="site-footer__panel">
            <div className="site-footer__inner">
              <div className="site-footer__top">
                <div className="site-footer__brand-block">
                  <p className="site-footer__brand">{siteMeta.brandName}</p>
                  <p className="site-footer__tagline">{siteMeta.brandLine}</p>
                  <a href="/gta5rp" className="site-footer__kagami-link" aria-label="KAGAMI GTA 5 RP">
                    <span className="site-footer__kagami-word">
                      K
                      <svg className="site-footer__kagami-star" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M12 2.8l2.55 5.18 5.72.83-4.14 4.04.98 5.7L12 15.86l-5.11 2.69.98-5.7-4.14-4.04 5.72-.83L12 2.8Z"
                          fill="currentColor"
                        />
                      </svg>
                      GAMI
                    </span>
                    <span>GTA 5 RP</span>
                  </a>
                </div>

                <div className="site-footer__nav-grid">
                  {footerNavColumns.map((column) => (
                    <nav className="site-footer__nav-col" key={column.title} aria-label={column.title}>
                      <h3>{column.title}</h3>
                      {column.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noreferrer" : undefined}
                        >
                          {link.label}
                        </a>
                      ))}
                    </nav>
                  ))}
                </div>

                <div className="site-footer__socials">
                  <a
                    href={socialLinks.discordProfile}
                    target="_blank"
                    rel="noreferrer"
                    className="site-footer__social-btn site-footer__social-btn--discord"
                  >
                    <UiIcon name="discord" className="site-footer__social-icon" />
                    Discord
                  </a>
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    className="site-footer__social-btn"
                  >
                    <UiIcon name="github" className="site-footer__social-icon" />
                    GitHub
                  </a>
                </div>
              </div>

              <div className="site-footer__bottom">
                <p className="site-footer__copy">
                  {siteMeta.footerCopy}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
