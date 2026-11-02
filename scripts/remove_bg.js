const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const ONEDRIVE_IMAGES = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\uploads\\images';
const LOCAL_IMAGES = path.join(__dirname, '..', 'uploads', 'images');

function makeTransparent(png, isImg29 = false) {
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const idx = (y * png.width + x) * 4;
            if (isImg29 && y <= 1) {
                png.data[idx + 3] = 0;
                continue;
            }
            const r = png.data[idx];
            const g = png.data[idx + 1];
            const b = png.data[idx + 2];

            const minVal = Math.min(r, g, b);
            if (minVal >= 245) {
                png.data[idx + 3] = 0;
            } else if (minVal >= 215) {
                const alphaRatio = (245 - minVal) / (245 - 215);
                png.data[idx + 3] = Math.round(255 * Math.max(0.08, alphaRatio));
                png.data[idx] = Math.round(r * alphaRatio);
                png.data[idx + 1] = Math.round(g * alphaRatio);
                png.data[idx + 2] = Math.round(b * alphaRatio);
            }
        }
    }
    return png;
}

let processedCount = 0;

for (let i = 1; i <= 60; i++) {
    const filename = `cq_ch3_image${i}.png`;
    const localFile = path.join(LOCAL_IMAGES, filename);
    if (!fs.existsSync(localFile)) {
        console.warn(`File not found: ${localFile}`);
        continue;
    }

    const data = fs.readFileSync(localFile);
    const png = PNG.sync.read(data);
    makeTransparent(png, i === 29);

    const outBuffer = PNG.sync.write(png);
    fs.writeFileSync(localFile, outBuffer);

    if (fs.existsSync(ONEDRIVE_IMAGES)) {
        const oneDriveFile = path.join(ONEDRIVE_IMAGES, filename);
        fs.writeFileSync(oneDriveFile, outBuffer);
    }
    processedCount++;
    console.log(`Processed ${filename} (${png.width}x${png.height})`);
}

console.log(`Successfully converted ${processedCount} images to transparent background.`);
