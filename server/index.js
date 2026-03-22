const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const cors = require('cors');

const app = express();
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hour cache

// Custom User-Agent required by Liquipedia
const LIQUIPEDIA_HEADERS = {
  'User-Agent': 'GodLikeFfmWebsite/1.1 (https://github.com/saika; contact@godlikeffm.com)',
  'Accept-Encoding': 'gzip',
};

const WIKI_API = 'https://liquipedia.net/freefire/api.php';
const PAGE_NAME = 'GodLike_Esports';

// Rate limiter: max 1 request per 2 seconds to Liquipedia
let lastRequestTime = 0;
async function rateLimitedFetch(url) {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  if (timeSinceLastRequest < 3000) {
    await new Promise(resolve => setTimeout(resolve, 3000 - timeSinceLastRequest));
  }
  lastRequestTime = Date.now();
  return axios.get(url, { headers: LIQUIPEDIA_HEADERS });
}

// Fetch and cache the full page HTML
async function getPageHTML() {
  const cacheKey = 'page_html';
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const url = `${WIKI_API}?action=parse&page=${PAGE_NAME}&format=json&prop=text|sections`;
  const response = await rateLimitedFetch(url);
  const html = response.data.parse.text['*'];
  const sections = response.data.parse.sections;
  const result = { html, sections };
  cache.set(cacheKey, result);
  return result;
}

// Helper: find a table by matching its header columns
function findTableByHeaders(doc, requiredHeaders) {
  let foundTable = null;
  doc('table').each((i, table) => {
    if (foundTable) return;
    const headers = [];
    doc(table).find('tr:first-child th').each((j, th) => {
      headers.push(doc(th).text().trim().toLowerCase());
    });
    const matches = requiredHeaders.every(req =>
      headers.some(h => h.includes(req))
    );
    if (matches) foundTable = { element: table, headers };
  });
  return foundTable;
}

app.use(cors());
app.use(express.json());

// ═══ GET /api/team-info ═══
app.get('/api/team-info', async (req, res) => {
  try {
    const cacheKey = 'team_info';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const { html } = await getPageHTML();
    const doc = cheerio.load(html);

    const teamInfo = {
      name: 'GodLike Esports',
      region: 'India',
      game: 'Free Fire',
      roster: [],
      formerRoster: [],
    };

    // Parse active roster table (ID | Name | Join Date)
    const activeRoster = findTableByHeaders(doc, ['id', 'name', 'join date']);
    if (activeRoster) {
      doc(activeRoster.element).find('tr').each((j, row) => {
        if (j === 0) return;
        const cells = doc(row).find('td');
        if (cells.length >= 2) {
          const id = doc(cells[0]).text().trim();
          const name = doc(cells[1]).text().trim();
          const joinDate = cells.length >= 3 ? doc(cells[2]).text().trim() : '';
          if (id) teamInfo.roster.push({ id, name, joinDate });
        }
      });
    }

    cache.set(cacheKey, teamInfo);
    res.json(teamInfo);
  } catch (err) {
    console.error('Error fetching team info:', err.message);
    res.status(500).json({ error: 'Failed to fetch team info', message: err.message });
  }
});

// ═══ GET /api/achievements ═══
app.get('/api/achievements', async (req, res) => {
  try {
    const cacheKey = 'achievements';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const { html } = await getPageHTML();
    const doc = cheerio.load(html);
    const achievements = [];

    // The achievements table has class "table2__table sortable"
    // Headers: Date | Place | Tier | Tournament | Prize
    // But actual rows have 6 cells: [date, place, tier, (empty icon), tournament, prize]
    doc('table.table2__table.sortable').each((i, table) => {
      const headers = [];
      doc(table).find('tr:first-child th').each((j, th) => {
        headers.push(doc(th).text().trim().toLowerCase());
      });

      // Only process the main achievements table (has "place" column)
      const hasPlace = headers.some(h => h.includes('place'));
      if (!hasPlace) return;

      doc(table).find('tr').each((j, row) => {
        if (j === 0) return; // skip header
        const cells = doc(row).find('td');
        if (cells.length < 5) return; // skip empty/year-header rows

        const cellTexts = [];
        cells.each((k, td) => cellTexts.push(doc(td).text().trim()));

        // Cells: [0]=date, [1]=place, [2]=tier, [3]=empty/icon, [4]=tournament, [5]=prize
        const achievement = {
          date: cellTexts[0] || '',
          placement: cellTexts[1] || '',
          tier: cellTexts[2] || '',
          tournament: cellTexts[4] || cellTexts[3] || '',
          prize: cellTexts[5] || cellTexts[4] || '',
        };

        // Fix: if tournament is empty but prize looks like a name, swap
        if (!achievement.tournament && achievement.prize && !achievement.prize.startsWith('$')) {
          achievement.tournament = achievement.prize;
          achievement.prize = '';
        }

        if (achievement.tournament && achievement.date) {
          // Convert date from YYYY-MM-DD to DD/MM/YYYY (Indian format)
          const dateMatch = achievement.date.match(/(\d{4})-(\d{2})-(\d{2})/);
          if (dateMatch) {
            achievement.date = dateMatch[3] + '/' + dateMatch[2] + '/' + dateMatch[1];
          }
          achievements.push(achievement);
        }
      });
    });

    cache.set(cacheKey, achievements);
    res.json(achievements);
  } catch (err) {
    console.error('Error fetching achievements:', err.message);
    res.status(500).json({ error: 'Failed to fetch achievements', message: err.message });
  }
});

// ═══ GET /api/earnings ═══
app.get('/api/earnings', async (req, res) => {
  try {
    const cacheKey = 'earnings';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const { html } = await getPageHTML();
    const doc = cheerio.load(html);

    let totalEarnings = '$0';
    const yearlyBreakdown = [];

    // Look for total earnings in the infobox
    doc('.infobox-cell-2').each((i, el) => {
      const label = doc(el).prev('.infobox-cell-1').text().trim().toLowerCase();
      const value = doc(el).text().trim();
      if (label.includes('earning') || label.includes('prize')) {
        totalEarnings = value;
      }
    });

    // Sum up prize money from achievements as fallback
    if (totalEarnings === '$0') {
      let total = 0;
      doc('table.table2__table.sortable').each((i, table) => {
        const headers = [];
        doc(table).find('tr:first-child th').each((j, th) => {
          headers.push(doc(th).text().trim().toLowerCase());
        });
        const prizeIdx = headers.findIndex(h => h.includes('prize'));
        if (prizeIdx >= 0) {
          doc(table).find('tr').each((j, row) => {
            if (j === 0) return;
            const cells = doc(row).find('td');
            if (prizeIdx < cells.length) {
              const prizeText = doc(cells[prizeIdx]).text().trim();
              const match = prizeText.match(/[\d,]+/);
              if (match) total += parseInt(match[0].replace(/,/g, ''), 10);
            }
          });
        }
      });
      if (total > 0) totalEarnings = '$' + total.toLocaleString();
    }

    const result = { totalEarnings, yearlyBreakdown };
    cache.set(cacheKey, result);
    res.json(result);
  } catch (err) {
    console.error('Error fetching earnings:', err.message);
    res.status(500).json({ error: 'Failed to fetch earnings', message: err.message });
  }
});

// ═══ GET /api/transfers ═══
app.get('/api/transfers', async (req, res) => {
  try {
    const cacheKey = 'transfers';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const { html } = await getPageHTML();
    const doc = cheerio.load(html);
    const transfers = [];

    // Look for tables with leave date / new team columns (former player tables)
    doc('table.table2__table').each((i, table) => {
      const headers = [];
      doc(table).find('tr:first-child th').each((j, th) => {
        headers.push(doc(th).text().trim().toLowerCase());
      });

      const hasLeaveDate = headers.some(h => h.includes('leave'));
      const hasJoinDate = headers.some(h => h.includes('join'));
      const hasId = headers.some(h => h.includes('id'));

      if (hasLeaveDate && hasJoinDate && hasId) {
        doc(table).find('tr').each((j, row) => {
          if (j === 0) return;
          const cells = doc(row).find('td');
          if (cells.length < 3) return;

          const cellTexts = [];
          cells.each((k, td) => cellTexts.push(doc(td).text().trim()));

          const idIdx = headers.findIndex(h => h.includes('id'));
          const joinIdx = headers.findIndex(h => h.includes('join'));
          const leaveIdx = headers.findIndex(h => h.includes('leave'));
          const teamIdx = headers.findIndex(h => h.includes('team'));

          transfers.push({
            player: idIdx >= 0 && idIdx < cellTexts.length ? cellTexts[idIdx] : '',
            joinDate: joinIdx >= 0 && joinIdx < cellTexts.length ? cellTexts[joinIdx] : '',
            leaveDate: leaveIdx >= 0 && leaveIdx < cellTexts.length ? cellTexts[leaveIdx] : '',
            newTeam: teamIdx >= 0 && teamIdx < cellTexts.length ? cellTexts[teamIdx] : '',
          });
        });
      }
    });

    cache.set(cacheKey, transfers);
    res.json(transfers);
  } catch (err) {
    console.error('Error fetching transfers:', err.message);
    res.status(500).json({ error: 'Failed to fetch transfers', message: err.message });
  }
});

// ═══ GET /api/upcoming ═══ — Upcoming/ongoing matches from Liquipedia
app.get('/api/upcoming', async (req, res) => {
  try {
    const cacheKey = 'upcoming';
    const cached = cache.get(cacheKey);
    if (cached) return res.json(cached);

    const { html } = await getPageHTML();
    const doc = cheerio.load(html);
    const upcoming = [];

    // Upcoming matches are in wikitable with class infobox_matches_content
    doc('table.infobox_matches_content').each((i, table) => {
      const headerRow = doc(table).find('tr:first-child');
      const tournament = headerRow.text().trim();
      const detailRow = doc(table).find('tr:nth-child(2)');
      const details = detailRow.text().trim();

      if (tournament) {
        upcoming.push({
          tournament,
          details,
          status: details.toLowerCase().includes('ongoing') ? 'ONGOING' : 'UPCOMING',
        });
      }
    });

    cache.set(cacheKey, upcoming);
    res.json(upcoming);
  } catch (err) {
    console.error('Error fetching upcoming:', err.message);
    res.status(500).json({ error: 'Failed to fetch upcoming matches', message: err.message });
  }
});

// ═══ GET /api/refresh ═══ — Clear cache and re-fetch
app.get('/api/refresh', (req, res) => {
  cache.flushAll();
  res.json({ message: 'Cache cleared', timestamp: new Date().toISOString() });
});

// Start server
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Liquipedia proxy server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  GET /api/team-info');
  console.log('  GET /api/achievements');
  console.log('  GET /api/earnings');
  console.log('  GET /api/transfers');
  console.log('  GET /api/upcoming');
  console.log('  GET /api/refresh');
});
