import { useEffect, useRef } from "react";

type Node = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  orbit: number;
  speed: number;
  phase: number;
  radius: number;
  depth: number;
};

function createNode(width: number, height: number): Node {
  const depth = 0.45 + Math.random() * 0.75;

  return {
    baseX: width * (0.08 + Math.random() * 0.84),
    baseY: height * (0.18 + Math.random() * 0.64),
    x: 0,
    y: 0,
    orbit: 5 + Math.random() * 18,
    speed: 0.00025 + Math.random() * 0.00045,
    phase: Math.random() * Math.PI * 2,
    radius: 1 + Math.random() * 1.8,
    depth,
  };
}

export function PortalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0 };
    const nodes: Node[] = [];
    let animationFrame = 0;
    let width = 1;
    let height = 1;
    let ratio = 1;
    let start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      nodes.length = 0;
      const count = width < 620 ? 14 : 24;
      for (let i = 0; i < count; i += 1) nodes.push(createNode(width, height));
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const draw = (now: number) => {
      const elapsed = reducedMotion ? 0 : now - start;
      context.clearRect(0, 0, width, height);

      const bg = context.createRadialGradient(width * 0.5, height * 0.46, 0, width * 0.5, height * 0.46, width * 0.62);
      bg.addColorStop(0, "rgba(166, 91, 255, 0.13)");
      bg.addColorStop(0.48, "rgba(105, 55, 190, 0.055)");
      bg.addColorStop(1, "rgba(8, 5, 24, 0)");
      context.fillStyle = bg;
      context.fillRect(0, 0, width, height);

      context.save();
      context.translate(pointer.x * 5, pointer.y * 4);

      for (let ring = 0; ring < 3; ring += 1) {
        context.beginPath();
        context.ellipse(
          width * (0.5 + ring * 0.025),
          height * (0.5 - ring * 0.035),
          width * (0.21 + ring * 0.105),
          height * (0.16 + ring * 0.035),
          -0.22 + ring * 0.16,
          0,
          Math.PI * 2,
        );
        context.strokeStyle = `rgba(192, 134, 255, ${0.075 - ring * 0.012})`;
        context.lineWidth = 1;
        context.stroke();
      }

      for (const node of nodes) {
        const orbit = reducedMotion ? 0 : elapsed * node.speed + node.phase;
        node.x = node.baseX + Math.cos(orbit) * node.orbit + pointer.x * node.depth * 8;
        node.y = node.baseY + Math.sin(orbit * 0.82) * node.orbit * 0.62 + pointer.y * node.depth * 6;
      }

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          const limit = width < 620 ? 118 : 155;
          if (distance > limit) continue;

          context.beginPath();
          context.moveTo(a.x, a.y);
          context.lineTo(b.x, b.y);
          context.strokeStyle = `rgba(197, 145, 255, ${0.12 * (1 - distance / limit)})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }

      for (const node of nodes) {
        const glow = context.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius * 11);
        glow.addColorStop(0, "rgba(222, 184, 255, 0.34)");
        glow.addColorStop(1, "rgba(143, 79, 255, 0)");
        context.fillStyle = glow;
        context.beginPath();
        context.arc(node.x, node.y, node.radius * 11, 0, Math.PI * 2);
        context.fill();

        context.fillStyle = "rgba(244, 226, 255, 0.68)";
        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        context.fill();
      }

      const pulseX = width * 0.5 + Math.sin(elapsed * 0.00028) * width * 0.08;
      const pulse = context.createRadialGradient(pulseX, height * 0.5, 0, pulseX, height * 0.5, height * 0.38);
      pulse.addColorStop(0, "rgba(206, 158, 255, 0.12)");
      pulse.addColorStop(1, "rgba(143, 79, 255, 0)");
      context.fillStyle = pulse;
      context.fillRect(0, 0, width, height);

      context.restore();

      if (!reducedMotion) animationFrame = window.requestAnimationFrame(draw);
    };

    resize();
    canvas.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", resize);
    animationFrame = window.requestAnimationFrame((now) => {
      start = now;
      draw(now);
    });

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  return <canvas className="portal-canvas__surface" aria-hidden="true" ref={canvasRef} />;
}
