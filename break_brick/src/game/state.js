import { DANGER_LINE, CELL_GAP, COLS, GAME_HEIGHT, GAME_STATUS, ROWS, TOP_OFFSET, brickHeight, brickWidth } from "./constants.js";

const colors = ["#7c4dff", "#00d4ff", "#ff1f71", "#39ffb0", "#ffcc00"];

export function createGameState() {
  return {
    status: GAME_STATUS.READY,
    score: 0,
    bestCombo: 0,
    combo: 0,
    turn: 1,
    ballsTotal: 1,
    pendingBalls: 0,
    pendingBallPickups: 0,
    launchBallCount: 1,
    ballsReturned: 0,
    launchIndex: 0,
    launchTimer: 0,
    baseX: 210,
    nextBaseX: 210,
    aim: { x: 210, y: 260, active: false },
    balls: [],
    bricks: [],
    pickups: [],
    particles: [],
    flashes: [],
    shake: 0,
    wallSoundCooldown: 0,
    width: 420,
    height: GAME_HEIGHT,
    submitted: false
  };
}

export function startRun(state) {
  Object.assign(state, createGameState());
  spawnRow(state);
  spawnRow(state);
  state.status = GAME_STATUS.AIMING;
}

export function resetTransient(state) {
  state.balls = [];
  state.flashes = [];
  state.particles = [];
  state.combo = 0;
  state.pendingBalls = 0;
  state.pendingBallPickups = 0;
  state.launchBallCount = state.ballsTotal;
  state.ballsReturned = 0;
  state.launchIndex = 0;
  state.launchTimer = 0;
}

export function getBrickRect(col, row) {
  return {
    x: CELL_GAP + col * (brickWidth + CELL_GAP),
    y: TOP_OFFSET + row * (brickHeight + CELL_GAP),
    w: brickWidth,
    h: brickHeight
  };
}

export function spawnRow(state) {
  state.bricks.forEach((brick) => {
    brick.row += 1;
    brick.targetY = getBrickRect(brick.col, brick.row).y;
  });
  state.pickups.forEach((pickup) => {
    pickup.row += 1;
    pickup.targetY = getBrickRect(pickup.col, pickup.row).y + brickHeight / 2;
  });

  const pressure = Math.max(1, state.turn);
  const turnValue = Math.max(1, Math.floor(pressure * 0.52 + state.ballsTotal * 0.28 + Math.random() * Math.max(2, pressure * 0.32)));
  const count = Math.min(COLS - 2, 2 + Math.floor(state.turn / 8) + Math.floor(Math.random() * 2));
  const cols = new Set();
  while (cols.size < count) cols.add(Math.floor(Math.random() * COLS));

  cols.forEach((col) => {
    const rect = getBrickRect(col, 0);
    state.bricks.push({
      id: crypto.randomUUID(),
      col,
      row: 0,
      x: rect.x,
      y: rect.y - 70,
      targetY: rect.y,
      w: rect.w,
      h: rect.h,
      hp: turnValue + Math.floor(Math.random() * Math.max(2, pressure * 0.58)),
      maxHp: turnValue + Math.ceil(pressure * 0.65),
      color: colors[Math.floor(Math.random() * colors.length)],
      flash: 0,
      scale: 1
    });
  });

  const pickupRolls = state.turn % 5 === 0 ? 2 : 1;
  for (let index = 0; index < pickupRolls; index += 1) {
    if (Math.random() >= 0.82) continue;
    const freeCols = Array.from({ length: COLS }, (_, col) => col).filter((col) => !cols.has(col));
    const col = freeCols[Math.floor(Math.random() * freeCols.length)] ?? Math.floor(Math.random() * COLS);
    const rect = getBrickRect(col, 0);
    state.pickups.push({
      id: crypto.randomUUID(),
      col,
      row: 0,
      x: rect.x + rect.w / 2,
      y: rect.y - 70 + rect.h / 2,
      targetY: rect.y + rect.h / 2,
      r: 13,
      pulse: Math.random() * 10
    });
  }
}

export function isGameOver(state) {
  return state.bricks.some((brick) => {
    return brick.y >= DANGER_LINE || brick.row >= ROWS;
  });
}
