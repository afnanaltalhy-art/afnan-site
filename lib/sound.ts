"use client";
let ctx: AudioContext | null = null;
let muted = false;
export const setMuted = (m: boolean) => { muted = m; };
export const isMuted = () => muted;

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const C = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!C) return null;
    ctx = new C();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType = "sine", gain = 0.18) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime + start);
  g.gain.setValueAtTime(0.0001, c.currentTime + start);
  g.gain.exponentialRampToValueAtTime(gain, c.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + start + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + start);
  o.stop(c.currentTime + start + dur + 0.05);
}

export const sfx = {
  pop: () => tone(880, 0, 0.12, "sine", 0.12),
  tick: () => tone(1200, 0, 0.05, "square", 0.04),
  correct: () => { tone(660, 0, 0.15, "triangle"); tone(880, 0.12, 0.25, "triangle"); },
  wrong: () => { tone(220, 0, 0.25, "sawtooth", 0.08); tone(180, 0.18, 0.3, "sawtooth", 0.07); },
  reveal: () => { tone(523, 0, 0.12); tone(784, 0.08, 0.2); },
  timeUp: () => { tone(440, 0, 0.2, "square", 0.08); tone(330, 0.22, 0.4, "square", 0.08); },
  win: () => { [523, 659, 784, 1046, 784, 1046].forEach((f, i) => tone(f, i * 0.13, 0.3, "triangle", 0.16)); },
};
