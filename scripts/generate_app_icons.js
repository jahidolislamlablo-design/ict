const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const { PNG } = require('pngjs');

const devPath = path.join(__dirname, '..', 'assets', 'images', 'developer.jpg');
const origIconPath = path.join(__dirname, '..', 'assets', 'icons', 'icon-512.png');

const devRaw = jpeg.decode(fs.readFileSync(devPath));
const origIcon = PNG.sync.read(fs.readFileSync(origIconPath));

const targetSize = 512;
const cropSize = Math.min(devRaw.width, devRaw.height); // 840
const cropX = Math.floor((devRaw.width - cropSize) / 2); // 92
const cropY = 0; // Top-aligned so head has natural headroom

function getDevPixel(dx, dy, size = targetSize) {
  const sx = cropX + (dx / size) * cropSize;
  const sy = cropY + (dy / size) * cropSize;
  const x0 = Math.floor(sx), x1 = Math.min(devRaw.width - 1, x0 + 1);
  const y0 = Math.floor(sy), y1 = Math.min(devRaw.height - 1, y0 + 1);
  const fx = sx - x0, fy = sy - y0;

  function sample(x, y) {
    const idx = (y * devRaw.width + x) * 4;
    return [devRaw.data[idx], devRaw.data[idx+1], devRaw.data[idx+2]];
  }

  const p00 = sample(x0, y0), p10 = sample(x1, y0);
  const p01 = sample(x0, y1), p11 = sample(x1, y1);

  const r = (1-fx)*(1-fy)*p00[0] + fx*(1-fy)*p10[0] + (1-fx)*fy*p01[0] + fx*fy*p11[0];
  const g = (1-fx)*(1-fy)*p00[1] + fx*(1-fy)*p10[1] + (1-fx)*fy*p01[1] + fx*fy*p11[1];
  const b = (1-fx)*(1-fy)*p00[2] + fx*(1-fy)*p10[2] + (1-fx)*fy*p01[2] + fx*fy*p11[2];
  return [Math.round(r), Math.round(g), Math.round(b)];
}

// 1. Create 512x512 composed icon
const png512 = new PNG({ width: 512, height: 512 });

for (let y = 0; y < 512; y++) {
  for (let x = 0; x < 512; x++) {
    const [devR, devG, devB] = getDevPixel(x, y, 512);
    const iIdx = (y * 512 + x) * 4;
    const iconR = origIcon.data[iIdx];
    const iconG = origIcon.data[iIdx+1];
    const iconB = origIcon.data[iIdx+2];

    const diff = 255 - ((iconR + iconG + iconB) / 3);
    const isLogo = diff > 18;

    let alpha = 0.08; // Subtle 8% lightening for outer background
    if (isLogo) {
      const weight = Math.min(1, (diff - 18) / 90);
      alpha = 0.08 + 0.50 * weight; // 0.08 to 0.58
    }

    const outR = Math.round((1 - alpha) * devR + alpha * iconR);
    const outG = Math.round((1 - alpha) * devG + alpha * iconG);
    const outB = Math.round((1 - alpha) * devB + alpha * iconB);

    png512.data[iIdx] = outR;
    png512.data[iIdx+1] = outG;
    png512.data[iIdx+2] = outB;
    png512.data[iIdx+3] = 255;
  }
}

// Helper to downscale PNG using area averaging
function downscale(srcPng, newSize) {
  const destPng = new PNG({ width: newSize, height: newSize });
  const scale = srcPng.width / newSize;

  for (let dy = 0; dy < newSize; dy++) {
    for (let dx = 0; dx < newSize; dx++) {
      let rSum = 0, gSum = 0, bSum = 0, aSum = 0, count = 0;
      const startX = Math.floor(dx * scale);
      const endX = Math.min(srcPng.width, Math.floor((dx + 1) * scale));
      const startY = Math.floor(dy * scale);
      const endY = Math.min(srcPng.height, Math.floor((dy + 1) * scale));

      for (let sy = startY; sy < endY; sy++) {
        for (let sx = startX; sx < endX; sx++) {
          const idx = (sy * srcPng.width + sx) * 4;
          rSum += srcPng.data[idx];
          gSum += srcPng.data[idx+1];
          bSum += srcPng.data[idx+2];
          aSum += srcPng.data[idx+3];
          count++;
        }
      }

      const dIdx = (dy * newSize + dx) * 4;
      destPng.data[dIdx] = count ? Math.round(rSum / count) : 0;
      destPng.data[dIdx+1] = count ? Math.round(gSum / count) : 0;
      destPng.data[dIdx+2] = count ? Math.round(bSum / count) : 0;
      destPng.data[dIdx+3] = count ? Math.round(aSum / count) : 255;
    }
  }
  return destPng;
}

const png192 = downscale(png512, 192);

const iconDir = path.join(__dirname, '..', 'assets', 'icons');
fs.writeFileSync(path.join(iconDir, 'icon-512.png'), PNG.sync.write(png512));
fs.writeFileSync(path.join(iconDir, 'icon-maskable-512.png'), PNG.sync.write(png512));
fs.writeFileSync(path.join(iconDir, 'icon-192.png'), PNG.sync.write(png192));
fs.writeFileSync(path.join(iconDir, 'apple-touch-icon.png'), PNG.sync.write(png192));

console.log('✓ Successfully generated all icons from developer.jpg background + translucent logo overlay!');
