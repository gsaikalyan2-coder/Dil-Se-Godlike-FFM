import React from 'react';
import { Link } from 'react-router-dom';
import { getLiveMatch, getFinishedMatches } from '../data/store';
import { useLiveTournament, useTournamentStoreSync } from '../hooks/useTournamentStoreSync';
import TournamentCountdown from '../components/TournamentCountdown';
import TierBadge from '../components/TierBadge';

/* ═══ Hero Player Data ═══ */
const HERO_PLAYERS = [
  { name: 'Yogi', src: '/images/hero/yogi.png' },
  { name: 'EcoEco', src: '/images/hero/eco.png' },
  { name: 'Nancy', src: '/images/hero/nancy.png' },
  { name: 'Marco', src: '/images/hero/marco.png' },
  { name: 'Nobita', src: '/images/hero/nobita.png' },
];

/* ═══ Match Result Card ═══ */
function MatchResultCard({ match }) {
  const isWin = match.godlike_score > match.opponent_score;
  return (
    <div className="bg-gradient-to-br from-[#1a1710] to-[#0f0e0c] border border-gold/10 rounded-[20px] p-6 sm:p-8 animate-slide-up hover:border-gold/30 hover:shadow-[0_0_30px_rgba(201,168,76,0.1)] transition-all duration-500 relative overflow-hidden group">

      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-gold opacity-10 blur-[50px] group-hover:opacity-20 transition-opacity duration-500"></div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-xs uppercase tracking-[0.2em] font-medium" style={{ color: '#8b7a4a' }}>{match.tournament}</span>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest ${isWin ? 'bg-win/10 text-win border border-win/20' : 'bg-loss/10 text-loss border border-loss/20'}`}>
          {isWin ? 'VICTORY' : 'DEFEAT'}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* GL Team */}
        <div className="flex flex-1 items-center gap-4 justify-end sm:justify-start w-full sm:w-auto">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a2418] to-[#1a1610] border border-gold/20 flex items-center justify-center shadow-inner">
            <span className="text-gold font-heading font-bold text-lg">GL</span>
          </div>
          <span className="font-heading font-bold text-xl sm:text-2xl text-white tracking-wide">GodLike FFM</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center justify-center relative px-6">
          <div className="flex items-center gap-4 font-heading text-4xl sm:text-5xl font-black">
            <span className={isWin ? 'text-gold' : 'text-white'}>{match.godlike_score}</span>
            <span className="text-dark-border text-2xl font-light">-</span>
            <span className={!isWin ? 'text-gold' : 'text-white'}>{match.opponent_score}</span>
          </div>
        </div>

        {/* Opponent Team */}
        <div className="flex flex-1 items-center gap-4 justify-start sm:justify-end w-full sm:w-auto flex-row-reverse sm:flex-row">
          <span className="font-heading font-bold text-xl sm:text-2xl text-grey-light tracking-wide">{match.opponent}</span>
          <div className="w-12 h-12 rounded-xl bg-[#141416] border border-dark-border flex items-center justify-center">
            <span className="text-grey font-bold tracking-wider">{match.opponent.substring(0, 2).toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-full h-px mt-8 mb-4" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0) 0%, rgba(201,168,76,0.15) 50%, rgba(201,168,76,0) 100%)' }} />

      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs uppercase tracking-[0.1em] font-medium" style={{ color: '#b0a080' }}>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold/50"></span>{match.kills} Kills</div>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold/50"></span>Rank #{match.rank}</div>
        <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold/50"></span>{match.date}</div>
      </div>
    </div>
  );
}

export default function Home() {
  const live = getLiveMatch();
  const finished = getFinishedMatches();
  const latestFinished = finished[0];
  const liveTournament = useLiveTournament();
  const { tournaments: upcomingTournaments } = useTournamentStoreSync('upcoming');
  const upcomingPreview = upcomingTournaments.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* ═══ HERO SECTION ═══ */}
      <section
        className="relative w-full overflow-hidden"
        style={{ height: '100vh', minHeight: '600px', maxHeight: '900px', backgroundColor: '#0a0a0a' }}
      >
        {/* Layer 1: Dark Background */}
        <div className="absolute inset-0" style={{ backgroundColor: '#0a0a0a', zIndex: 0 }} />

        {/* Layer 2: GodLike Logo Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ zIndex: 1 }}
        >
          <img
            src="/images/godlike-logo.png"
            alt=""
            className="w-[400px] sm:w-[500px] md:w-[600px] h-auto"
            style={{ opacity: 0.08, filter: 'grayscale(30%)' }}
            onError={e => { e.currentTarget.style.display = 'none'; }}
          />
        </div>

        {/* Layer 3: Gold Ambient Glow */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '700px',
            height: '500px',
            background: 'radial-gradient(ellipse at center, rgba(201, 168, 76, 0.15) 0%, rgba(201, 168, 76, 0.05) 40%, transparent 70%)',
            zIndex: 2,
          }}
        />

        {/* Layer 4: Player Images — arranged side-by-side with no overlap */}
        <div
          className="absolute bottom-0 left-0 w-full flex items-end justify-between px-2 sm:px-8"
          style={{ zIndex: 3, height: '80%' }}
        >
          {HERO_PLAYERS.map((player, i) => {
            const isCenter = i === 2;

            return (
              <div
                key={player.name}
                className="flex flex-1 justify-center items-end"
                style={{
                  height: '100%',
                }}
              >
                <img
                  src={player.src}
                  alt={player.name}
                  className="w-full h-full object-contain object-bottom"
                  style={{
                    maxHeight: isCenter ? '75vh' : '65vh',
                    filter: `drop-shadow(0 0 ${isCenter ? '25px' : '12px'} rgba(201, 168, 76, ${isCenter ? '0.25' : '0.12'}))`,
                  }}
                  onError={e => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextSibling) e.currentTarget.nextSibling.style.display = 'flex';
                  }}
                />
                {/* Silhouette Fallback */}
                <div
                  className="w-full flex items-end justify-center"
                  style={{ display: 'none', height: '100%' }}
                >
                  <svg viewBox="0 0 120 300" fill="rgba(201, 168, 76, 0.1)" className="h-4/5">
                    <ellipse cx="60" cy="60" rx="30" ry="35" />
                    <rect x="25" y="90" width="70" height="120" rx="15" />
                    <rect x="20" y="200" width="30" height="90" rx="10" />
                    <rect x="70" y="200" width="30" height="90" rx="10" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Layer 5: Bottom Gradient Overlay */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: '45%',
            background: 'linear-gradient(to top, #0a0a0a 0%, #0a0a0a 15%, rgba(10,10,10,0.8) 40%, transparent 100%)',
            zIndex: 4,
          }}
        />

        {/* Layer 6: Hero Headline Text */}
        <div
          className="absolute bottom-16 sm:bottom-20 left-0 right-0 text-center px-4"
          style={{ zIndex: 5 }}
        >
          <h1
            className="font-heading font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl uppercase leading-tight"
            style={{
              textShadow: '0 2px 20px rgba(0,0,0,0.8), 0 0 40px rgba(0,0,0,0.5)',
              letterSpacing: '0.05em',
            }}
          >
            <span className="text-white">Ultimate Esports Experience</span>
            <br />
            <span className="text-white">for the </span>
            <span style={{ color: '#c9a84c' }}>Golden Army.</span>
          </h1>
        </div>
      </section>

      {/* ═══ LIVE TOURNAMENT BANNER ═══ */}
      {liveTournament && (
        <Link to="/tournaments" className="block no-underline">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="live-tournament-glow rounded-xl p-5 bg-dark-card hover:bg-[#161618] transition cursor-pointer">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse-live" />
                <span className="text-red-400 font-heading font-bold text-xs uppercase tracking-widest">Live Tournament</span>
              </div>
              <h3 className="font-heading font-bold text-xl text-white mb-2">{liveTournament.name}</h3>
              <div className="flex items-center gap-4 flex-wrap text-sm">
                <TierBadge tier={liveTournament.tier} />
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  liveTournament.gameMode === 'CS' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {liveTournament.gameMode}
                </span>
                {/* Current match info */}
                {liveTournament.stages && liveTournament.stages.length > 0 ? (
                  <span className="text-grey text-xs">
                    Game {liveTournament.stages[liveTournament.stages.length - 1]?.matches?.length || '?'} in progress
                  </span>
                ) : (
                  <span className="text-grey text-xs">In Progress</span>
                )}
                {/* GodLike standings position */}
                {liveTournament.standings && liveTournament.standings.length > 0 && (() => {
                  const glRow = liveTournament.standings.find(r => r.isGodlike || (r.team && r.team.toLowerCase().includes('godl')));
                  return glRow ? (
                    <span className="text-[#c9a84c] text-xs font-semibold">GodLike: #{glRow.rank} ({glRow.points || glRow.totalPts || 0} pts)</span>
                  ) : null;
                })()}
              </div>
              <div className="flex items-center gap-1 mt-3 text-red-400 text-xs font-semibold">
                View Live
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* ═══ LIVE BANNER (existing match-level) ═══ */}
      {live && (
        <Link to="/live" className="block no-underline">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 flex items-center justify-center gap-3 hover:bg-green-500/20 transition cursor-pointer">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse-live" />
              <span className="text-green-400 font-heading font-bold text-lg uppercase tracking-wider">
                Currently Live — GodLike FFM vs {live.opponent}
              </span>
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      )}

      {/* ═══ LATEST RESULT ═══ */}
      {latestFinished && (
        <section className="max-w-3xl mx-auto px-4 pb-16 pt-8">
          <h2 className="font-heading font-bold text-2xl text-white mb-4 uppercase tracking-wider">Latest Result</h2>
          <MatchResultCard match={latestFinished} />
        </section>
      )}

      {/* ═══ UPCOMING TOURNAMENTS PREVIEW ═══ */}
      {upcomingPreview.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <h2 className="font-heading font-bold text-2xl uppercase tracking-wider mb-6">
            <span className="text-white">Upcoming </span>
            <span style={{ color: '#c9a84c' }}>Tournaments</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingPreview.map((t, i) => (
              <div
                key={t.id}
                className="bg-dark-card border border-dark-border rounded-xl p-5 hover:border-gold/20 transition animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <TierBadge tier={t.tier} />
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    t.gameMode === 'CS' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {t.gameMode}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-1 leading-tight">{t.name}</h3>
                <p className="text-grey text-xs mb-3">
                  {t.startDate && new Date(t.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {t.endDate && t.endDate !== t.startDate && ` — ${new Date(t.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}
                </p>
                {t.startDate && (
                  <div className="mb-3">
                    <TournamentCountdown targetDate={t.startDate} compact />
                  </div>
                )}
                <div className="flex items-center gap-3 text-grey text-xs">
                  {(t.prizePoolINR > 0 || t.prizePoolUSD > 0) && (
                    <span>
                      {t.prizePoolINR > 0 && `₹${t.prizePoolINR.toLocaleString('en-IN')}`}
                      {t.prizePoolINR > 0 && t.prizePoolUSD > 0 && ' / '}
                      {t.prizePoolUSD > 0 && `$${t.prizePoolUSD.toLocaleString()}`}
                    </span>
                  )}
                  {t.teamsCount > 0 && <span>{t.teamsCount} Teams</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link
              to="/schedule"
              className="text-[#c9a84c] font-heading font-bold text-sm uppercase tracking-wider hover:text-[#e0c872] transition no-underline inline-flex items-center gap-1"
            >
              View Full Schedule
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
