import { BOTTOM_LINE, GAME_HEIGHT, GAME_STATUS, GAME_WIDTH } from "./constants.js";
import { launch } from "./physics.js";

function pointerToGame(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * GAME_WIDTH,
    y: ((event.clientY - rect.top) / rect.height) * GAME_HEIGHT
  };
}

export function attachInput(canvas, state, audio, onStartRequest) {
  const move = (event) => {
    if (state.status !== GAME_STATUS.AIMING) return;
    const point = pointerToGame(canvas, event);
    state.aim = {
      x: Math.max(24, Math.min(GAME_WIDTH - 24, point.x)),
      y: Math.max(42, Math.min(BOTTOM_LINE - 48, point.y)),
      active: true
    };
  };

  const down = (event) => {
    event.preventDefault();
    audio.unlock?.();
    if (state.status === GAME_STATUS.READY) {
      onStartRequest();
      return;
    }
    move(event);
  };

  const up = (event) => {
    event.preventDefault();
    if (state.status !== GAME_STATUS.AIMING) return;
    move(event);
    audio.click();
    launch(state);
  };

  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);

  return () => {
    canvas.removeEventListener("pointerdown", down);
    canvas.removeEventListener("pointermove", move);
    canvas.removeEventListener("pointerup", up);
    canvas.removeEventListener("pointercancel", up);
  };
}
