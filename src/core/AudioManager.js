export class AudioManager {
  constructor(assets) {
    this.assets = assets;
    this.volume = 1;
    this.muted = false;
    this.active = new Set();
  }

  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, value));
  }

  setMuted(flag) {
    this.muted = Boolean(flag);
  }

  play(id, options = {}) {
    const source = this.assets.getAudio(id);
    if (!source) {
      return null;
    }

    const clip = source.cloneNode(true);
    clip.loop = Boolean(options.loop);
    clip.currentTime = 0;
    clip.volume = this.muted ? 0 : this.volume * (options.volume ?? 1);

    const cleanup = () => {
      this.active.delete(clip);
    };

    clip.addEventListener("ended", cleanup, { once: true });
    clip.addEventListener("pause", cleanup, { once: true });
    this.active.add(clip);

    clip.play().catch((error) => {
      console.warn(`Audio playback blocked for ${id}:`, error.message);
      cleanup();
    });

    return clip;
  }

  stopAll() {
    for (const clip of this.active) {
      clip.pause();
      clip.currentTime = 0;
    }
    this.active.clear();
  }
}
