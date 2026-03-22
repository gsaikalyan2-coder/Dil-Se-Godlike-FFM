const axios = require('./server/node_modules/axios');
const cheerio = require('./server/node_modules/cheerio');

axios.get('https://liquipedia.net/freefire/Zee_Media/Arena_of_Champions', {headers:{'User-Agent':'Bot/1.0'}}).then(r => {
  const $ = cheerio.load(r.data);
  const rows = $('table.table2__table.sortable').last().find('tr');
  const results = [];
  rows.each((i, el) => {
    const tds = $(el).find('td');
    if (tds.length >= 6) {
      const rank = $(tds[0]).text().trim();
      const team = $(tds[2]).text().trim();
      const points = $(tds[6]).text().trim();
      if (team) {
         results.push(`${rank} | ${team} | ${points}`);
      }
    }
  });
  console.log(results.join('\n'));
}).catch(e => console.error(e.message));
