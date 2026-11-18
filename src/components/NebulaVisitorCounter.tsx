import CrystalizedBall from "./CrystalizedBall";
import ParticleDigits from "./ParticleDigits";
import "./NebulaVisitorCounter.css";

type Props = {
  value: number | null;
  loading: boolean;
  locale: string;
  reducedMotion: boolean;
  label: string;
};

export default function NebulaVisitorCounter({ value, loading, locale, reducedMotion, label }: Props) {
  const readable = loading ? "Загрузка" : value === null ? "—" : Intl.NumberFormat(locale).format(value);

  return (
    <div className="hero-nebula" role="img" aria-label={`${label}: ${readable}`}>
      <div className="hero-nebula__ball">
        <CrystalizedBall
          preset="nebula"
          color="#9478ff"
          size={0.7}
          crackle={1}
          fill={0.45}
          interactive={!reducedMotion}
          hoverStrength={0.7}
          strands={6}
          flares={0.5}
          glow={0.9}
          sparks={0.6}
          particleCount={1000}
          motion="rise"
          particleShape="square"
          depth={0.5}
          sway={0.4}
          twinkle={0.6}
          haze={0.8}
          dustSpeed={1.2}
          speed={1}
          intro={!reducedMotion}
          paused={reducedMotion}
        />
      </div>
      <ParticleDigits value={value} loading={loading} locale={locale} reducedMotion={reducedMotion} density={0.75} glow={1.5} />
    </div>
  );
}
