const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const assetsDir = path.join(__dirname, '../public/assets');

async function processImages() {
  const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.png') && !f.startsWith('trimmed-'));
  
  for (const file of files) {
    const inputPath = path.join(assetsDir, file);
    const outputPath = path.join(assetsDir, `trimmed-${file}`);
    
    try {
      await sharp(inputPath).trim().toFile(outputPath);
      // Replace original file
      fs.unlinkSync(inputPath);
      fs.renameSync(outputPath, inputPath);
      console.log(`Trimmed ${file}`);
    } catch (err) {
      console.error(`Error trimming ${file}:`, err);
    }
  }
}

processImages();
