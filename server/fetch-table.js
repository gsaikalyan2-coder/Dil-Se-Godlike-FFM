const axios = require('axios');
const cheerio = require('cheerio');

axios.get('https://liquipedia.net/freefire/Zee_Media/Arena_of_Champions', {headers:{'User-Agent':'GodLikeFfmWebsite/1.9'}}).then(r => {
  const $ = cheerio.load(r.data);
  const rows = $('table.table2__table.sortable').last().find('tr');
  rows.each((i, el) => {
    const tds = $(el).find('td');
    if (tds.length >= 6) {
      const rank = $(tds[0]).text().trim();
      const team = $(tds[2]).text().trim();
      const points = $(tds[6]).text().trim();
      if (team) {
         console.log(rank, "|", team, "|", points);
      }
    }
  });
}).catch(e => console.error(e.message));
