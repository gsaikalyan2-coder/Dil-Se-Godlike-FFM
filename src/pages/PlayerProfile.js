import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayerById } from '../data/store';

const StatCard = ({ label, value, highlight }) => (
  <div
    className="rounded-2xl p-5 text-center"
    style={{
      background: 'linear-gradient(145deg, #1a1710 0%, #141210 50%, #0f0e0c 100%)',
      border: '1px solid rgba(201, 168, 76, 0.15)',
    }}
  >
    <p className="text-[10px] uppercase tracking-[0.15em] mb-2" style={{ color: '#8b7a4a' }}>{label}</p>
    <p className={`font-heading font-bold text-3xl ${highlight ? '' : 'text-white'}`} style={highlight ? { color: '#c9a84c' } : {}}>
      {value || '\u2014'}
    </p>
  </div>
);

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const player = getPlayerById(id);

  if (!player) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ backgroundColor: '#0d0d0f' }}>
        <div className="text-center">
          <p className="font-heading font-bold text-2xl text-white mb-4">Player not found</p>
          <button onClick={() => navigate('/roster')} className="text-sm uppercase tracking-wider" style={{ color: '#c9a84c' }}>
            &larr; Back to Roster
          </button>
        </div>
      </div>
    );
  }

  const initial = player.game_name ? player.game_name.charAt(0).toUpperCase() : '?';
  const avgKills = player.avg_kills || (player.matches_played ? (player.total_kills / player.matches_played).toFixed(1) : 0);

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#0d0d0f' }}>
      <div className="max-w-5xl mx-auto px-4">

        {/* Back Button */}
        <button
          onClick={() => navigate('/roster')}
          className="inline-flex items-center gap-2 text-sm uppercase tracking-wider mb-8 hover:opacity-80 transition font-semibold"
          style={{ color: '#c9a84c' }}
        >
          &larr; BACK TO ROSTER
        </button>

        {/* ═══ TOP BANNER ═══ */}
        <div
          className="rounded-[20px] p-6 sm:p-8 mb-8 animate-slide-up"
          style={{
            background: 'linear-gradient(145deg, #1a1710 0%, #141210 50%, #0f0e0c 100%)',
            border: '1px solid rgba(201, 168, 76, 0.15)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Player Avatar */}
            {player.photo_url ? (
              <img
                src={player.photo_url}
                alt={player.game_name}
                className="w-[160px] h-[200px] sm:w-[200px] sm:h-[250px] rounded-2xl object-cover flex-shrink-0"
                style={{ border: '2px solid rgba(201, 168, 76, 0.25)', objectPosition: 'top center' }}
              />
            ) : (
              <div
                className="w-[160px] h-[160px] sm:w-[200px] sm:h-[200px] rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #2a2418 0%, #1a1610 100%)', border: '2px solid rgba(201, 168, 76, 0.2)' }}
              >
                <span className="font-heading font-bold text-7xl" style={{ color: '#c9a84c' }}>{initial}</span>
              </div>
            )}

            {/* Player Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="font-heading font-bold text-3xl sm:text-5xl text-white uppercase tracking-wide">
                {player.name}
              </h1>
              <p className="font-heading font-bold text-xl sm:text-2xl mt-1" style={{ color: '#c9a84c' }}>
                {player.game_name}
              </p>
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mt-3"
                style={{ background: 'linear-gradient(135deg, #c9a84c, #a68a3e)', color: '#0d0d0f' }}
              >
                {player.role}
              </span>
              {player.bio && (
                <p className="mt-4 text-sm leading-relaxed" style={{ color: '#8b7a4a' }}>{player.bio}</p>
              )}
            </div>
          </div>
        </div>

        {/* ═══ STATS GRID ═══ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <StatCard label="Total Kills" value={player.total_kills} />
          <StatCard label="Matches Played" value={player.matches_played} highlight />
          <StatCard label="Best Rank" value={player.best_rank ? `#${player.best_rank}` : null} />
          <StatCard label="Win Rate" value={player.win_rate ? `${player.win_rate}%` : null} />
          <StatCard label="Avg Kills / Match" value={avgKills} highlight />
          <StatCard label="Tournaments Played" value={player.tournaments_played} />
        </div>

        {/* ═══ DIVIDER ═══ */}
        <div className="my-8 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.3) 50%, transparent 100%)' }} />

        {/* ═══ ABOUT SECTION ═══ */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="font-heading font-bold text-2xl text-white uppercase mb-4" style={{ letterSpacing: '0.12em' }}>
            ABOUT
          </h2>
          <div
            className="rounded-[20px] p-6"
            style={{
              background: 'linear-gradient(145deg, #1a1710 0%, #141210 50%, #0f0e0c 100%)',
              border: '1px solid rgba(201, 168, 76, 0.15)',
            }}
          >
            <p className="leading-relaxed" style={{ color: '#8b7a4a' }}>
              {player.bio || 'Bio coming soon...'}
            </p>
          </div>
        </div>

        {/* ═══ RECENT MATCHES ═══ */}
        <div className="mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="font-heading font-bold text-2xl text-white uppercase mb-4" style={{ letterSpacing: '0.12em' }}>
            RECENT MATCHES
          </h2>
          <div
            className="rounded-[20px] p-8 text-center"
            style={{
              background: 'linear-gradient(145deg, #1a1710 0%, #141210 50%, #0f0e0c 100%)',
              border: '1px solid rgba(201, 168, 76, 0.15)',
            }}
          >
            <p style={{ color: '#8b7a4a' }}>Match stats coming soon...</p>
          </div>
        </div>

        {/* ═══ SOCIAL LINKS ═══ */}
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="font-heading font-bold text-2xl text-white uppercase mb-4" style={{ letterSpacing: '0.12em' }}>
            FIND ME
          </h2>
          <div className="flex flex-wrap gap-3">
            {player.instagram && (
              <a
                href={player.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition hover:opacity-80"
                style={{ background: '#1a1710', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                Instagram
              </a>
            )}
            {player.youtube && (
              <a
                href={player.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition hover:opacity-80"
                style={{ background: '#1a1710', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                YouTube
              </a>
            )}
            {player.twitter && (
              <a
                href={player.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition hover:opacity-80"
                style={{ background: '#1a1710', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter / X
              </a>
            )}
            {!player.instagram && !player.youtube && !player.twitter && (
              <div
                className="px-5 py-2.5 rounded-full text-sm"
                style={{ background: '#1a1710', border: '1px solid rgba(201,168,76,0.1)', color: '#666' }}
              >
                No social links added yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
