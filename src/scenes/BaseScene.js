export class BaseScene {
  constructor() {
    this.context = null;
  }

  get renderer() {
    return this.context.renderer;
  }

  get assets() {
    return this.context.assets;
  }

  get input() {
    return this.context.input;
  }

  get audio() {
    return this.context.audio;
  }

  get sceneManager() {
    return this.context.sceneManager;
  }

  enter() {}

  exit() {}

  update() {}

  render() {}
}
