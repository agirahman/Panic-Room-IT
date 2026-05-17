
/**
 * Simple tone generator using Web Audio API to avoid external dependencies.
 */

class SoundService {
  private audioContext: AudioContext | null = null;

  resumeContext() {
    this.init();
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  private init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        latencyHint: 'interactive'
      });
    }
  }

  private playTone(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
    this.resumeContext();
    if (!this.audioContext || this.audioContext.state === 'suspended') return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
    
    gain.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start();
    osc.stop(this.audioContext.currentTime + duration);
  }

  private playFile(path: string, volume: number = 0.5) {
    this.resumeContext();
    const audio = new Audio(path);
    audio.volume = volume;
    audio.play().catch(e => console.error("Error playing sound:", path, e));
  }

  private alertAudio: HTMLAudioElement | null = null;

  startAlert() {
    this.stopAlert();
    this.alertAudio = new Audio('/assets/danger-siren-alarm_BfknMds.mp3');
    this.alertAudio.volume = 0.3;
    // this.alertAudio.loop = true; // We don't want it to loop indefinitely if we just want it to act as an alert, but maybe we do while incident is active? The user only complained that it stays after it's solved.
    this.alertAudio.play().catch(e => console.error("Alert play error:", e));
  }

  stopAlert() {
    if (this.alertAudio) {
      this.alertAudio.pause();
      this.alertAudio.currentTime = 0;
      this.alertAudio = null;
    }
  }

  playSlackPing() {
    this.playFile('/assets/discord ping.mp3', 0.5);
  }

  playSuccess() {
    this.playFile('/assets/correct.mp3', 0.5);
  }

  playError() {
    this.playFile('/assets/wrong-answer-buzzer.mp3', 0.5);
  }

  playClick() {
    this.playTone(1500, 'sine', 0.05, 0.02);
  }

  playVictory() {
    this.playFile('/assets/winner.mp3', 0.6);
  }

  playGameOver() {
    this.playFile('/assets/gameover.mp3', 0.6);
  }

  private bgm: HTMLAudioElement | null = null;

  startBGM() {
    if (this.bgm) return;
    this.bgm = new Audio('assets/BACKSOUND RYAN SUPERNAYR ｜ PART 1 [7hOwM_PfNBo].m4a');
    this.bgm.loop = true;
    this.bgm.volume = 0.3;
    this.bgm.play().catch(e => console.error("BGM play error:", e));
  }

  stopBGM() {
    if (this.bgm) {
      this.bgm.pause();
      this.bgm = null;
    }
  }
}

export const sounds = new SoundService();
