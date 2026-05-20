import { useState } from "react";
import animeLogo from "../../anime.mp4";
import { navigation, siteMeta, socialLinks } from "../data/siteContent";
import { useScrolled } from "../hooks/useScrolled";
import { PrimaryButton } from "./PrimaryButton";
import { UiIcon } from "./UiIcon";

export function SiteHeader() {
  const isScrolled = useScrolled(20);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className={`site-header__inner ${isScrolled ? "is-scrolled" : ""}`}>
        <a href="#overview" className="site-brand" aria-label={`${siteMeta.brandName} главная`} onClick={closeMenu}>
          <span className="site-brand__mark">
            <video src={animeLogo} autoPlay loop muted playsInline width="44" height="44" style={{ objectFit: "cover", borderRadius: "12px" }} />
          </span>
          <span className="site-brand__copy">
            <strong>{siteMeta.brandName}</strong>
            <span>{siteMeta.brandLine}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Основная навигация">
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="site-header__actions">
          <PrimaryButton
            href={socialLinks.mainSite}
            className="site-header__cta"
            variant="ghost"
            icon={<UiIcon name="home" />}
          >
            На главную
          </PrimaryButton>

          <PrimaryButton
            href={socialLinks.discord}
            target="_blank"
            rel="noreferrer"
            className="site-header__cta"
            icon={<UiIcon name="discord" />}
          >
            Открыть Discord
          </PrimaryButton>

          <button
            type="button"
            className="site-header__toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className={menuOpen ? "is-open" : ""} />
            <span className={menuOpen ? "is-open" : ""} />
            <span className={menuOpen ? "is-open" : ""} />
          </button>
        </div>

        {menuOpen ? (
          <div className="site-header__mobile" id="mobile-navigation">
            <nav className="site-header__mobile-nav" aria-label="Мобильная навигация">
              {navigation.map((item) => (
                <a key={item.href} href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              ))}
            </nav>
            <PrimaryButton
              href={socialLinks.mainSite}
              onClick={closeMenu}
              className="site-header__mobile-cta"
              variant="ghost"
            >
              На главную
            </PrimaryButton>
            <PrimaryButton
              href={socialLinks.discord}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="site-header__mobile-cta"
            >
              Открыть сервер
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </header>
  );
}
