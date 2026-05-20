import type { ReactNode } from "react";
import clashClanIcon from "../../clash_clan/assets/clash_icon.png";
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

  return (
    <div className="page-shell">
      <div className="page-shell__backdrop" aria-hidden="true">
        <div className="page-shell__scene" />
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

      <SiteHeader />

      <main>{children}</main>

      <footer className="site-footer">
        <div className="page-container">
          <div className="site-footer__panel">
            <div className="site-footer__inner">
              <div className="site-footer__top">
                <div className="site-footer__brand-block">
                  <p className="site-footer__brand">{siteMeta.brandName}</p>
                  <p className="site-footer__tagline">{siteMeta.brandLine}</p>
                </div>

                <div className="site-footer__socials">
                  <a
                    href={socialLinks.discord}
                    className="site-footer__social-btn site-footer__social-btn--discord"
                  >
                    <UiIcon name="discord" className="site-footer__social-icon" />
                    {siteMeta.ctaTitle}
                  </a>
                  <a
                    href={socialLinks.clashClan}
                    className="site-footer__social-btn site-footer__social-btn--clash"
                  >
                    <img src={clashClanIcon} alt="" className="site-footer__social-icon site-footer__social-icon--image" />
                    Clash Clan
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
