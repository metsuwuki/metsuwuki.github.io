import { BALL_RADIUS, BOTTOM_LINE, DANGER_LINE, GAME_HEIGHT, GAME_WIDTH, GAME_STATUS } from "./constants.js";
import { getAimVector } from "./physics.js";

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawBackground(ctx) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, "rgba(24, 18, 46, 0.96)");
  gradient.addColorStop(1, "rgba(7, 5, 16, 0.98)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.strokeStyle = "rgba(232, 221, 250, 0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= GAME_WIDTH; x += 42) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, GAME_HEIGHT);
    ctx.stroke();
  }
  for (let y = 0; y <= GAME_HEIGHT; y += 42) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(GAME_WIDTH, y);
    ctx.stroke();
  }
}

function drawAim(ctx, state) {
  if (state.status !== GAME_STATUS.AIMING || !state.aim.active) return;
  const aim = getAimVector(state);
  const sideDistance = aim.x > 0
    ? (GAME_WIDTH - BALL_RADIUS - state.baseX) / aim.x
    : (BALL_RADIUS - state.baseX) / aim.x;
  const topDistance = (BALL_RADIUS - BOTTOM_LINE) / aim.y;
  const distance = Math.max(0, Math.min(sideDistance, topDistance));
  const endX = state.baseX + aim.x * distance;
  const endY = BOTTOM_LINE + aim.y * distance;
  ctx.save();
  ctx.setLineDash([9, 10]);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "rgba(0, 212, 255, 0.68)";
  ctx.shadowColor = "rgba(0, 212, 255, 0.65)";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.moveTo(state.baseX, BOTTOM_LINE);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.restore();
}

function drawBrick(ctx, brick) {
  const lowerEdge = brick.y + brick.h;
  const isDanger = lowerEdge >= DANGER_LINE && brick.y < DANGER_LINE;
  const dangerPulse = isDanger ? (Math.sin(performance.now() / 90) + 1) / 2 : 0;
  ctx.save();
  ctx.translate(brick.x + brick.w / 2, brick.y + brick.h / 2);
  ctx.scale(brick.scale, brick.scale);
  const x = -brick.w / 2;
  const y = -brick.h / 2;
  const gradient = ctx.createLinearGradient(x, y, x + brick.w, y + brick.h);
  gradient.addColorStop(0, brick.flash > 0 || dangerPulse > 0.72 ? "#ffffff" : brick.color);
  gradient.addColorStop(1, "rgba(14, 11, 25, 0.62)");
  ctx.fillStyle = gradient;
  ctx.shadowColor = isDanger ? "#ff4c63" : brick.color;
  ctx.shadowBlur = 12 + brick.flash * 18 + dangerPulse * 18;
  roundRect(ctx, x, y, brick.w, brick.h, 12);
  ctx.fill();
  ctx.strokeStyle = isDanger ? `rgba(255, 76, 99, ${0.42 + dangerPulse * 0.42})` : "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#f7f1ff";
  ctx.font = "900 20px Inter, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowBlur = 9;
  ctx.shadowColor = "rgba(0,0,0,0.42)";
  ctx.fillText(String(brick.hp), 0, 1);
  ctx.restore();
}

function drawPickup(ctx, pickup) {
  const pulse = Math.sin(pickup.pulse) * 2;
  ctx.save();
  ctx.translate(pickup.x, pickup.y);
  ctx.fillStyle = "rgba(247, 241, 255, 0.12)";
  ctx.shadowColor = "rgba(247, 241, 255, 0.78)";
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.arc(0, 0, pickup.r + pulse + 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f7f1ff";
  ctx.beginPath();
  ctx.arc(0, 0, pickup.r + pulse, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#110b25";
  ctx.font = "950 13px Inter, Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("+1", 0, 1);
  ctx.restore();
}

function drawBall(ctx, ball) {
  ctx.save();
  ctx.fillStyle = "#f7f1ff";
  ctx.shadowColor = "rgba(247, 241, 255, 0.82)";
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawParticles(ctx, state) {
  for (const particle of state.particles) {
    ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife);
    ctx.fillStyle = particle.color;
    ctx.shadowColor = particle.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function render(ctx, state) {
  ctx.save();
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  const shakeX = state.shake ? (Math.random() - 0.5) * state.shake : 0;
  const shakeY = state.shake ? (Math.random() - 0.5) * state.shake : 0;
  ctx.translate(shakeX, shakeY);

  drawBackground(ctx);
  ctx.strokeStyle = "rgba(255, 76, 99, 0.55)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, DANGER_LINE);
  ctx.lineTo(GAME_WIDTH, DANGER_LINE);
  ctx.stroke();

  ctx.strokeStyle = "rgba(232, 221, 250, 0.34)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, BOTTOM_LINE);
  ctx.lineTo(GAME_WIDTH, BOTTOM_LINE);
  ctx.stroke();

  drawAim(ctx, state);
  state.bricks.forEach((brick) => drawBrick(ctx, brick));
  state.pickups.forEach((pickup) => drawPickup(ctx, pickup));
  state.balls.forEach((ball) => drawBall(ctx, ball));
  drawBall(ctx, { x: state.baseX, y: BOTTOM_LINE });
  drawParticles(ctx, state);

  for (const flash of state.flashes) {
    ctx.globalAlpha = Math.max(0, flash.life / 0.16);
    ctx.strokeStyle = flash.color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(flash.x, flash.y, 24 * (1 - flash.life / 0.16 + 0.25), 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}
