// Web Audio API procedural sound synthesizer — zero external audio files required

class FortuneAudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  constructor() {
    try {
      const saved = localStorage.getItem('chatin_bella_muted');
      this.muted = saved === 'true';
    } catch {
      this.muted = false;
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(value: boolean): void {
    this.muted = value;
    try {
      localStorage.setItem('chatin_bella_muted', String(value));
    } catch {
      // ignore storage errors
    }
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playTap(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.055);

    gain.gain.setValueAtTime(0.11, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.075);
  }

  public playPullTension(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(410, now + 0.55);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.07, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  public playCookieCrack(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Multi-burst crisp cookie crunch using filtered noise
    const bufferSize = Math.floor(ctx.sampleRate * 0.28);
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Sharp transient spikes mixed with crisp crackle
      const env = Math.pow(1 - i / bufferSize, 1.8);
      const spike = Math.random() < 0.14 ? 1.0 : 0.45;
      data[i] = (Math.random() * 2 - 1) * env * spike;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(2100, now);
    bandpass.Q.setValueAtTime(1.4, now);

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(750, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.45, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(bandpass);
    bandpass.connect(highpass);
    highpass.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + 0.27);

    // Crispy snap transient
    [0, 0.045, 0.09].forEach((offset, idx) => {
      const snapOsc = ctx.createOscillator();
      const snapGain = ctx.createGain();
      snapOsc.type = 'square';
      snapOsc.frequency.setValueAtTime(380 - idx * 65, now + offset);
      snapOsc.frequency.exponentialRampToValueAtTime(95, now + offset + 0.035);

      snapGain.gain.setValueAtTime(0.14 / (idx + 1), now + offset);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);

      snapOsc.connect(snapGain);
      snapGain.connect(ctx.destination);
      snapOsc.start(now + offset);
      snapOsc.stop(now + offset + 0.045);
    });
  }

  public playMagicChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Festive pentatonic sparkle (C5, E5, G5, A5, C6)
    const notes = [523.25, 659.25, 783.99, 880.0, 1046.5];

    notes.forEach((freq, i) => {
      const start = now + i * 0.065;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.11, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.68);
    });
  }

  public playFavoriteChime(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [659.25, 987.77].forEach((freq, i) => {
      const start = now + i * 0.08;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.12, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.38);
    });
  }
}

export const soundEngine = new FortuneAudioEngine();
