// Web Audio API synthetic sound generator — fallback when no audio files are available

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  return ctx;
}

/**
 * Must be called inside a user-gesture handler (click / touchstart / wheel / keydown).
 * Browsers create AudioContext in "suspended" state; this resumes it so every
 * sound after the first interaction plays immediately without silence.
 */
export async function resumeCtx(): Promise<void> {
  try {
    const c = getCtx();
    if (c.state === "suspended") await c.resume();
  } catch {}
}

/** Returns true only when the AudioContext is fully running. */
export function isCtxRunning(): boolean {
  try { return getCtx().state === "running"; } catch { return false; }
}

/**
 * Soft 3-note rising chime played the instant audio unlocks.
 * Confirms to the user that sound is now active.
 */
export function playUnlock() {
  try {
    const c = getCtx();
    const notes = [523.25, 659.25, 783.99]; // C5 → E5 → G5
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = c.currentTime + i * 0.1;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.35);
    });
  } catch {}
}

/**
 * Positive success chord — ascending 6-note fanfare.
 * Plays when a form is submitted successfully.
 */
export function playSuccess() {
  try {
    const c = getCtx();
    // C4 → E4 → G4 → C5 → E5 → G5  (C-major arpeggio)
    const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = c.currentTime + i * 0.08;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  } catch {}
}

export function playClick() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.frequency.setValueAtTime(1200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.08);
    gain.gain.setValueAtTime(0.15, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.08);
  } catch {}
}

export function playHover() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1000, c.currentTime + 0.05);
    gain.gain.setValueAtTime(0.05, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.12);
  } catch {}
}

export function playWhoosh() {
  try {
    const c = getCtx();
    const bufferSize = c.sampleRate * 0.4;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const source = c.createBufferSource();
    source.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(200, c.currentTime);
    filter.frequency.exponentialRampToValueAtTime(4000, c.currentTime + 0.2);
    filter.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.4);
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, c.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, c.currentTime + 0.4);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);
    source.start(c.currentTime);
  } catch {}
}

export function playTransition() {
  try {
    const c = getCtx();
    const freqs = [440, 554, 659, 880];
    freqs.forEach((f, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.connect(gain);
      gain.connect(c.destination);
      osc.type = "sine";
      osc.frequency.value = f;
      const t = c.currentTime + i * 0.06;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.08, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
      osc.start(t);
      osc.stop(t + 0.25);
    });
  } catch {}
}

/**
 * Technological linear-motion deploy sound for each menu item sliding in.
 * Each successive `index` raises the base pitch, so 5 items produce a
 * fast rising scale — like a system powering up line by line.
 */
export function playMenuSlide(index: number) {
  try {
    const c = getCtx();
    const base = 260 + index * 85; // rising pitch per item

    // Sawtooth through a tight bandpass = metallic servo / data-line character
    const osc = c.createOscillator();
    osc.type = "sawtooth";

    const filter = c.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = base;
    filter.Q.value = 7;

    // Second harmonic blip for brightness
    const osc2 = c.createOscillator();
    osc2.type = "square";
    osc2.frequency.setValueAtTime(base * 2, c.currentTime);
    osc2.frequency.linearRampToValueAtTime(base * 3.5, c.currentTime + 0.06);
    const gain2 = c.createGain();
    gain2.gain.setValueAtTime(0.018, c.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07);
    osc2.connect(gain2);
    gain2.connect(c.destination);

    const gain = c.createGain();
    osc.frequency.setValueAtTime(base, c.currentTime);
    osc.frequency.linearRampToValueAtTime(base * 2.4, c.currentTime + 0.07);
    gain.gain.setValueAtTime(0, c.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, c.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.1);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(c.destination);

    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.1);
    osc2.start(c.currentTime);
    osc2.stop(c.currentTime + 0.07);
  } catch {}
}

/** Soft keystroke — very short, quiet click for typing feedback. */
export function playKeyPress() {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.connect(gain);
    gain.connect(c.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(520, c.currentTime + 0.035);
    gain.gain.setValueAtTime(0.035, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.05);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + 0.05);
  } catch {}
}

/**
 * Ambient music — a slow pad-like chord built from Web Audio oscillators.
 * Sounds like a gentle, breathable background hum. Volume is kept very low
 * (gain 0.02) so it never distracts. A slow LFO tremolo at 0.08 Hz adds
 * natural breathing motion. Users can mute anytime via the header toggle.
 */
export function startAmbient(): () => void {
  try {
    const c = getCtx();
    // Chord: root, fifth, octave (power chord — sounds wide and neutral)
    const freqs = [55, 82.5, 110, 165];
    const oscs = freqs.map((f) => {
      const o = c.createOscillator();
      o.type = "sine";
      o.frequency.value = f;
      return o;
    });

    // LFO tremolo for organic breathing feel
    const lfo = c.createOscillator();
    const lfoGain = c.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.08; // one breath every ~12 seconds
    lfoGain.gain.value = 0.006; // tremolo depth — subtle
    lfo.connect(lfoGain);

    const masterGain = c.createGain();
    masterGain.gain.value = 0.02; // very quiet
    lfoGain.connect(masterGain.gain); // LFO modulates master volume

    oscs.forEach((o) => { o.connect(masterGain); o.start(); });
    lfo.start();
    masterGain.connect(c.destination);

    return () => {
      try { oscs.forEach((o) => o.stop()); lfo.stop(); } catch {}
    };
  } catch {
    return () => {};
  }
}
