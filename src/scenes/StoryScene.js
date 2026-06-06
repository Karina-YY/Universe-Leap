import { BaseScene } from "./BaseScene.js";
import { StartScene } from "./StartScene.js";
import { Easing } from "../core/timeline/Easing.js";
import { Timeline, call, delay, parallel, sequence, tween } from "../core/timeline/Timeline.js";

export class StoryScene extends BaseScene {
  constructor() {
    super();
    this.time = 0;
    this.timeline = new Timeline();
    this.camera = { x: 360, y: 640, zoom: 1 };
    this.subtitle = { text: "", alpha: 0 };
    this.finished = false;
    this.story = null;
    this.orbs = [
      { x: 252, y: 516, radius: 42, color: "#74f2ce", drift: 0.5 },
      { x: 422, y: 382, radius: 60, color: "#7aa5ff", drift: 0.9 },
      { x: 500, y: 744, radius: 34, color: "#ff7aa2", drift: 1.2 },
    ];
  }

  enter() {
    this.story = this.assets.getJSON("story") || { lines: [] };
    this.buildTimeline();
  }

  buildTimeline() {
    const lines = this.story.lines || [];
    const beat = (text, cameraTo, hold = 1.2) =>
      sequence([
        call(() => {
          this.subtitle.text = text;
          this.audio.play("confirm", { volume: 0.18 });
        }),
        parallel([
          tween(this.subtitle, { alpha: 1 }, 0.65, { ease: Easing.easeOutCubic }),
          tween(this.camera, cameraTo, 2.8, { ease: Easing.easeInOutCubic }),
        ]),
        delay(hold),
        tween(this.subtitle, { alpha: 0 }, 0.55, { ease: Easing.easeInOutQuad }),
        delay(0.18),
      ]);

    this.timeline.add(
      sequence([
        beat(lines[0] || "贝果震动，镜头开始向未知中心推进。", { x: 360, y: 544, zoom: 1.12 }, 1.35),
        beat(lines[1] || "字幕渐入，时间轴并行推动镜头与文字演出。", { x: 392, y: 438, zoom: 1.28 }, 1.1),
        beat(lines[2] || "推拉结束后，场景回到玩家可控状态。", { x: 360, y: 640, zoom: 1.02 }, 1.45),
        call(() => {
          this.subtitle.text = "StoryScene 完成。点击屏幕返回 StartScene。";
          this.subtitle.alpha = 1;
          this.finished = true;
        }),
      ])
    );
  }

  update(dt) {
    this.time += dt;
    this.timeline.update(dt);

    if (!this.finished) {
      return;
    }

    if (
      this.input.wasKeyPressed("Enter") ||
      this.input.wasKeyPressed("Space") ||
      this.input.wasPointerPressed()
    ) {
      this.sceneManager.change(new StartScene());
    }
  }

  drawWorld(ctx) {
    const beacon = this.assets.getImage("beacon");

    const gradient = ctx.createRadialGradient(360, 620, 60, 360, 620, 520);
    gradient.addColorStop(0, "rgba(28, 58, 120, 0.38)");
    gradient.addColorStop(1, "rgba(5, 8, 20, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(40, 40, 640, 1200);

    ctx.strokeStyle = "rgba(116, 242, 206, 0.12)";
    ctx.lineWidth = 1;
    for (let x = 54; x <= 666; x += 68) {
      ctx.beginPath();
      ctx.moveTo(x, 40);
      ctx.lineTo(x, 1240);
      ctx.stroke();
    }
    for (let y = 40; y <= 1240; y += 88) {
      ctx.beginPath();
      ctx.moveTo(40, y);
      ctx.lineTo(680, y);
      ctx.stroke();
    }

    for (const orb of this.orbs) {
      const pulse = 1 + Math.sin(this.time * (1.4 + orb.drift)) * 0.08;
      ctx.fillStyle = orb.color;
      ctx.globalAlpha = 0.16;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius * 2.4 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.fillStyle = "#ffbf69";
    ctx.beginPath();
    ctx.arc(360, 620, 108, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#201421";
    ctx.beginPath();
    ctx.arc(388, 616, 68, 0, Math.PI * 2);
    ctx.fill();

    if (beacon) {
      ctx.drawImage(beacon, 256, 152, 208, 208);
    }

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.font = "600 28px 'SF Pro Display', 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("StoryScene / Timeline Demo", 360, 438);
    ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
    ctx.font = "400 18px 'SF Pro Text', 'PingFang SC', sans-serif";
    ctx.fillText("镜头对象: camera = { x, y, zoom }", 360, 474);
    ctx.fillText("字幕对象: subtitle = { text, alpha }", 360, 504);
    ctx.textAlign = "start";
  }

  drawSubtitle(ctx, renderer) {
    if (!this.subtitle.text || this.subtitle.alpha <= 0.01) {
      return;
    }

    ctx.save();
    ctx.globalAlpha = this.subtitle.alpha;
    const panelX = 48;
    const panelY = renderer.height - 218;
    const panelWidth = renderer.width - 96;
    const panelHeight = 132;

    ctx.fillStyle = "rgba(8, 13, 32, 0.72)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.14)";
    ctx.lineWidth = 1.4;
    renderer.roundedRectPath(panelX, panelY, panelWidth, panelHeight, 18);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
    ctx.font = "500 28px 'SF Pro Text', 'PingFang SC', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(this.subtitle.text, renderer.width * 0.5, panelY + 76);
    ctx.font = "400 18px 'SF Pro Text', 'PingFang SC', sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.56)";
    ctx.fillText("点击任意位置可继续或返回", renderer.width * 0.5, panelY + 108);
    ctx.textAlign = "start";
    ctx.restore();
  }

  render(renderer) {
    const ctx = renderer.ctx;

    renderer.withCamera(this.camera, (cameraCtx) => {
      this.drawWorld(cameraCtx);
    });

    ctx.save();
    ctx.fillStyle = "rgba(245, 247, 255, 0.68)";
    ctx.font = "400 16px 'SF Pro Text', 'PingFang SC', sans-serif";
    ctx.fillText(
      `camera x:${this.camera.x.toFixed(1)} y:${this.camera.y.toFixed(1)} zoom:${this.camera.zoom.toFixed(2)}`,
      28,
      38
    );
    ctx.restore();

    this.drawSubtitle(ctx, renderer);
  }
}
