const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'public', 'assets', 'logo-dashboard-light.png');
const outputPath = path.join(__dirname, 'public', 'assets', 'logo-dashboard-light-trimmed.png');

async function trimImage() {
  try {
    await sharp(inputPath)
      .trim()
      .toFile(outputPath);
    console.log('Successfully trimmed image.');
    
    // Replace original
    fs.renameSync(outputPath, inputPath);
    console.log('Replaced original image.');
  } catch (error) {
    console.error('Error trimming image:', error);
  }
}

trimImage();
