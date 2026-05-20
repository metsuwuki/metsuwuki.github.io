let audioContext;
let muted = localStorage.getItem("neon-flow-muted") === "true";

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  localStorage.setItem("neon-flow-muted", String(muted));
  return muted;
}

export function playRotate() {
  if (muted) return;

  audioContext ??= new (window.AudioContext || window.webkitAudioContext)();
  audioContext.resume?.();

  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.setValueAtTime(360 + Math.random() * 70, now);
  osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(900, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.18);
}
