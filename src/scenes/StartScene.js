import { BaseScene } from "./BaseScene.js";
import { StoryScene } from "./StoryScene.js";

export class StartScene extends BaseScene {
  constructor() {
    super();
    this.time = 0;
    this.button = { x: 140, y: 932, width: 440, height: 88 };
    this.stars = Array.from({ length: 72 }, (_, index) => ({
      x: (index * 97) % 720,
      y: (index * 131) % 1280,
      size: 1 + (index % 3),
      speed: 4 + (index % 7),
    }));
  }

  update(dt) {
    this.time += dt;

    for (const star of this.stars) {
      star.y += star.speed * dt;
      if (star.y > 1280) {
        star.y = -8;
      }
    }

    const confirm =
      this.input.wasKeyPressed("Enter") ||
      this.input.wasKeyPressed("Space") ||
      (this.input.wasPointerPressed() && this.isPointerInsideButton());

    if (confirm) {
      this.audio.play("confirm", { volume: 0.35 });
      this.sceneManager.change(new StoryScene());
    }
  }

  isPointerInsideButton() {
    const { x, y } = this.input.pointer;
    const { button } = this;
    return x >= button.x && x <= button.x + button.width && y >= button.y && y <= button.y + button.height;
  }

  render(renderer) {
    const ctx = renderer.ctx;
    const beacon = this.assets.getImage("beacon");
    const hovered = this.isPointerInsideButton();
    const pulse = 1 + Math.sin(this.time * 2.2) * 0.03;

    ctx.save();
    ctx.fillStyle = "rgba(113, 168, 255, 0.07)";
    for (const star of this.stars) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(116, 242, 206, 0.14)";
    ctx.lineWidth = 1;
    for (let x = 64; x <= 656; x += 74) {
      ctx.beginPath();
      ctx.moveTo(x, 124);
      ctx.lineTo(x, 1160);
      ctx.stroke();
    }
    for (let y = 124; y <= 1160; y += 92) {
      ctx.beginPath();
      ctx.moveTo(64, y);
      ctx.lineTo(656, y);
      ctx.stroke();
    }
    ctx.restore();

    if (beacon) {
      const wobble = Math.sin(this.time * 1.4) * 10;
      ctx.save();
      ctx.translate(360, 310 + wobble);
      ctx.scale(pulse, pulse);
      ctx.drawImage(beacon, -140, -140, 280, 280);
      ctx.restore();
    }

    ctx.fillStyle = "#f5f7ff";
    ctx.font = "700 52px 'SF Pro Display', 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("瞬息全宇宙", 360, 542);
    ctx.fillText("逃离贝果", 360, 604);

    ctx.fillStyle = "rgba(245, 247, 255, 0.74)";
    ctx.font = "400 24px 'SF Pro Text', 'PingFang SC', sans-serif";
    ctx.fillText("纯离线 Canvas 手机端骨架", 360, 676);
    ctx.font = "400 20px 'SF Pro Text', 'PingFang SC', sans-serif";
    ctx.fillText("点击下方按钮，进入 StoryScene 剧情转场演示", 360, 724);
    ctx.fillText("竖屏优先 / 触控优先 / 本地离线可运行", 360, 760);

    ctx.fillStyle = "rgba(255, 191, 105, 0.12)";
    ctx.strokeStyle = hovered ? "rgba(255, 191, 105, 0.9)" : "rgba(116, 242, 206, 0.45)";
    ctx.lineWidth = hovered ? 2.4 : 1.4;
    renderer.roundedRectPath(this.button.x, this.button.y, this.button.width, this.button.height, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#ffffff";
    ctx.font = "700 28px 'SF Pro Display', 'PingFang SC', sans-serif";
    ctx.fillText("点击开始剧情演示", 360, 988);

    ctx.fillStyle = "rgba(245, 247, 255, 0.58)";
    ctx.font = "400 18px 'SF Pro Text', 'PingFang SC', sans-serif";
    ctx.fillText("StartScene: 手机端欢迎页与触控入口", 360, 1092);
    ctx.fillText("已加载 JSON: story / 图片: beacon / 音频: confirm", 360, 1126);
    ctx.fillText("桌面端仍可用 Enter / Space 进入剧情", 360, 1160);
    ctx.textAlign = "start";
  }
}
