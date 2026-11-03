const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const MEDIA_DIR = path.join(__dirname, '..', 'temp_ch2_docx_extract', 'word', 'media');
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

// Stitched image for image13 and image14 (Ring and Bus)
function stitchImages(p1, p2, spacing = 30) {
    const width = p1.width + spacing + p2.width;
    const height = Math.max(p1.height, p2.height);
    const result = new PNG({ width, height });

    // initialize transparent
    for (let i = 0; i < width * height * 4; i += 4) {
        result.data[i] = 0;
        result.data[i + 1] = 0;
        result.data[i + 2] = 0;
        result.data[i + 3] = 0;
    }

    // copy p1 (left)
    const yOffset1 = Math.floor((height - p1.height) / 2);
    for (let y = 0; y < p1.height; y++) {
        for (let x = 0; x < p1.width; x++) {
            const srcIdx = (y * p1.width + x) * 4;
            const destIdx = ((y + yOffset1) * width + x) * 4;
            result.data[destIdx] = p1.data[srcIdx];
            result.data[destIdx + 1] = p1.data[srcIdx + 1];
            result.data[destIdx + 2] = p1.data[srcIdx + 2];
            result.data[destIdx + 3] = p1.data[srcIdx + 3];
        }
    }

    // copy p2 (right)
    const yOffset2 = Math.floor((height - p2.height) / 2);
    const xOffset2 = p1.width + spacing;
    for (let y = 0; y < p2.height; y++) {
        for (let x = 0; x < p2.width; x++) {
            const srcIdx = (y * p2.width + x) * 4;
            const destIdx = ((y + yOffset2) * width + (x + xOffset2)) * 4;
            result.data[destIdx] = p2.data[srcIdx];
            result.data[destIdx + 1] = p2.data[srcIdx + 1];
            result.data[destIdx + 2] = p2.data[srcIdx + 2];
            result.data[destIdx + 3] = p2.data[srcIdx + 3];
        }
    }

    return result;
}

const mappings = [
    { src: 'image4.png', dest: 'mcq_ch2_image1.png' },    // Mesh topology
    { src: 'image5.png', dest: 'mcq_ch2_image2.png' },    // Satellite dish
    { src: 'image6.png', dest: 'mcq_ch2_image3.png' },    // Optical fiber core
    { src: 'image7.png', dest: 'mcq_ch2_image4.png' },    // Tx mode A -> B,C,D
    { src: 'image8.png', dest: 'mcq_ch2_image5.png' },    // Tx mode A -> B,C,D (Ku. 17)
    { src: 'image9.png', dest: 'mcq_ch2_image6.png' },    // Tx mode A -> B,C,D,E (Din. 17)
    { src: 'image10.png', dest: 'mcq_ch2_image7.png' },   // Hybrid topology
    { src: 'image11.png', dest: 'mcq_ch2_image8.png' },   // Tree topology
    { src: 'image12.png', dest: 'mcq_ch2_image9.png' },   // Tx mode P -> X,Y,Z (Raj. 23)
    // Stitched 13 + 14:
    { stitched: ['image13.png', 'image14.png'], dest: 'mcq_ch2_image10.png' }, // Ring and Bus topologies
    { src: 'image15.png', dest: 'mcq_ch2_image11.png' },  // HUB network
    { src: 'image16.png', dest: 'mcq_ch2_image12.png' }   // Switch network
];

function savePng(pngObj, destFilename) {
    const outBuffer = PNG.sync.write(pngObj);
    const localPath = path.join(LOCAL_UPLOADS, destFilename);
    fs.writeFileSync(localPath, outBuffer);
    console.log(`Saved ${destFilename} (${pngObj.width}x${pngObj.height}) -> ${localPath}`);

    if (fs.existsSync(ONEDRIVE_UPLOADS)) {
        const odPath = path.join(ONEDRIVE_UPLOADS, destFilename);
        fs.writeFileSync(odPath, outBuffer);
        console.log(`Synced to OneDrive -> ${odPath}`);
    }
}

for (const m of mappings) {
    if (m.stitched) {
        const f1 = path.join(MEDIA_DIR, m.stitched[0]);
        const f2 = path.join(MEDIA_DIR, m.stitched[1]);
        const p1 = makeTransparent(PNG.sync.read(fs.readFileSync(f1)));
        const p2 = makeTransparent(PNG.sync.read(fs.readFileSync(f2)));
        const stitchedPng = stitchImages(p1, p2, 40);
        savePng(stitchedPng, m.dest);
    } else {
        const f = path.join(MEDIA_DIR, m.src);
        const png = makeTransparent(PNG.sync.read(fs.readFileSync(f)));
        savePng(png, m.dest);
    }
}

console.log('Finished processing all Chapter 2 MCQ images.');
