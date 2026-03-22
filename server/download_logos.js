const fs = require('fs');
const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');

async function downloadLogo(url, teamName) {
  try {
    const p = path.join(__dirname, '../public/logos', teamName + '.png');
    if (!fs.existsSync(p)) {
      const res = await axios({url, responseType: 'stream'});
      res.data.pipe(fs.createWriteStream(p));
      console.log('Downloaded ' + teamName);
    }
  } catch(e) {}
}

const html = fs.readFileSync('rapid.html', 'utf8');
const $ = cheerio.load(html);

$('table').find('tr').each((i, row) => {
  const rowData = $(row).text();
  if (rowData.includes('K9 Esports') || rowData.includes('NG Pros') || rowData.includes('Team Forever')) {
    const img = $(row).find('img').attr('src');
    if (img) {
      let fullUrl = img.startsWith('//') ? 'https:' + img : img;
      if (!fullUrl.startsWith('http')) fullUrl = 'https://liquipedia.net' + fullUrl;
      const tName = rowData.includes('K9') ? 'k9_esports' : (rowData.includes('NG') ? 'ng_pros' : 'team_forever');
      downloadLogo(fullUrl, tName);
    }
  }
});
