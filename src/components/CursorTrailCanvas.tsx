import { useEffect, useRef } from "react";

type CursorDust = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  maxLife: number;
  alpha: number;
};

function createCursorDust(x: number, y: number, velocityX: number, velocityY: number): CursorDust {
  const drift = Math.random() * Math.PI * 2;
  const speed = 0.25 + Math.random() * 0.75;

  return {
    x: x + (Math.random() - 0.5) * 8,
    y: y + (Math.random() - 0.5) * 8,
    vx: -velocityX * (0.018 + Math.random() * 0.018) + Math.cos(drift) * speed,
    vy: -velocityY * (0.018 + Math.random() * 0.018) + Math.sin(drift) * speed,
    radius: 0.7 + Math.random() * 1.7,
    life: 0,
    maxLife: 34 + Math.random() * 22,
    alpha: 0.2 + Math.random() * 0.32,
  };
}

export function CursorTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canUsePointerTrail = !reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canUsePointerTrail) return;

    const cursorDust: CursorDust[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let lastPointerFrame = 0;

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      frame += 1;
      context.clearRect(0, 0, width, height);

      for (let index = cursorDust.length - 1; index >= 0; index -= 1) {
        const dust = cursorDust[index];
        dust.life += 1;
        dust.x += dust.vx;
        dust.y += dust.vy;
        dust.vx *= 0.975;
        dust.vy *= 0.975;

        const progress = dust.life / dust.maxLife;
        const alpha = dust.alpha * (1 - progress);
        const glow = context.createRadialGradient(dust.x, dust.y, 0, dust.x, dust.y, dust.radius * 9);

        context.save();
        context.globalCompositeOperation = "lighter";
        glow.addColorStop(0, `rgba(255, 246, 255, ${alpha})`);
        glow.addColorStop(0.45, `rgba(211, 166, 255, ${alpha * 0.34})`);
        glow.addColorStop(1, "rgba(143, 79, 255, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(dust.x, dust.y, dust.radius * 9, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = `rgba(255, 246, 255, ${Math.min(0.72, alpha + 0.08)})`;
        context.beginPath();
        context.arc(dust.x, dust.y, dust.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();

        if (dust.life >= dust.maxLife) {
          cursorDust.splice(index, 1);
        }
      }

      animationFrame = window.requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (frame - lastPointerFrame < 2) return;

      const velocityX = event.clientX - lastPointerX;
      const velocityY = event.clientY - lastPointerY;
      const speed = Math.hypot(velocityX, velocityY);

      lastPointerX = event.clientX;
      lastPointerY = event.clientY;
      lastPointerFrame = frame;

      if (speed < 2) return;

      const amount = Math.min(3, Math.max(1, Math.round(speed / 34)));
      for (let index = 0; index < amount; index += 1) {
        cursorDust.push(createCursorDust(event.clientX, event.clientY, velocityX, velocityY));
      }

      if (cursorDust.length > 72) {
        cursorDust.splice(0, cursorDust.length - 72);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="cursor-trail-canvas" aria-hidden="true" ref={canvasRef} />;
}
