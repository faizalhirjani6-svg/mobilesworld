type Tone = { from: number; to: number; peak: number };

function playTone({ from, to, peak }: Tone) {
  if (typeof window === "undefined" || !window.AudioContext) return;
  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(from, now);
  osc.frequency.exponentialRampToValueAtTime(to, now + 0.12);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.2);
  osc.onended = () => void ctx.close();
}

export function playAddToCartSound() {
  playTone({ from: 880, to: 1320, peak: 0.25 });
}

export function playRemoveFromCartSound() {
  playTone({ from: 520, to: 260, peak: 0.25 });
}
