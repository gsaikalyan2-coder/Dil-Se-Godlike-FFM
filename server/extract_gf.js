const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prg_full.html', 'utf-8');
const $ = cheerio.load(html);
let output = '';

$('.csstable-widget, .brkts-popup, .brkts-matchlist, .wikitable, .divTable, table, div[class*="table"]').each((i, table) => {
  const text = $(table).text();
  if (text.includes('GodLike') || text.includes('GODL') || text.includes('Hind') || text.includes('18')) {
    output += `--- TABLE ${i} ---\n`;
    $(table).find('tr, .divRow, .csstable-widget-row').each((j, row) => {
      const rowData = [];
      $(row).find('th, td, .divCell, .csstable-widget-cell').each((k, cell) => {
        let cellText = $(cell).text().replace(/\s+/g, ' ').trim();
        if (cellText) rowData.push(cellText);
      });
      if (rowData.length > 0) output += `Row ${j}: ` + rowData.join(' | ') + '\n';
    });
    output += '\n\n';
  }
});

fs.writeFileSync('prg_full_tables.txt', output);
console.log('Done mapping tables.');
