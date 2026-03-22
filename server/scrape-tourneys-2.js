const axios = require('axios');
const cheerio = require('cheerio');

async function scrape(url, name) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'Bot-Godlike/1.0' } });
    const $ = cheerio.load(res.data);
    console.log(`\n=== ${name} ===`);
    
    // Find all standing tables
    const tables = $('table.wikitable');
    tables.each((tIdx, table) => {
      console.log(`\nWikitable ${tIdx + 1}:`);
      const rows = $(table).find('tr');
      rows.each((i, el) => {
         const cells = $(el).find('th, td');
         const rowData = [];
         cells.each((_, c) => rowData.push($(c).text().trim()));
         if (rowData.length > 2) console.log(rowData.join(' | '));
      });
    });
    
    const divTables = $('div.divTable');
    divTables.each((dIdx, divTable) => {
      console.log(`\nDivTable ${dIdx + 1}:`);
      const rows = $(divTable).find('.divRow');
      rows.each((i, el) => {
         const cells = $(el).find('.divCell');
         const rowData = [];
         cells.each((_, c) => rowData.push($(c).text().trim()));
         if (rowData.length > 2) console.log(rowData.join(' | '));
      });
    });

  } catch (err) {
    console.error(`Error fetching ${name}:`, err.message);
  }
}

(async () => {
  await scrape('https://liquipedia.net/freefire/PRG/Survivor_Series', 'PRG Survivor Series');
  await scrape('https://liquipedia.net/freefire/Rapid/Dignity_Cup', 'Rapid Dignity Cup');
})();
