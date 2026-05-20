let context = null;
let muted = localStorage.getItem('minesweeper-muted') === 'true';

const ensure = () => {
  if (!context) {
    context = new AudioContext();
  }
  if (context.state === 'suspended') {
    context.resume();
  }
  return context;
};

const tone = (frequency, duration = 0.05, type = 'sine', gainValue = 0.045) => {
  if (muted) return;
  const audio = ensure();
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = type;
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(gainValue, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + duration);
  osc.connect(gain).connect(audio.destination);
  osc.start();
  osc.stop(audio.currentTime + duration);
};

export const audioManager = {
  get muted() {
    return muted;
  },
  unlock() {
    if (!muted) ensure();
  },
  toggle() {
    muted = !muted;
    localStorage.setItem('minesweeper-muted', String(muted));
    if (!muted) tone(640, 0.045, 'triangle', 0.035);
    return muted;
  },
  open() {
    tone(520, 0.035, 'triangle', 0.035);
  },
  flag() {
    tone(740, 0.045, 'square', 0.032);
  },
  mine() {
    tone(110, 0.12, 'sawtooth', 0.06);
    window.setTimeout(() => tone(72, 0.16, 'sawtooth', 0.045), 70);
  },
  click() {
    tone(580, 0.035, 'triangle', 0.03);
  }
};
