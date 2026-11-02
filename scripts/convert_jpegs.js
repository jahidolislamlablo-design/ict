const fs = require('fs');
const path = require('path');
const jpeg = require('jpeg-js');
const PNG = require('pngjs').PNG;

const LOCAL_IMAGES = path.join(__dirname, '..', 'uploads', 'images');
const ONEDRIVE_IMAGES = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\uploads\\images';

const jpegIndices = [7, 8, 9, 21, 28, 41];

for (const num of jpegIndices) {
    const jpegFile = path.join(LOCAL_IMAGES, `cq_ch3_image${num}.jpeg`);
    if (!fs.existsSync(jpegFile)) {
        console.warn(`File not found: ${jpegFile}`);
        continue;
    }

    const jpegData = fs.readFileSync(jpegFile);
    const decoded = jpeg.decode(jpegData, { useTArray: true });

    const png = new PNG({
        width: decoded.width,
        height: decoded.height
    });

    // Copy decoded data to png buffer and make background transparent
    for (let p = 0; p < decoded.data.length; p += 4) {
        const r = decoded.data[p];
        const g = decoded.data[p + 1];
        const b = decoded.data[p + 2];

        png.data[p] = r;
        png.data[p + 1] = g;
        png.data[p + 2] = b;

        const minVal = Math.min(r, g, b);
        if (minVal >= 240) {
            png.data[p + 3] = 0;
        } else if (minVal >= 210) {
            const alphaRatio = (240 - minVal) / (240 - 210);
            png.data[p + 3] = Math.round(255 * Math.max(0.1, alphaRatio));
            png.data[p] = Math.round(r * alphaRatio);
            png.data[p + 1] = Math.round(g * alphaRatio);
            png.data[p + 2] = Math.round(b * alphaRatio);
        } else {
            png.data[p + 3] = 255;
        }
    }

    const pngBuffer = PNG.sync.write(png);
    const pngLocalPath = path.join(LOCAL_IMAGES, `cq_ch3_image${num}.png`);
    fs.writeFileSync(pngLocalPath, pngBuffer);

    if (fs.existsSync(ONEDRIVE_IMAGES)) {
        const pngOneDrivePath = path.join(ONEDRIVE_IMAGES, `cq_ch3_image${num}.png`);
        fs.writeFileSync(pngOneDrivePath, pngBuffer);
    }

    console.log(`Converted cq_ch3_image${num}.jpeg -> cq_ch3_image${num}.png (${png.width}x${png.height})`);
}

// Update references in database/cqs.json
const cqsFile = path.join(__dirname, '..', 'database', 'cqs.json');
let cqsContent = fs.readFileSync(cqsFile, 'utf8');

for (const num of jpegIndices) {
    const regex = new RegExp(`cq_ch3_image${num}\\.jpeg`, 'g');
    cqsContent = cqsContent.replace(regex, `cq_ch3_image${num}.png`);
}
fs.writeFileSync(cqsFile, cqsContent, 'utf8');
console.log('Updated references in database/cqs.json');

const oneDriveCqs = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\database\\cqs.json';
if (fs.existsSync(oneDriveCqs)) {
    fs.writeFileSync(oneDriveCqs, cqsContent, 'utf8');
    console.log('Synced database/cqs.json to OneDrive');
}
