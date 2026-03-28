import React, { useState } from 'react';
import { useTournamentsByStatus } from '../hooks/useSupabaseTournaments';
import { computeSquadPerformance, computeAutoStandings } from '../data/tournamentStore';
import TierBadge from '../components/TierBadge';

/* ═══ Placement Point Table ═══ */
const PP = [0, 12, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1];
const getPP = (p) => (p >= 1 && p <= 12) ? PP[p] : 0;

/* ═══ Live Tournament Card ═══ */
function LiveTournamentCard({ tournament }) {
  const [showMatches, setShowMatches] = useState(true);
  const perf = computeSquadPerformance(tournament);
  const autoRow = computeAutoStandings(tournament);
  const allMatches = (tournament.stages || []).flatMap((s, si) =>
    (s.matches || []).map((m, mi) => ({ ...m, stageName: s.name || `Stage ${si + 1}`, stageIdx: si, matchIdx: mi }))
  );

  return (
    <div className="bg-[#111113] border border-dark-border rounded-2xl overflow-hidden animate-slide-up">
      {/* Live Header */}
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse-live" />
          <span className="text-red-400 font-heading font-bold text-xs uppercase tracking-widest">Live Now</span>
        </div>

        {/* Tournament Info */}
        <div className="flex items-start justify-between flex-wrap gap-3 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-heading font-bold text-2xl text-white">{tournament.name}</h3>
              <TierBadge tier={tournament.tier} />
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                tournament.gameMode === 'CS' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {tournament.gameMode}
              </span>
            </div>
            <p className="text-grey text-xs">{tournament.organizer}{tournament.region ? ` | ${tournament.region}` : ''}</p>
            {(tournament.startDate || tournament.endDate) && (
              <p className="text-grey text-xs mt-0.5">
                {tournament.startDate && new Date(tournament.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                {tournament.endDate && tournament.endDate !== tournament.startDate && ` — ${new Date(tournament.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
              </p>
            )}
            {tournament.playingFour?.length > 0 && (
              <p className="text-grey text-xs mt-0.5">Playing: {tournament.playingFour.join(', ')}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {(tournament.prizePoolINR > 0 || tournament.prizePoolUSD > 0) && (
              <span className="text-grey text-xs">
                {tournament.prizePoolINR > 0 && `₹${tournament.prizePoolINR.toLocaleString('en-IN')}`}
                {tournament.prizePoolINR > 0 && tournament.prizePoolUSD > 0 && ' / '}
                {tournament.prizePoolUSD > 0 && `$${tournament.prizePoolUSD.toLocaleString()}`}
              </span>
            )}
            {tournament.teamsCount > 0 && (
              <span className="text-grey text-xs">{tournament.teamsCount} Teams</span>
            )}
          </div>
        </div>

        {/* Live Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-[#0d0d0f] rounded-lg p-3 border border-red-500/20">
            <p className="text-red-400 text-[10px] font-bold uppercase">Matches Played</p>
            <p className="text-white font-heading font-bold text-2xl">{perf.totalMatches}</p>
          </div>
          <div className="bg-[#0d0d0f] rounded-lg p-3 border border-red-500/20">
            <p className="text-red-400 text-[10px] font-bold uppercase">Total Points</p>
            <p className="text-white font-heading font-bold text-2xl">{perf.totalPoints}</p>
          </div>
          <div className="bg-[#0d0d0f] rounded-lg p-3 border border-red-500/20">
            <p className="text-red-400 text-[10px] font-bold uppercase">Total Kills</p>
            <p className="text-white font-heading font-bold text-2xl">{perf.totalKills}</p>
          </div>
          <div className="bg-[#0d0d0f] rounded-lg p-3 border border-red-500/20">
            <p className="text-red-400 text-[10px] font-bold uppercase">Booyahs</p>
            <p className="text-white font-heading font-bold text-2xl">{perf.totalBooyahs}</p>
          </div>
        </div>

        {/* Squad Performance */}
        {perf.players.length > 0 && perf.players.some(p => p.kills > 0) && (
          <div className="mb-5">
            <h5 className="text-xs text-red-400 font-bold uppercase tracking-wider mb-2">Squad Performance</h5>
            <div className="flex gap-3 flex-wrap">
              {perf.players.map(p => (
                <div key={p.name} className="text-center bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50 min-w-[70px]">
                  <p className="text-white font-heading font-bold text-lg">{p.kills}</p>
                  <p className="text-grey text-[10px] uppercase">{p.name}</p>
                  <p className="text-grey text-[9px]">{p.matchesPlayed} games</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Auto-Standings Summary */}
        {autoRow && (
          <div className="mb-5 bg-[#0d0d0f] rounded-lg p-4 border border-[#c9a84c]/20">
            <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">GodLike Standings</h5>
            <div className="flex items-center gap-6 flex-wrap">
              <div>
                <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Total Pts</p>
                <p className="text-white font-heading font-bold text-xl">{autoRow.points}</p>
              </div>
              <div>
                <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Placement Pts</p>
                <p className="text-white font-heading font-bold text-xl">{autoRow.placementPts}</p>
              </div>
              <div>
                <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Kills</p>
                <p className="text-white font-heading font-bold text-xl">{autoRow.kills}</p>
              </div>
              <div>
                <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Booyahs</p>
                <p className="text-white font-heading font-bold text-xl">{autoRow.booyahs}</p>
              </div>
            </div>
          </div>
        )}

        {/* Standings Table (if other teams' standings exist) */}
        {tournament.standings && tournament.standings.length > 0 && (
          <div className="mb-5">
            <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Standings</h5>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#c9a84c]/20">
                    <th className="text-left py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">#</th>
                    <th className="text-left py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Team</th>
                    <th className="text-center py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Points</th>
                    <th className="text-center py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Kills</th>
                  </tr>
                </thead>
                <tbody>
                  {tournament.standings.map((r, i) => {
                    const isGL = r.isGodlike || (r.team && r.team.toLowerCase().includes('godl'));
                    return (
                      <tr key={i} className={`border-b border-dark-border/50 ${i % 2 === 0 ? 'bg-[#0d0d0f]' : 'bg-[#111113]'}`}
                        style={isGL ? { borderLeft: '3px solid #c9a84c' } : {}}>
                        <td className="py-1.5 px-2 text-grey">{r.rank}</td>
                        <td className={`py-1.5 px-2 font-semibold ${isGL ? 'text-[#c9a84c]' : 'text-white'}`}>{r.team}</td>
                        <td className={`py-1.5 px-2 text-center font-bold ${isGL ? 'text-[#c9a84c]' : 'text-white'}`}>{r.points ?? '-'}</td>
                        <td className="py-1.5 px-2 text-center text-grey">{r.kills ?? '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Match History Toggle */}
        {allMatches.length > 0 && (
          <div>
            <button
              onClick={() => setShowMatches(prev => !prev)}
              className="text-red-400 text-xs font-bold uppercase tracking-wider hover:text-red-300 transition flex items-center gap-1 mb-3"
            >
              {showMatches ? 'Hide' : 'Show'} Match Results ({allMatches.length})
              <svg className={`w-3 h-3 transition-transform ${showMatches ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showMatches && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {allMatches.map((m, i) => {
                  const placementPts = getPP(m.placement);
                  const matchPts = placementPts + (m.kills || 0);
                  const playerKillEntries = Object.entries(m.playerKills || {}).filter(([, v]) => v > 0);
                  return (
                    <div key={i} className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-grey">
                          {m.stageName} — Game {m.matchNum || m.matchNumber || i + 1}
                          {m.map && <span className="text-[10px] text-grey ml-1">| {m.map}</span>}
                        </span>
                        {m.booyah && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c]">BOOYAH!</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-semibold text-sm">#{m.placement || '-'}</span>
                        <span className="text-grey text-xs">+{placementPts} place</span>
                        <span className="text-grey text-xs">{m.kills ?? '-'} kills</span>
                        <span className="text-[#c9a84c] text-xs font-bold ml-auto">{matchPts} pts</span>
                      </div>
                      {playerKillEntries.length > 0 && (
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          {playerKillEntries.map(([p, k]) => (
                            <span key={p} className="text-[10px] text-grey">{p}: {k}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ Main Component ═══ */
export default function LiveScores() {
  const { tournaments: liveTournaments, loading } = useTournamentsByStatus('live');

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ backgroundColor: '#0d0d0f' }}>
        <p className="text-grey text-lg">Loading live scores...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#0d0d0f' }}>
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider mb-8">
          Live <span className="text-red-400">Scores</span>
        </h1>

        {liveTournaments.length === 0 ? (
          <div className="rounded-2xl p-8 sm:p-12 bg-[#111113] border border-dark-border text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1a1a1c] flex items-center justify-center">
              <svg className="w-8 h-8 text-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-grey text-lg font-heading font-semibold mb-1">No Live Tournaments</p>
            <p className="text-grey/60 text-sm">Check back when a tournament goes live!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {liveTournaments.map((t) => (
              <LiveTournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
