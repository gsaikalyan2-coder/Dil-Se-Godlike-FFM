const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('prg_updated.html', 'utf8');
const $ = cheerio.load(html);

const results = [];

// Look for tables that might be standings format
$('.wikitable, .divTable, table').each((i, el) => {
  let hasGodlike = $(el).text().includes('GodLike') || $(el).text().includes('GODL');
  let hasHind = $(el).text().includes('Hind');
  
  if (hasGodlike && hasHind) {
    results.push(`--- Table ${i} ---`);
    $(el).find('tr, .divRow').each((j, row) => {
      let rowData = [];
      $(row).find('th, td, .divCell').each((k, cell) => {
        rowData.push($(cell).text().trim().replace(/\s+/g, ' '));
      });
      if (rowData.length > 0) {
        results.push(rowData.join(' | '));
      }
    });
  }
});

fs.writeFileSync('prg_gf_standings.txt', results.join('\n'));
