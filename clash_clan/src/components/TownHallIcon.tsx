import fallbackIcon from "../../assets/clash_icon.png";

type TownHallIconProps = {
  level: number;
  className?: string;
};

const townHallImages = import.meta.glob("../../assets/townhall/th*.{png,webp,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default"
}) as Record<string, string>;

export function getTownHallImage(level: number): string {
  const normalized = Number.isFinite(level) ? Math.max(1, Math.round(level)) : 1;
  return (
    townHallImages[`../../assets/townhall/th${normalized}.png`] ??
    townHallImages[`../../assets/townhall/th${normalized}.webp`] ??
    townHallImages[`../../assets/townhall/th${normalized}.jpg`] ??
    townHallImages[`../../assets/townhall/th${normalized}.jpeg`] ??
    fallbackIcon
  );
}

export default function TownHallIcon({ level, className = "" }: TownHallIconProps) {
  return <img className={className} src={getTownHallImage(level)} alt={`Town Hall ${level}`} loading="lazy" />;
}
