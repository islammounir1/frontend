const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceToMustard(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Hex replacements (Purple to Mustard)
  content = content.replace(/#8B5CF6/ig, '#EAB308'); // Vivid Purple -> Mustard
  content = content.replace(/#7C3AED/ig, '#CA8A04'); // Deep Purple -> Dark Mustard
  content = content.replace(/#C084FC/ig, '#FDE047'); // Light Purple -> Light Mustard/Yellow
  content = content.replace(/#B026FF/ig, '#EAB308'); // Magenta -> Mustard
  
  // Rgba replacements (Purple rgba to Mustard rgba)
  content = content.replace(/rgba\(\s*124\s*,\s*58\s*,\s*237\s*,/g, 'rgba(234, 179, 8,');
  content = content.replace(/rgba\(\s*139\s*,\s*92\s*,\s*246\s*,/g, 'rgba(234, 179, 8,');
  content = content.replace(/rgba\(\s*192\s*,\s*132\s*,\s*252\s*,/g, 'rgba(253, 224, 71,');
  content = content.replace(/rgba\(\s*176\s*,\s*38\s*,\s*255\s*,/g, 'rgba(234, 179, 8,');

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css')) {
      replaceToMustard(fullPath);
    }
  }
}

processDirectory(srcDir);
console.log("Purple successfully changed to Mustard!");
