import React, { useState } from 'react';
import { useTournamentStoreSync } from '../hooks/useTournamentStoreSync';
import { computeSquadPerformance } from '../data/tournamentStore';
import TierBadge from './TierBadge';
import PositionBadge from './PositionBadge';

/* ═══ Journey Timeline ═══ */
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

/* ═══ Standings Table ═══ */
function StandingsTable({ standings }) {
  if (!standings || standings.length === 0) return null;
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
function MatchPerformance({ stages, csMatches, roster }) {
  const brMatches = stages?.flatMap(s => (s.matches || []).map(m => ({ ...m, stageName: s.name }))) || [];
  const hasPlayerKills = brMatches.some(m => m.playerKills);

  return (
    <div className="space-y-4">
      {brMatches.length > 0 && (
        <div>
          <h5 className="text-white font-heading font-semibold text-sm mb-2">BR Match Results</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {brMatches.map((m, i) => (
              <div key={i} className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-grey">{m.stageName} — Game {m.matchNumber || i + 1}{m.map ? <span className="text-[10px] text-grey ml-1">| {m.map}</span> : null}</span>
                  {m.booyah && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#c9a84c]/20 text-[#c9a84c]">BOOYAH!</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold text-sm">{m.placement || '0'} Place Pts</span>
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
          {hasPlayerKills && (
            <div className="mt-3 bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
              <h6 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Player Kill Totals</h6>
              <div className="flex gap-4 flex-wrap">
                {(roster && roster.length > 0 ? roster : [...new Set(brMatches.flatMap(m => Object.keys(m.playerKills || {})))]).map(p => {
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

/* ═══ Full-Size Tournament Widget (latest result) ═══ */
function FullTournamentCard({ tournament, expanded, onToggle }) {
  const t = tournament;
  return (
    <div className={`group relative bg-[#13110f]/40 backdrop-blur-2xl border transition-all duration-700 rounded-3xl overflow-hidden animate-slide-up ${expanded ? 'border-[#e6c364]/40 shadow-[0_0_50px_rgba(230,195,100,0.1)]' : 'border-white/5 shadow-2xl hover:border-[#e6c364]/20 hover:bg-[#13110f]/60'}`}>
      {/* Subtle Background Glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#e6c364]/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-[#e6c364]/20 transition-all duration-700"></div>
      
      <div className="relative z-10 p-6 sm:p-8">
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
            {t.playingFour?.length > 0 && (
              <p className="text-grey text-xs mt-0.5">Playing: {t.playingFour.join(', ')}</p>
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

        {t.godlikeJourney && t.godlikeJourney.length > 0 && (
          <div className="mb-4">
            <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">GodLike's Journey</h5>
            <JourneyTimeline journey={t.godlikeJourney} />
          </div>
        )}

        <button
          onClick={() => onToggle(t.id)}
          className="text-[#c9a84c] text-xs font-bold uppercase tracking-wider hover:text-[#e0c872] transition flex items-center gap-1"
        >
          {expanded ? 'Hide Details' : 'View Full Details'}
          <svg className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {expanded && (
        <div className="border-t border-dark-border px-5 sm:px-6 py-5 space-y-6">
          {(() => {
            const perf = computeSquadPerformance(t);
            if (perf.totalMatches === 0) return null;
            return (
              <>
                <div>
                  <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Tournament Overview</h5>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                      <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Total Points</p>
                      <p className="text-white font-heading font-bold text-xl">{perf.totalPoints}</p>
                    </div>
                    <div className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                      <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Matches Played</p>
                      <p className="text-white font-heading font-bold text-xl">{perf.totalMatches}</p>
                    </div>
                    <div className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                      <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Total Kills</p>
                      <p className="text-white font-heading font-bold text-xl">{perf.totalKills}</p>
                    </div>
                    <div className="bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50">
                      <p className="text-[#c9a84c] text-[10px] font-bold uppercase">Booyahs</p>
                      <p className="text-white font-heading font-bold text-xl">{perf.totalBooyahs}</p>
                    </div>
                  </div>
                </div>
                {perf.players.length > 0 && perf.players.some(p => p.kills > 0) && (
                  <div>
                    <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Squad Performance</h5>
                    <div className="flex gap-4 flex-wrap">
                      {perf.players.map(p => (
                        <div key={p.name} className="text-center bg-[#0d0d0f] rounded-lg p-3 border border-dark-border/50 min-w-[70px]">
                          <p className="text-white font-heading font-bold text-lg">{p.kills}</p>
                          <p className="text-grey text-[10px] uppercase">{p.name}</p>
                          <p className="text-grey text-[9px]">{p.matchesPlayed} matches</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}

          {t.standings && t.standings.length > 0 && (
            <div>
              <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Standings</h5>
              <StandingsTable standings={t.standings} />
            </div>
          )}

          {((t.stages && t.stages.some(s => s.matches?.length > 0)) || (t.csMatches && t.csMatches.length > 0)) && (
            <div>
              <h5 className="text-xs text-[#c9a84c] font-bold uppercase tracking-wider mb-2">Match-by-Match Performance</h5>
              <MatchPerformance stages={t.stages} csMatches={t.csMatches} roster={t.playingFour?.length > 0 ? t.playingFour : (t.roster || [])} />
            </div>
          )}

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
  );
}

/* ═══ Compact Tournament Card (golden-tinted, for older results) ═══ */
function CompactTournamentCard({ tournament, onSelect }) {
  const t = tournament;
  const perf = computeSquadPerformance(t);
  const dateStr = t.endDate
    ? new Date(t.endDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase()
    : t.startDate
      ? new Date(t.startDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }).toUpperCase()
      : '';

  return (
    <div
      className="relative rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_10px_40px_rgba(230,195,100,0.1)] cursor-pointer group overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(20, 18, 16, 0.8) 0%, rgba(10, 10, 10, 0.95) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}
      onClick={() => onSelect(t.id)}
    >
      {/* Inner subtle glow ring */}
      <div className="absolute inset-0 border border-[#e6c364]/0 group-hover:border-[#e6c364]/30 rounded-3xl transition-colors duration-500"></div>
      
      {/* Top right floating gradient */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#e6c364]/5 group-hover:bg-[#e6c364]/15 blur-3xl transition-all duration-500"></div>

      <div className="relative z-10">
        <h4 className="font-headline font-black text-lg text-white uppercase tracking-tighter mb-4 leading-tight group-hover:text-[#e6c364] transition-colors">
          {t.name}
        </h4>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {perf.totalMatches > 0 && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md bg-[#1a1a1a] border border-white/5 text-white/40">
              {perf.totalMatches} matches
            </span>
          )}
          {perf.totalPoints > 0 && (
            <span
              className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md backdrop-blur-md"
              style={{ backgroundColor: 'rgba(230,195,100,0.1)', border: '1px solid rgba(230,195,100,0.2)', color: '#e6c364' }}
            >
              {perf.totalPoints} pts
            </span>
          )}
          {t.godlikeFinalPosition && (
            <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md bg-[#1a1a1a] border border-white/5 text-[#e6c364]/80">
              {t.godlikeFinalPosition}
            </span>
          )}
        </div>

        {dateStr && (
          <p className="text-white/30 text-[10px] uppercase tracking-[0.2em] font-label mb-4">{dateStr}</p>
        )}

        <div className="flex items-center justify-end mt-2">
          <span
            className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2.5 transition-all text-[#e6c364]/50 group-hover:text-[#e6c364]"
          >
            Review Data
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* ═══ Main Component ═══ */
export default function DynamicCompletedTournaments() {
  const { tournaments } = useTournamentStoreSync('completed');
  const [expanded, setExpanded] = useState({});
  const [selectedCompact, setSelectedCompact] = useState(null);

  // Filter out seed_ tournaments (already shown by hardcoded CompletedTournaments)
  const dynamicTournaments = tournaments.filter(t => !t.id.startsWith('seed_'));

  if (dynamicTournaments.length === 0) return null;

  // Sort by updatedAt descending — latest first
  const sorted = [...dynamicTournaments].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  // Latest gets the full widget, rest go to compact grid
  const latest = sorted[0];
  const older = sorted.slice(1);

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSelectCompact = (id) => {
    if (selectedCompact === id) {
      setSelectedCompact(null);
    } else {
      setSelectedCompact(id);
    }
  };

  const selectedTournament = selectedCompact ? sorted.find(t => t.id === selectedCompact) : null;

  return (
    <div className="mb-12">
      <h2 className="font-heading font-bold text-3xl sm:text-4xl text-white uppercase tracking-wider mb-8">
        Recent <span style={{ color: '#c9a84c' }}>Results</span>
      </h2>

      {/* Latest tournament — full-size widget */}
      <div className="mb-8">
        <FullTournamentCard
          tournament={latest}
          expanded={expanded[latest.id]}
          onToggle={toggle}
        />
      </div>

      {/* Older tournaments — compact golden grid */}
      {older.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3), transparent)' }} />
            <h3 className="font-heading font-bold text-sm text-grey uppercase tracking-widest flex items-center gap-2">
              Tournament History
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#c9a84c]/10 text-[#c9a84c] border border-[#c9a84c]/20">
                {older.length}
              </span>
            </h3>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {older.map((t, i) => (
              <CompactTournamentCard
                key={t.id}
                tournament={t}
                onSelect={handleSelectCompact}
              />
            ))}
          </div>

          {/* Expanded view for selected compact tournament */}
          {selectedTournament && (
            <div className="mt-6 animate-slide-up">
              <FullTournamentCard
                tournament={selectedTournament}
                expanded={expanded[selectedTournament.id]}
                onToggle={toggle}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
