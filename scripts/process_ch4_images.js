const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;
const jpeg = require('jpeg-js');

const MEDIA_DIR = path.join(__dirname, '..', 'temp_ch4_docx_extract', 'word', 'media');
const LOCAL_UPLOADS = path.join(__dirname, '..', 'uploads', 'images');
const ONEDRIVE_UPLOADS = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\uploads\\images';

if (!fs.existsSync(LOCAL_UPLOADS)) fs.mkdirSync(LOCAL_UPLOADS, { recursive: true });
if (fs.existsSync(path.dirname(ONEDRIVE_UPLOADS)) && !fs.existsSync(ONEDRIVE_UPLOADS)) {
    fs.mkdirSync(ONEDRIVE_UPLOADS, { recursive: true });
}

function makeTransparent(png) {
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const idx = (y * png.width + x) * 4;
            const r = png.data[idx];
            const g = png.data[idx + 1];
            const b = png.data[idx + 2];

            const minVal = Math.min(r, g, b);
            if (minVal >= 240) {
                png.data[idx + 3] = 0;
            } else if (minVal >= 200) {
                const alphaRatio = (240 - minVal) / (240 - 200);
                png.data[idx + 3] = Math.round(255 * Math.max(0.1, alphaRatio));
            }
        }
    }
    return png;
}

function savePng(png, filename) {
    const buffer = PNG.sync.write(png);
    fs.writeFileSync(path.join(LOCAL_UPLOADS, filename), buffer);
    if (fs.existsSync(ONEDRIVE_UPLOADS)) {
        fs.writeFileSync(path.join(ONEDRIVE_UPLOADS, filename), buffer);
    }
    console.log(`Saved ${filename} (${png.width}x${png.height})`);
}

function loadAnyAsPng(filePath) {
    if (filePath.endsWith('.jpeg') || filePath.endsWith('.jpg')) {
        const rawJpeg = fs.readFileSync(filePath);
        const decoded = jpeg.decode(rawJpeg, { useTArray: true });
        const png = new PNG({ width: decoded.width, height: decoded.height });
        for (let i = 0; i < decoded.width * decoded.height * 4; i++) {
            png.data[i] = decoded.data[i];
        }
        return png;
    } else {
        const raw = fs.readFileSync(filePath);
        return PNG.sync.read(raw);
    }
}

// 1. Process 4 bullet images
['image4.png', 'image5.png', 'image6.png', 'image7.png'].forEach((f, i) => {
    const names = ['mcq_ch4_bullet_disc.png', 'mcq_ch4_bullet_square.png', 'mcq_ch4_bullet_rect.png', 'mcq_ch4_bullet_circle.png'];
    const p = loadAnyAsPng(path.join(MEDIA_DIR, f));
    makeTransparent(p);
    savePng(p, names[i]);
});

// 2. Process Table 5 images (K, L, M, N)
const optImages = [
    loadAnyAsPng(path.join(MEDIA_DIR, 'image10.png')), // K
    loadAnyAsPng(path.join(MEDIA_DIR, 'image11.jpeg')), // L
    loadAnyAsPng(path.join(MEDIA_DIR, 'image12.png')), // M
    loadAnyAsPng(path.join(MEDIA_DIR, 'image13.png'))  // N
];

const optNames = ['mcq_ch4_opt_k.png', 'mcq_ch4_opt_l.png', 'mcq_ch4_opt_m.png', 'mcq_ch4_opt_n.png'];
optImages.forEach((p, i) => {
    makeTransparent(p);
    savePng(p, optNames[i]);
});

// 3. Stitch 4 options into a clean 2x2 grid diagram for mcq_ch4_image1.png
// Find max cell size
const cellW = Math.max(...optImages.map(p => p.width));
const cellH = Math.max(...optImages.map(p => p.height));
const pad = 40;
const labelH = 30;

const totalW = cellW * 2 + pad * 3;
const totalH = (cellH + labelH) * 2 + pad * 3;

const stitched = new PNG({ width: totalW, height: totalH });
// Fill with transparent
for (let i = 0; i < totalW * totalH * 4; i += 4) {
    stitched.data[i] = 255;
    stitched.data[i + 1] = 255;
    stitched.data[i + 2] = 255;
    stitched.data[i + 3] = 0;
}

function pasteAt(src, dst, startX, startY) {
    for (let y = 0; y < src.height; y++) {
        for (let x = 0; x < src.width; x++) {
            const srcIdx = (y * src.width + x) * 4;
            const dstIdx = ((startY + y) * dst.width + (startX + x)) * 4;
            const alpha = src.data[srcIdx + 3] / 255;
            if (alpha > 0) {
                dst.data[dstIdx] = src.data[srcIdx];
                dst.data[dstIdx + 1] = src.data[srcIdx + 1];
                dst.data[dstIdx + 2] = src.data[srcIdx + 2];
                dst.data[dstIdx + 3] = src.data[srcIdx + 3];
            }
        }
    }
}

// Col 0, Row 0: K
pasteAt(optImages[0], stitched, pad, pad + labelH);
// Col 1, Row 0: L
pasteAt(optImages[1], stitched, pad * 2 + cellW, pad + labelH);
// Col 0, Row 1: M
pasteAt(optImages[2], stitched, pad, pad * 2 + cellH + labelH * 2);
// Col 1, Row 1: N
pasteAt(optImages[3], stitched, pad * 2 + cellW, pad * 2 + cellH + labelH * 2);

savePng(stitched, 'mcq_ch4_image1.png');
console.log('All Chapter 4 images processed successfully!');
