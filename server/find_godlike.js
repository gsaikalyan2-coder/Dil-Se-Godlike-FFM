const fs = require('fs');
const html = fs.readFileSync('prg.html', 'utf8');

const lines = html.split('\n');
let out = '';
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('GodLike') || lines[i].includes('GODL') || lines[i].includes('Grand Finals')) {
    out += `\n--- Match at line ${i} ---\n`;
    const start = Math.max(0, i - 2);
    const end = Math.min(lines.length - 1, i + 5);
    for (let j = start; j <= end; j++) {
      out += lines[j].trim() + '\n';
    }
  }
}
fs.writeFileSync('prg_search.txt', out, 'utf8');
