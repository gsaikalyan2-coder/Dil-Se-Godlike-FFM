const https = require('https');

const urls = [
  'https://www.youtube.com/live/_j_fbLdwtN4',
  'https://www.youtube.com/live/yVN8MbmLhhU',
  'https://www.youtube.com/live/LVMc8OGTxZU',
  'https://www.youtube.com/live/Xgfb0guQEnc'
];

async function fetchUrl(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, data }));
    });
  });
}

(async () => {
  for (let url of urls) {
    const { data } = await fetchUrl(url);
    const titleMatch = data.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1] : 'No Title';
    
    // Check if GodLike is mentioned
    const hasGodLike = /godlike/i.test(data);
    
    // Attempt to extract teams list or points from description or meta
    const descMatch = data.match(/"shortDescription":"(.*?)"/);
    const desc = descMatch ? descMatch[1] : '';

    console.log("----");
    console.log("URL:", url);
    console.log("Title:", title);
    console.log("Mentions GodLike?", hasGodLike);
    
    // Check for GodLike in the description
    const regex = /.{0,50}godlike.{0,50}/ig;
    let match;
    while ((match = regex.exec(data)) !== null) {
      console.log("Match:", match[0]);
    }
  }
})();
