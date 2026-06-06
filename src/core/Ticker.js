export class Ticker {
  constructor(onTick) {
    this.onTick = onTick;
    this.running = false;
    this.lastTime = 0;
    this.frame = this.frame.bind(this);
  }

  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.frame);
  }

  stop() {
    this.running = false;
  }

  frame(now) {
    if (!this.running) {
      return;
    }

    const dt = Math.min((now - this.lastTime) / 1000, 0.1);
    this.lastTime = now;
    this.onTick(dt);
    requestAnimationFrame(this.frame);
  }
}
