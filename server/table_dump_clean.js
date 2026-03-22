const fs = require('fs');
const cheerio = require('cheerio');

let out = '';
function dumpTables(file) {
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  out += `\n\n=== ${file} ===\n`;
  $('table.wikitable').each((i, table) => {
    out += `\nTable ${i+1}:\n`;
    $(table).find('tr').each((j, row) => {
      const cells = $(row).find('th, td');
      const rowData = [];
      cells.each((_, c) => rowData.push($(c).text().replace(/\s+/g, ' ').trim()));
      out += rowData.join(' | ') + '\n';
    });
  });
  
  $('.table2__table').each((i, table) => {
    out += `\nTable2 ${i+1}:\n`;
    $(table).find('tr').each((j, row) => {
      const cells = $(row).find('th, td');
      const rowData = [];
      cells.each((_, c) => rowData.push($(c).text().replace(/\s+/g, ' ').trim()));
      out += rowData.join(' | ') + '\n';
    });
  });
}

dumpTables('prg.html');
dumpTables('rapid.html');

fs.writeFileSync('clean_dump.txt', out, 'utf8');
