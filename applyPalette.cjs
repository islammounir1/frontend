const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function applyPalette(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // New Palette:
  // Orange: #E87F24
  // Yellow: #FFC81E
  // Cream: #FEFDDF
  // Blue: #73A5CA

  // Background cream
  content = content.replace(/--bg-dark:\s*#[a-f0-9]+;/ig, '--bg-dark: #FEFDDF;'); 
  
  // Replace previous mustards/yellows/purples with the new precise Orange and Yellow
  content = content.replace(/#EAB308/ig, '#E87F24');
  content = content.replace(/#CA8A04/ig, '#E87F24');
  content = content.replace(/#FDE047/ig, '#FFC81E');
  
  // Replace previous blues/cyans with the new Blue
  content = content.replace(/#00E5FF/ig, '#73A5CA');
  content = content.replace(/#3B82F6/ig, '#73A5CA');

  // RGBA replacements
  // Old orange rgba(234, 179, 8 -> rgba(232, 127, 36
  content = content.replace(/rgba\(\s*234\s*,\s*179\s*,\s*8\s*,/g, 'rgba(232, 127, 36,');
  // Old yellow rgba(253, 224, 71 -> rgba(255, 200, 30
  content = content.replace(/rgba\(\s*253\s*,\s*224\s*,\s*71\s*,/g, 'rgba(255, 200, 30,');
  // Old cyan rgba(0, 229, 255 -> rgba(115, 165, 202
  content = content.replace(/rgba\(\s*0\s*,\s*229\s*,\s*255\s*,/g, 'rgba(115, 165, 202,');

  // Ensure auroras use the palette explicitly
  content = content.replace(/--aurora-1:\s*#[a-f0-9]+;/ig, '--aurora-1: #E87F24;'); // Orange
  content = content.replace(/--aurora-2:\s*#[a-f0-9]+;/ig, '--aurora-2: #73A5CA;'); // Blue
  content = content.replace(/--aurora-3:\s*#[a-f0-9]+;/ig, '--aurora-3: #FFC81E;'); // Yellow

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css')) {
      applyPalette(fullPath);
    }
  }
}

processDirectory(srcDir);
console.log("Palette successfully applied!");
