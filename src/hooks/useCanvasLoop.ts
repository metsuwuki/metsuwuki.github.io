import { useEffect, type RefObject } from "react";

type CanvasLoopOptions = {
  /** "window": canvas fills the viewport, resizes with devicePixelRatio (fixed backdrops).
   *  "element": canvas fills its own box at 1:1 pixel scale (section-scoped decoration). */
  sizing?: "window" | "element";
};

type DrawFrame = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frame: number,
  reducedMotion: boolean
) => void;

/**
 * Shared boilerplate for the project's decorative particle canvases: sizing
 * (window or element), a devicePixelRatio-aware resize, the rAF loop, and
 * prefers-reduced-motion handling (draws exactly one static frame, then
 * stops — no continuous animation, no per-frame cost for those users).
 * Callers own their own particle/meteor state and drawing logic.
 */
export function useCanvasLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  onResize: (width: number, height: number) => void,
  drawFrame: DrawFrame,
  { sizing = "window" }: CanvasLoopOptions = {}
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let frame = 0;

    const resize = () => {
      const ratio = sizing === "window" ? Math.min(window.devicePixelRatio || 1, 2) : 1;
      width = sizing === "window" ? window.innerWidth : canvas.offsetWidth;
      height = sizing === "window" ? window.innerHeight : canvas.offsetHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      if (sizing === "window") {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
      }
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      onResize(width, height);
    };

    const loop = () => {
      frame += 1;
      drawFrame(ctx, width, height, frame, reducedMotion);
      if (!reducedMotion) {
        animationFrame = window.requestAnimationFrame(loop);
      }
    };

    resize();
    loop();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationFrame);
    };
    // Intentionally run once per mount: callers close over stable, prop-free
    // particle simulations (matches the previous per-component behavior).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizing]);
}
