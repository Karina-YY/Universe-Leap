export class Input {
  constructor(canvas, renderer) {
    this.canvas = canvas;
    this.renderer = renderer;
    this.keysDown = new Set();
    this.keysPressed = new Set();
    this.pointer = {
      x: 0,
      y: 0,
      down: false,
      pressed: false,
    };

    window.addEventListener("keydown", (event) => {
      if (!this.keysDown.has(event.code)) {
        this.keysPressed.add(event.code);
      }
      this.keysDown.add(event.code);
    });

    window.addEventListener("keyup", (event) => {
      this.keysDown.delete(event.code);
    });

    canvas.addEventListener("pointermove", (event) => {
      this.updatePointer(event);
    });

    canvas.addEventListener("pointerdown", (event) => {
      this.updatePointer(event);
      this.pointer.down = true;
      this.pointer.pressed = true;
    });

    window.addEventListener("pointerup", (event) => {
      this.updatePointer(event);
      this.pointer.down = false;
    });
  }

  updatePointer(event) {
    const position = this.renderer.toCanvasPoint(event.clientX, event.clientY);
    this.pointer.x = position.x;
    this.pointer.y = position.y;
  }

  isKeyDown(code) {
    return this.keysDown.has(code);
  }

  wasKeyPressed(code) {
    return this.keysPressed.has(code);
  }

  isPointerDown() {
    return this.pointer.down;
  }

  wasPointerPressed() {
    return this.pointer.pressed;
  }

  endFrame() {
    this.keysPressed.clear();
    this.pointer.pressed = false;
  }
}
