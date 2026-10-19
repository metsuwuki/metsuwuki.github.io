import { Link } from "react-router-dom";
import metsukiPortrait from "../../metsuki.jpg";
import { usePageViews } from "../hooks/usePageViews";
import "./IdentitySelector.css";

const mikaPortrait = "https://avatars.githubusercontent.com/u/285079740?v=4";

export default function IdentitySelector() {
  const { count, loading } = usePageViews();
  return (
    <main className="identity-select">
      <div className="identity-select__heading">
        <span>KAGAMI / IDENTITY PROTOCOL</span>
        <h1>Choose your world</h1>
        <p>Две личности. Одно пространство.</p>
      </div>
      <div className="identity-select__grid">
        <Link className="identity-card identity-card--metsuki" to="/metsuki" aria-label="Открыть профиль Metsuki Kagami">
          <img src={metsukiPortrait} alt="Аватар Metsuki Kagami" />
          <span className="identity-card__shade" aria-hidden="true" />
          <span className="identity-card__content">
            <small>PROFILE / 01</small>
            <strong>Metsuki<br />Kagami</strong>
            <span>Software developer <b aria-hidden="true">↗</b></span>
          </span>
        </Link>
        <div className="identity-select__emblem" aria-hidden="true"><span>✦</span><small>UNITY<br />PROTOCOL</small></div>
        <Link className="identity-card identity-card--mika" to="/mika" aria-label="Открыть профиль Mika Kagami">
          <img src={mikaPortrait} alt="Аватар Mika Kagami" />
          <span className="identity-card__shade" aria-hidden="true" />
          <span className="identity-card__content">
            <small>PROFILE / 02</small>
            <strong>Mika<br />Kagami</strong>
            <span>3D · Design · Visual art <b aria-hidden="true">↗</b></span>
          </span>
        </Link>
      </div>
      <div className="identity-select__footer">
        <span>TOTAL UNIQUE VISITORS</span>
        <strong aria-live="polite">{loading ? "…" : count === null ? "—" : count.toLocaleString()}</strong>
        <Link to="/gta5rp">K★GAMI / GTA 5 RP ↗</Link>
      </div>
    </main>
  );
}
