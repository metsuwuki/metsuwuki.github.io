import type { ReactNode } from "react";
import { SiteHeader } from "../components/SiteHeader";
import { siteMeta } from "../data/siteContent";

type SiteShellProps = {
  children: ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
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
              </div>

              <div className="site-footer__bottom">
                <p className="site-footer__copy">
                  © 2026 {siteMeta.brandName}. Discord-сервер для игр, аниме и кино.
                </p>
              </div>

            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
