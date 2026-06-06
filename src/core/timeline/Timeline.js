import {
  CallAction,
  DelayAction,
  ParallelAction,
  SequenceAction,
  TweenAction,
} from "./Tween.js";

export class Timeline {
  constructor() {
    this.actions = [];
    this.paused = false;
  }

  add(action) {
    action.reset();
    this.actions.push(action);
    return action;
  }

  update(dt) {
    if (this.paused) {
      return;
    }

    this.actions = this.actions.filter((action) => {
      if (!action.started) {
        action.start();
      }
      action.step(dt);
      return !action.finished;
    });
  }

  clear() {
    this.actions.length = 0;
  }

  isIdle() {
    return this.actions.length === 0;
  }
}

export function tween(target, to, duration, options = {}) {
  return new TweenAction(target, to, duration, options);
}

export function delay(duration) {
  return new DelayAction(duration);
}

export function call(callback) {
  return new CallAction(callback);
}

export function sequence(actions) {
  return new SequenceAction(actions);
}

export function parallel(actions) {
  return new ParallelAction(actions);
}
