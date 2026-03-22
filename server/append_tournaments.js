const fs = require('fs');
const filepath = 'c:/Users/saika/godlike-ffm/src/data/tournaments.js';
let content = fs.readFileSync(filepath, 'utf8');

const additionalData = `
// ═══════════════════════════════════════════
// PRG SURVIVOR SERIES
// ═══════════════════════════════════════════

export const prgSurvivorSeries = {
  name: "PRG Survivor Series",
  shortName: "PRG Survivor",
  organizer: "Play Rivals Gaming & FFM India Community",
  game: "Free Fire MAX",
  tier: "D-Tier",
  dates: "28/01/2026 — 17/02/2026",
  location: "Online (India)",
  totalTeams: 24,
  prizePool: "₹1,50,000 (≈ $1,751 USD)",
  format: "Qualifiers → Quarter Finals → Semi Finals (2 groups of 12) → Grand Finals (12 teams)",
  status: "COMPLETED",
  champion: "TBD",
  runnerUp: "TBD",
  thirdPlace: "TBD",
  scope: "National (India)",
};

export const prgFormat = {
  semiFinals: {
    name: "Semi Finals",
    dates: "10/02/2026 — 11/02/2026",
    totalTeams: 24,
    description: "24 teams divided into two groups of 12. Top 6 from each group qualify for Grand Finals.",
    groups: {
      group1: ["GodLike Esports", "Jonty Gaming", "NG Pros", "True Impact", "Total Gaming eSports", "Autobotz Esports"],
      group2: ["K9 Esports", "Team Hind", "Head Hunters", "Emz Esports", "Team Tycoons", "RNX Esports"]
    }
  },
  grandFinals: {
    name: "Grand Finals",
    dates: "12/02/2026 — 17/02/2026",
    totalTeams: 12,
    description: "Top 12 teams from Semi Finals. 18 matches across 3 days."
  }
};

export const prgGodlikeJourney = {
  semiFinals: {
    stage: "Semi Finals (Group 1)",
    result: "1st in Group 1",
    qualified: true,
    points: 139,
    kills: 91,
    booyahs: 2,
    note: "Dominated Group 1 to easily secure a Grand Finals spot."
  },
  grandFinals: {
    stage: "Grand Finals",
    result: "Pending / Details Unavailable",
    qualified: true,
    note: "Advanced to Finals. Final standings missing from Liquipedia."
  },
  overallResult: "Qualified for Grand Finals (Group 1 Winner)",
  prizeMoney: "TBD",
  highlights: [
    "Topped Semi Finals Group 1 with 139 points.",
    "Secured 91 kills and 2 Booyahs in 6 group stage matches.",
    "Outperformed Total Gaming eSports and NG Pros in the group.",
    "Easily qualified for the Grand Finals."
  ]
};

export const prgGroup1Standings = [
  { rank: 1, team: "GodLike Esports", points: 139, booyahs: 2, placement: 48, kills: 91, qualified: true, isGodlike: true },
  { rank: 2, team: "Jonty Gaming", points: 130, booyahs: 1, placement: 39, kills: 91, qualified: true, isGodlike: false },
  { rank: 3, team: "NG Pros", points: 126, booyahs: 1, placement: 43, kills: 83, qualified: true, isGodlike: false },
  { rank: 4, team: "True Impact", points: 121, booyahs: 2, placement: 42, kills: 79, qualified: true, isGodlike: false },
  { rank: 5, team: "Total Gaming eSports", points: 109, booyahs: 0, placement: 20, kills: 89, qualified: true, isGodlike: false },
  { rank: 6, team: "Autobotz Esports", points: 87, booyahs: 0, placement: 28, kills: 59, qualified: true, isGodlike: false },
];

export const prgGodlikeAnalysis = {
  overallRating: "Strong (Semi Finals)",
  avgPointsPerGame: 23.1, // 139 / 6
  verdict: "GodLike had a spectacular Semi Finals performance, averaging over 23 points and 15 kills per game. Their 91 kills across 6 matches showed peak aggression, winning them the group over formidable teams like Total Gaming."
};


// ═══════════════════════════════════════════
// RAPID DIGNITY CUP SEASON 1
// ═══════════════════════════════════════════

export const rapidDignityCup = {
  name: "Rapid Dignity Cup Season 1",
  shortName: "Rapid Dignity",
  organizer: "Rapid Chaos Esports",
  game: "Free Fire MAX",
  tier: "D-Tier",
  dates: "18/11/2025 — 20/11/2025",
  location: "Online (India)",
  totalTeams: 21,
  prizePool: "₹1,00,000 (≈ $1,185 USD)",
  format: "Semi Finals → Wildcard → Grand Finals (12 teams)",
  status: "COMPLETED",
  champion: "K9 Esports",
  runnerUp: "NG Pros",
  thirdPlace: "Total Gaming eSports",
  scope: "National (India)",
};

export const rapidGFStandings = [
  { rank: 1, team: "K9 Esports", points: 265, day1: 125, day2: 140, prize: "₹40,000", isGodlike: false, note: "Champion" },
  { rank: 2, team: "NG Pros", points: 215, day1: 112, day2: 103, prize: "₹25,000", isGodlike: false, note: "Runner-Up" },
  { rank: 3, team: "Total Gaming eSports", points: 197, day1: 94, day2: 103, prize: "₹15,000", isGodlike: false, note: "2nd Runner-Up" },
  { rank: 4, team: "Reckoning Esports", points: 189, day1: 98, day2: 91, prize: "₹10,000", isGodlike: false },
  { rank: 5, team: "GodLike Esports", points: 188, day1: 97, day2: 91, prize: "—", isGodlike: true, note: "Missed 4th place by 1 point" },
  { rank: 6, team: "Team Forever", points: 159, day1: 84, day2: 75, prize: "—", isGodlike: false },
  { rank: 7, team: "Meta Ninza", points: 126, day1: 68, day2: 58, prize: "—", isGodlike: false },
  { rank: 8, team: "Olympians", points: 115, day1: 56, day2: 59, prize: "—", isGodlike: false },
  { rank: 9, team: "Emz Esports", points: 114, day1: 69, day2: 45, prize: "—", isGodlike: false },
  { rank: 10, team: "Ultra Instinct", points: 104, day1: 50, day2: 54, prize: "—", isGodlike: false },
  { rank: 11, team: "LXP Elite", points: 95, day1: 30, day2: 65, prize: "—", isGodlike: false },
  { rank: 12, team: "S8UL Elite", points: 50, day1: 41, day2: 9, prize: "—", isGodlike: false },
];

export const rapidGodlikeJourney = {
  semiFinals: {
    stage: "Semi Finals",
    result: "Qualified directly to Grand Finals",
    qualified: true,
    note: "Finished in Top 4 of Semi Finals, bypassing the Wildcard stage."
  },
  grandFinals: {
    stage: "Grand Finals",
    result: "5th Place",
    qualified: false,
    points: 188,
    day1: 97,
    day2: 91,
    note: "Consistent performance over 2 days, narrowly missing 4th."
  },
  overallResult: "5th Place in Grand Finals",
  prizeMoney: "—",
  highlights: [
    "Bypassed Wildcard by placing Top 4 in Semi Finals.",
    "Scores exactly 97 pts on Day 1 and 91 pts on Day 2.",
    "Finished 5th overall with 188 points.",
    "Lost 4th place to Reckoning Esports by a single point (189 to 188)."
  ]
};

export const rapidGodlikeAnalysis = {
  overallRating: "Good",
  avgPointsPerGame: 15.6, // 188 / 12 matches
  verdict: "GodLike played solidly in the Rapid Dignity Cup placing 5th. Their consistency (97 pts, 91 pts) was excellent, but they fell just 1 point shy of prize money, edged out by Reckoning Esports."
};
`;

if (!content.includes('PRG SURVIVOR SERIES')) {
  fs.writeFileSync(filepath, content + additionalData);
  console.log('Appended additional data successfully.');
} else {
  console.log('Data already appended.');
}
