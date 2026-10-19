import { Link } from "react-router-dom";
import { usePageViews } from "../hooks/usePageViews";
import "./MikaPage.css";

const portrait = "https://avatars.githubusercontent.com/u/285079740?v=4";

export default function MikaPage() {
  const { count, loading } = usePageViews();
  return (
    <main className="mika-profile">
      <nav className="mika-profile__nav" aria-label="Навигация">
        <Link to="/">✦ KAGAMI / SELECT PROFILE</Link>
        <Link to="/metsuki">MET​SUKI ↗</Link>
      </nav>
      <section className="mika-profile__hero">
        <div className="mika-profile__copy">
          <small>02 / PERSONAL SPACE</small>
          <h1>Mika<br /><em>Kagami.</em></h1>
          <p>3D · Дизайн · Визуальные работы</p>
          <a href="https://mika-kagami.github.io/" target="_blank" rel="noopener noreferrer">Original portfolio ↗</a>
        </div>
        <div className="mika-profile__portrait"><img src={portrait} alt="Mika Kagami" /></div>
      </section>
      <section className="mika-profile__interests" aria-labelledby="mika-interests">
        <small>THE CREATIVE UNIVERSE</small>
        <h2 id="mika-interests">Creative orbit</h2>
        <div className="mika-profile__orbit" aria-label="3D, дизайн, визуальные работы">
          {["✦ 3D","◈ DESIGN","✧ VISUAL ART","✦ 3D","◈ DESIGN","✧ VISUAL ART"].map((item,index)=><span key={index}>{item}</span>)}
        </div>
      </section>
      <section className="mika-profile__soon">
        <small>PROJECTS / UNDER CONSTRUCTION</small>
        <h2>Something beautiful<br /><em>is coming.</em></h2>
        <p>Новые работы и пространства появятся здесь позже.</p>
        <div className="mika-profile__placeholder" aria-label="Coming soon"><span>✧</span><strong>COMING SOON</strong><small>NEW CHAPTER / 2026+</small></div>
      </section>
      <footer className="mika-profile__footer">
        <Link to="/">← Выбор профиля</Link>
        <div><small>TOTAL UNIQUE VISITORS</small><strong>{loading ? "…" : count === null ? "—" : count.toLocaleString()}</strong></div>
      </footer>
    </main>
  );
}
