import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
};

type Meteor = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  life: number;
  maxLife: number;
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

function createMeteor(width: number, height: number): Meteor {
  const speed = 7 + Math.random() * 3.8;
  const angle = Math.PI * (0.13 + Math.random() * 0.08);

  return {
    x: -80 + Math.random() * width * 0.78,
    y: Math.random() * height * 0.44,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: 86 + Math.random() * 72,
    life: 0,
    maxLife: 34 + Math.random() * 22,
    alpha: 0.28 + Math.random() * 0.22,
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
    const meteors: Meteor[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let ratio = 1;
    let frame = 0;
    let nextMeteorFrame = 140 + Math.round(Math.random() * 220);

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      const targetCount = Math.max(16, Math.min(38, Math.round(width / 46)));
      while (particles.length < targetCount) particles.push(createParticle(width, height));
      particles.length = targetCount;
    };

    const draw = () => {
      frame += 1;
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

      if (!reducedMotion && frame >= nextMeteorFrame && meteors.length < (width < 760 ? 2 : 4)) {
        meteors.push(createMeteor(width, height));
        nextMeteorFrame = frame + 80 + Math.round(Math.random() * 150);
      }

      for (let index = meteors.length - 1; index >= 0; index -= 1) {
        const meteor = meteors[index];
        meteor.life += 1;
        meteor.x += meteor.vx;
        meteor.y += meteor.vy;

        const progress = meteor.life / meteor.maxLife;
        const fade = Math.sin(Math.min(1, progress) * Math.PI);
        const tailX = meteor.x - meteor.vx * (meteor.length / 10);
        const tailY = meteor.y - meteor.vy * (meteor.length / 10);
        const gradient = context.createLinearGradient(tailX, tailY, meteor.x, meteor.y);

        gradient.addColorStop(0, "rgba(143, 79, 255, 0)");
        gradient.addColorStop(0.55, `rgba(190, 128, 255, ${meteor.alpha * fade * 0.48})`);
        gradient.addColorStop(1, `rgba(255, 240, 255, ${meteor.alpha * fade})`);

        context.save();
        context.globalCompositeOperation = "lighter";
        context.strokeStyle = gradient;
        context.lineWidth = 1.35;
        context.lineCap = "round";
        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(meteor.x, meteor.y);
        context.stroke();

        context.fillStyle = `rgba(255, 240, 255, ${meteor.alpha * fade})`;
        context.beginPath();
        context.arc(meteor.x, meteor.y, 1.8, 0, Math.PI * 2);
        context.fill();
        context.restore();

        if (meteor.life >= meteor.maxLife || meteor.x > width + 180 || meteor.y > height + 120) {
          meteors.splice(index, 1);
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
