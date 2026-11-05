// Synthesizer using Web Audio API for responsive game audio without external file dependencies

class SoundManager {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // AudioContext will be initialized on first user interaction
    const saved = localStorage.getItem('quizmobile_sound_muted');
    if (saved !== null) {
      this.isMuted = saved === 'true';
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    localStorage.setItem('quizmobile_sound_muted', String(this.isMuted));
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Play short click / tap sound
  public playTap() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio fallback silent
    }
  }

  // Play countdown tick sound
  public playTick(isLastFew: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = isLastFew ? 'sawtooth' : 'sine';
      const freq = isLastFew ? 660 : 520;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(isLastFew ? 0.25 : 0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio fallback silent
    }
  }

  // Correct answer cheerful arpeggio
  public playCorrect() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.07);

        gain.gain.setValueAtTime(0.2, now + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.07 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + index * 0.07);
        osc.stop(now + index * 0.07 + 0.25);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Wrong answer subtle buzz
  public playWrong() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.3);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } catch {
      // Audio fallback silent
    }
  }

  // Game start / countdown fanfare
  public playStart() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        gain.gain.setValueAtTime(0.2, now + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.3);
      });
    } catch {
      // Audio fallback silent
    }
  }

  // Victory fanfare on podium
  public playVictory() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chords = [
        { notes: [523.25, 659.25, 783.99], time: 0, duration: 0.25 },
        { notes: [587.33, 739.99, 880], time: 0.25, duration: 0.25 },
        { notes: [659.25, 830.61, 987.77], time: 0.5, duration: 0.3 },
        { notes: [783.99, 987.77, 1174.66, 1567.98], time: 0.8, duration: 0.8 },
      ];
      chords.forEach((chord) => {
        chord.notes.forEach((freq) => {
          if (!this.ctx) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + chord.time);

          gain.gain.setValueAtTime(0.12, now + chord.time);
          gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + chord.duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + chord.time);
          osc.stop(now + chord.time + chord.duration);
        });
      });
    } catch {
      // Audio fallback silent
    }
  }
}

export const soundManager = new SoundManager();
