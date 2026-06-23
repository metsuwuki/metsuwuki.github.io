import { useEffect, useRef } from "react";
import type { Chart, ChartConfiguration } from "chart.js";
import type { PageViewPoint } from "../hooks/usePageViews";

type VisitorsTrendChartProps = {
  points: PageViewPoint[];
};

export function VisitorsTrendChart({ points }: VisitorsTrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart<"line"> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function renderChart() {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const {
        Chart,
        CategoryScale,
        Filler,
        LineController,
        LineElement,
        LinearScale,
        PointElement,
        Tooltip,
      } = await import("chart.js");

      if (cancelled) return;

      Chart.register(CategoryScale, Filler, LineController, LineElement, LinearScale, PointElement, Tooltip);

      const gradient = context.createLinearGradient(0, 0, 0, canvas.height || 180);
      gradient.addColorStop(0, "rgba(215, 166, 255, 0.42)");
      gradient.addColorStop(0.55, "rgba(143, 79, 255, 0.16)");
      gradient.addColorStop(1, "rgba(143, 79, 255, 0)");

      const config: ChartConfiguration<"line"> = {
        type: "line",
        data: {
          labels: points.map((point) => point.label),
          datasets: [
            {
              data: points.map((point) => point.value),
              borderColor: "#d9a8ff",
              backgroundColor: gradient,
              borderWidth: 2.6,
              tension: 0,
              fill: true,
              pointRadius: 3.4,
              pointHoverRadius: 5,
              pointBackgroundColor: "#f4ddff",
              pointBorderColor: "#8f4fff",
              pointBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          layout: {
            padding: {
              top: 8,
              right: 8,
              bottom: 0,
              left: 0,
            },
          },
          animation: {
            duration: 700,
            easing: "easeOutQuart",
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              displayColors: false,
              backgroundColor: "rgba(13, 8, 31, 0.94)",
              borderColor: "rgba(217, 168, 255, 0.32)",
              borderWidth: 1,
              titleColor: "#f7efff",
              bodyColor: "#d9c8f2",
              callbacks: {
                label: (item) => `${item.parsed.y} visitors`,
              },
            },
          },
          scales: {
            x: {
              grid: {
                color: "rgba(206, 171, 255, 0.07)",
                drawTicks: false,
              },
              ticks: {
                color: "rgba(231, 222, 247, 0.48)",
                maxTicksLimit: 4,
                maxRotation: 0,
                padding: 2,
                font: {
                  size: 9,
                  family: "Geist Mono, monospace",
                },
              },
              border: {
                display: false,
              },
            },
            y: {
              beginAtZero: true,
              suggestedMax: Math.max(4, ...points.map((point) => point.value)) + 1,
              grid: {
                color: "rgba(206, 171, 255, 0.1)",
                drawTicks: false,
              },
              ticks: {
                color: "rgba(231, 222, 247, 0.5)",
                precision: 0,
                maxTicksLimit: 3,
                padding: 4,
                font: {
                  size: 9,
                  family: "Geist Mono, monospace",
                },
              },
              border: {
                display: false,
              },
            },
          },
        },
      };

      chartRef.current?.destroy();
      chartRef.current = new Chart(context, config);
    }

    renderChart();

    return () => {
      cancelled = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [points]);

  return <canvas ref={canvasRef} aria-label="Monthly visitors trend" />;
}
