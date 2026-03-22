import React, { useState } from 'react';
import { getUpcomingMatches } from '../data/store';
import { useTournamentStoreSync } from '../hooks/useTournamentStoreSync';
import TournamentCountdown from '../components/TournamentCountdown';
import TierBadge from '../components/TierBadge';

const TIER_PRIORITY = { S: 0, A: 1, B: 2, C: 3, D: 4, Community: 5 };

export default function Schedule() {
  const upcoming = getUpcomingMatches();
  const { tournaments: upcomingTournaments } = useTournamentStoreSync('upcoming');

  const [sortBy, setSortBy] = useState('date');
  const [filterMode, setFilterMode] = useState('all');
  const [filterTier, setFilterTier] = useState('all');

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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider mb-2">
          Match <span className="text-accent">Schedule</span>
        </h1>
        <p className="text-grey mb-10">Upcoming matches sorted by date</p>

        {/* ═══ Upcoming Tournaments from tournamentStore ═══ */}
        {upcomingTournaments.length > 0 && (
          <section className="mb-10">
            <h2 className="font-heading font-bold text-2xl text-white uppercase tracking-wider mb-4">
              Upcoming <span style={{ color: '#c9a84c' }}>Tournaments</span>
            </h2>

            {/* Filter/Sort Toolbar */}
            <div className="bg-dark-card border border-dark-border rounded-xl p-4 mb-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-grey text-xs uppercase tracking-wider">Mode:</label>
                <select
                  value={filterMode}
                  onChange={e => setFilterMode(e.target.value)}
                  className="bg-[#0d0d0f] border border-dark-border rounded px-2 py-1 text-white text-sm"
                >
                  <option value="all">All</option>
                  <option value="BR">BR</option>
                  <option value="CS">CS</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-grey text-xs uppercase tracking-wider">Tier:</label>
                <select
                  value={filterTier}
                  onChange={e => setFilterTier(e.target.value)}
                  className="bg-[#0d0d0f] border border-dark-border rounded px-2 py-1 text-white text-sm"
                >
                  <option value="all">All</option>
                  <option value="S">S-Tier</option>
                  <option value="A">A-Tier</option>
                  <option value="B">B-Tier</option>
                  <option value="C">C-Tier</option>
                  <option value="D">D-Tier</option>
                  <option value="Community">Community</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-grey text-xs uppercase tracking-wider">Sort:</label>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-[#0d0d0f] border border-dark-border rounded px-2 py-1 text-white text-sm"
                >
                  <option value="date">Date (Nearest)</option>
                  <option value="prizePool">Prize Pool</option>
                  <option value="tier">Tier</option>
                </select>
              </div>
            </div>

            {/* Tournament Cards */}
            {filtered.length > 0 ? (
              <div className="grid gap-4">
                {filtered.map((t, i) => (
                  <div
                    key={t.id}
                    className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-upcoming-blue/30 transition animate-slide-up"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-heading font-bold text-lg text-white">{t.name}</h3>
                          <TierBadge tier={t.tier} />
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            t.gameMode === 'CS' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          }`}>
                            {t.gameMode}
                          </span>
                        </div>
                        <p className="text-grey text-xs">{t.organizer}</p>
                        <div className="flex items-center gap-3 mt-2 flex-wrap text-grey text-xs">
                          {t.teamsCount > 0 && <span>{t.teamsCount} Teams</span>}
                          {(t.prizePoolINR > 0 || t.prizePoolUSD > 0) && (
                            <span>
                              {t.prizePoolINR > 0 && `₹${t.prizePoolINR.toLocaleString('en-IN')}`}
                              {t.prizePoolINR > 0 && t.prizePoolUSD > 0 && ' / '}
                              {t.prizePoolUSD > 0 && `$${t.prizePoolUSD.toLocaleString()}`}
                            </span>
                          )}
                          {t.stages && t.stages.length > 0 && (
                            <span>{t.stages.map(s => s.name).join(', ')}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {t.startDate && (
                          <p className="text-grey text-sm mb-1">
                            {new Date(t.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {t.endDate && t.endDate !== t.startDate && ` — ${new Date(t.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                          </p>
                        )}
                        {t.startDate && <TournamentCountdown targetDate={t.startDate} compact />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-grey text-sm">No tournaments match your filters.</p>
            )}

            {/* Divider between tournaments and matches */}
            <div className="mt-10 mb-2 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)' }} />
          </section>
        )}

        {/* ═══ Existing Match Schedule (unchanged) ═══ */}
        {upcoming.length > 0 ? (
          <div className="grid gap-4">
            {upcoming.map((m, i) => (
              <div
                key={m.id}
                className="bg-dark-card border border-dark-border rounded-xl p-5 flex items-center justify-between flex-wrap gap-4 hover:border-upcoming-blue/30 transition animate-slide-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold px-3 py-1 rounded bg-upcoming-blue/20 text-upcoming-blue uppercase tracking-wider">
                    Upcoming
                  </span>
                  <span className="text-grey text-sm">{m.tournament}</span>
                </div>
                <div className="font-heading font-semibold text-lg">
                  <span className="text-accent">GodLike FFM</span>
                  <span className="text-grey mx-3">vs</span>
                  <span className="text-white">{m.opponent}</span>
                </div>
                <div className="text-grey text-sm">
                  {new Date(m.date + 'T' + m.time).toLocaleDateString('en-IN', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  at {m.time}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-grey text-lg">No upcoming matches scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
}
