const fs = require('fs');

function injectReact() {
  const file = 'c:/Users/saika/godlike-ffm/src/components/CompletedTournaments.js';
  let content = fs.readFileSync(file, 'utf8');

  // 1. Update imports
  if (!content.includes('prgSurvivorSeries')) {
    content = content.replace(
      'ngACGrandFinalsStandings, ngACGodlikeAnalysis, ngACBroadcast',
      'ngACGrandFinalsStandings, ngACGodlikeAnalysis, ngACBroadcast,\n  prgSurvivorSeries, prgFormat, prgGodlikeJourney, prgGroup1Standings, prgGodlikeAnalysis,\n  rapidDignityCup, rapidGFStandings, rapidGodlikeJourney, rapidGodlikeAnalysis'
    );
  }

  // 2. Add Component Definitions just before export default function
  const sectionCode = `
/* ═══════════════════════════════════════════
   PRG SURVIVOR SERIES SECTION
   ═══════════════════════════════════════════ */
function PrgSurvivorSection() {
  return (
    <div className="mb-12">
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{prgSurvivorSeries.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{prgSurvivorSeries.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{prgSurvivorSeries.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{prgSurvivorSeries.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{prgSurvivorSeries.dates} • {prgSurvivorSeries.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {prgSurvivorSeries.organizer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{prgSurvivorSeries.prizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{prgSurvivorSeries.totalTeams} teams • {prgSurvivorSeries.scope}</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's PRG Journey</h4>
        <JourneyTimeline stages={[
          { stage: prgGodlikeJourney.semiFinals.stage, points: prgGodlikeJourney.semiFinals.points, booyahs: prgGodlikeJourney.semiFinals.booyahs, kills: prgGodlikeJourney.semiFinals.kills, qualified: true, result: prgGodlikeJourney.semiFinals.result + " — " + prgGodlikeJourney.semiFinals.note },
          { stage: 'Grand Finals', result: prgGodlikeJourney.grandFinals.note }
        ]} />
      </div>

      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Semi Finals (Group 1) Standings</h4>
        <StandingsTable data={prgGroup1Standings} />
      </div>

      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#4ade80' }}>{prgGodlikeAnalysis.overallRating}</span></p>
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Avg Points / Game:</strong> <span style={{ color: '#4ade80' }}>{prgGodlikeAnalysis.avgPointsPerGame}</span></p>
          <p className="text-xs mt-2 italic" style={{ color: '#888' }}>{prgGodlikeAnalysis.verdict}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RAPID DIGNITY CUP SECTION
   ═══════════════════════════════════════════ */
function RapidDignitySection() {
  return (
    <div className="mb-12">
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{rapidDignityCup.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{rapidDignityCup.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{rapidDignityCup.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{rapidDignityCup.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{rapidDignityCup.dates} • {rapidDignityCup.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {rapidDignityCup.organizer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{rapidDignityCup.prizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{rapidDignityCup.totalTeams} teams • {rapidDignityCup.scope}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={rapidDignityCup.champion} sub="265 pts" />
        <StatCard label="Runner-Up" value={rapidDignityCup.runnerUp} sub="215 pts" />
        <StatCard label="3rd Place" value={rapidDignityCup.thirdPlace} sub="197 pts" />
        <StatCard label="GodLike Result" value="5th Place" sub="188 pts" />
      </div>

      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's RDC Journey</h4>
        <JourneyTimeline stages={[
          { stage: rapidGodlikeJourney.semiFinals.stage, qualified: true, result: rapidGodlikeJourney.semiFinals.result + " — " + rapidGodlikeJourney.semiFinals.note },
          { stage: 'Grand Finals', points: rapidGodlikeJourney.grandFinals.points, position: 5, qualified: false, result: rapidGodlikeJourney.grandFinals.result + " — " + rapidGodlikeJourney.grandFinals.note }
        ]} />
      </div>

      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals Standings</h4>
        <StandingsTable data={rapidGFStandings} />
      </div>

      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#4ade80' }}>{rapidGodlikeAnalysis.overallRating}</span></p>
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Avg Points / Game:</strong> <span style={{ color: '#4ade80' }}>{rapidGodlikeAnalysis.avgPointsPerGame}</span></p>
          <p className="text-xs mt-2 italic" style={{ color: '#888' }}>{rapidGodlikeAnalysis.verdict}</p>
        </div>
      </div>
    </div>
  );
}

`;
  if (!content.includes('PrgSurvivorSection()')) {
    content = content.replace('export default function CompletedTournaments() {', sectionCode + 'export default function CompletedTournaments() {');
  }

  // 3. Add to tabs
  if (!content.includes("{ key: 'prg', label: 'PRG Survivor' }")) {
    content = content.replace(
      "{ key: 'ngac', label: 'NG AC' }",
      "{ key: 'ngac', label: 'NG AC' },\\n          { key: 'prg', label: 'PRG Survivor' },\\n          { key: 'rdc', label: 'Rapid Dignity' }"
    );
  }

  // 4. Add rendering logic
  if (!content.includes("activeTab === 'prg'")) {
    content = content.replace(
      "{activeTab === 'ngac' && <NgAsiaChampSection />}",
      "{activeTab === 'ngac' && <NgAsiaChampSection />}\\n\\n        {activeTab === 'prg' && <PrgSurvivorSection />}\\n\\n        {activeTab === 'rdc' && <RapidDignitySection />}"
    );
  }

  fs.writeFileSync(file, content, 'utf8');

  // Now modify tournaments.js godlikeOverallStats
  let tourFile = 'c:/Users/saika/godlike-ffm/src/data/tournaments.js';
  let tourContent = fs.readFileSync(tourFile, 'utf8');
  if (tourContent.includes('totalTournaments: 6,')) {
    tourContent = tourContent.replace('totalTournaments: 6,', 'totalTournaments: 8,');
    tourContent = tourContent.replace('totalMatchesPlayed: "230+",', 'totalMatchesPlayed: "250+",');
    tourContent = tourContent.replace(
      '"11th in NG Asia Championship Grand Finals (153 pts — struggled vs SEA teams)"',
      '"11th in NG Asia Championship Grand Finals (153 pts — struggled vs SEA teams)",\n    "1st in PRG Survivor Series Group 1 (139 pts, 91 kills)",\n    "5th in Rapid Dignity Cup Grand Finals (188 pts)"'
    );
  }
  fs.writeFileSync(tourFile, tourContent, 'utf8');

  console.log('Injection successful!');
}

injectReact();
