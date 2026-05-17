
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

  private activeAudios: Set<HTMLAudioElement> = new Set();
  
  stopEffects() {
    this.activeAudios.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    this.activeAudios.clear();
  }

  private playFile(path: string, volume: number = 0.5) {
    this.resumeContext();
    const audio = new Audio(path);
    audio.volume = volume;
    this.activeAudios.add(audio);
    
    audio.addEventListener('ended', () => {
      this.activeAudios.delete(audio);
    });

    audio.play().catch(e => {
      this.activeAudios.delete(audio);
      console.error("Error playing sound:", path, e);
    });
  }

  private alertAudio: HTMLAudioElement | null = null;
  private alertPlayPromise: Promise<void> | null = null;

  startAlert() {
    this.stopAlert();
    this.alertAudio = new Audio('/error.mp3');
    this.alertAudio.volume = 0.3;
    this.alertAudio.loop = true; // Loop the error sound while active
    this.alertPlayPromise = this.alertAudio.play();
    this.alertPlayPromise.catch(e => {
      if (e.name !== 'AbortError') console.error("Alert play error:", e);
    });
  }

  stopAlert() {
    if (this.alertAudio) {
      const audioToStop = this.alertAudio;
      this.alertAudio = null;
      
      // If play() was called, we must wait for it to resolve or catch before pausing
      if (this.alertPlayPromise) {
        this.alertPlayPromise.then(() => {
          audioToStop.pause();
          audioToStop.currentTime = 0;
        }).catch(() => {});
        this.alertPlayPromise = null;
      } else {
        audioToStop.pause();
        audioToStop.currentTime = 0;
      }
    }
  }

  playSlackPing() {
    this.playFile('/ping.mp3', 0.5);
  }

  playSuccess() {
    this.playFile('/correct.mp3', 0.5);
  }

  playError() {
    this.playFile('/wrong.mp3', 0.5);
  }

  playClick() {
    this.playTone(1500, 'sine', 0.05, 0.02);
  }

  playVictory() {
    this.playFile('/winner.mp3', 0.6);
  }

  playGameOver() {
    this.playFile('/gameover.mp3', 0.6);
  }

  private bgm: HTMLAudioElement | null = null;
  private bgmPlayPromise: Promise<void> | null = null;

  startBGM() {
    if (!this.bgm) {
      this.bgm = new Audio('/bgm.m4a');
      this.bgm.loop = true;
      this.bgm.volume = 0.3;
    }
    this.bgmPlayPromise = this.bgm.play();
    this.bgmPlayPromise.catch(e => {
      if (e.name !== 'AbortError') console.error("BGM play error:", e);
    });
  }

  stopBGM() {
    if (this.bgm) {
      // Don't reset currentTime here so it resumes appropriately when startBGM is called
      if (this.bgmPlayPromise) {
        this.bgmPlayPromise.then(() => {
          this.bgm?.pause();
        }).catch(() => {});
        this.bgmPlayPromise = null;
      } else {
        this.bgm.pause();
      }
    }
  }
}

export const sounds = new SoundService();
