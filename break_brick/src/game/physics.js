import { BALL_LAUNCH_DELAY, BALL_RADIUS, BALL_SPEED, BOTTOM_LINE, GAME_STATUS, GAME_HEIGHT, GAME_WIDTH, MAX_AIM_ANGLE, MIN_AIM_ANGLE } from "./constants.js";
import { circleCircleCollision, circleRectCollision } from "./collision.js";
import { burst } from "./particles.js";
import { isGameOver, resetTransient, spawnRow } from "./state.js";

export function getAimVector(state) {
  const dx = state.aim.x - state.baseX;
  const dy = state.aim.y - BOTTOM_LINE;
  let angle = Math.atan2(dy, dx);
  angle = Math.max(-MAX_AIM_ANGLE, Math.min(-MIN_AIM_ANGLE, angle));
  return { x: Math.cos(angle), y: Math.sin(angle), angle };
}

export function launch(state) {
  if (state.status !== GAME_STATUS.AIMING) return;
  state.status = GAME_STATUS.FIRING;
  state.launchIndex = 0;
  state.launchTimer = 0;
  state.ballsReturned = 0;
  state.launchBallCount = state.ballsTotal;
  state.pendingBalls = state.launchBallCount;
  state.nextBaseX = null;
  state.combo = 0;
}

function spawnBall(state) {
  const aim = getAimVector(state);
  state.balls.push({
    x: state.baseX,
    y: BOTTOM_LINE,
    vx: aim.x * BALL_SPEED,
    vy: aim.y * BALL_SPEED,
    active: true
  });
  state.launchIndex += 1;
}

function returnBall(state, ball) {
  ball.active = false;
  state.ballsReturned += 1;
  if (state.nextBaseX === null) {
    state.nextBaseX = Math.max(BALL_RADIUS + 4, Math.min(GAME_WIDTH - BALL_RADIUS - 4, ball.x));
  }
}

function handleBrickHit(state, brick, audio) {
  brick.hp -= 1;
  brick.flash = 1;
  brick.scale = 1.06;
  state.combo += 1;
  state.bestCombo = Math.max(state.bestCombo, state.combo);
  state.score += 1 + Math.floor(Math.max(0, state.combo - 1) / 5);
  state.shake = Math.min(10, state.shake + 1.4);
  state.flashes.push({ x: brick.x + brick.w / 2, y: brick.y + brick.h / 2, life: 0.16, color: brick.color });
  audio.hit(state.combo);

  if (state.combo > 0 && state.combo % 10 === 0) {
    audio.combo();
  }

  if (brick.hp <= 0) {
    state.score += 8 + Math.floor(state.combo / 3);
    state.shake = Math.min(16, state.shake + 5);
    burst(state, brick.x + brick.w / 2, brick.y + brick.h / 2, brick.color, 24, 260);
    audio.break();
  }
}

function stepBall(state, ball, dt, audio) {
  ball.x += ball.vx * dt;
  ball.y += ball.vy * dt;

  if (ball.x < BALL_RADIUS) {
    ball.x = BALL_RADIUS;
    ball.vx = Math.abs(ball.vx);
    if (state.wallSoundCooldown <= 0) {
      audio.wall();
      state.wallSoundCooldown = 0.045;
    }
  } else if (ball.x > GAME_WIDTH - BALL_RADIUS) {
    ball.x = GAME_WIDTH - BALL_RADIUS;
    ball.vx = -Math.abs(ball.vx);
    if (state.wallSoundCooldown <= 0) {
      audio.wall();
      state.wallSoundCooldown = 0.045;
    }
  }

  if (ball.y < BALL_RADIUS) {
    ball.y = BALL_RADIUS;
    ball.vy = Math.abs(ball.vy);
    if (state.wallSoundCooldown <= 0) {
      audio.wall();
      state.wallSoundCooldown = 0.045;
    }
  }

  for (const brick of state.bricks) {
    if (brick.hp <= 0) continue;
    const hit = circleRectCollision(ball, brick);
    if (!hit) continue;

    if (hit.nx) {
      ball.vx = Math.abs(ball.vx) * hit.nx;
      ball.x += hit.nx * (hit.depth + 0.5);
    } else {
      ball.vy = Math.abs(ball.vy) * hit.ny;
      ball.y += hit.ny * (hit.depth + 0.5);
    }
    handleBrickHit(state, brick, audio);
    break;
  }

  for (const pickup of state.pickups) {
    if (pickup.collected) continue;
    if (!circleCircleCollision({ ...ball, r: BALL_RADIUS }, pickup)) continue;
    pickup.collected = true;
    state.pendingBallPickups += 1;
    state.score += 6;
    state.shake = Math.min(12, state.shake + 3);
    burst(state, pickup.x, pickup.y, "#39ffb0", 18, 220);
    audio.pickup();
  }

  if (ball.y >= BOTTOM_LINE) {
    returnBall(state, ball);
  } else if (ball.y > GAME_HEIGHT + 30) {
    returnBall(state, ball);
  }
}

function finishTurn(state) {
  state.baseX = state.nextBaseX ?? state.baseX;
  state.ballsTotal += state.pendingBallPickups;
  resetTransient(state);
  state.turn += 1;
  spawnRow(state);
  state.status = GAME_STATUS.AIMING;
}

export function updatePhysics(state, dt, audio) {
  state.shake = Math.max(0, state.shake - 22 * dt);
  state.wallSoundCooldown = Math.max(0, state.wallSoundCooldown - dt);
  state.flashes = state.flashes.filter((flash) => {
    flash.life -= dt;
    return flash.life > 0;
  });

  for (const brick of state.bricks) {
    brick.y += (brick.targetY - brick.y) * Math.min(1, dt * 12);
    brick.flash = Math.max(0, brick.flash - dt * 6);
    brick.scale += (1 - brick.scale) * Math.min(1, dt * 14);
  }
  for (const pickup of state.pickups) {
    pickup.y += (pickup.targetY - pickup.y) * Math.min(1, dt * 12);
    pickup.pulse += dt * 5;
  }

  state.bricks = state.bricks.filter((brick) => brick.hp > 0);
  state.pickups = state.pickups.filter((pickup) => !pickup.collected && pickup.y - pickup.r < GAME_HEIGHT + 20);

  if (isGameOver(state)) {
    state.balls = [];
    state.status = GAME_STATUS.OVER;
    state.shake = Math.max(state.shake, 16);
    return;
  }

  if (state.status !== GAME_STATUS.FIRING) return;

  state.launchTimer -= dt * 1000;
  while (state.launchIndex < state.launchBallCount && state.launchTimer <= 0) {
    spawnBall(state);
    state.launchTimer += BALL_LAUNCH_DELAY;
  }

  const steps = Math.max(1, Math.ceil((BALL_SPEED * dt) / 8));
  const stepDt = dt / steps;
  for (let step = 0; step < steps; step += 1) {
    for (const ball of state.balls) {
      if (ball.active) stepBall(state, ball, stepDt, audio);
    }
  }

  state.balls = state.balls.filter((ball) => ball.active);
  if (state.ballsReturned >= state.launchBallCount && state.launchIndex >= state.launchBallCount) {
    finishTurn(state);
  }
}
