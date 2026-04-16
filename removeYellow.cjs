const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function removeYellow(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // NO YELLOW POLICY
  // Replace Cream with Light Fresh Blue
  content = content.replace(/#FEFDDF/ig, '#F0F9FF');
  content = content.replace(/#FFF799/ig, '#F0F9FF');
  
  // Replace any leftover mustard/yellow with Navy
  content = content.replace(/#EAB308/ig, '#05044D');
  content = content.replace(/#CA8A04/ig, '#05044D');
  content = content.replace(/#FFC81E/ig, '#05044D');
  content = content.replace(/#E87F24/ig, '#05044D'); // Also orange

  // Gradients
  content = content.replace(/linear-gradient\(45deg, #05044d, #ff0000\)/g, 'linear-gradient(45deg, #05044D, #4C8CE4)'); // Fix confirm btn to stay blue/blue or blue/red depending on context, but user said NO YELLOW gradient.
  content = content.replace(/#89d985/ig, '#4C8CE4'); // Green to Blue

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css')) {
      removeYellow(fullPath);
    }
  }
}

processDirectory(srcDir);
console.log("Yellow eradicated, replaced with Blue/Navy!");
