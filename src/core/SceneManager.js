export class SceneManager {
  constructor(game) {
    this.game = game;
    this.current = null;
  }

  change(nextScene) {
    if (!nextScene) {
      throw new Error("SceneManager.change requires a valid scene instance.");
    }

    const previous = this.current;

    if (previous && typeof previous.exit === "function") {
      previous.exit(nextScene);
    }

    nextScene.context = this.game.getContext();
    this.current = nextScene;

    if (typeof nextScene.enter === "function") {
      nextScene.enter(previous);
    }
  }

  update(dt) {
    if (this.current && typeof this.current.update === "function") {
      this.current.update(dt);
    }
  }

  render(renderer) {
    if (this.current && typeof this.current.render === "function") {
      this.current.render(renderer);
    }
  }
}
