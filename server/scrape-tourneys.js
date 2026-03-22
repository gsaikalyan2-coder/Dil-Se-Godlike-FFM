const axios = require('axios');
const cheerio = require('cheerio');

async function scrape(url, name) {
  try {
    const res = await axios.get(url, { headers: { 'User-Agent': 'Bot-Godlike/1.0' } });
    const $ = cheerio.load(res.data);
    console.log(`\n=== ${name} ===`);
    
    // Find all standing tables
    const tables = $('table.table2__table.sortable');
    tables.each((tIdx, table) => {
      console.log(`\nTable ${tIdx + 1}:`);
      const rows = $(table).find('tr');
      rows.each((i, el) => {
        const tds = $(el).find('td');
        if (tds.length >= 5) {
          const rank = $(tds[0]).text().trim();
          const team = $(tds[2]).text().trim();
          const points = $(tds[tds.length - 1]).text().trim(); // typically last col is Total Points
          if (team) {
            console.log(`${rank} | ${team} | ${points}`);
          }
        }
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
