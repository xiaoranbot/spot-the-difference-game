// Whale Cottage — tiny WebAudio sound effects, synthesized live.
// No audio files: every sound is an oscillator (or a short arpeggio of them).
'use strict';

const SoundFX = {
  ctx: null,
  muted: false,

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  },

  // One short sine blip: frequency, start delay, length, volume.
  blip(freq, delay, length, volume) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + length + 0.05);
  },

  // A correct find: a bright two-note chime.
  found() {
    this.blip(880, 0, 0.16, 0.22);
    this.blip(1318.5, 0.09, 0.24, 0.2);
  },

  // A wrong click: one low, soft thud.
  wrong() {
    this.blip(160, 0, 0.18, 0.16);
  },

  // A hint: a gentle rising pair.
  hint() {
    this.blip(660, 0, 0.12, 0.14);
    this.blip(990, 0.08, 0.16, 0.12);
  },

  // Winning: a small rising arpeggio.
  win() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((freq, i) => this.blip(freq, i * 0.11, 0.3, 0.2));
  },

  // Starting a round: a single soft note.
  start() {
    this.blip(523.25, 0, 0.2, 0.16);
  },
};
