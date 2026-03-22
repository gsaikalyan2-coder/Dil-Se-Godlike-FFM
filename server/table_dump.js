const fs = require('fs');
const cheerio = require('cheerio');

function dumpTables(file) {
  const html = fs.readFileSync(file, 'utf8');
  const $ = cheerio.load(html);
  console.log(`\n\n=== ${file} ===`);
  $('table.wikitable').each((i, table) => {
    console.log(`\nTable ${i+1}:`);
    $(table).find('tr').each((j, row) => {
      const cells = $(row).find('th, td');
      const rowData = [];
      cells.each((_, c) => rowData.push($(c).text().replace(/\s+/g, ' ').trim()));
      if (rowData.includes('GodLike Esports') || rowData.includes('GODL')) {
         console.log('-> ' + rowData.join(' | '));
      } else if (rowData.length > 2 && j < 4) {
         // Print first few rows to know headers
         console.log('H: ' + rowData.join(' | '));
      }
    });
  });
  
  // also check generic tables
  $('.table2__table').each((i, table) => {
    console.log(`\nTable2 ${i+1}:`);
    $(table).find('tr').each((j, row) => {
      const cells = $(row).find('th, td');
      const rowData = [];
      cells.each((_, c) => rowData.push($(c).text().replace(/\s+/g, ' ').trim()));
      if (rowData.includes('GodLike Esports') || rowData.includes('GODL')) {
         console.log('=> ' + rowData.join(' | '));
      } else if (rowData.length > 2 && j < 4) {
         console.log('T: ' + rowData.join(' | '));
      }
    });
  });
}

dumpTables('prg.html');
dumpTables('rapid.html');
