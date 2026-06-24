import { useMemo } from "react";
import type { PageViewPoint } from "../hooks/usePageViews";

type VisitorsTrendChartProps = {
  points: PageViewPoint[];
};

const WIDTH = 430;
const HEIGHT = 190;
const PADDING = { top: 16, right: 20, bottom: 34, left: 18 };

function buildLinePath(coords: Array<{ x: number; y: number }>): string {
  if (coords.length === 0) return "";
  if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

  return coords.reduce((path, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    return `${path} L ${point.x} ${point.y}`;
  }, "");
}

export function VisitorsTrendChart({ points }: VisitorsTrendChartProps) {
  const chart = useMemo(() => {
    const values = points.map((point) => point.value);
    const maxValue = Math.max(1, ...values);
    const minValue = 0;
    const innerWidth = WIDTH - PADDING.left - PADDING.right;
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const denominator = Math.max(1, points.length - 1);

    const coords = points.map((point, index) => {
      const x = PADDING.left + (index / denominator) * innerWidth;
      const normalized = (point.value - minValue) / Math.max(1, maxValue - minValue);
      const y = PADDING.top + innerHeight - normalized * innerHeight;
      return { x, y, point };
    });

    const linePath = buildLinePath(coords);
    const areaPath = `${linePath} L ${PADDING.left + innerWidth} ${PADDING.top + innerHeight} L ${PADDING.left} ${PADDING.top + innerHeight} Z`;
    const labels = coords.filter((_, index) => index === 0 || index === Math.floor(coords.length / 2) || index === coords.length - 1);
    const ticks = Array.from(new Set([0, Math.ceil(maxValue / 2), maxValue]));

    return { areaPath, coords, innerHeight, innerWidth, labels, linePath, maxValue, ticks };
  }, [points]);

  return (
    <svg className="visitors-trend-chart" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label="30-day visitors trend">
      <defs>
        <linearGradient id="visitorLineGradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#8f4fff" />
          <stop offset="46%" stopColor="#c98bff" />
          <stop offset="100%" stopColor="#f0d4ff" />
        </linearGradient>
        <linearGradient id="visitorAreaGradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(201, 139, 255, 0.22)" />
          <stop offset="58%" stopColor="rgba(98, 54, 148, 0.15)" />
          <stop offset="100%" stopColor="rgba(10, 7, 18, 0)" />
        </linearGradient>
        <filter id="visitorGlow" x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path className="visitors-trend-chart__horizon" d={`M ${PADDING.left} ${PADDING.top + chart.innerHeight} H ${PADDING.left + chart.innerWidth}`} />

      {chart.ticks.map((tick) => {
        const y = PADDING.top + chart.innerHeight - (tick / Math.max(1, chart.maxValue)) * chart.innerHeight;
        return (
          <g className="visitors-trend-chart__scale" key={tick}>
            <line className="visitors-trend-chart__grid" x1={PADDING.left} x2={PADDING.left + chart.innerWidth} y1={y} y2={y} />
            <text className="visitors-trend-chart__tick" x={PADDING.left + 2} y={Math.max(PADDING.top + 9, y - 5)}>
              {tick}
            </text>
          </g>
        );
      })}

      <path className="visitors-trend-chart__area" d={chart.areaPath} />
      <path className="visitors-trend-chart__line-glow" d={chart.linePath} />
      <path className="visitors-trend-chart__line" d={chart.linePath} />

      {chart.labels.map(({ x, point }) => (
        <text className="visitors-trend-chart__label" key={point.date} x={Math.min(Math.max(x, 34), WIDTH - 34)} y={HEIGHT - 12} textAnchor="middle">
          {point.label}
        </text>
      ))}
    </svg>
  );
}
