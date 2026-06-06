import { Game } from "./core/Game.js";
import { gameAssetManifest } from "./data/assets.js";
import { StartScene } from "./scenes/StartScene.js";

const canvas = document.getElementById("game-canvas");
const statusText = document.getElementById("status-text");
const statusOverlay = document.getElementById("status-overlay");

const game = new Game({
  canvas,
  width: 720,
  height: 1280,
});

window.__game = game;

function setStatus(message) {
  statusText.textContent = message;
}

async function bootstrap() {
  setStatus("初始化引擎...\n准备预加载资源");

  const result = await game.assets.preload(gameAssetManifest, {
    retries: 2,
    onProgress: ({ loaded, total, progress, item, failed }) => {
      const percent = Math.round(progress * 100);
      const current = item ? `${item.type}:${item.id}` : "-";
      setStatus(`正在加载资源 ${percent}%\n${loaded}/${total}\n当前: ${current}\n失败: ${failed}`);
    },
  });

  if (result.errors.length > 0) {
    const names = result.errors.map((entry) => `${entry.type}:${entry.id}`).join(", ");
    setStatus(`资源加载完成，但有 ${result.errors.length} 项失败\n${names}\n已使用可用资源继续启动`);
  } else {
    setStatus("资源加载完成\n进入 StartScene...");
  }

  game.start(new StartScene());

  window.setTimeout(() => {
    statusOverlay.classList.add("overlay--hidden");
  }, 1200);
}

bootstrap().catch((error) => {
  console.error(error);
  setStatus(`启动失败\n${error.message}`);
});
