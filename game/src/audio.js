// audio.js — every sound in the game is a small WebAudio tone, made on the
// spot. No audio files are shipped and nothing is fetched from a network.

export class SoundFX {
  constructor() {
    this.enabled = true;
    this.context = null;
  }

  ensure() {
    if (!this.context) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.context = new AC();
    }
    if (this.context.state === 'suspended') void this.context.resume();
    return this.context;
  }

  tone(freq, startAt, duration, type, gain) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t = ctx.currentTime + startAt;
    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.02);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  // Two-note chime when a difference is found.
  found() {
    this.tone(660, 0, 0.18, 'sine', 0.16);
    this.tone(990, 0.09, 0.28, 'sine', 0.14);
  }

  // Soft low thud for a wrong click.
  wrong() {
    this.tone(160, 0, 0.16, 'triangle', 0.12);
  }

  // Gentle pluck when a hint is used.
  hint() {
    this.tone(520, 0, 0.14, 'sine', 0.1);
    this.tone(780, 0.07, 0.2, 'sine', 0.09);
  }

  // Little rising arpeggio for finishing a level.
  win() {
    this.tone(523, 0, 0.2, 'sine', 0.14);
    this.tone(659, 0.12, 0.2, 'sine', 0.14);
    this.tone(784, 0.24, 0.3, 'sine', 0.14);
    this.tone(1047, 0.36, 0.4, 'sine', 0.12);
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
}
