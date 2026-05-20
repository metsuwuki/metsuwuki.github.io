import { BALL_RADIUS } from "./constants.js";

export function circleRectCollision(ball, rect) {
  const nearestX = Math.max(rect.x, Math.min(ball.x, rect.x + rect.w));
  const nearestY = Math.max(rect.y, Math.min(ball.y, rect.y + rect.h));
  const dx = ball.x - nearestX;
  const dy = ball.y - nearestY;
  const distanceSq = dx * dx + dy * dy;
  if (distanceSq > BALL_RADIUS * BALL_RADIUS) return null;

  const overlapX = BALL_RADIUS - Math.abs(dx);
  const overlapY = BALL_RADIUS - Math.abs(dy);
  if (Math.abs(dx) > Math.abs(dy)) {
    return { nx: Math.sign(dx) || (ball.vx > 0 ? -1 : 1), ny: 0, depth: overlapX };
  }
  return { nx: 0, ny: Math.sign(dy) || (ball.vy > 0 ? -1 : 1), depth: overlapY };
}

export function circleCircleCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const radius = a.r + b.r;
  return dx * dx + dy * dy <= radius * radius;
}
