import { m } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import mikaPortrait from "../../mika.jpg";
import metsukiPortrait from "../../metsuki.jpg";
import { useMotionSettings } from "../hooks/useMotionSettings";
import { usePageViews } from "../hooks/usePageViews";

const profiles = [
  {
    id: "metsuki",
    name: "Metsuki Kagami",
    direction: "Software development",
    portrait: metsukiPortrait,
    path: "/metsuki",
  },
  {
    id: "mika",
    name: "Mika Kagami",
    direction: "3D · Interiors · Design",
    portrait: mikaPortrait,
    path: "/mika",
  },
] as const;

export default function IdentitySelector() {
  const { prefersReducedMotion } = useMotionSettings();
  const { count, loading } = usePageViews();

  useEffect(() => {
    document.title = "Kagami · Choose your world";
  }, []);

  return (
    <main className="identity-selector">
      <div className="identity-selector__atmosphere" aria-hidden="true"><i /><i /><i /></div>
      <header className="identity-selector__heading">
        <p>KAGAMI / DUAL IDENTITY</p>
        <h1>WHOSE WORLD<br />WILL YOU ENTER?</h1>
        <span>Две личности. Один визуальный мир.</span>
      </header>

      <div className="identity-selector__stage" aria-label="Выбор профиля">
        {profiles.map((profile, index) => (
          <m.div
            className={`identity-selector__profile identity-selector__profile--${profile.id}`}
            key={profile.id}
            initial={prefersReducedMotion ? false : { opacity: 0, x: index === 0 ? -36 : 36 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: .65, delay: .08 + index * .08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link to={profile.path} className="identity-selector__card" aria-label={`Открыть профиль ${profile.name}`}>
              <img src={profile.portrait} alt={`Портрет ${profile.name}`} width="736" height="736" />
              <span className="identity-selector__card-grid" aria-hidden="true" />
              <span className="identity-selector__card-glow" aria-hidden="true" />
              <span className="identity-selector__card-copy">
                <small>PROFILE / 0{index + 1}</small>
                <strong>{profile.name}</strong>
                <span>{profile.direction}<b aria-hidden="true">↗</b></span>
              </span>
            </Link>
          </m.div>
        ))}

        <div className="identity-selector__sigil" aria-hidden="true">
          <span>✦</span>
          <i />
          <small>KAGAMI<br />NEXUS</small>
        </div>
      </div>

      <footer className="identity-selector__footer">
        <span>TOTAL UNIQUE VISITORS</span>
        <strong aria-live="polite">{loading ? "…" : count == null ? "—" : count.toLocaleString()}</strong>
        <Link to="/gta5rp">K★GAMI / GTA 5 RP <b aria-hidden="true">↗</b></Link>
      </footer>
    </main>
  );
}
