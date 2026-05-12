const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Fix opacity values: border-white/[0.06] -> border-white/6
  content = content.replace(/(border-white)\/\[0\.0(\d+)\]/g, '$1/$2');
  // Fix opacity values: hover:border-white/[0.15] -> hover:border-white/15
  content = content.replace(/(border-white)\/\[0\.(\d+)\]/g, (match, p1, p2) => {
    return `${p1}/${p2.length === 1 ? p2 + '0' : p2}`;
  });

  // bg-white/[0.02] -> bg-white/2
  content = content.replace(/(bg-white)\/\[0\.0(\d+)\]/g, '$1/$2');
  // bg-white/[0.15] -> bg-white/15
  content = content.replace(/(bg-white)\/\[0\.(\d+)\]/g, (match, p1, p2) => {
    return `${p1}/${p2.length === 1 ? p2 + '0' : p2}`;
  });
  
  // bg-red-500/[0.02] -> bg-red-500/2
  content = content.replace(/(bg-red-500)\/\[0\.0(\d+)\]/g, '$1/$2');

  // bg-gradient-to-r -> bg-linear-to-r
  content = content.replace(/bg-gradient-to-/g, 'bg-linear-to-');
  
  // flex-shrink-0 -> shrink-0
  content = content.replace(/flex-shrink-0/g, 'shrink-0');
  
  // tracking-tighter -> tracking-tight
  content = content.replace(/tracking-tighter/g, 'tracking-tight');
  
  // bg-[#0b0e14] -> bg-card
  content = content.replace(/bg-\[#0b0e14\]/g, 'bg-card');
  
  // -top-[10%] -> top-[-10%]
  content = content.replace(/-top-\[([^\]]+)\]/g, 'top-[-$1]');
  content = content.replace(/-left-\[([^\]]+)\]/g, 'left-[-$1]');
  content = content.replace(/-right-\[([^\]]+)\]/g, 'right-[-$1]');
  content = content.replace(/-bottom-\[([^\]]+)\]/g, 'bottom-[-$1]');
  
  // divide-white/[0.04] -> divide-white/4
  content = content.replace(/(divide-white)\/\[0\.0(\d+)\]/g, '$1/$2');
  content = content.replace(/(text-white)\/\[0\.0(\d+)\]/g, '$1/$2');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

walk(path.join(__dirname, 'src'), processFile);
console.log("Done fixing Tailwind classes.");
