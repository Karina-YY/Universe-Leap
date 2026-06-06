const storyInlineData = {
  lines: [
    "贝果震动，镜头开始向未知中心推进。",
    "字幕渐入，时间轴并行推动镜头与文字演出。",
    "推拉结束后，场景回到玩家可控状态。",
  ],
};

export const gameAssetManifest = {
  // 图片示例: 可直接使用本地相对路径。
  images: [
    { id: "beacon", src: "./assets/images/beacon.svg" },
  ],

  // 音频示例: 直接使用本地文件路径，AssetManager 会预加载并缓存 HTMLAudioElement。
  audio: [
    { id: "confirm", src: "./assets/audio/confirm.wav" },
  ],

  // JSON 示例: 为兼容 file:// 打开场景，提供 inlineData 作为本地兜底。
  json: [
    {
      id: "story",
      src: "./assets/data/story.json",
      inlineData: storyInlineData,
    },
  ],
};

// 调用方式示例:
// await assets.preload(gameAssetManifest, { onProgress: ({ progress }) => console.log(progress) });
// const image = assets.getImage("beacon");
// const audio = assets.getAudio("confirm");
// const data = assets.getJSON("story");
