import { useState } from "react";
import portraitImage from "../../metsuki.jpg";
import { useDiscordPresence } from "../hooks/useDiscordPresence";
import { useScrolled } from "../hooks/useScrolled";
import { usePageLocale } from "../i18n/pageLocale";
import { UiIcon } from "./UiIcon";

function KagamiStarSvg() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="site-nav__kagami-star"
    >
      <path d="M12 2.5l2.6 5.3 5.8.85-4.2 4.1 1 5.8L12 15.8l-5.2 2.75 1-5.8-4.2-4.1 5.8-.85z" />
    </svg>
  );
}

export function SiteHeader() {
  const isScrolled = useScrolled(20);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, content } = usePageLocale();
  const { navigation, siteMeta } = content;
  const presence = useDiscordPresence(siteMeta.discordPresenceId, locale);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className={`site-header__inner ${isScrolled ? "is-scrolled" : ""}`}>
        <a href="#overview" className="site-brand" aria-label={`${siteMeta.brandName} ${siteMeta.brandHomeAria}`} onClick={closeMenu}>
          <span className={`site-brand__mark site-brand__mark--${presence.state}`}>
            <img src={presence.avatarUrl || portraitImage} alt="" width="44" height="44" />
          </span>
          <span className="site-brand__copy">
            <strong>{siteMeta.brandName}</strong>
            <span>{siteMeta.brandLine}</span>
            <span className={`site-brand__presence site-brand__presence--${presence.state}`} aria-label={presence.label}>
              <UiIcon name="discord" className="site-brand__presence-icon" />
              <span className="site-brand__presence-label">{presence.label}</span>
            </span>
          </span>
        </a>

        <nav className="site-nav" aria-label={siteMeta.navigationAria}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              <UiIcon name={item.icon} className="site-nav__icon" />
              {item.label}
            </a>
          ))}
          <a href="/gta5rp" className="site-nav__kagami-link" title="K★GAMI — GTA 5 RP">
            <KagamiStarSvg />
            <span>K★GAMI</span>
          </a>
        </nav>

        <div className="site-header__actions">
          <div className="site-locale-switch" role="group" aria-label={siteMeta.localeSwitcherAria}>
            <button
              type="button"
              className={`site-locale-switch__button ${locale === "en" ? "is-active" : ""}`}
              aria-pressed={locale === "en"}
              onClick={() => setLocale("en")}
            >
              EN
            </button>
            <button
              type="button"
              className={`site-locale-switch__button ${locale === "ru" ? "is-active" : ""}`}
              aria-pressed={locale === "ru"}
              onClick={() => setLocale("ru")}
            >
              RU
            </button>
          </div>

          <button
            type="button"
            className="site-header__toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? siteMeta.closeMenuAria : siteMeta.openMenuAria}
            onClick={() => setMenuOpen((current) => !current)}
          >
            <span className={menuOpen ? "is-open" : ""} />
            <span className={menuOpen ? "is-open" : ""} />
            <span className={menuOpen ? "is-open" : ""} />
          </button>
        </div>

        {menuOpen ? (
          <div className="site-header__mobile" id="mobile-navigation">
            <nav className="site-header__mobile-nav" aria-label={siteMeta.mobileNavigationAria}>
              {navigation.map((item) => (
                <a key={item.href} href={item.href} onClick={closeMenu}>
                  <UiIcon name={item.icon} className="site-nav__icon" />
                  {item.label}
                </a>
              ))}
              <a href="/gta5rp" className="site-header__mobile-kagami" onClick={closeMenu}>
                <KagamiStarSvg />
                K★GAMI
              </a>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
