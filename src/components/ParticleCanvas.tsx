import { useRef } from "react";
import { useCanvasLoop } from "../hooks/useCanvasLoop";

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

const GLOW_SPRITE_SIZE = 64;

// createRadialGradient()+addColorStop() is a relatively heavy canvas call;
// doing it fresh for every particle on every frame (up to 38x * 60fps) was
// measured to cause periodic >100ms main-thread long tasks from the GC
// pressure of discarding that many gradient objects per second. Baking the
// glow to an offscreen sprite once and blitting it via drawImage (scaled
// per particle's radius, tinted per particle's alpha via globalAlpha) is
// visually identical — opacity scaling commutes — but allocation-free.
function createGlowSprite(): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = GLOW_SPRITE_SIZE;
  sprite.height = GLOW_SPRITE_SIZE;
  const ctx = sprite.getContext("2d")!;
  const r = GLOW_SPRITE_SIZE / 2;
  const glow = ctx.createRadialGradient(r, r, 0, r, r, r);
  glow.addColorStop(0, "rgba(218, 174, 255, 1)");
  glow.addColorStop(1, "rgba(143, 79, 255, 0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(r, r, r, 0, Math.PI * 2);
  ctx.fill();
  return sprite;
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
  const particles = useRef<Particle[]>([]);
  const meteors = useRef<Meteor[]>([]);
  const nextMeteorFrame = useRef(140 + Math.round(Math.random() * 220));
  const glowSprite = useRef<HTMLCanvasElement | null>(null);

  useCanvasLoop(
    canvasRef,
    (width, height) => {
      const targetCount = Math.max(16, Math.min(38, Math.round(width / 46)));
      while (particles.current.length < targetCount) particles.current.push(createParticle(width, height));
      particles.current.length = targetCount;
    },
    (context, width, height, frame, reducedMotion) => {
      if (!glowSprite.current) glowSprite.current = createGlowSprite();
      context.clearRect(0, 0, width, height);

      for (const particle of particles.current) {
        if (!reducedMotion) {
          particle.x += particle.vx;
          particle.y += particle.vy;
        }

        if (particle.x < -20) particle.x = width + 20;
        if (particle.x > width + 20) particle.x = -20;
        if (particle.y < -20) particle.y = height + 20;
        if (particle.y > height + 20) particle.y = -20;

        const glowDiameter = particle.radius * 7 * 2;
        context.globalAlpha = particle.alpha;
        context.drawImage(
          glowSprite.current,
          particle.x - glowDiameter / 2,
          particle.y - glowDiameter / 2,
          glowDiameter,
          glowDiameter
        );
        context.globalAlpha = 1;

        context.fillStyle = `rgba(245, 230, 255, ${Math.min(0.8, particle.alpha + 0.18)})`;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }

      for (let i = 0; i < particles.current.length; i += 1) {
        for (let j = i + 1; j < particles.current.length; j += 1) {
          const a = particles.current[i];
          const b = particles.current[j];
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

      if (!reducedMotion && frame >= nextMeteorFrame.current && meteors.current.length < (width < 760 ? 2 : 4)) {
        meteors.current.push(createMeteor(width, height));
        nextMeteorFrame.current = frame + 80 + Math.round(Math.random() * 150);
      }

      for (let index = meteors.current.length - 1; index >= 0; index -= 1) {
        const meteor = meteors.current[index];
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
          meteors.current.splice(index, 1);
        }
      }
    }
  );

  return <canvas className="particle-canvas" aria-hidden="true" ref={canvasRef} />;
}
