const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function replaceToLightMode(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Change backgrounds from dark translucent to white translucent
  content = content.replace(/rgba\(\s*10\s*,\s*10\s*,\s*20\s*,\s*0\.[58]\s*\)/g, 'rgba(255, 255, 255, 0.7)');
  content = content.replace(/rgba\(\s*15\s*,\s*15\s*,\s*25\s*,\s*0\.6\s*\)/g, 'rgba(255, 255, 255, 0.7)');
  
  // Inputs from dark translucent to pure white/very light translucent
  content = content.replace(/background:\s*rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\.[45]\s*\)/g, 'background: rgba(255, 255, 255, 0.9)');
  
  // Specific inputs text color
  content = content.replace(/color:\s*white\s*!important;\s*transition/g, 'color: #1E293B !important; transition');
  
  // Theme Variables
  content = content.replace(/--bg-dark:\s*#[a-f0-9]+;/ig, '--bg-dark: #F4F9FF;'); // Very light fresh icy blue
  content = content.replace(/--text-main:\s*#FFFFFF;/ig, '--text-main: #1E293B;'); // Slate blue dark
  content = content.replace(/--text-muted:\s*#[a-f0-9]+;/ig, '--text-muted: #64748B;'); 
  
  // Auroras back to fresh lively aesthetic
  content = content.replace(/--aurora-1:\s*#[a-f0-9]+;/ig, '--aurora-1: #8B5CF6;'); // Violet
  content = content.replace(/--aurora-2:\s*#[a-f0-9]+;/ig, '--aurora-2: #00E5FF;'); // Fresh lively cyan/blue
  content = content.replace(/--aurora-3:\s*#[a-f0-9]+;/ig, '--aurora-3: #FFFFFF;'); // White light
  
  // Change table text, title texts
  content = content.replace(/color:\s*#E2E8F0/g, 'color: #334155'); 
  // Title shadows (remove intense neon shadows for dark themes, add soft shadow)
  content = content.replace(/text-shadow:\s*0\s*0\s*15px\s*rgba\(255,255,255,0\.3\);/g, 'text-shadow: 0 4px 10px rgba(0,0,0,0.1);');
  content = content.replace(/text-shadow:\s*0\s*10px\s*30px\s*rgba[^;]+;/g, 'text-shadow: 0 5px 15px rgba(0,0,0,0.1);');

  // Change generic white color for layout text to dark slate
  // But buttons still keep 'color: white'
  content = content.replace(/color:\s*white;/g, 'color: #1E293B;');
  // Now restore specific buttons that got caught
  content = content.replace(/color:\s*#1E293B;\s*box-shadow/g, 'color: white; box-shadow');
  content = content.replace(/color:\s*#1E293B;\s*padding:\s*10px\s*18/g, 'color: white; padding: 10px 18');

  // Re-fix Gradients (Purple and Blue)
  content = content.replace(/#F3E8FF/ig, '#00E5FF'); // Cyan/Blue component
  content = content.replace(/#7C3AED/ig, '#8B5CF6'); // Purple component
  
  // Box shadows (invert intense dark box shadows)
  content = content.replace(/box-shadow:\s*0\s*20px\s*40px\s*rgba\(0,0,0,0\.5\)/g, 'box-shadow: 0 20px 40px rgba(0,0,0,0.05)');
  content = content.replace(/box-shadow:\s*0\s*15px\s*35px\s*rgba\(0,0,0,0\.5\)/g, 'box-shadow: 0 15px 35px rgba(0,0,0,0.05)');
  content = content.replace(/rgba\(0,0,0,0\.8\)/g, 'rgba(0,0,0,0.4)'); // Make heavy modal backgrounds softer

  fs.writeFileSync(filePath, content, 'utf8');
}

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.css')) {
      replaceToLightMode(fullPath);
    }
  }
}

processDirectory(srcDir);
console.log("Fresh light theme applied!");
