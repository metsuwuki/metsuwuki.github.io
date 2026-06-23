import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.14,
    radius: 0.8 + Math.random() * 1.7,
    alpha: 0.18 + Math.random() * 0.42,
  };
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const particles: Particle[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const targetCount = Math.max(34, Math.min(78, Math.round(width / 24)));
      while (particles.length < targetCount) particles.push(createParticle(width, height));
      particles.length = targetCount;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);

      for (const particle of particles) {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
        }

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const glow = context.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.radius * 7);
        glow.addColorStop(0, `rgba(218, 174, 255, ${particle.alpha})`);
        glow.addColorStop(1, "rgba(143, 79, 255, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius * 7, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = `rgba(245, 230, 255, ${Math.min(0.8, particle.alpha + 0.18)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const distance = Math.hypot(dx, dy);

          if (distance > 128) continue;

          context.strokeStyle = `rgba(181, 118, 255, ${0.11 * (1 - distance / 128)})`;
          context.lineWidth = 1;
          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.stroke();
        }
      }

      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="particle-canvas" aria-hidden="true" ref={canvasRef} />;
}
