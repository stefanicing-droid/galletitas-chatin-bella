// Smart border flood-fill background removal for white, cream, and checkerboard backgrounds

export interface ProcessedDogSprites {
  chatinUrl: string;
  bellaUrl: string;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
    img.src = src;
  });
}

function isNeutralLightBackground(
  r: number,
  g: number,
  b: number,
  a: number,
  bgPalette: Array<[number, number, number]>,
  tolerance: number
): boolean {
  if (a < 30) return true;

  for (let i = 0; i < bgPalette.length; i++) {
    const [pr, pg, pb] = bgPalette[i];
    const dist = Math.abs(r - pr) + Math.abs(g - pg) + Math.abs(b - pb);
    if (dist <= tolerance * 2.5) {
      return true;
    }
  }

  const maxC = Math.max(r, g, b);
  const minC = Math.min(r, g, b);
  const saturation = maxC === 0 ? 0 : (maxC - minC) / maxC;
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  if (luminance > 246 - tolerance * 1.15 && saturation < 0.22) {
    return true;
  }

  return false;
}

function buildBorderPalette(data: Uint8ClampedArray, w: number, h: number): Array<[number, number, number]> {
  const palette: Array<[number, number, number]> = [];
  const step = Math.max(1, Math.floor(Math.min(w, h) / 40));

  const tryAdd = (x: number, y: number) => {
    const idx = (y * w + x) * 4;
    if (data[idx + 3] < 128) return;
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    for (const [pr, pg, pb] of palette) {
      if (Math.abs(r - pr) + Math.abs(g - pg) + Math.abs(b - pb) < 28) {
        return;
      }
    }
    if (palette.length < 12) {
      palette.push([r, g, b]);
    }
  };

  for (let x = 0; x < w; x += step) {
    tryAdd(x, 0);
    tryAdd(x, h - 1);
  }
  for (let y = 0; y < h; y += step) {
    tryAdd(0, y);
    tryAdd(w - 1, y);
  }
  return palette;
}

function cleanRegionToDataUrl(
  source: HTMLImageElement,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  tolerance: number,
  maxDim = 640,
  clearTopCounters = false
): string {
  const scale = Math.min(1, maxDim / Math.max(sw, sh));
  const w = Math.max(1, Math.round(sw * scale));
  const h = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';

  ctx.drawImage(source, sx, sy, sw, sh, 0, 0, w, h);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const bgPalette = buildBorderPalette(data, w, h);
  const visited = new Uint8Array(w * h);
  const removed = new Uint8Array(w * h);

  // BFS flood-fill starting from all 4 edges
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const enqueueIfBg = (x: number, y: number) => {
    const pos = y * w + x;
    if (visited[pos]) return;
    visited[pos] = 1;
    const idx = pos * 4;
    if (isNeutralLightBackground(data[idx], data[idx + 1], data[idx + 2], data[idx + 3], bgPalette, tolerance)) {
      removed[pos] = 1;
      queue[tail++] = pos;
    }
  };

  for (let x = 0; x < w; x++) {
    enqueueIfBg(x, 0);
    enqueueIfBg(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    enqueueIfBg(0, y);
    enqueueIfBg(w - 1, y);
  }

  while (head < tail) {
    const pos = queue[head++];
    const x = pos % w;
    const y = (pos - x) / w;

    if (x > 0) enqueueIfBg(x - 1, y);
    if (x < w - 1) enqueueIfBg(x + 1, y);
    if (y > 0) enqueueIfBg(x, y - 1);
    if (y < h - 1) enqueueIfBg(x, y + 1);
  }

  // Optional: clear enclosed white counters inside top comic text (e.g., letter "A" in "¡CRACK!")
  if (clearTopCounters) {
    const topLimit = Math.floor(h * 0.22);
    for (let y = 0; y < topLimit; y++) {
      for (let x = 0; x < w; x++) {
        const pos = y * w + x;
        if (removed[pos]) continue;
        const idx = pos * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        if (lum > 228 && (maxC === 0 ? 0 : (maxC - minC) / maxC) < 0.16) {
          removed[pos] = 1;
        }
      }
    }
  }

  // Clear removed pixels
  for (let i = 0; i < w * h; i++) {
    if (removed[i]) {
      data[i * 4 + 3] = 0;
    }
  }

  // Anti-aliased edge smoothing & white-halo decontamination along outline boundaries
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const pos = y * w + x;
      if (removed[pos]) continue;
      let bgNeighbors = 0;
      if (removed[pos - 1]) bgNeighbors++;
      if (removed[pos + 1]) bgNeighbors++;
      if (removed[pos - w]) bgNeighbors++;
      if (removed[pos + w]) bgNeighbors++;
      if (bgNeighbors > 0) {
        const idx = pos * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        if (lum > 145) {
          const factor = Math.max(0.1, 1 - bgNeighbors * 0.24);
          data[idx + 3] = Math.round(data[idx + 3] * factor);
          // Warm-darken fringe slightly toward outline ink (#3D241C) to kill white JPEG halos
          data[idx] = Math.round(data[idx] * 0.72 + 61 * 0.28);
          data[idx + 1] = Math.round(data[idx + 1] * 0.72 + 36 * 0.28);
          data[idx + 2] = Math.round(data[idx + 2] * 0.72 + 28 * 0.28);
        }
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Tightly crop transparent margins so characters align nicely on stage
  let minX = w;
  let minY = h;
  let maxX = 0;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 20) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (maxX <= minX || maxY <= minY) {
    return canvas.toDataURL('image/png');
  }

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;
  const outCanvas = document.createElement('canvas');
  outCanvas.width = cropW;
  outCanvas.height = cropH;
  const outCtx = outCanvas.getContext('2d');
  if (!outCtx) return canvas.toDataURL('image/png');
  outCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

  return outCanvas.toDataURL('image/png');
}

export async function processSceneIllustration(
  src: string,
  options: { tolerance?: number; clearTopCounters?: boolean } = {}
): Promise<string> {
  const { tolerance = 30, clearTopCounters = false } = options;
  const img = await loadImage(src);
  return cleanRegionToDataUrl(
    img,
    0,
    0,
    img.naturalWidth,
    img.naturalHeight,
    tolerance,
    1080,
    clearTopCounters
  );
}

export async function processSingleDogImage(fileOrUrl: File | string, tolerance = 28): Promise<string> {
  const src = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
  try {
    const img = await loadImage(src);
    return cleanRegionToDataUrl(img, 0, 0, img.naturalWidth, img.naturalHeight, tolerance, 680, false);
  } finally {
    if (typeof fileOrUrl !== 'string') {
      URL.revokeObjectURL(src);
    }
  }
}

export async function processCombinedSheet(
  fileOrUrl: File | string,
  splitMode: 'top-bottom' | 'left-right',
  tolerance = 28
): Promise<ProcessedDogSprites> {
  const src = typeof fileOrUrl === 'string' ? fileOrUrl : URL.createObjectURL(fileOrUrl);
  try {
    const img = await loadImage(src);
    const w = img.naturalWidth;
    const h = img.naturalHeight;

    if (splitMode === 'top-bottom') {
      const halfH = Math.floor(h / 2);
      return {
        chatinUrl: cleanRegionToDataUrl(img, 0, 0, w, halfH, tolerance, 680, false),
        bellaUrl: cleanRegionToDataUrl(img, 0, halfH, w, h - halfH, tolerance, 680, false),
      };
    }

    const halfW = Math.floor(w / 2);
    return {
      chatinUrl: cleanRegionToDataUrl(img, 0, 0, halfW, h, tolerance, 680, false),
      bellaUrl: cleanRegionToDataUrl(img, halfW, 0, w - halfW, h, tolerance, 680, false),
    };
  } finally {
    if (typeof fileOrUrl !== 'string') {
      URL.revokeObjectURL(src);
    }
  }
}
