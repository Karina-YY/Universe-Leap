import { Easing } from "./Easing.js";

class Action {
  constructor() {
    this.started = false;
    this.finished = false;
  }

  start() {
    this.started = true;
  }

  reset() {
    this.started = false;
    this.finished = false;
  }

  step(dt) {
    this.finished = true;
    return dt;
  }
}

export class DelayAction extends Action {
  constructor(duration) {
    super();
    this.duration = Math.max(0, duration);
    this.elapsed = 0;
  }

  reset() {
    super.reset();
    this.elapsed = 0;
  }

  step(dt) {
    if (this.finished) {
      return dt;
    }

    const remaining = this.duration - this.elapsed;
    const consumed = Math.min(dt, remaining);
    this.elapsed += consumed;

    if (this.elapsed >= this.duration) {
      this.finished = true;
    }

    return dt - consumed;
  }
}

export class CallAction extends Action {
  constructor(callback) {
    super();
    this.callback = callback;
  }

  step(dt) {
    if (!this.finished && typeof this.callback === "function") {
      this.callback();
    }
    this.finished = true;
    return dt;
  }
}

export class TweenAction extends Action {
  constructor(target, to, duration, options = {}) {
    super();
    this.target = target;
    this.to = to;
    this.duration = Math.max(0.0001, duration);
    this.from = options.from || null;
    this.ease = options.ease || Easing.linear;
    this.onUpdate = options.onUpdate || null;
    this.onComplete = options.onComplete || null;
    this.elapsed = 0;
    this.snapshot = null;
  }

  start() {
    super.start();
    this.snapshot = {};
    for (const key of Object.keys(this.to)) {
      this.snapshot[key] = this.from && key in this.from ? this.from[key] : this.target[key];
    }
  }

  reset() {
    super.reset();
    this.elapsed = 0;
    this.snapshot = null;
  }

  step(dt) {
    if (this.finished) {
      return dt;
    }

    if (!this.started) {
      this.start();
    }

    const remaining = this.duration - this.elapsed;
    const consumed = Math.min(dt, remaining);
    this.elapsed += consumed;
    const ratio = Math.min(this.elapsed / this.duration, 1);
    const eased = this.ease(ratio);

    for (const key of Object.keys(this.to)) {
      const startValue = this.snapshot[key];
      const endValue = this.to[key];
      if (typeof startValue === "number" && typeof endValue === "number") {
        this.target[key] = startValue + (endValue - startValue) * eased;
      }
    }

    if (typeof this.onUpdate === "function") {
      this.onUpdate(this.target, eased);
    }

    if (ratio >= 1) {
      this.finished = true;
      if (typeof this.onComplete === "function") {
        this.onComplete(this.target);
      }
    }

    return dt - consumed;
  }
}

export class SequenceAction extends Action {
  constructor(actions) {
    super();
    this.actions = actions;
    this.index = 0;
  }

  reset() {
    super.reset();
    this.index = 0;
    this.actions.forEach((action) => action.reset());
  }

  step(dt) {
    let leftover = dt;

    while (this.index < this.actions.length) {
      const action = this.actions[this.index];
      if (!action.started) {
        action.start();
      }

      leftover = action.step(leftover);

      if (action.finished) {
        this.index += 1;
        continue;
      }

      leftover = 0;
      break;
    }

    if (this.index >= this.actions.length) {
      this.finished = true;
    }

    return leftover;
  }
}

export class ParallelAction extends Action {
  constructor(actions) {
    super();
    this.actions = actions;
  }

  reset() {
    super.reset();
    this.actions.forEach((action) => action.reset());
  }

  step(dt) {
    let allFinished = true;

    for (const action of this.actions) {
      if (action.finished) {
        continue;
      }
      if (!action.started) {
        action.start();
      }
      action.step(dt);
      if (!action.finished) {
        allFinished = false;
      }
    }

    if (allFinished) {
      this.finished = true;
    }

    return 0;
  }
}
