export const GAME_WIDTH = 420;
export const GAME_HEIGHT = 680;
export const COLS = 7;
export const ROWS = 9;
export const CELL_GAP = 8;
export const TOP_OFFSET = 74;
export const DANGER_LINE = GAME_HEIGHT - 154;
export const BOTTOM_LINE = GAME_HEIGHT - 56;
export const BALL_RADIUS = 5;
export const BALL_SPEED = 760;
export const BALL_LAUNCH_DELAY = 42;
export const MAX_AIM_ANGLE = Math.PI - 0.18;
export const MIN_AIM_ANGLE = 0.18;
export const GAME_STATUS = {
  READY: "ready",
  AIMING: "aiming",
  FIRING: "firing",
  SETTLING: "settling",
  PAUSED: "paused",
  OVER: "over"
};

export const brickWidth = (GAME_WIDTH - CELL_GAP * (COLS + 1)) / COLS;
export const brickHeight = 44;
