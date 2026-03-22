const axios = require('axios');
const fs = require('fs');

async function scrape() {
  try {
    const res = await axios.get('https://liquipedia.net/freefire/PRG/Survivor_Series', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    fs.writeFileSync('prg_full.html', res.data);
    console.log('Downloaded full HTML.');
  } catch (err) {
    console.error(err.message);
  }
}
scrape();
