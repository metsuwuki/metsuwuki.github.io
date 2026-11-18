import { useEffect, useRef } from "react";

interface ParticleDigitsProps {
  value: number | null;
  loading: boolean;
  locale: string;
  reducedMotion: boolean;
  density?: number;
  glow?: number;
}

type Particle = { x: number; y: number; tx: number; ty: number; vx: number; vy: number; seed: number; size: number };

const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));

export default function ParticleDigits({
  value,
  loading,
  locale,
  reducedMotion,
  density = 0.75,
  glow = 1.5,
}: ParticleDigitsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motionRef = useRef({ reducedMotion, density, glow });
  motionRef.current = { reducedMotion, density, glow };
  const label = loading ? "..." : value === null ? "—" : Intl.NumberFormat(locale).format(value);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;
    const safeCanvas: HTMLCanvasElement = canvas;

    const parent = canvas.parentElement;
    if (!parent) return;

    const particles: Particle[] = [];
    const pointer = { x: -10000, y: -10000, active: false };
    let width = 1;
    let height = 1;
    let raf = 0;
    let visible = true;
    let frame = 0;
    let disposed = false;
    const random = (i: number) => {
      const x = Math.sin(i * 123.71 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    function generateTargets() {
      const { density } = motionRef.current;
      const off = document.createElement("canvas");
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      const w = Math.max(1, Math.floor(width));
      const h = Math.max(1, Math.floor(height));
      off.width = w;
      off.height = h;
      const fontSize = clamp(Math.min(width * 0.255, height * 0.27), 24, 140);
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `900 ${fontSize}px system-ui, -apple-system, sans-serif`;
      // Fit long visitor counts inside the orb.
      const available = width * 0.54;
      const measured = octx.measureText(label).width;
      const scale = Math.min(1, available / Math.max(measured, 1));
      octx.save();
      octx.translate(w / 2, h / 2);
      octx.scale(scale, scale);
      octx.fillStyle = "#fff";
      octx.fillText(label, 0, 0);
      octx.restore();
      const data = octx.getImageData(0, 0, w, h).data;
      const step = clamp(Math.round(3.6 - density * 2), 2, 4);
      const targets: { x: number; y: number }[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (data[(y * w + x) * 4 + 3] > 110 && random(x * 17 + y * 13) < density) {
            targets.push({ x, y });
          }
        }
      }
      // Avoid unbounded particle usage with large numbers / large screens.
      const max = 4400;
      const stride = Math.max(1, Math.ceil(targets.length / max));
      const sampled = targets.filter((_, i) => i % stride === 0);
      sampled.forEach((target, i) => {
        if (particles[i]) {
          particles[i].tx = target.x;
          particles[i].ty = target.y;
        } else {
          const theta = random(i + 991) * Math.PI * 2;
          const radius = Math.min(width, height) * (0.12 + random(i + 450) * 0.23);
          particles.push({
            x: width / 2 + Math.cos(theta) * radius,
            y: height / 2 + Math.sin(theta) * radius,
            tx: target.x,
            ty: target.y,
            vx: 0,
            vy: 0,
            seed: random(i + 331),
            size: 0.65 + random(i + 503) * 0.8,
          });
        }
      });
      particles.length = sampled.length;
      if (motionRef.current.reducedMotion) {
        for (const p of particles) { p.x = p.tx; p.y = p.ty; p.vx = 0; p.vy = 0; }
      }
    }

    function resize() {
      const bounds = safeCanvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      safeCanvas.width = Math.round(width * dpr);
      safeCanvas.height = Math.round(height * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      generateTargets();
      if (motionRef.current.reducedMotion) renderFrame();
    }

    function renderFrame() {
      if (disposed) return;
      ctx!.clearRect(0, 0, width, height);
      const { reducedMotion, glow } = motionRef.current;
      ctx!.save();
      ctx!.globalCompositeOperation = "lighter";
      for (const p of particles) {
        if (!reducedMotion) {
          const dx = p.tx - p.x;
          const dy = p.ty - p.y;
          p.vx = (p.vx + dx * 0.018) * 0.85;
          p.vy = (p.vy + dy * 0.018) * 0.85;
          if (pointer.active) {
            const qx = p.x - pointer.x;
            const qy = p.y - pointer.y;
            const dist2 = qx * qx + qy * qy;
            if (dist2 < 65 * 65 && dist2 > 1) {
              const force = (1 - Math.sqrt(dist2) / 65) * 1.7;
              p.vx += qx / Math.sqrt(dist2) * force;
              p.vy += qy / Math.sqrt(dist2) * force;
            }
          }
          p.x += p.vx;
          p.y += p.vy;
        }
        const alpha = reducedMotion ? 0.9 : 0.7 + 0.3 * Math.sin(frame * 0.037 + p.seed * 37);
        const radius = p.size * (0.75 + glow * 0.35);
        ctx!.fillStyle = `rgba(172,151,255,${clamp(alpha * 0.3 * glow, 0, 1)})`;
        ctx!.fillRect(p.x - radius * 1.8, p.y - radius * 1.8, radius * 3.6, radius * 3.6);
        ctx!.fillStyle = `rgba(238,229,255,${alpha})`;
        ctx!.fillRect(p.x - p.size * 0.5, p.y - p.size * 0.5, p.size, p.size);
      }
      ctx!.restore();
      frame++;
      if (!reducedMotion && visible) raf = requestAnimationFrame(renderFrame);
    }

    const move = (event: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      pointer.x = event.clientX - b.left;
      pointer.y = event.clientY - b.top;
      pointer.active = true;
    };
    const leave = () => { pointer.active = false; };
    parent.addEventListener("pointermove", move, { passive: true });
    parent.addEventListener("pointerleave", leave);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(entries => {
      visible = entries[0]?.isIntersecting ?? true;
      cancelAnimationFrame(raf);
      if (visible) renderFrame();
    });
    io.observe(parent);
    resize();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      parent.removeEventListener("pointermove", move);
      parent.removeEventListener("pointerleave", leave);
    };
  }, [label, reducedMotion]);

  return <canvas ref={canvasRef} className="hero-nebula__digits" aria-hidden="true" />;
}
