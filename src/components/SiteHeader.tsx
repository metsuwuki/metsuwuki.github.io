import { useState } from "react";
import portraitImage from "../../metsuki.jpg";
import { socialLinks } from "../data/siteContent";
import { usePageLocale } from "../i18n/pageLocale";
import { useScrolled } from "../hooks/useScrolled";
import { PrimaryButton } from "./PrimaryButton";
import { UiIcon } from "./UiIcon";

export function SiteHeader() {
  const isScrolled = useScrolled(20);
  const [menuOpen, setMenuOpen] = useState(false);
  const { locale, setLocale, content } = usePageLocale();
  const { navigation, siteMeta } = content;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className={`site-header__inner ${isScrolled ? "is-scrolled" : ""}`}>
        <a href="#overview" className="site-brand" aria-label={`${siteMeta.brandName} ${siteMeta.brandHomeAria}`} onClick={closeMenu}>
          <span className="site-brand__mark">
            <img src={portraitImage} alt="" width="44" height="44" style={{ objectFit: "cover", borderRadius: "12px" }} />
          </span>
          <span className="site-brand__copy">
            <strong>{siteMeta.brandName}</strong>
            <span>{siteMeta.brandLine}</span>
          </span>
        </a>

        <nav className="site-nav" aria-label={siteMeta.navigationAria}>
          {navigation.map((item) => (
            <a key={item.href} href={item.href}>
              {item.image ? <img src={item.image} alt="" className="site-nav__icon site-nav__icon--image" /> : <UiIcon name={item.icon} className="site-nav__icon" />}
              {item.label}
            </a>
          ))}
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

          <PrimaryButton href={socialLinks.github} target="_blank" rel="noreferrer" className="site-header__cta" leadingIcon="github">
            GitHub
          </PrimaryButton>

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
                  {item.image ? <img src={item.image} alt="" className="site-nav__icon site-nav__icon--image" /> : <UiIcon name={item.icon} className="site-nav__icon" />}
                  {item.label}
                </a>
              ))}
            </nav>
            <PrimaryButton
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              className="site-header__mobile-cta"
              leadingIcon="github"
            >
              GitHub
            </PrimaryButton>
          </div>
        ) : null}
      </div>
    </header>
  );
}
