import { useState, useMemo } from 'react';
import { useTournamentsByStatus, useLiveTournament, useScheduleEntries } from '../hooks/useSupabaseTournaments';
import { computeSquadPerformance, computeAutoStandings } from '../data/tournamentStore';
import TournamentCountdown from '../components/TournamentCountdown';
import TierBadge from '../components/TierBadge';

const TIER_PRIORITY = { S: 0, A: 1, B: 2, C: 3, D: 4, Community: 5 };

/* ═══ Helper: format 24h time to 12h ═══ */
function formatTime12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/* ═══ Placement Points ═══ */
// Placement points are now directly stored in the placement property.
/* ═══ Inline Tournament Detail Panel ═══ */
function TournamentDetailPanel({ tournament }) {
  const [activeStage, setActiveStage] = useState(0);
  if (!tournament) return null;

  const perf = computeSquadPerformance(tournament);
  const autoRow = computeAutoStandings(tournament);
  const stages = tournament.stages || [];
  const hasMatchData = stages.some(s => s.matches && s.matches.length > 0);

  if (!hasMatchData && !autoRow && (!tournament.standings || tournament.standings.length === 0)) {
    return (
      <div className="mt-4 pt-4 border-t border-white/5 text-center py-6">
        <p className="text-white/30 font-label text-xs uppercase tracking-widest">No match data available yet</p>
        <p className="text-white/20 text-[10px] mt-1">Stats will appear once the admin updates this tournament</p>
      </div>
    );
  }

  return (
    <div className="mt-4 pt-4 border-t border-white/5 animate-slide-up">
      {/* Stats Overview */}
      {perf.totalMatches > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-[#0a0a0a] rounded-lg p-2.5 border border-white/5 text-center">
            <p className="text-[#e6c364] text-[9px] font-bold uppercase tracking-wider">Matches</p>
            <p className="text-white font-headline font-bold text-lg">{perf.totalMatches}</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-2.5 border border-white/5 text-center">
            <p className="text-[#e6c364] text-[9px] font-bold uppercase tracking-wider">Total Pts</p>
            <p className="text-white font-headline font-bold text-lg">{perf.totalPoints}</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-2.5 border border-white/5 text-center">
            <p className="text-[#e6c364] text-[9px] font-bold uppercase tracking-wider">Kills</p>
            <p className="text-white font-headline font-bold text-lg">{perf.totalKills}</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-lg p-2.5 border border-white/5 text-center">
            <p className="text-[#e6c364] text-[9px] font-bold uppercase tracking-wider">Booyahs</p>
            <p className="text-white font-headline font-bold text-lg">{perf.totalBooyahs}</p>
          </div>
        </div>
      )}

      {/* Squad Performance */}
      {perf.players.length > 0 && perf.players.some(p => p.kills > 0) && (
        <div className="mb-4">
          <p className="text-[#e6c364] text-[9px] font-bold uppercase tracking-widest mb-2">Squad Performance</p>
          <div className="flex gap-2 flex-wrap">
            {perf.players.map(p => (
              <div key={p.name} className="text-center bg-[#0a0a0a] rounded-lg p-2 border border-white/5 min-w-[56px]">
                <p className="text-white font-headline font-bold text-sm">{p.kills}</p>
                <p className="text-white/40 text-[9px] uppercase">{p.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage Tabs */}
      {stages.length > 0 && (
        <div className="mb-3">
          <div className="flex gap-1.5 flex-wrap mb-3">
            {stages.map((s, si) => (
              <button
                key={si}
                onClick={(e) => { e.stopPropagation(); setActiveStage(si); }}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                  activeStage === si
                    ? 'bg-[#e6c364] text-[#0a0a0a]'
                    : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {s.name || `Stage ${si + 1}`}
                {s.type && <span className="ml-1 opacity-60">({s.type})</span>}
              </button>
            ))}
          </div>

          {/* Active Stage Matches */}
          {stages[activeStage]?.matches?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {stages[activeStage].matches.map((m, mi) => {
                const placementPts = Number(m.placement) || 0;
                const matchPts = placementPts + (m.kills || 0);
                const playerKillEntries = Object.entries(m.playerKills || {}).filter(([, v]) => v > 0);
                return (
                  <div key={mi} className="bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-white/40">
                        Game {m.matchNum || m.matchNumber || mi + 1}
                        {m.map && <span className="ml-1 text-white/25">| {m.map}</span>}
                      </span>
                      {m.booyah && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-[#e6c364]/15 text-[#e6c364]">BOOYAH!</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white font-semibold text-sm">{m.placement || '0'} Place Pts</span>
                      <span className="text-white/30 text-[10px]">{m.kills ?? '0'} kills</span>
                      <span className="text-[#e6c364] text-xs font-bold ml-auto">{matchPts} pts total</span>
                    </div>
                    {playerKillEntries.length > 0 && (
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {playerKillEntries.map(([p, k]) => (
                          <span key={p} className="text-[9px] text-white/30">{p}: {k}</span>
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

      {/* Standings */}
      {tournament.standings && tournament.standings.length > 0 && (
        <div className="mt-3">
          <p className="text-[#e6c364] text-[9px] font-bold uppercase tracking-widest mb-2">Standings</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-[#e6c364]/15">
                  <th className="text-left py-1.5 px-2 text-[#e6c364] text-[9px] font-bold uppercase">#</th>
                  <th className="text-left py-1.5 px-2 text-[#e6c364] text-[9px] font-bold uppercase">Team</th>
                  <th className="text-center py-1.5 px-2 text-[#e6c364] text-[9px] font-bold uppercase">Pts</th>
                  <th className="text-center py-1.5 px-2 text-[#e6c364] text-[9px] font-bold uppercase">Kills</th>
                </tr>
              </thead>
              <tbody>
                {tournament.standings.map((r, i) => {
                  const isGL = r.isGodlike || (r.team && r.team.toLowerCase().includes('godl'));
                  return (
                    <tr key={i} className={`border-b border-white/5 ${i % 2 === 0 ? 'bg-[#0a0a0a]' : ''}`}
                      style={isGL ? { borderLeft: '2px solid #e6c364' } : {}}>
                      <td className="py-1 px-2 text-white/40">{r.rank}</td>
                      <td className={`py-1 px-2 font-semibold ${isGL ? 'text-[#e6c364]' : 'text-white'}`}>{r.team}</td>
                      <td className={`py-1 px-2 text-center font-bold ${isGL ? 'text-[#e6c364]' : 'text-white'}`}>{r.points ?? '-'}</td>
                      <td className="py-1 px-2 text-center text-white/40">{r.kills ?? '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══ Schedule Widget Card (Bento Style) ═══ */
function ScheduleWidget({ widget, isExpanded, onToggle, tournamentMap }) {
  const tournament = widget.tournamentId ? (tournamentMap || {})[widget.tournamentId] : null;
  const tier = tournament?.tier;
  const gameMode = tournament?.gameMode;
  const organizer = tournament?.organizer;

  return (
    <div
      onClick={onToggle}
      className={`group relative bg-[#13110f]/60 backdrop-blur-2xl border transition-all duration-500 rounded-3xl p-6 sm:p-8 cursor-pointer overflow-hidden ${
        isExpanded ? 'border-[#e6c364]/40 shadow-[0_0_40px_rgba(230,195,100,0.1)] bg-[#1a1714]/80' : 'border-white/5 shadow-lg hover:border-[#e6c364]/30 hover:bg-[#1a1714]/90 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(230,195,100,0.08)]'
      }`}
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#e6c364]/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#e6c364]/15 transition-all duration-700" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#e6c364]/0 via-[#e6c364]/0 to-[#e6c364]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
      
      <div className="flex flex-col h-full relative z-10">
        <div className="flex justify-between items-start mb-6">
          {widget.time && (
            <div className="bg-[#e6c364]/10 border border-[#e6c364]/20 text-[#e6c364] px-4 py-1.5 rounded-full font-headline font-black text-[10px] tracking-[0.2em] uppercase shadow-inner">
              {formatTime12(widget.time)}
            </div>
          )}
          <div className="flex gap-2 items-center">
            {tier && <TierBadge tier={tier} />}
            {gameMode && (
              <span className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${
                gameMode === 'CS' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {gameMode}
              </span>
            )}
            <svg className={`w-4 h-4 ml-1 text-white/30 transition-transform duration-500 group-hover:text-[#e6c364] ${isExpanded ? 'rotate-180 text-[#e6c364]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <h3 className="font-headline font-black text-2xl text-white tracking-tighter mb-2 group-hover:text-[#e6c364] transition-colors">{widget.name}</h3>
        {organizer && <p className="text-white/40 font-label text-[10px] uppercase tracking-[0.2em] mb-4">{organizer}</p>}

        {widget.notes && (
          <p className="text-white/50 font-body text-sm leading-relaxed mb-4">{widget.notes}</p>
        )}

        {!isExpanded && (
          <div className="mt-auto pt-5 border-t border-white/5 flex items-center justify-between group-hover:border-[#e6c364]/20 transition-colors">
            <span className="text-[#e6c364]/50 group-hover:text-[#e6c364] font-label text-[10px] tracking-[0.2em] uppercase transition-colors">Tap to review stats</span>
            {tournament?.startDate && (
              <TournamentCountdown targetDate={tournament.startDate} compact />
            )}
          </div>
        )}

        {isExpanded && tournament && <TournamentDetailPanel tournament={tournament} />}
      </div>
    </div>
  );
}

/* ═══ Schedule Tournament Card (Bento Style) ═══ */
function ScheduleTournamentCard({ t, index, expandedId, toggleExpand }) {
  const isOpen = expandedId === t.id;
  return (
    <div
      onClick={() => toggleExpand(t.id)}
      className={`group relative bg-[#13110f]/60 backdrop-blur-2xl border transition-all duration-500 rounded-3xl p-8 cursor-pointer overflow-hidden flex flex-col justify-between ${
        isOpen
          ? 'sm:col-span-2 border-[#e6c364]/40 shadow-[0_0_50px_rgba(230,195,100,0.1)] bg-[#1a1714]/80'
          : `hover:border-[#e6c364]/30 hover:bg-[#1a1714]/90 hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(230,195,100,0.08)] border-white/5 ${t.tier === 'S' ? 'sm:col-span-2 bg-gradient-to-br from-[#1a140a] to-[#0a0a09]' : 'shadow-lg'}`
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Tier Glow */}
      {t.tier === 'S' && <div className="absolute top-0 right-0 w-80 h-80 bg-[#e6c364]/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-[#e6c364]/15 transition-all duration-700"></div>}
      {t.tier !== 'S' && <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#e6c364]/10 transition-all duration-700"></div>}

      <div>
        <div className="flex justify-between items-start mb-6 relative z-10">
          <TierBadge tier={t.tier} />
          <div className="flex items-center gap-2">
            <span className={`font-label text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest ${ t.gameMode === 'CS' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20' }`}>
              {t.gameMode}
            </span>
            <svg className={`w-4 h-4 ml-1 text-white/30 transition-transform duration-500 group-hover:text-[#e6c364] ${isOpen ? 'rotate-180 text-[#e6c364]' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <h3 className={`font-headline font-black uppercase text-white tracking-tighter group-hover:text-[#e6c364] transition-colors mb-2 relative z-10 ${t.tier === 'S' ? 'text-5xl' : 'text-3xl sm:text-4xl'}`}>{t.name}</h3>
        <p className="font-label text-white/40 uppercase tracking-[0.2em] text-[10px] relative z-10">{t.organizer}</p>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap gap-4 justify-between items-end relative z-10 group-hover:border-[#e6c364]/20 transition-colors">
        <div>
          {t.status === 'completed' ? (
            <span className="font-headline font-bold text-[10px] text-[#e6c364]/80 uppercase tracking-widest bg-[#e6c364]/10 px-4 py-2 rounded-full border border-[#e6c364]/30 inline-block shadow-inner backdrop-blur-md">Event Concluded</span>
          ) : t.startDate ? (
            <TournamentCountdown targetDate={t.startDate} compact />
          ) : null}
        </div>
        {(t.prizePoolINR > 0) && (
          <div className="text-right">
            <span className="block font-label text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1">Prize Pool</span>
            <span className="font-headline font-black text-2xl text-[#e6c364]">₹{t.prizePoolINR.toLocaleString('en-IN')}</span>
          </div>
        )}
      </div>

      {/* Expanded Detail */}
      {isOpen && (
        <div className="relative z-10">
          <TournamentDetailPanel tournament={t} />
        </div>
      )}
    </div>
  );
}

export default function Schedule() {
  const liveTournament = useLiveTournament();
  const { tournaments: upcomingTournaments } = useTournamentsByStatus('upcoming');
  const { tournaments: completedTournaments } = useTournamentsByStatus('completed');
  const { entries: scheduleEntries } = useScheduleEntries();

  const [sortBy, setSortBy] = useState('date');
  const [filterMode, setFilterMode] = useState('all');
  const [filterTier, setFilterTier] = useState('all');

  // Build a lookup map for all fetched tournaments
  const tournamentMap = useMemo(() => {
    const map = {};
    [...upcomingTournaments, ...completedTournaments, ...(liveTournament ? [liveTournament] : [])].forEach(t => { map[t.id] = t; });
    return map;
  }, [upcomingTournaments, completedTournaments, liveTournament]);

  // Track which tournament is expanded (by id) — only one at a time
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  // Filter tournaments
  let filtered = upcomingTournaments;
  if (filterMode !== 'all') filtered = filtered.filter(t => t.gameMode === filterMode);
  if (filterTier !== 'all') filtered = filtered.filter(t => t.tier === filterTier);

  // Sort tournaments
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'date') return (a.startDate || '').localeCompare(b.startDate || '');
    if (sortBy === 'prizePool') return ((b.prizePoolINR || 0) + (b.prizePoolUSD || 0) * 85) - ((a.prizePoolINR || 0) + (a.prizePoolUSD || 0) * 85);
    if (sortBy === 'tier') return (TIER_PRIORITY[a.tier] ?? 5) - (TIER_PRIORITY[b.tier] ?? 5);
    return 0;
  });

  // Filter & Sort completed tournaments (excluding seeds for Agenda fallback)
  let completedFiltered = completedTournaments.filter(t => !(typeof t.id === 'string' && t.id.startsWith('seed_')));
  if (filterMode !== 'all') completedFiltered = completedFiltered.filter(t => t.gameMode === filterMode);
  if (filterTier !== 'all') completedFiltered = completedFiltered.filter(t => t.tier === filterTier);
  completedFiltered = [...completedFiltered].sort((a, b) => {
    if (sortBy === 'date') return (b.endDate || '').localeCompare(a.endDate || '');
    if (sortBy === 'prizePool') return ((b.prizePoolINR || 0) + (b.prizePoolUSD || 0) * 85) - ((a.prizePoolINR || 0) + (a.prizePoolUSD || 0) * 85);
    if (sortBy === 'tier') return (TIER_PRIORITY[a.tier] ?? 5) - (TIER_PRIORITY[b.tier] ?? 5);
    return 0;
  });

  // Group schedule entries by date, sorted chronologically
  const sortedSchedule = [...scheduleEntries]
    .filter(e => e.tournaments && e.tournaments.length > 0)
    .sort((a, b) => (a.date || '').localeCompare(b.date || ''));

  // What is the next scheduled tournament?
  let nextScheduledWidget = null; let nextScheduledDate = null;
  const nowStr = new Date().toISOString().slice(0, 10);
  for (const entry of sortedSchedule) {
    if (entry.date >= nowStr) {
      const validWidgets = [...entry.tournaments]
        .sort((a,b) => (a.time || '').localeCompare(b.time || ''))
        .filter(w => {
           const rt = tournamentMap[w.tournamentId];
           return rt && rt.status !== 'completed' && rt.status !== 'live';
        });
      if (validWidgets.length > 0) {
         nextScheduledWidget = validWidgets[0];
         nextScheduledDate = entry.date;
         break;
      }
    }
  }

  const nextTournament = nextScheduledWidget ? tournamentMap[nextScheduledWidget.tournamentId] : null;
  const heroTournament = liveTournament || nextTournament;
  const isHeroLive = !!liveTournament;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#0a0a0a] text-[#e5e2e1] font-body relative overflow-hidden">
      {/* Brutalist Grid Background overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#e6c364 1px, transparent 1px), linear-gradient(90deg, #e6c364 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Dynamic Header */}
        <div className="mb-16">
          <span className="font-label text-[#e6c364] tracking-[0.4em] text-xs font-bold uppercase mb-4 block">Operations</span>
          <h1 className="font-headline font-black text-6xl sm:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-none shadow-sm">
            Battle <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6c364] to-[#c9a84c]">Schedule</span>
          </h1>
        </div>

        {/* ═══ LIVE NOW / UP NEXT (Massive Glassmorphism Card — Clickable) ═══ */}
        {heroTournament && (
          <section className="mb-16 animate-slide-up">
            <div
              onClick={() => toggleExpand(heroTournament.id)}
              className={`group relative bg-[#1a0f0f]/60 backdrop-blur-2xl border ${isHeroLive ? 'border-red-500/20' : 'border-blue-500/20'} rounded-3xl p-8 lg:p-12 overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)] cursor-pointer`}
            >
              {/* Animated Background Glare */}
              <div className={`absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 ${isHeroLive ? 'bg-red-500/20' : 'bg-blue-500/20'} blur-[100px] rounded-full pointer-events-none animate-pulse-slow`}></div>
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${isHeroLive ? 'from-red-600 via-red-400 to-red-600' : 'from-blue-600 via-blue-400 to-blue-600'}`}></div>

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 text-left">
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    {isHeroLive ? (
                      <>
                        <span className="relative flex h-4 w-4">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                        </span>
                        <span className="text-red-400 font-headline font-bold text-sm uppercase tracking-[0.3em]">Live Encounter</span>
                      </>
                    ) : (
                      <>
                        <span className="relative flex h-4 w-4">
                          <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                        </span>
                        <span className="text-blue-400 font-headline font-bold text-sm uppercase tracking-[0.3em]">
                          Up Next — {new Date(nextScheduledDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })} at {formatTime12(nextScheduledWidget.time)}
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="font-headline text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4 group-hover:scale-[1.01] transition-transform origin-left">{heroTournament.name}</h2>
                  <p className={`${isHeroLive ? 'text-red-200/60' : 'text-blue-200/60'} font-label uppercase tracking-widest text-sm`}>{heroTournament.organizer}</p>
                </div>

                <div className="flex flex-wrap gap-4 font-headline uppercase tracking-wider text-sm items-center">
                  {heroTournament.teamsCount > 0 && (
                    <div className={`${isHeroLive ? 'bg-red-500/10 border-red-400/20 text-red-100' : 'bg-blue-500/10 border-blue-400/20 text-blue-100'} border px-6 py-3 rounded-full flex items-center gap-2`}>
                      <span className="material-symbols-outlined text-sm">groups</span>
                      {heroTournament.teamsCount} Teams
                    </div>
                  )}
                  {(heroTournament.prizePoolINR > 0 || heroTournament.prizePoolUSD > 0) && (
                    <div className="bg-[#e6c364]/10 border border-[#e6c364]/20 px-6 py-3 rounded-full text-[#e6c364] flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">trophy</span>
                      {heroTournament.prizePoolINR > 0 && `₹${heroTournament.prizePoolINR.toLocaleString('en-IN')}`}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 ${isHeroLive ? 'text-red-300/60' : 'text-blue-300/60'} text-xs transition-transform ${expandedId === heroTournament.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {expandedId === heroTournament.id && (
                <div className={`relative z-10 mt-8 pt-6 border-t ${isHeroLive ? 'border-red-500/20' : 'border-blue-500/20'}`}>
                  <TournamentDetailPanel tournament={heroTournament} />
                </div>
              )}
            </div>
          </section>
        )}

        {/* ═══ THE BENTO GRID (Upcoming & Daily) ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Filter & Upcoming Tournaments Area (Takes up more space) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Sleek Filter Pill Bar */}
            <div className="bg-[#131313]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex flex-wrap items-center gap-4 shadow-lg sticky top-24 z-30">
              <span className="material-symbols-outlined text-white/30 pl-2">tune</span>
              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
              
              <select value={filterMode} onChange={e => setFilterMode(e.target.value)} className="bg-transparent text-white font-label text-xs tracking-widest uppercase border-none focus:ring-0 cursor-pointer appearance-none hover:text-[#e6c364] transition-colors">
                <option value="all" className="bg-[#131313]">Mode: All</option>
                <option value="BR" className="bg-[#131313]">Mode: BR</option>
                <option value="CS" className="bg-[#131313]">Mode: CS</option>
              </select>

              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
              
              <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="bg-transparent text-white font-label text-xs tracking-widest uppercase border-none focus:ring-0 cursor-pointer appearance-none hover:text-[#e6c364] transition-colors">
                <option value="all" className="bg-[#131313]">Tier: All</option>
                <option value="S" className="bg-[#131313]">Tier: S</option>
                <option value="A" className="bg-[#131313]">Tier: A</option>
                <option value="Community" className="bg-[#131313]">Tier: Community</option>
              </select>

              <div className="h-6 w-px bg-white/10 hidden sm:block"></div>
              
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-transparent text-white font-label text-xs tracking-widest uppercase border-none focus:ring-0 cursor-pointer appearance-none hover:text-[#e6c364] transition-colors ml-auto">
                <option value="date" className="bg-[#131313]">Sort: Next</option>
                <option value="prizePool" className="bg-[#131313]">Sort: Prize</option>
                <option value="tier" className="bg-[#131313]">Sort: Tier</option>
              </select>
            </div>

            {/* Upcoming Tournaments Bento Layout */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filtered.map((t, i) => (
                  <ScheduleTournamentCard key={t.id} t={t} index={i} expandedId={expandedId} toggleExpand={toggleExpand} />
                ))}
              </div>
            ) : completedFiltered.length > 0 ? (
              <div className="flex flex-col gap-6 animate-slide-up">
                <div className="bg-[#131313]/30 border border-white/5 rounded-3xl p-6 text-center shadow-inner">
                  <p className="font-headline text-sm text-white/40 uppercase tracking-widest flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[#e6c364]/50">history</span>
                    No upcoming match data. Displaying Recent Results.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {completedFiltered.map((t, i) => (
                    <ScheduleTournamentCard key={t.id} t={t} index={i} expandedId={expandedId} toggleExpand={toggleExpand} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#131313]/30 border border-white/5 rounded-3xl p-12 text-center">
                <span className="material-symbols-outlined text-white/20 text-6xl mb-4">event_busy</span>
                <p className="font-headline text-xl text-white/40 uppercase tracking-widest">No matching tournaments found.</p>
              </div>
            )}
          </div>

          {/* Daily Schedule Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <h2 className="font-headline font-black text-3xl text-white uppercase tracking-tighter flex items-center gap-3">
              <span className="material-symbols-outlined text-[#e6c364]">calendar_today</span>
              Agenda
            </h2>
            
            {sortedSchedule.length > 0 ? (
              <div className="space-y-8">
                {sortedSchedule.map(entry => (
                  <div key={entry.id} className="relative">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[3px] top-8 bottom-[-2rem] w-[2px] bg-gradient-to-b from-[#e6c364]/30 to-transparent"></div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-[8px] h-[8px] bg-[#e6c364] rounded-full shadow-[0_0_10px_#e6c364]"></div>
                      <h3 className="font-label font-bold text-sm text-[#e6c364] uppercase tracking-widest">
                        {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                      </h3>
                    </div>
                    
                    <div className="grid gap-4 pl-6 relative">
                      {[...entry.tournaments].sort((a, b) => (a.time || '').localeCompare(b.time || '')).map((w, i) => (
                        <ScheduleWidget
                          key={i}
                          widget={w}
                          isExpanded={expandedId === w.tournamentId}
                          onToggle={() => w.tournamentId && toggleExpand(w.tournamentId)}
                          tournamentMap={tournamentMap}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               <div className="bg-[#131313]/30 border border-white/5 rounded-3xl p-8 text-center">
                 <p className="font-label text-sm text-white/40 uppercase tracking-widest">No daily fixtures logged.</p>
               </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
