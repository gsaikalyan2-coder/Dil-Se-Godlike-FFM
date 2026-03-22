/* ═══════════════════════════════════════════════════════════════
   TOURNAMENT STORE — CRUD, Status Lifecycle, Validation & Seeding
   localStorage-backed data layer for the Admin dashboard.
   Does NOT modify store.js or tournaments.js.
   ═══════════════════════════════════════════════════════════════ */

import {
  ffmic2025, ffmicBrGodlike, ffmicBrFinals, ffmicCsGodlike,
  ffmai2025, ffmaiBrGodlike, ffmaiBrFinals, ffmaiCsGodlike,
  lidomaEndless2025, lidomaSouthAsia, lidomaSouthAsiaStandings,
  lidomaAsiaClash,
  godlikeLidomaSummary,
  zeeMediaAOC, aocGodlikeJourney, aocGrandFinalsStandings,
  iqooProS3, iqooPS3GodlikeJourney, iqooPS3GrandFinalsStandings,
  ngAsiaChamp, ngACGodlikeJourney, ngACGrandFinalsStandings,
  prgSurvivorSeries, prgGodlikeJourney, prgGrandFinalsStandings,
  rapidDignityCup, rapidGFStandings, rapidGodlikeJourney,
  lidomaRegionalWars, lidomaRWGodlikeJourney, lidomaRWPlayoffsStandings,
  lidomaRWLastChanceStandings, lidomaRWGrandFinalsStandings,
  oneBladeInferno, oneBladeGodlikeJourney, oneBladePlayInsGroupB,
  oneBladeGrandFinalsStandings,
  urbanskySeries, urbanskyGodlikeJourney, urbanskyGrandFinalsStandings,
  rbzRegionalBR, rbzBRGodlikeJourney, rbzBRGrandFinalsStandings,
  rbzRegionalCS, rbzCSGodlikeJourney,
} from './tournaments';

// ─── Storage Keys ───
const TOURNAMENT_KEYS = {
  INDEX: 'tournaments-index',
  PREFIX: 'tournament:',
};

const ACTIVITY_LOG_KEY = 'glffm_activity_log';

// ─── Undo/Redo (in-memory, resets on page reload) ───
let undoStack = [];
let redoStack = [];

// ─── localStorage Helpers (mirrors store.js) ───
function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* corrupted data — fall back */ }
  return fallback;
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── Activity Log ───
export function logActivity(action, details) {
  const log = getJSON(ACTIVITY_LOG_KEY, []);
  log.unshift({ action, details: details || '', timestamp: Date.now() });
  if (log.length > 100) log.length = 100;
  setJSON(ACTIVITY_LOG_KEY, log);
}

export function getActivityLog() {
  return getJSON(ACTIVITY_LOG_KEY, []);
}

export function clearActivityLog() {
  setJSON(ACTIVITY_LOG_KEY, []);
}

// ─── Undo/Redo Functions ───
export function pushUndoSnapshot(id) {
  const data = getJSON(TOURNAMENT_KEYS.PREFIX + id, null);
  if (!data) return;
  undoStack.push({ id, data: JSON.parse(JSON.stringify(data)) });
  if (undoStack.length > 50) undoStack.shift();
  redoStack = [];
}

export function undo() {
  if (undoStack.length === 0) return null;
  const snapshot = undoStack.pop();
  const current = getJSON(TOURNAMENT_KEYS.PREFIX + snapshot.id, null);
  if (current) {
    redoStack.push({ id: snapshot.id, data: JSON.parse(JSON.stringify(current)) });
  }
  setJSON(TOURNAMENT_KEYS.PREFIX + snapshot.id, snapshot.data);
  const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
  const updatedIndex = index.map(entry => entry.id === snapshot.id ? { ...entry, status: snapshot.data.status } : entry);
  setJSON(TOURNAMENT_KEYS.INDEX, updatedIndex);
  return snapshot.data;
}

export function redo() {
  if (redoStack.length === 0) return null;
  const snapshot = redoStack.pop();
  const current = getJSON(TOURNAMENT_KEYS.PREFIX + snapshot.id, null);
  if (current) {
    undoStack.push({ id: snapshot.id, data: JSON.parse(JSON.stringify(current)) });
  }
  setJSON(TOURNAMENT_KEYS.PREFIX + snapshot.id, snapshot.data);
  const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
  const updatedIndex = index.map(entry => entry.id === snapshot.id ? { ...entry, status: snapshot.data.status } : entry);
  setJSON(TOURNAMENT_KEYS.INDEX, updatedIndex);
  return snapshot.data;
}

export function canUndo() { return undoStack.length > 0; }
export function canRedo() { return redoStack.length > 0; }

// ─── Date Parsing ───
function parseDate(str) {
  if (!str) return '';
  // "22/08/2025" → "2025-08-22"
  const ddmmyyyy = str.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (ddmmyyyy) return `${ddmmyyyy[3]}-${ddmmyyyy[2]}-${ddmmyyyy[1]}`;
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  return str;
}

function parseDateRange(str) {
  if (!str) return { start: '', end: '' };
  // "22/08/2025 – 28/09/2025" or "22/08/2025 — 28/09/2025"
  const parts = str.split(/\s*[–—]\s*/);
  if (parts.length === 2) {
    return { start: parseDate(parts[0].trim()), end: parseDate(parts[1].trim()) };
  }
  // Single year "2025"
  if (/^\d{4}$/.test(str.trim())) {
    return { start: `${str.trim()}-01-01`, end: `${str.trim()}-12-31` };
  }
  const d = parseDate(str);
  return { start: d, end: d };
}

// ─── Tournament Object Factory ───
export function createBlankTournament() {
  return {
    id: 't_' + Date.now(),
    name: '',
    organizer: '',
    gameMode: 'BR',
    region: '',
    tier: 'C',
    status: 'upcoming',
    startDate: '',
    endDate: '',
    prizePoolINR: 0,
    prizePoolUSD: 0,
    teamsCount: 0,
    liquipediaURL: '',
    instagramURL: '',
    vodLinks: [],
    stages: [],
    standings: [],
    godlikeJourney: [],
    godlikeFinalPosition: '',
    godlikePrizeINR: 0,
    godlikePrizeUSD: 0,
    roster: ['YOGI', 'MARCO', 'NOBITA', 'ECOECO', 'NANCY'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ─── CRUD Functions ───

// Internal update — no undo/logging (used by status transition helpers)
function _rawUpdate(id, data) {
  const existing = getJSON(TOURNAMENT_KEYS.PREFIX + id, null);
  if (!existing) return null;
  const updated = { ...existing, ...data, id, updatedAt: Date.now() };
  setJSON(TOURNAMENT_KEYS.PREFIX + id, updated);
  if (data.status && data.status !== existing.status) {
    const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
    const updatedIndex = index.map(entry => entry.id === id ? { ...entry, status: data.status } : entry);
    setJSON(TOURNAMENT_KEYS.INDEX, updatedIndex);
  }
  return updated;
}

export function createTournament(data) {
  const blank = createBlankTournament();
  const tournament = { ...blank, ...data, id: data.id || blank.id, createdAt: Date.now(), updatedAt: Date.now() };
  setJSON(TOURNAMENT_KEYS.PREFIX + tournament.id, tournament);
  const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
  index.push({ id: tournament.id, status: tournament.status });
  setJSON(TOURNAMENT_KEYS.INDEX, index);
  logActivity('Created tournament', tournament.name);
  return tournament;
}

export function getTournament(id) {
  return getJSON(TOURNAMENT_KEYS.PREFIX + id, null);
}

export function getAllTournaments() {
  const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
  return index.map(entry => getJSON(TOURNAMENT_KEYS.PREFIX + entry.id, null)).filter(Boolean);
}

export function getTournamentsByStatus(status) {
  const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
  return index
    .filter(entry => entry.status === status)
    .map(entry => getJSON(TOURNAMENT_KEYS.PREFIX + entry.id, null))
    .filter(Boolean)
    .sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));
}

export function updateTournament(id, data) {
  pushUndoSnapshot(id);
  const result = _rawUpdate(id, data);
  if (result) logActivity('Updated tournament', result.name);
  return result;
}

export function deleteTournament(id) {
  pushUndoSnapshot(id);
  const t = getJSON(TOURNAMENT_KEYS.PREFIX + id, null);
  logActivity('Deleted tournament', t ? t.name : id);
  const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
  setJSON(TOURNAMENT_KEYS.INDEX, index.filter(entry => entry.id !== id));
  localStorage.removeItem(TOURNAMENT_KEYS.PREFIX + id);
}

export function getTournamentIndex() {
  return getJSON(TOURNAMENT_KEYS.INDEX, []);
}

// ─── Status Transition Functions ───

export function goLive(id) {
  const t = getTournament(id);
  if (!t || t.status !== 'upcoming') return null;
  pushUndoSnapshot(id);
  logActivity('Tournament went live', t.name);
  return _rawUpdate(id, { status: 'live' });
}

export function markComplete(id) {
  const t = getTournament(id);
  if (!t || (t.status !== 'upcoming' && t.status !== 'live')) return null;
  pushUndoSnapshot(id);
  logActivity('Tournament completed', t.name);
  return _rawUpdate(id, { status: 'completed' });
}

export function revertStatus(id) {
  const t = getTournament(id);
  if (!t) return null;
  pushUndoSnapshot(id);
  logActivity('Reverted status for', t.name);
  if (t.status === 'completed') return _rawUpdate(id, { status: 'live' });
  if (t.status === 'live') return _rawUpdate(id, { status: 'upcoming' });
  return null;
}

// ─── Validation ───

export function validateTournament(data) {
  const errors = [];
  const warnings = [];

  if (!data.name || !data.name.trim()) errors.push('Tournament name is required.');
  if (!data.gameMode) errors.push('Game mode is required.');
  if (!data.region || !data.region.trim()) errors.push('Region is required.');
  if (!data.tier) errors.push('Tier is required.');
  if (!data.startDate) errors.push('Start date is required.');
  if (!data.endDate) errors.push('End date is required.');
  if (data.startDate && data.endDate && data.endDate < data.startDate) {
    errors.push('End date must be on or after start date.');
  }

  // Check standings for valid data
  if (data.standings) {
    data.standings.forEach((row, i) => {
      if (row.kills !== undefined && row.kills < 0) errors.push(`Standings row ${i + 1}: kills cannot be negative.`);
    });
  }

  // Check godlikeJourney for valid placements
  if (data.godlikeJourney) {
    data.godlikeJourney.forEach((stage, i) => {
      if (stage.position && (stage.position < 1 || stage.position > 18)) {
        errors.push(`Journey stage ${i + 1}: placement must be 1–18.`);
      }
    });
  }

  // Duplicate name warning
  if (data.name) {
    const index = getJSON(TOURNAMENT_KEYS.INDEX, []);
    const existing = index.find(entry => {
      const t = getJSON(TOURNAMENT_KEYS.PREFIX + entry.id, null);
      return t && t.name === data.name && t.id !== data.id;
    });
    if (existing) warnings.push(`A tournament named "${data.name}" already exists.`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

// ─── Auto-Calculating Standings ───
const FF_PLACEMENT_PTS = [0, 12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1];
function getPlacementPoints(placement) {
  if (placement < 1 || placement > 18) return 0;
  return FF_PLACEMENT_PTS[placement] || 0;
}

export function computeAutoStandings(tournament) {
  if (!tournament || !tournament.stages) return null;
  let totalKills = 0, totalPlacementPts = 0, totalBooyahs = 0, matchCount = 0;
  tournament.stages.forEach(stage => {
    (stage.matches || []).forEach(match => {
      matchCount++;
      totalKills += match.kills || 0;
      totalPlacementPts += getPlacementPoints(match.placement || 0);
      if (match.booyah) totalBooyahs++;
    });
  });
  return {
    rank: null, team: 'GodLike', booyahs: totalBooyahs, kills: totalKills,
    placementPts: totalPlacementPts, points: totalPlacementPts + totalKills,
    isGodlike: true, matchesPlayed: matchCount,
  };
}

export function recalculateGodlikeStandings(tournamentId) {
  const t = getTournament(tournamentId);
  if (!t) return;
  const autoRow = computeAutoStandings(t);
  if (!autoRow) return;
  const standings = [...(t.standings || [])];
  const glIdx = standings.findIndex(r => r.isGodlike || (r.team && r.team.toLowerCase().includes('godl')));
  if (glIdx >= 0) {
    standings[glIdx] = { ...standings[glIdx], ...autoRow, rank: standings[glIdx].rank };
  } else {
    autoRow.rank = standings.length + 1;
    standings.push(autoRow);
  }
  _rawUpdate(tournamentId, { standings });
}

// ─── Duplicate & Export ───
export function duplicateTournament(id) {
  const t = getTournament(id);
  if (!t) return null;
  const clone = JSON.parse(JSON.stringify(t));
  clone.id = 't_' + Date.now();
  clone.name = t.name + ' (Copy)';
  clone.status = 'upcoming';
  clone.createdAt = Date.now();
  clone.updatedAt = Date.now();
  return createTournament(clone);
}

export function exportTournamentAsMarkdown(id) {
  const t = getTournament(id);
  if (!t) return '';
  let md = `# ${t.name}\n\n`;
  md += `| Field | Value |\n|-------|-------|\n`;
  md += `| Organizer | ${t.organizer || '—'} |\n`;
  md += `| Game Mode | ${t.gameMode} |\n`;
  md += `| Region | ${t.region || '—'} |\n`;
  md += `| Tier | ${t.tier} |\n`;
  md += `| Dates | ${t.startDate || '—'} to ${t.endDate || '—'} |\n`;
  if (t.prizePoolINR) md += `| Prize Pool (INR) | ₹${t.prizePoolINR.toLocaleString()} |\n`;
  if (t.prizePoolUSD) md += `| Prize Pool (USD) | $${t.prizePoolUSD.toLocaleString()} |\n`;
  md += `| Teams | ${t.teamsCount || '—'} |\n`;
  md += `| GodLike Position | ${t.godlikeFinalPosition || '—'} |\n\n`;
  if (t.godlikeJourney && t.godlikeJourney.length > 0) {
    md += `## GodLike's Journey\n\n`;
    t.godlikeJourney.forEach(j => {
      md += `- **${j.stage}**: ${j.position || '—'} (${j.outcome})`;
      if (j.points) md += ` — ${j.points} pts`;
      if (j.notes) md += ` — ${j.notes}`;
      md += '\n';
    });
    md += '\n';
  }
  if (t.standings && t.standings.length > 0) {
    md += `## Standings\n\n`;
    md += `| Rank | Team | Kills | Points |\n|------|------|-------|--------|\n`;
    t.standings.forEach(r => {
      md += `| ${r.rank || '—'} | ${r.team || '—'} | ${r.kills || '—'} | ${r.points || '—'} |\n`;
    });
    md += '\n';
  }
  if (t.stages && t.stages.some(s => (s.matches || []).length > 0 || (s.csMatches || []).length > 0)) {
    md += `## Match Results\n\n`;
    t.stages.forEach(s => {
      md += `### ${s.name || 'Stage'}\n\n`;
      (s.matches || []).forEach(m => {
        md += `- Game ${m.matchNum || '?'}: #${m.placement || '?'} placement, ${m.kills || 0} kills${m.booyah ? ' (BOOYAH!)' : ''}\n`;
      });
      (s.csMatches || []).forEach(cm => {
        md += `- ${cm.roundName || 'Match'} (${cm.format || 'Bo3'}) vs ${cm.opponent || '?'}: ${cm.result || '—'}\n`;
      });
      md += '\n';
    });
  }
  return md;
}

// ═══════════════════════════════════════════
// SEED FUNCTION — Transform hardcoded data
// ═══════════════════════════════════════════

function buildSeedTournament(id, overrides) {
  const blank = createBlankTournament();
  return { ...blank, ...overrides, id, status: 'completed', createdAt: 1, updatedAt: 1 };
}

function seedAllTournaments() {
  const tournaments = [];

  // 1. FFMIC 2025
  const ffmicDates = parseDateRange(ffmic2025.dates);
  tournaments.push(buildSeedTournament('seed_ffmic2025', {
    name: ffmic2025.name,
    organizer: 'Garena',
    gameMode: 'BR',
    region: 'India',
    tier: 'S',
    startDate: ffmicDates.start,
    endDate: ffmicDates.end,
    prizePoolINR: 10000000,
    teamsCount: ffmic2025.totalTeams || 18,
    stages: [
      { name: 'Qualifiers', type: 'br_points', description: ffmicBrGodlike.qualifiers?.result || '' },
      { name: 'League Stage', type: 'br_points', description: ffmicBrGodlike.leagueStage?.result || '' },
      { name: 'Grand Finals', type: 'br_points', description: ffmicBrGodlike.grandFinals?.result || '' },
    ],
    standings: ffmicBrFinals.map(r => ({
      rank: r.rank, team: r.team, points: r.points, booyahs: r.booyahs, prize: r.prize, isGodlike: r.isGodlike,
    })),
    godlikeJourney: [
      { stage: 'Qualifiers', position: `${ffmicBrGodlike.qualifiers.position}/${ffmicBrGodlike.qualifiers.totalTeams}`, points: ffmicBrGodlike.qualifiers.points, outcome: 'advanced', notes: ffmicBrGodlike.qualifiers.result },
      { stage: 'League Stage', position: 'Qualified', points: null, outcome: 'advanced', notes: ffmicBrGodlike.leagueStage.result },
      { stage: 'Grand Finals (BR)', position: `${ffmicBrGodlike.grandFinals.position}/12`, points: ffmicBrGodlike.grandFinals.points, outcome: 'eliminated', notes: ffmicBrGodlike.grandFinals.result },
      { stage: 'Clash Squad', position: ffmicCsGodlike.finalPlacement, points: null, outcome: 'runner_up', notes: `Lost to Total Gaming ${ffmicCsGodlike.grandFinal.score}` },
    ],
    godlikeFinalPosition: '9th (BR) / Runner-Up (CS)',
    godlikePrizeINR: 500000,
  }));

  // 2. FFMAI 2025
  const ffmaiDates = parseDateRange(ffmai2025.dates);
  tournaments.push(buildSeedTournament('seed_ffmai2025', {
    name: ffmai2025.name,
    organizer: 'Garena',
    gameMode: 'BR',
    region: 'Asia',
    tier: 'S',
    startDate: ffmaiDates.start,
    endDate: ffmaiDates.end,
    prizePoolUSD: 50000,
    teamsCount: ffmai2025.totalTeams || 26,
    stages: [
      { name: 'Play-Ins', type: 'br_points', description: ffmaiBrGodlike.playIns?.result || '' },
      { name: 'Main Event', type: 'br_points', description: ffmaiBrGodlike.mainEvent?.result || '' },
      { name: 'Grand Finals', type: 'br_points', description: ffmaiBrGodlike.grandFinals?.result || '' },
    ],
    standings: ffmaiBrFinals.map(r => ({
      rank: r.rank, team: r.team, country: r.country, points: r.points, booyahs: r.booyahs, prize: r.prize, isGodlike: r.isGodlike,
    })),
    godlikeJourney: [
      { stage: 'Play-Ins', position: `${ffmaiBrGodlike.playIns.position}/${ffmaiBrGodlike.playIns.totalTeams}`, points: ffmaiBrGodlike.playIns.points, outcome: 'advanced', notes: ffmaiBrGodlike.playIns.result },
      { stage: 'Main Event', position: `${ffmaiBrGodlike.mainEvent.position}/${ffmaiBrGodlike.mainEvent.totalTeams}`, points: ffmaiBrGodlike.mainEvent.points, outcome: 'advanced', notes: ffmaiBrGodlike.mainEvent.result },
      { stage: 'Grand Finals (BR)', position: `${ffmaiBrGodlike.grandFinals.position}/${ffmaiBrGodlike.grandFinals.totalTeams}`, points: ffmaiBrGodlike.grandFinals.points, outcome: 'eliminated', notes: ffmaiBrGodlike.grandFinals.result },
      { stage: 'Clash Squad', position: ffmaiCsGodlike.finalPlacement, points: null, outcome: 'eliminated', notes: ffmaiCsGodlike.qualifier.finalResult },
    ],
    godlikeFinalPosition: '6th (BR) / 9th-15th (CS)',
    godlikePrizeUSD: 1900,
  }));

  // 3. Lidoma Endless Series 2025
  const lidomaDates = parseDateRange(lidomaEndless2025.dates);
  tournaments.push(buildSeedTournament('seed_lidoma2025', {
    name: lidomaEndless2025.name,
    organizer: lidomaEndless2025.organizer || 'Lidoma Vision Esports',
    gameMode: 'BR',
    region: 'Asia',
    tier: 'B',
    startDate: lidomaDates.start,
    endDate: lidomaDates.end,
    prizePoolUSD: 61300,
    teamsCount: 7000,
    stages: [
      { name: 'India Open', type: 'br_points', description: 'Qualified for South Asia Championship' },
      { name: 'South Asia Championship', type: 'br_points', description: `${lidomaSouthAsia.godlikeResult.result} — $${lidomaSouthAsia.godlikeResult.prizeMoney}` },
      { name: 'Asia Intercontinental Clash', type: 'br_points', description: lidomaAsiaClash.godlikeResult.result },
    ],
    standings: lidomaSouthAsiaStandings.map(r => ({
      rank: r.rank, team: r.team, country: r.country, prize: r.prize, qualified: r.qualified, isGodlike: r.isGodlike,
    })),
    godlikeJourney: godlikeLidomaSummary?.journey?.map(j => ({
      stage: j.stage, position: j.position || '', points: j.points || null, outcome: j.qualified ? 'advanced' : 'eliminated', notes: j.result || j.note || '',
    })) || [
      { stage: 'India Open', position: 'Qualified', points: null, outcome: 'advanced', notes: 'Advanced to South Asia Championship' },
      { stage: 'South Asia Championship', position: '2nd/18', points: null, outcome: 'advanced', notes: 'Runner-Up ($1,250)' },
      { stage: 'Asia Intercontinental', position: '9th', points: 174, outcome: 'eliminated', notes: 'Did not qualify for Global Championship' },
    ],
    godlikeFinalPosition: '2nd (South Asia) / 9th (Asia Playoffs)',
    godlikePrizeUSD: 1450,
  }));

  // 4. Zee Media AOC
  const zeeDates = parseDateRange(zeeMediaAOC.dates);
  tournaments.push(buildSeedTournament('seed_zeeaoc', {
    name: zeeMediaAOC.name,
    organizer: zeeMediaAOC.organizer || 'Zee Media / Garena',
    gameMode: 'BR',
    region: 'India',
    tier: 'A',
    startDate: zeeDates.start,
    endDate: zeeDates.end,
    prizePoolINR: zeeMediaAOC.prizePool ? parseInt(String(zeeMediaAOC.prizePool).replace(/[^\d]/g, '')) || 0 : 0,
    teamsCount: zeeMediaAOC.totalTeams || 24,
    standings: aocGrandFinalsStandings?.map(r => ({
      rank: r.rank, team: r.team, points: r.points, booyahs: r.booyahs, prize: r.prize, isGodlike: r.isGodlike,
    })) || [],
    godlikeJourney: [
      { stage: aocGodlikeJourney?.qualifiers?.stage || 'Qualifiers', position: aocGodlikeJourney?.qualifiers?.result || 'Eliminated', points: aocGodlikeJourney?.qualifiers?.points || null, outcome: 'eliminated', notes: aocGodlikeJourney?.qualifiers?.note || 'Missed Top 24 due to Fan Favourite voting' },
    ],
    godlikeFinalPosition: 'Eliminated in Qualifiers',
    godlikePrizeINR: 0,
  }));

  // 5. iQOO Pro Series S3
  const iqooDates = parseDateRange(iqooProS3.dates);
  tournaments.push(buildSeedTournament('seed_iqoops3', {
    name: iqooProS3.name,
    organizer: iqooProS3.organizer || 'iQOO / Garena',
    gameMode: 'BR',
    region: 'India',
    tier: 'A',
    startDate: iqooDates.start,
    endDate: iqooDates.end,
    prizePoolINR: iqooProS3.prizePool ? parseInt(String(iqooProS3.prizePool).replace(/[^\d]/g, '')) || 0 : 0,
    teamsCount: iqooProS3.totalTeams || 18,
    standings: iqooPS3GrandFinalsStandings?.map(r => ({
      rank: r.rank, team: r.team, points: r.points, booyahs: r.booyahs, prize: r.prize, isGodlike: r.isGodlike,
    })) || [],
    godlikeJourney: [
      { stage: iqooPS3GodlikeJourney?.leagueStage?.stage || 'League Stage', position: iqooPS3GodlikeJourney?.leagueStage?.result || '', points: iqooPS3GodlikeJourney?.leagueStage?.points || null, outcome: 'advanced', notes: iqooPS3GodlikeJourney?.leagueStage?.note || '' },
      { stage: 'Grand Finals', position: iqooPS3GodlikeJourney?.grandFinals?.result || '7th', points: iqooPS3GodlikeJourney?.grandFinals?.points || 228, outcome: 'eliminated', notes: iqooPS3GodlikeJourney?.grandFinals?.note || '' },
    ],
    godlikeFinalPosition: '7th',
    godlikePrizeINR: 0,
  }));

  // 6. NG Asia Championship
  const ngDates = parseDateRange(ngAsiaChamp.dates);
  tournaments.push(buildSeedTournament('seed_ngac', {
    name: ngAsiaChamp.name,
    organizer: ngAsiaChamp.organizer || 'NG Esports',
    gameMode: 'BR',
    region: 'Asia',
    tier: 'B',
    startDate: ngDates.start,
    endDate: ngDates.end,
    prizePoolUSD: ngAsiaChamp.prizePool ? parseInt(String(ngAsiaChamp.prizePool).replace(/[^\d]/g, '')) || 0 : 0,
    teamsCount: ngAsiaChamp.totalTeams || 18,
    standings: ngACGrandFinalsStandings?.map(r => ({
      rank: r.rank, team: r.team, points: r.points, booyahs: r.booyahs, prize: r.prize, isGodlike: r.isGodlike, country: r.country,
    })) || [],
    godlikeJourney: [
      { stage: ngACGodlikeJourney?.semiFinals?.stage || 'Semi Finals', position: ngACGodlikeJourney?.semiFinals?.result || '', points: ngACGodlikeJourney?.semiFinals?.points || null, outcome: 'advanced', notes: ngACGodlikeJourney?.semiFinals?.note || '' },
      { stage: 'Grand Finals', position: ngACGodlikeJourney?.grandFinals?.result || '11th', points: ngACGodlikeJourney?.grandFinals?.points || 153, outcome: 'eliminated', notes: ngACGodlikeJourney?.grandFinals?.note || '' },
    ],
    godlikeFinalPosition: '11th',
    godlikePrizeUSD: 0,
  }));

  // 7. PRG Survivor Series
  const prgDates = parseDateRange(prgSurvivorSeries.dates);
  tournaments.push(buildSeedTournament('seed_prg', {
    name: prgSurvivorSeries.name,
    organizer: prgSurvivorSeries.organizer || 'PRG Esports',
    gameMode: 'BR',
    region: 'India',
    tier: 'C',
    startDate: prgDates.start,
    endDate: prgDates.end,
    prizePoolINR: prgSurvivorSeries.prizePool ? parseInt(String(prgSurvivorSeries.prizePool).replace(/[^\d]/g, '')) || 0 : 0,
    teamsCount: prgSurvivorSeries.totalTeams || 18,
    standings: prgGrandFinalsStandings?.map(r => ({
      rank: r.rank, team: r.team, points: r.points, prize: r.prize, isGodlike: r.isGodlike,
    })) || [],
    godlikeJourney: [
      { stage: prgGodlikeJourney?.groupStage?.stage || 'Group Stage', position: prgGodlikeJourney?.groupStage?.result || '', points: prgGodlikeJourney?.groupStage?.points || null, outcome: 'advanced', notes: prgGodlikeJourney?.groupStage?.note || '' },
      { stage: 'Grand Finals', position: prgGodlikeJourney?.grandFinals?.result || '3rd', points: prgGodlikeJourney?.grandFinals?.points || 318, outcome: 'eliminated', notes: prgGodlikeJourney?.grandFinals?.note || '' },
    ],
    godlikeFinalPosition: '3rd',
    godlikePrizeINR: 7500,
  }));

  // 8. Rapid Dignity Cup
  const rapidDates = parseDateRange(rapidDignityCup.dates);
  tournaments.push(buildSeedTournament('seed_rapid', {
    name: rapidDignityCup.name,
    organizer: rapidDignityCup.organizer || 'Rapid Esports',
    gameMode: 'BR',
    region: 'India',
    tier: 'D',
    startDate: rapidDates.start,
    endDate: rapidDates.end,
    prizePoolINR: rapidDignityCup.prizePool ? parseInt(String(rapidDignityCup.prizePool).replace(/[^\d]/g, '')) || 0 : 0,
    teamsCount: rapidDignityCup.totalTeams || 12,
    standings: rapidGFStandings?.map(r => ({
      rank: r.rank, team: r.team, points: r.points, booyahs: r.booyahs, prize: r.prize, isGodlike: r.isGodlike,
    })) || [],
    godlikeJourney: [
      { stage: rapidGodlikeJourney?.semiFinals?.stage || 'Semi Finals', position: rapidGodlikeJourney?.semiFinals?.result || '', points: rapidGodlikeJourney?.semiFinals?.points || null, outcome: 'advanced', notes: rapidGodlikeJourney?.semiFinals?.note || '' },
      { stage: 'Grand Finals', position: rapidGodlikeJourney?.grandFinals?.result || '5th', points: rapidGodlikeJourney?.grandFinals?.points || 188, outcome: 'eliminated', notes: rapidGodlikeJourney?.grandFinals?.note || '' },
    ],
    godlikeFinalPosition: '5th',
    godlikePrizeINR: 0,
  }));

  // 9. Lidoma Regional Wars
  const lrwDates = parseDateRange(lidomaRegionalWars.dates);
  tournaments.push(buildSeedTournament('seed_lidomarw', {
    name: lidomaRegionalWars.name,
    organizer: lidomaRegionalWars.organizer || 'Lidoma Vision Esports',
    gameMode: 'BR',
    region: lidomaRegionalWars.scope || 'South Asia',
    tier: 'D',
    startDate: lrwDates.start,
    endDate: lrwDates.end,
    prizePoolUSD: 1000,
    teamsCount: lidomaRegionalWars.totalTeams || 18,
    standings: [
      ...(lidomaRWPlayoffsStandings || []).map(r => ({ ...r, stage: 'Playoffs' })),
      ...(lidomaRWLastChanceStandings || []).map(r => ({ ...r, stage: 'Last Chance' })),
      ...(lidomaRWGrandFinalsStandings || []).map(r => ({ ...r, stage: 'Grand Finals' })),
    ],
    godlikeJourney: [
      { stage: lidomaRWGodlikeJourney?.playoffs?.stage || 'Playoffs', position: lidomaRWGodlikeJourney?.playoffs?.result || '12th', points: lidomaRWGodlikeJourney?.playoffs?.points || 219, outcome: 'advanced', notes: lidomaRWGodlikeJourney?.playoffs?.note || '' },
      { stage: lidomaRWGodlikeJourney?.lastChance?.stage || 'Last Chance', position: lidomaRWGodlikeJourney?.lastChance?.result || '10th', points: lidomaRWGodlikeJourney?.lastChance?.points || 51, outcome: 'eliminated', notes: lidomaRWGodlikeJourney?.lastChance?.note || '' },
    ],
    godlikeFinalPosition: 'Eliminated in Last Chance',
    godlikePrizeUSD: 0,
  }));

  // 10. OneBlade Inferno League
  const obDates = parseDateRange(oneBladeInferno.dates);
  tournaments.push(buildSeedTournament('seed_oneblade', {
    name: oneBladeInferno.name,
    organizer: oneBladeInferno.organizer || 'OneBlade',
    gameMode: 'BR',
    region: 'India',
    tier: 'D',
    startDate: obDates.start,
    endDate: obDates.end,
    prizePoolINR: 100000,
    teamsCount: oneBladeInferno.totalTeams || 24,
    standings: [
      ...(oneBladePlayInsGroupB || []).map(r => ({ ...r, stage: 'Play-Ins Group B' })),
      ...(oneBladeGrandFinalsStandings || []).map(r => ({ ...r, stage: 'Grand Finals' })),
    ],
    godlikeJourney: [
      { stage: oneBladeGodlikeJourney?.leagueStage?.stage || 'League Stage', position: oneBladeGodlikeJourney?.leagueStage?.result || 'Dropped', points: null, outcome: 'eliminated', notes: oneBladeGodlikeJourney?.leagueStage?.note || '' },
      { stage: 'Play-Ins Group B', position: oneBladeGodlikeJourney?.playIns?.result || '5th', points: oneBladeGodlikeJourney?.playIns?.points || 84, outcome: 'eliminated', notes: oneBladeGodlikeJourney?.playIns?.note || '' },
    ],
    godlikeFinalPosition: 'Eliminated in Play-Ins (5th)',
    godlikePrizeINR: 0,
  }));

  // 11. Urbansky Gaming Series
  const urbDates = parseDateRange(urbanskySeries.dates);
  tournaments.push(buildSeedTournament('seed_urbansky', {
    name: urbanskySeries.name,
    organizer: urbanskySeries.organizer || 'Urbansky Esports',
    gameMode: 'BR',
    region: 'India',
    tier: 'D',
    startDate: urbDates.start,
    endDate: urbDates.end,
    prizePoolINR: 50000,
    teamsCount: urbanskySeries.totalTeams || 12,
    standings: urbanskyGrandFinalsStandings?.map(r => ({
      rank: r.rank, team: r.team, points: r.points, booyahs: r.booyahs, kills: r.kills, placementPts: r.placementPts, prize: r.prize, isGodlike: r.isGodlike,
    })) || [],
    godlikeJourney: [
      { stage: urbanskyGodlikeJourney?.semiFinals?.stage || 'Semi Finals', position: urbanskyGodlikeJourney?.semiFinals?.result || 'Qualified', points: null, outcome: 'advanced', notes: urbanskyGodlikeJourney?.semiFinals?.note || '' },
      { stage: 'Grand Finals', position: urbanskyGodlikeJourney?.grandFinals?.result || '8th', points: urbanskyGodlikeJourney?.grandFinals?.points || 64, outcome: 'eliminated', notes: urbanskyGodlikeJourney?.grandFinals?.note || '' },
    ],
    godlikeFinalPosition: '8th',
    godlikePrizeINR: 0,
  }));

  // 12. RBZ Regional Cup BR
  const rbzBRDates = parseDateRange(rbzRegionalBR.dates);
  tournaments.push(buildSeedTournament('seed_rbzbr', {
    name: rbzRegionalBR.name,
    organizer: rbzRegionalBR.organizer || 'Rulebreakerz',
    gameMode: 'BR',
    region: 'India',
    tier: 'Community',
    startDate: rbzBRDates.start,
    endDate: rbzBRDates.end,
    teamsCount: rbzRegionalBR.totalTeams || 12,
    standings: rbzBRGrandFinalsStandings?.map(r => ({
      rank: r.rank, team: r.team, points: r.points, booyahs: r.booyahs, kills: r.kills, placementPts: r.placementPts, prize: r.prize, isGodlike: r.isGodlike,
    })) || [],
    godlikeJourney: [
      { stage: 'Semi Finals', position: rbzBRGodlikeJourney?.semiFinals?.result || 'Qualified', points: null, outcome: 'advanced', notes: rbzBRGodlikeJourney?.semiFinals?.note || '' },
      { stage: 'Point Rush', position: rbzBRGodlikeJourney?.pointRush?.result || 'Qualified', points: null, outcome: 'advanced', notes: rbzBRGodlikeJourney?.pointRush?.note || '' },
      { stage: 'Grand Finals', position: rbzBRGodlikeJourney?.grandFinals?.result || '2nd', points: rbzBRGodlikeJourney?.grandFinals?.points || 132, outcome: 'runner_up', notes: rbzBRGodlikeJourney?.grandFinals?.note || '' },
    ],
    godlikeFinalPosition: '2nd (Runner-Up)',
    godlikePrizeINR: 0,
  }));

  // 13. RBZ Regional Cup CS
  const rbzCSDates = parseDateRange(rbzRegionalCS.dates);
  tournaments.push(buildSeedTournament('seed_rbzcs', {
    name: rbzRegionalCS.name,
    organizer: rbzRegionalCS.organizer || 'Rulebreakerz',
    gameMode: 'CS',
    region: 'India',
    tier: 'Community',
    startDate: rbzCSDates.start,
    endDate: rbzCSDates.end,
    teamsCount: rbzRegionalCS.totalTeams || 8,
    standings: [],
    godlikeJourney: [
      { stage: 'Round 1 (Bo3)', position: rbzCSGodlikeJourney?.round1?.result || 'Win (2-0)', points: null, outcome: 'advanced', notes: `vs ${rbzCSGodlikeJourney?.round1?.opponent || 'NG Pros'}` },
      { stage: 'Semi Finals (Bo3)', position: rbzCSGodlikeJourney?.semiFinals?.result || 'Win (2-0)', points: null, outcome: 'advanced', notes: `vs ${rbzCSGodlikeJourney?.semiFinals?.opponent || 'NKG Esports'}` },
      { stage: 'Grand Finals (Bo5)', position: rbzCSGodlikeJourney?.grandFinals?.result || 'Win (3-0)', points: null, outcome: 'champions', notes: `vs ${rbzCSGodlikeJourney?.grandFinals?.opponent || 'Gyan Gaming'} — CHAMPIONS` },
    ],
    godlikeFinalPosition: 'CHAMPIONS',
    godlikePrizeINR: 0,
    csMatches: [
      {
        round: 'Round 1',
        format: 'Bo3',
        opponent: rbzCSGodlikeJourney?.round1?.opponent || 'NG Pros',
        games: rbzCSGodlikeJourney?.round1?.games || [],
        result: rbzCSGodlikeJourney?.round1?.result || 'Win (2-0)',
      },
      {
        round: 'Semi Finals',
        format: 'Bo3',
        opponent: rbzCSGodlikeJourney?.semiFinals?.opponent || 'NKG Esports',
        games: rbzCSGodlikeJourney?.semiFinals?.games || [],
        result: rbzCSGodlikeJourney?.semiFinals?.result || 'Win (2-0)',
      },
      {
        round: 'Grand Finals',
        format: 'Bo5',
        opponent: rbzCSGodlikeJourney?.grandFinals?.opponent || 'Gyan Gaming',
        games: rbzCSGodlikeJourney?.grandFinals?.games || [],
        result: rbzCSGodlikeJourney?.grandFinals?.result || 'Win (3-0) — CHAMPIONS',
      },
    ],
  }));

  return tournaments;
}

// ─── Init Function (called from App.js) ───
export function initTournamentStore() {
  // Guard: don't re-seed if index already exists
  if (localStorage.getItem(TOURNAMENT_KEYS.INDEX)) return;

  const tournaments = seedAllTournaments();
  const index = [];

  for (const t of tournaments) {
    setJSON(TOURNAMENT_KEYS.PREFIX + t.id, t);
    index.push({ id: t.id, status: t.status });
  }

  setJSON(TOURNAMENT_KEYS.INDEX, index);
}
