export class Renderer {
  constructor({ canvas, width = 1280, height = 720 }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = width;
    this.height = height;
    this.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.background = "#050814";

    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);
  }

  resize() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const scale = Math.min(viewportWidth / this.width, viewportHeight / this.height);
    const displayWidth = Math.floor(this.width * scale);
    const displayHeight = Math.floor(this.height * scale);

    this.canvas.width = Math.floor(this.width * this.pixelRatio);
    this.canvas.height = Math.floor(this.height * this.pixelRatio);
    this.canvas.style.width = `${displayWidth}px`;
    this.canvas.style.height = `${displayHeight}px`;
  }

  beginFrame() {
    this.ctx.setTransform(this.pixelRatio, 0, 0, this.pixelRatio, 0, 0);
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.background;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  endFrame() {}

  withCamera(camera, draw) {
    const safeCamera = camera || { x: this.width * 0.5, y: this.height * 0.5, zoom: 1 };

    this.ctx.save();
    this.ctx.translate(this.width * 0.5, this.height * 0.5);
    this.ctx.scale(safeCamera.zoom || 1, safeCamera.zoom || 1);
    this.ctx.translate(-(safeCamera.x || 0), -(safeCamera.y || 0));
    draw(this.ctx);
    this.ctx.restore();
  }

  toCanvasPoint(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: ((clientX - rect.left) / rect.width) * this.width,
      y: ((clientY - rect.top) / rect.height) * this.height,
    };
  }

  roundedRectPath(x, y, width, height, radius = 12) {
    const ctx = this.ctx;
    const r = Math.min(radius, width * 0.5, height * 0.5);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + width - r, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + r);
    ctx.lineTo(x + width, y + height - r);
    ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    ctx.lineTo(x + r, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
}
