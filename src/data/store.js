const KEYS = {
  MATCHES: 'glffm_matches',
  PLAYERS: 'glffm_players',
  SETTINGS: 'glffm_settings',
};

const DEFAULT_MATCHES = [
  {
    id: 1,
    opponent: 'Total Gaming',
    tournament: 'FFPL Season 5',
    date: '2026-03-17',
    time: '18:00',
    game: 'Free Fire',
    status: 'LIVE',
    godlike_score: 23,
    opponent_score: 19,
    kills: 11,
    rank: 2,
  },
  {
    id: 2,
    opponent: 'TSG Army',
    tournament: 'FFPL Season 5',
    date: '2026-03-20',
    time: '19:00',
    game: 'Free Fire',
    status: 'UPCOMING',
    godlike_score: 0,
    opponent_score: 0,
    kills: 0,
    rank: 0,
  },
  {
    id: 3,
    opponent: 'Aura Esports',
    tournament: 'FF India Championship',
    date: '2026-03-15',
    time: '17:00',
    game: 'Free Fire',
    status: 'FINISHED',
    godlike_score: 45,
    opponent_score: 32,
    kills: 18,
    rank: 1,
  },
  {
    id: 4,
    opponent: 'Desi Gamers',
    tournament: 'FFPL Season 5',
    date: '2026-03-12',
    time: '18:00',
    game: 'Free Fire',
    status: 'FINISHED',
    godlike_score: 28,
    opponent_score: 35,
    kills: 9,
    rank: 4,
  },
];

const DEFAULT_PLAYERS = [
  { id: 1, name: 'Player One', game_name: 'GodL.Yogi', role: 'IGL/Sniper', bio: 'Team captain and in-game leader', photo_url: '/players/yogi.png', is_active: true, total_kills: 265, matches_played: 120, best_rank: 1, win_rate: 42, avg_kills: 0, tournaments_played: 15, instagram: '', youtube: '', twitter: '' },
  { id: 2, name: 'Player Two', game_name: 'GodL.EcoEco', role: 'Sec Rusher/Nader', bio: 'Long range specialist', photo_url: '/players/ecoeco.png', is_active: true, total_kills: 278, matches_played: 119, best_rank: 1, win_rate: 38, avg_kills: 0, tournaments_played: 12, instagram: '', youtube: '', twitter: '' },
  { id: 3, name: 'Player Three', game_name: 'GodL.Nancy', role: 'Primary Rusher', bio: 'Aggressive entry player', photo_url: '/players/nancy.png', is_active: true, total_kills: 310, matches_played: 125, best_rank: 2, win_rate: 35, avg_kills: 0, tournaments_played: 14, instagram: '', youtube: '', twitter: '' },
  { id: 4, name: 'Player Four', game_name: 'GodL.Marco', role: 'Rusher/Sniper', bio: 'Team support and rotations', photo_url: '/players/marco.png', is_active: true, total_kills: 198, matches_played: 110, best_rank: 3, win_rate: 40, avg_kills: 0, tournaments_played: 11, instagram: '', youtube: '', twitter: '' },
  { id: 5, name: 'Player Five', game_name: 'GodL.Nobita', role: 'Rusher/Support', bio: 'Primary rusher and front liner', photo_url: '/players/nobita.png', is_active: true, total_kills: 245, matches_played: 105, best_rank: 2, win_rate: 36, avg_kills: 0, tournaments_played: 10, instagram: '', youtube: '', twitter: '' },
];

const DEFAULT_SETTINGS = {
  site_title: 'GodLike FFM',
  team_name: 'GodLike FFM',
  admin_password: 'admin123',
  instagram: '',
  youtube: '',
  twitter: '',
};

function getJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return fallback;
}

function setJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initStore() {
  if (!localStorage.getItem(KEYS.MATCHES)) setJSON(KEYS.MATCHES, DEFAULT_MATCHES);
  if (!localStorage.getItem(KEYS.PLAYERS)) setJSON(KEYS.PLAYERS, DEFAULT_PLAYERS);
  if (!localStorage.getItem(KEYS.SETTINGS)) setJSON(KEYS.SETTINGS, DEFAULT_SETTINGS);
}

// Matches
export function getMatches() {
  return getJSON(KEYS.MATCHES, DEFAULT_MATCHES);
}
export function saveMatches(matches) {
  setJSON(KEYS.MATCHES, matches);
}
export function addMatch(match) {
  const matches = getMatches();
  match.id = Date.now();
  matches.push(match);
  saveMatches(matches);
  return match;
}
export function updateMatch(id, data) {
  const matches = getMatches().map(m => (m.id === id ? { ...m, ...data } : m));
  saveMatches(matches);
}
export function deleteMatch(id) {
  saveMatches(getMatches().filter(m => m.id !== id));
}
export function setLiveMatch(id) {
  const matches = getMatches().map(m => {
    if (m.id === id) return { ...m, status: 'LIVE' };
    if (m.status === 'LIVE') return { ...m, status: 'UPCOMING' };
    return m;
  });
  saveMatches(matches);
}
export function getLiveMatch() {
  return getMatches().find(m => m.status === 'LIVE') || null;
}
export function getUpcomingMatches() {
  return getMatches()
    .filter(m => m.status === 'UPCOMING')
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
}
export function getFinishedMatches() {
  return getMatches()
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
}

// Players
export function getPlayers() {
  return getJSON(KEYS.PLAYERS, DEFAULT_PLAYERS);
}
export function savePlayers(players) {
  setJSON(KEYS.PLAYERS, players);
}
export function addPlayer(player) {
  const players = getPlayers();
  player.id = Date.now();
  players.push(player);
  savePlayers(players);
  return player;
}
export function updatePlayer(id, data) {
  savePlayers(getPlayers().map(p => (p.id === id ? { ...p, ...data } : p)));
}
export function deletePlayer(id) {
  savePlayers(getPlayers().filter(p => p.id !== id));
}
export function getActivePlayers() {
  return getPlayers().filter(p => p.is_active);
}
export function getInactivePlayers() {
  return getPlayers().filter(p => !p.is_active);
}
export function getPlayerById(id) {
  return getPlayers().find(p => p.id === Number(id)) || null;
}

// Settings
export function getSettings() {
  return getJSON(KEYS.SETTINGS, DEFAULT_SETTINGS);
}
export function saveSettings(settings) {
  setJSON(KEYS.SETTINGS, settings);
}
