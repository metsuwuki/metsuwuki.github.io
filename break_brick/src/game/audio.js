export function createAudioManager() {
  let context = null;
  let muted = localStorage.getItem("brick-breaker-muted") === "true";

  const ensure = () => {
    if (!context) {
      context = new AudioContext();
    }
    if (context.state === "suspended") {
      context.resume();
    }
    return context;
  };

  const tone = (frequency, duration = 0.05, type = "sine", gainValue = 0.055) => {
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

  return {
    get muted() {
      return muted;
    },
    toggle() {
      muted = !muted;
      localStorage.setItem("brick-breaker-muted", String(muted));
      if (!muted) tone(640, 0.045, "triangle", 0.025);
    return muted;
    },
    unlock: () => {
      if (!muted) ensure();
    },
    click: () => tone(520, 0.045, "triangle", 0.045),
    wall: () => tone(380, 0.03, "triangle", 0.026),
    hit: (combo = 0) => tone(260 + Math.min(combo, 18) * 18, 0.04, "square", 0.045),
    break: () => tone(120, 0.1, "sawtooth", 0.06),
    pickup: () => tone(760, 0.07, "triangle", 0.055),
    combo: () => {
      tone(620, 0.06, "triangle", 0.05);
      window.setTimeout(() => tone(820, 0.055, "triangle", 0.04), 45);
    }
  };
}
