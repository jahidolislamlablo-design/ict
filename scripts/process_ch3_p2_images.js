const fs = require('fs');
const path = require('path');
const PNG = require('pngjs').PNG;

const mediaDir = path.join(__dirname, '..', 'temp_ch3_p2_docx', 'word', 'media');
const targetLocalDir = path.join(__dirname, '..', 'uploads', 'images');
const targetOneDriveDir = 'C:\\Users\\taibu\\OneDrive\\Desktop\\Antygravity project\\ict-easy-learning\\uploads\\images';

if (!fs.existsSync(targetLocalDir)) {
    fs.mkdirSync(targetLocalDir, { recursive: true });
}

function removeBackground(png) {
    for (let y = 0; y < png.height; y++) {
        for (let x = 0; x < png.width; x++) {
            const idx = (y * png.width + x) * 4;
            const r = png.data[idx];
            const g = png.data[idx + 1];
            const b = png.data[idx + 2];

            const minVal = Math.min(r, g, b);
            if (minVal >= 240) {
                png.data[idx + 3] = 0; // Completely transparent
            } else if (minVal >= 210) {
                // Anti-alias edge transition
                const alphaRatio = (240 - minVal) / (240 - 210);
                png.data[idx + 3] = Math.round(255 * Math.max(0.1, alphaRatio));
            }
        }
    }
    return png;
}

const files = fs.readdirSync(mediaDir).filter(f => f.endsWith('.png'));
console.log(`Found ${files.length} PNG files to process.`);

let processed = 0;
const processedMap = {}; // originalFilename -> newFilename / url

files.forEach(f => {
    const inputPath = path.join(mediaDir, f);
    const data = fs.readFileSync(inputPath);
    try {
        const png = PNG.sync.read(data);
        removeBackground(png);
        const outBuffer = PNG.sync.write(png);

        // Name it mcq_ch3_p2_<filename>
        const outFileName = `mcq_ch3_p2_${f}`;
        const outPathLocal = path.join(targetLocalDir, outFileName);
        fs.writeFileSync(outPathLocal, outBuffer);

        if (fs.existsSync(targetOneDriveDir)) {
            const outPathOneDrive = path.join(targetOneDriveDir, outFileName);
            fs.writeFileSync(outPathOneDrive, outBuffer);
        }

        processedMap[f] = `/uploads/images/${outFileName}`;
        processed++;
    } catch (e) {
        console.error(`Failed to process ${f}:`, e.message);
    }
});

console.log(`Successfully processed and removed background from ${processed} images!`);
fs.writeFileSync(path.join(__dirname, 'image_map_ch3_p2.json'), JSON.stringify(processedMap, null, 2));
