const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Hex replacements
  content = content.replace(/#00E5FF/ig, '#F3E8FF'); // Cyan to Very Light Purple/White
  content = content.replace(/#B026FF/ig, '#7C3AED'); // Magenta to Deep Violet
  content = content.replace(/#FF0055/ig, '#C084FC'); // Red to Medium Purple
  content = content.replace(/#ff00ea/ig, '#8B5CF6'); // Another magenta to Purple
  content = content.replace(/#4f00ff/ig, '#4C1D95'); // Indigo to Very Dark Purple
  content = content.replace(/#050511/ig, '#1c1326'); // Very Dark background to Dark Purple Background
  
  // RGBA replacements
  // Cyan rgba(0, 229, 255 -> rgba(243, 232, 255
  content = content.replace(/rgba\(\s*0\s*,\s*229\s*,\s*255\s*,/g, 'rgba(243, 232, 255,');
  // Magenta rgba(176, 38, 255 -> rgba(124, 58, 237
  content = content.replace(/rgba\(\s*176\s*,\s*38\s*,\s*255\s*,/g, 'rgba(124, 58, 237,');
  // Red rgba(255, 0, 85 -> rgba(192, 132, 252
  content = content.replace(/rgba\(\s*255\s*,\s*0\s*,\s*85\s*,/g, 'rgba(192, 132, 252,');

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css')) {
      replaceColors(fullPath);
    }
  }
}

processDirectory(srcDir);
console.log("Colors successfully swapped to White and Purples theme!");
