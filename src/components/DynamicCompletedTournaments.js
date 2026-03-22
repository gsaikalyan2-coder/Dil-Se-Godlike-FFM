import React, { useState } from 'react';
import { useTournamentStoreSync } from '../hooks/useTournamentStoreSync';
import TierBadge from './TierBadge';
import PositionBadge from './PositionBadge';

/* ═══ Journey Timeline (mirrors CompletedTournaments.js pattern) ═══ */
function JourneyTimeline({ journey }) {
  if (!journey || journey.length === 0) return null;
  const outcomeColor = (o) => {
    if (o === 'champions') return '#c9a84c';
    if (o === 'advanced' || o === 'runner_up') return '#22c55e';
    if (o === 'eliminated') return '#ef4444';
    return '#9ca3af';
  };
  return (
    <div className="relative pl-6">
      <div className="absolute left-2 top-2 bottom-2 w-px bg-dark-border" />
      {journey.map((j, i) => (
        <div key={i} className="relative mb-4 last:mb-0">
          <div
            className="absolute -left-4 top-1.5 w-3 h-3 rounded-full border-2"
            style={{ borderColor: outcomeColor(j.outcome), backgroundColor: i === journey.length - 1 ? outcomeColor(j.outcome) : 'transparent' }}
          />
          <div className="ml-2">
            <p className="text-white font-heading font-semibold text-sm">{j.stage}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              {j.position && <span className="text-grey text-xs">Position: {j.position}</span>}
              {j.points != null && <span className="text-grey text-xs">| {j.points} pts</span>}
            </div>
            {j.notes && <p className="text-grey text-xs mt-0.5">{j.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══ Standings Table (mirrors CompletedTournaments.js pattern) ═══ */
function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) return null;
  // Detect which columns have data
  const hasBoo = standings.some(r => r.booyahs != null);
  const hasKills = standings.some(r => r.kills != null);
  const hasPlacePts = standings.some(r => r.placementPts != null);
  const hasPrize = standings.some(r => r.prize);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#c9a84c]/20">
            <th className="text-left py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">#</th>
            <th className="text-left py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Team</th>
            {hasBoo && <th className="text-center py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Booyahs</th>}
            {hasKills && <th className="text-center py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Kills</th>}
            {hasPlacePts && <th className="text-center py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Place Pts</th>}
            <th className="text-center py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Points</th>
            {hasPrize && <th className="text-right py-2 px-2 text-[#c9a84c] text-xs font-bold uppercase tracking-wider">Prize</th>}
          </tr>
        </thead>
        <tbody>
          {standings.map((r, i) => {
            const isGL = r.isGodlike || (r.team && r.team.toLowerCase().includes('godl'));
            return (
              <tr
                key={i}
                className={`border-b border-dark-border/50 ${i % 2 === 0 ? 'bg-[#0d0d0f]' : 'bg-[#111113]'}`}
                style={isGL ? { borderLeft: '3px solid #c9a84c' } : {}}
              >
                <td className="py-1.5 px-2 text-grey">{r.rank}</td>
                <td className={`py-1.5 px-2 font-semibold ${isGL ? 'text-[#c9a84c]' : 'text-white'}`}>{r.team}</td>
                {hasBoo && <td className="py-1.5 px-2 text-center text-grey">{r.booyahs ?? '-'}</td>}
                {hasKills && <td className="py-1.5 px-2 text-center text-grey">{r.kills ?? '-'}</td>}
                {hasPlacePts && <td className="py-1.5 px-2 text-center text-grey">{r.placementPts ?? '-'}</td>}
                <td className={`py-1.5 px-2 text-center font-bold ${isGL ? 'text-[#c9a84c]' : 'text-white'}`}>{r.points ?? '-'}</td>
                {hasPrize && <td className="py-1.5 px-2 text-right text-grey text-xs">{r.prize || '-'}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ═══ Match Performance (BR + CS) ═══ */
function MatchPerformance({ stages, csMatches }) {
  const brMatches = stages?.flatMap(s => (s.matches || []).map(m => ({ ...m, stageName: s.name }))) || [];
  const hasPlayerKills = brMatches.some(m => m.playerKills);

  return (
    <div className="space-y-4">
      {/* BR Matches */}
      {brMatches.length > 0 && (
        <div>
          <h5 className="text-white font-heading font-semibold text-sm mb-2">BR Match Results</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {brMatches.map((m, i) => (
              <div key={i} className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-grey">{m.stageName} — Game {m.matchNumber || i + 1}</span>
                  {m.booyah && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c]">BOOYAH!</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-sm">#{m.placement || '-'}</span>
                  <span className="text-grey text-xs">{m.kills ?? '-'} kills</span>
                </div>
                {m.playerKills && (
                  <div className="flex gap-2 mt-1.5 flex-wrap">
                    {Object.entries(m.playerKills).map(([p, k]) => (
                      <span key={p} className="text-[10px] text-grey">{p}: {k}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Aggregate Player Stats */}
          {hasPlayerKills && (
            <div className="mt-3 bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
              <h6 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Player Kill Totals</h6>
              <div className="flex gap-4 flex-wrap">
                {['YOGI', 'MARCO', 'NOBITA', 'ECOECO', 'NANCY'].map(p => {
                  const total = brMatches.reduce((sum, m) => sum + (m.playerKills?.[p] || 0), 0);
                  return total > 0 ? (
                    <div key={p} className="text-center">
                      <p className="text-white font-heading font-bold text-lg">{total}</p>
                      <p className="text-grey text-[10px] uppercase">{p}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CS Matches */}
      {csMatches && csMatches.length > 0 && (
        <div>
          <h5 className="text-white font-heading font-semibold text-sm mb-2">CS Match Results</h5>
          <div className="space-y-3">
            {csMatches.map((series, i) => (
              <div key={i} className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-semibold text-sm">{series.round} ({series.format})</span>
                  <span className="text-xs text-grey">vs {series.opponent}</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#c9a84c] font-heading font-bold text-sm">{series.result}</span>
                </div>
                {series.games && series.games.length > 0 && (
                  <div className="flex gap-2 mt-1">
                    {series.games.map((g, gi) => (
                      <div key={gi} className="bg-[#141416] rounded px-2 py-1 text-xs">
                        <span className="text-grey">G{gi + 1}: </span>
                        <span className={g.godlike > g.opponent ? 'text-[#22c55e]' : 'text-[#ef4444]'}>
                          {g.godlike}-{g.opponent}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ Main Component ═══ */
export default function DynamicCompletedTournaments() {
  const { tournaments } = useTournamentStoreSync('completed');
  const [expanded, setExpanded] = useState({});

  // Filter out seed_ tournaments (already shown by hardcoded CompletedTournaments)
  const dynamicTournaments = tournaments.filter(t => !t.id.startsWith('seed_'));

  if (dynamicTournaments.length === 0) return null;

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="mt-12">
      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
        <h3 className="font-heading font-bold text-xl text-white uppercase tracking-wider">
          More <span style={{ color: '#c9a84c' }}>Tournaments</span>
        </h3>
        <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
      </div>

      <div className="space-y-6">
        {dynamicTournaments.map((t, i) => (
          <div
            key={t.id}
            className="bg-[#111113] border border-dark-border rounded-2xl overflow-hidden animate-slide-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            {/* Header */}
            <div className="p-5 sm:p-6">
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h4 className="font-heading font-bold text-xl text-white">{t.name}</h4>
                    <TierBadge tier={t.tier} />
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      t.gameMode === 'CS' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {t.gameMode}
                    </span>
                  </div>
                  <p className="text-grey text-xs">{t.organizer} | {t.region}</p>
                  {(t.startDate || t.endDate) && (
                    <p className="text-grey text-xs mt-0.5">
                      {t.startDate && new Date(t.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {t.endDate && t.endDate !== t.startDate && ` — ${new Date(t.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  {t.godlikeFinalPosition && <PositionBadge position={t.godlikeFinalPosition} />}
                  {(t.prizePoolINR > 0 || t.prizePoolUSD > 0) && (
                    <span className="text-grey text-xs">
                      {t.prizePoolINR > 0 && `₹${t.prizePoolINR.toLocaleString('en-IN')}`}
                      {t.prizePoolINR > 0 && t.prizePoolUSD > 0 && ' / '}
                      {t.prizePoolUSD > 0 && `$${t.prizePoolUSD.toLocaleString()}`}
                    </span>
                  )}
                </div>
              </div>

              {/* Journey Timeline (always visible) */}
              {t.godlikeJourney && t.godlikeJourney.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">GodLike's Journey</h5>
                  <JourneyTimeline journey={t.godlikeJourney} />
                </div>
              )}

              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggle(t.id)}
                className="text-[#c9a84c] text-xs font-bold uppercase tracking-wider hover:text-[#e0c872] transition flex items-center gap-1"
              >
                {expanded[t.id] ? 'Hide Details' : 'View Full Details'}
                <svg className={`w-3 h-3 transition-transform ${expanded[t.id] ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Expanded Content */}
            {expanded[t.id] && (
              <div className="border-t border-dark-border px-5 sm:px-6 py-5 space-y-6">
                {/* Standings */}
                {t.standings && t.standings.length > 0 && (
                  <div>
                    <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Standings</h5>
                    <StandingsTable standings={t.standings} />
                  </div>
                )}

                {/* Match Performance */}
                {((t.stages && t.stages.some(s => s.matches?.length > 0)) || (t.csMatches && t.csMatches.length > 0)) && (
                  <div>
                    <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Match-by-Match Performance</h5>
                    <MatchPerformance stages={t.stages} csMatches={t.csMatches} />
                  </div>
                )}

                {/* VOD Links */}
                {t.vodLinks && t.vodLinks.length > 0 && (
                  <div>
                    <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">VOD Links</h5>
                    <div className="flex gap-2 flex-wrap">
                      {t.vodLinks.map((vod, vi) => (
                        <a
                          key={vi}
                          href={vod.url || vod}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-[#0d0d0f] border border-dark-border rounded-lg px-3 py-2 text-grey hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition no-underline"
                        >
                          {vod.label || `VOD ${vi + 1}`}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
