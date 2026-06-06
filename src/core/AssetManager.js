function cloneJSON(value) {
  return JSON.parse(JSON.stringify(value));
}

async function retry(task, retries, onRetry) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await task(attempt);
    } catch (error) {
      lastError = error;
      if (attempt < retries && typeof onRetry === "function") {
        onRetry(error, attempt + 1);
      }
    }
  }

  throw lastError;
}

export class AssetManager {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
    this.json = new Map();
    this.errors = [];
  }

  async preload(manifest, options = {}) {
    const retries = options.retries ?? 2;
    const items = [
      ...(manifest.images || []).map((item) => ({ ...item, type: "image" })),
      ...(manifest.audio || []).map((item) => ({ ...item, type: "audio" })),
      ...(manifest.json || []).map((item) => ({ ...item, type: "json" })),
    ];
    const total = items.length;
    let loaded = 0;

    this.errors = [];

    for (const item of items) {
      try {
        const data = await retry(() => this.loadItem(item), item.retries ?? retries);
        this.storeItem(item, data);
      } catch (error) {
        const detail = {
          id: item.id,
          type: item.type,
          src: item.src || "inlineData",
          message: error.message,
        };
        this.errors.push(detail);
        if (typeof item.onError === "function") {
          item.onError(detail);
        }
      }

      loaded += 1;
      if (typeof options.onProgress === "function") {
        options.onProgress({
          loaded,
          total,
          progress: total === 0 ? 1 : loaded / total,
          item,
          failed: this.errors.length,
        });
      }
    }

    return {
      total,
      loaded,
      errors: [...this.errors],
    };
  }

  async loadItem(item) {
    if (!item.id) {
      throw new Error("Asset item requires an id.");
    }

    switch (item.type) {
      case "image":
        return this.loadImage(item);
      case "audio":
        return this.loadAudio(item);
      case "json":
        return this.loadJSON(item);
      default:
        throw new Error(`Unsupported asset type: ${item.type}`);
    }
  }

  loadImage(item) {
    return new Promise((resolve, reject) => {
      if (!item.src) {
        reject(new Error(`Image asset ${item.id} is missing src.`));
        return;
      }

      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Image failed to load: ${item.src}`));
      image.src = item.src;
    });
  }

  loadAudio(item) {
    return new Promise((resolve, reject) => {
      if (!item.src) {
        reject(new Error(`Audio asset ${item.id} is missing src.`));
        return;
      }

      const audio = new Audio();
      const cleanup = () => {
        audio.removeEventListener("canplaythrough", handleReady);
        audio.removeEventListener("loadeddata", handleReady);
        audio.removeEventListener("error", handleError);
      };
      const handleReady = () => {
        cleanup();
        resolve(audio);
      };
      const handleError = () => {
        cleanup();
        reject(new Error(`Audio failed to load: ${item.src}`));
      };

      audio.preload = "auto";
      audio.addEventListener("canplaythrough", handleReady, { once: true });
      audio.addEventListener("loadeddata", handleReady, { once: true });
      audio.addEventListener("error", handleError, { once: true });
      audio.src = item.src;
      audio.load();
    });
  }

  async loadJSON(item) {
    if (item.inlineData && !item.src) {
      return cloneJSON(item.inlineData);
    }

    if (!item.src) {
      throw new Error(`JSON asset ${item.id} is missing src.`);
    }

    try {
      const response = await fetch(item.src, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      if (item.inlineData) {
        return cloneJSON(item.inlineData);
      }
      throw new Error(`JSON failed to load: ${item.src} (${error.message})`);
    }
  }

  storeItem(item, data) {
    switch (item.type) {
      case "image":
        this.images.set(item.id, data);
        break;
      case "audio":
        this.audio.set(item.id, data);
        break;
      case "json":
        this.json.set(item.id, data);
        break;
      default:
        break;
    }
  }

  getImage(id) {
    return this.images.get(id) || null;
  }

  getAudio(id) {
    return this.audio.get(id) || null;
  }

  getJSON(id) {
    const value = this.json.get(id);
    return value ? cloneJSON(value) : null;
  }
}
