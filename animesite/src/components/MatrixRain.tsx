import { useEffect, useRef } from "react";

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ" +
  "マミムメモヤユヨラリルレロワヲン" +
  "0123456789ABCDEF◈✦⊘◎▸▹▪";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on mobile — canvas is hidden via CSS and animation wastes battery
    if (window.matchMedia("(max-width: 640px)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fontSize = 13;
    let drops: number[] = [];
    let animId: number;

    const init = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: cols }, () =>
        Math.floor(Math.random() * -(canvas.height / fontSize))
      );
    };

    init();

    const ro = new ResizeObserver(() => {
      init();
    });
    ro.observe(canvas);

    const draw = () => {
      // Затухающий шлейф
      ctx.fillStyle = "rgba(11, 10, 26, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const y = drops[i] * fontSize;

        // Яркий глиф — голова потока
        const headAlpha = 0.7 + Math.random() * 0.3;
        ctx.fillStyle = `rgba(240, 240, 255, ${headAlpha})`;
        ctx.fillText(char, i * fontSize, y);

        // Случайные тусклые глифы чуть ниже — тело потока
        if (Math.random() > 0.6) {
          const bodyAlpha = Math.random() * 0.18 + 0.04;
          const bodyChar = CHARS[Math.floor(Math.random() * CHARS.length)];
          ctx.fillStyle = `rgba(200, 195, 255, ${bodyAlpha})`;
          ctx.fillText(bodyChar, i * fontSize, y - fontSize * (1 + Math.floor(Math.random() * 4)));
        }

        if (y > canvas.height && Math.random() > 0.97) {
          drops[i] = -Math.floor(Math.random() * 20);
        }
        drops[i] += 0.4 + Math.random() * 0.3;
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
}
