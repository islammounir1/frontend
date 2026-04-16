const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function applyNewPalette(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // UPDATED PALETTE: Navy, Blue, Green, Cream
  // Navy: #05044d (Primary Accent)
  // Dark Blue: #406093
  // Bright Blue: #4C8CE4
  // Green: #91D06C
  // Cream: #FEFDDF

  // Replacement logic for previous "mustard/orange/yellow" that the user hated
  content = content.replace(/#E87F24/ig, '#05044d'); // Orange -> Navy
  content = content.replace(/#EAB308/ig, '#05044d'); // Mustard -> Navy
  content = content.replace(/#FFC81E/ig, '#05044d'); // Yellow -> Navy
  content = content.replace(/#CA8A04/ig, '#05044d'); // Dark Mustard -> Navy
  
  // Replace references to "yellow" specifically if they appear in comments or strings (careful here, mainly concerned with hexes)
  
  // Replace old Cream (#FFF799) with New Cream (#FEFDDF)
  content = content.replace(/#FFF799/ig, '#FEFDDF');
  
  // Keep/Fix Blue variations to the new Bright Blue
  content = content.replace(/#73A5CA/ig, '#4C8CE4');
  
  // Handle some specific rgba values that might have been yellow or orange
  content = content.replace(/rgba\(\s*232\s*,\s*127\s*,\s*36\s*,/g, 'rgba(5, 4, 77,'); // Orange rgba -> Navy rgba
  content = content.replace(/rgba\(\s*234\s*,\s*179\s*,\s*8\s*,/g, 'rgba(5, 4, 77,'); // Mustard rgba -> Navy rgba
  content = content.replace(/rgba\(\s*255\s*,\s*200\s*,\s*30\s*,/g, 'rgba(5, 4, 77,'); // Yellow rgba -> Navy rgba

  // Specific title gradient swap if it existed
  // Replacing any gradient that used to be warm (yellow/orange) with navy/blue
  content = content.replace(/linear-gradient\(to right, #00E5FF, #B026FF\)/g, 'linear-gradient(to right, #05044d, #4C8CE4)');

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css')) {
      applyNewPalette(fullPath);
    }
  }
}

processDirectory(srcDir);
console.log("Navy & Cream palette (no yellow) successfully applied!");
