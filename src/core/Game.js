import { Renderer } from "./Renderer.js";
import { SceneManager } from "./SceneManager.js";
import { AssetManager } from "./AssetManager.js";
import { Input } from "./Input.js";
import { AudioManager } from "./AudioManager.js";
import { Ticker } from "./Ticker.js";

export class Game {
  constructor({ canvas, width = 1280, height = 720 }) {
    this.renderer = new Renderer({ canvas, width, height });
    this.assets = new AssetManager();
    this.audio = new AudioManager(this.assets);
    this.input = new Input(canvas, this.renderer);
    this.sceneManager = new SceneManager(this);
    this.ticker = new Ticker((dt) => this.update(dt));

    this.renderer.resize();
  }

  getContext() {
    return {
      game: this,
      renderer: this.renderer,
      assets: this.assets,
      audio: this.audio,
      input: this.input,
      sceneManager: this.sceneManager,
    };
  }

  start(initialScene) {
    this.sceneManager.change(initialScene);
    this.ticker.start();
  }

  update(dt) {
    this.sceneManager.update(dt);
    this.renderer.beginFrame();
    this.sceneManager.render(this.renderer);
    this.renderer.endFrame();
    this.input.endFrame();
  }
}
