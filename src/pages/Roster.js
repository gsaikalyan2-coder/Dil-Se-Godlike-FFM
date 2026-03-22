import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivePlayers, getInactivePlayers } from '../data/store';

/* ═══ 6 TBD placeholder slots for Previous Roster ═══ */
const PREVIOUS_PLACEHOLDERS = [
  { id: 101, game_name: 'GodL.Nivesh', name: 'Nivesh', role: 'IGL', total_kills: 0, matches_played: 0, photo_url: '' },
  { id: 102, game_name: 'GodL.Ginotra', name: 'Ginotra', role: 'Nader', total_kills: 0, matches_played: 0, photo_url: '' },
  { id: 103, game_name: 'GodL.Bablu', name: 'Bablu', role: 'Rusher', total_kills: 0, matches_played: 0, photo_url: '' },
  { id: 104, game_name: 'GodL.Abhay', name: 'Abhay', role: 'Sniper', total_kills: 0, matches_played: 0, photo_url: '' },
  { id: 105, game_name: 'GodL.Akashdip', name: 'Akashdip', role: 'Rusher', total_kills: 0, matches_played: 0, photo_url: '' },
  { id: 106, game_name: 'GodL.TheCM', name: 'TheCM', role: 'Rusher', total_kills: 0, matches_played: 0, photo_url: '' },
];

/* ═══ Timeline Data ═══ */
const CURRENT_TIMELINE = [
  { date: '27/06/2025', event: 'AUTOBOTZ Esports bids farewell to their FFM Esports roster', type: 'departure' },
  { date: '27/06/2025', event: 'AUTOBOTZ FFM Lineup joined GodLike Esports', type: 'joined' },
];

const PREVIOUS_TIMELINE = [
  { date: '26/09/2021', event: 'BLIND Esports bids farewell to the FF roster', type: 'departure' },
  { date: '26/09/2021', event: 'Ex-BLIND FF roster joined GodLike Esports', type: 'joined' },
  { date: '19/12/2021', event: 'BABLU left GodLike', type: 'departure' },
  { date: '24/12/2021', event: 'THE CM left TITANIUM', type: 'departure' },
  { date: '24/12/2021', event: 'THE CM joined GodLike', type: 'joined' },
  { date: '24/12/2023', event: 'GodLike bids farewell to the FF Roster', type: 'departure' },
];

/* ═══ Timeline Component ═══ */
function Timeline({ events }) {
  return (
    <div className="mt-14">
      {/* Timeline Heading */}
      <h2
        className="font-heading font-bold text-2xl sm:text-3xl uppercase mb-8"
        style={{ letterSpacing: '0.12em', color: '#c9a84c' }}
      >
        Timeline
      </h2>

      {/* Timeline Events */}
      <div className="relative pl-8">
        {/* Vertical Line */}
        <div
          className="absolute left-[11px] top-2 bottom-2 w-[2px]"
          style={{ background: 'linear-gradient(180deg, #c9a84c 0%, rgba(201,168,76,0.15) 100%)' }}
        />

        {events.map((item, i) => {
          const color = item.type === 'joined' ? '#22c55e' : '#ef4444';

          return (
            <div
              key={i}
              className="relative mb-8 last:mb-0 animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Dot */}
              <div
                className="absolute -left-8 top-1 w-[12px] h-[12px] rounded-full"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 8px ${color}55`,
                  border: '2px solid #0d0d0f',
                }}
              />

              {/* Content */}
              <div
                className="rounded-xl px-5 py-4 transition-all duration-300"
                style={{
                  background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)',
                  border: '1px solid rgba(201, 168, 76, 0.1)',
                  borderLeft: `3px solid ${color}`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = `1px solid rgba(201, 168, 76, 0.3)`;
                  e.currentTarget.style.borderLeft = `3px solid ${color}`;
                  e.currentTarget.style.boxShadow = `0 0 15px ${color}15`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(201, 168, 76, 0.1)';
                  e.currentTarget.style.borderLeft = `3px solid ${color}`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <p className="font-heading font-bold text-sm tracking-wider mb-1" style={{ color: '#c9a84c' }}>
                  {item.date}
                </p>
                <p className="text-sm" style={{ color: '#b0a080' }}>
                  {item.event}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ Player Card Component ═══ */
function PlayerCard({ player, index, inactive }) {
  const navigate = useNavigate();
  const initial = player.game_name && player.game_name !== 'TBD'
    ? player.game_name.charAt(0).toUpperCase()
    : '?';
  const kills = player.total_kills || 0;
  const matches = player.matches_played || 0;
  const isTBD = player.game_name === 'TBD';

  const isClickable = !inactive && !isTBD;

  return (
    <div
      onClick={() => isClickable && navigate(`/player/${player.id}`)}
      className={`group relative ${isClickable ? 'cursor-pointer' : 'cursor-default'} rounded-[16px] p-5 transition-all duration-300 animate-slide-up`}
      style={{
        animationDelay: `${index * 80}ms`,
        background: 'linear-gradient(145deg, #1a1710 0%, #141210 50%, #0f0e0c 100%)',
        border: '1px solid rgba(201, 168, 76, 0.15)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(201, 168, 76, 0.4)';
        e.currentTarget.style.boxShadow = '0 0 25px rgba(201, 168, 76, 0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(201, 168, 76, 0.15)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Status Badge - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: inactive ? '#ef4444' : '#22c55e' }}
        />
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: inactive ? '#ef4444' : '#22c55e' }}
        >
          {inactive ? 'INACTIVE' : 'ACTIVE'}
        </span>
      </div>

      {/* Avatar */}
      <div className="mb-3">
        {player.photo_url ? (
          <img
            src={player.photo_url}
            alt={player.game_name}
            className="w-[64px] h-[64px] rounded-xl object-cover"
            style={{
              border: '2px solid rgba(201, 168, 76, 0.25)',
              objectPosition: 'top center',
            }}
          />
        ) : (
          <div
            className="w-[64px] h-[64px] rounded-xl flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #2a2418 0%, #1a1610 100%)',
              border: '2px solid rgba(201, 168, 76, 0.2)',
            }}
          >
            {/* Silhouette SVG for inactive/TBD, initial letter otherwise */}
            {isTBD || inactive ? (
              <svg className="w-8 h-8 opacity-30" fill="#c9a84c" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            ) : (
              <span className="font-heading font-bold text-2xl" style={{ color: '#c9a84c' }}>
                {initial}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Role Badge */}
      <div className="mb-3">
        <span
          className="inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{
            background: inactive ? '#333' : 'linear-gradient(135deg, #c9a84c, #a68a3e)',
            color: inactive ? '#888' : '#0d0d0f',
          }}
        >
          {player.role}
        </span>
      </div>

      {/* Player Name */}
      <h3 className="font-heading font-bold text-lg uppercase tracking-wide" style={{ color: inactive ? '#888' : '#e8d5a3' }}>
        {player.game_name}
      </h3>
      <p className="text-[11px] uppercase tracking-[0.2em] mt-0.5 mb-4" style={{ color: inactive ? '#555' : '#8b7a4a' }}>
        {player.role}
      </p>

      {/* Divider */}
      <div className="w-full h-px mb-4" style={{ background: 'linear-gradient(90deg, rgba(201,168,76,0.3) 0%, rgba(201,168,76,0.05) 100%)' }} />

      {/* Stats */}
      <div className="flex gap-6">
        <div>
          <p className="text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: '#8b7a4a' }}>Total Kills</p>
          <p className="font-heading font-bold text-xl" style={{ color: inactive ? '#444' : '#c9a84c' }}>{kills}</p>
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-[0.15em] mb-1" style={{ color: '#8b7a4a' }}>Matches</p>
          <p className="font-heading font-bold text-xl" style={{ color: inactive ? '#444' : '#c9a84c' }}>{matches}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══ Main Roster Page ═══ */
export default function Roster() {
  const [activeTab, setActiveTab] = useState('current');
  const activePlayers = getActivePlayers();
  const inactivePlayers = getInactivePlayers();

  // Use inactive players from store if available, otherwise show TBD placeholders
  const previousPlayers = inactivePlayers.length > 0 ? inactivePlayers : PREVIOUS_PLACEHOLDERS;

  const isCurrent = activeTab === 'current';
  const teamSize = isCurrent ? activePlayers.length : previousPlayers.length;

  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#0d0d0f' }}>
      <div className="max-w-6xl mx-auto px-4">

        {/* ═══ HEADER ═══ */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase" style={{ letterSpacing: '0.12em' }}>
              {isCurrent ? 'CURRENT ROSTER' : 'PREVIOUS ROSTER'}
            </h1>
            <p className="text-xs sm:text-sm uppercase mt-2" style={{ letterSpacing: '0.2em', color: '#8b7a4a' }}>
              {isCurrent ? 'THE GOLDEN ARMY REPRESENTING GODLIKE FFM' : 'FORMER MEMBERS OF GODLIKE FFM'}
            </p>
          </div>
          <div
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-heading font-semibold"
            style={{ background: '#1a1710', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}
          >
            <span className="text-xs uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Team Size:</span>
            <span className="text-lg font-bold">{String(teamSize).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ═══ TAB BUTTONS ═══ */}
        <div className="flex gap-2 mb-10">
          <button
            onClick={() => setActiveTab('current')}
            className="relative px-6 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300"
            style={{
              background: isCurrent
                ? 'linear-gradient(135deg, #c9a84c, #a68a3e)'
                : '#1a1710',
              color: isCurrent ? '#0d0d0f' : '#8b7a4a',
              border: isCurrent
                ? '1px solid rgba(201, 168, 76, 0.6)'
                : '1px solid rgba(201, 168, 76, 0.15)',
            }}
          >
            Current Roster
            {isCurrent && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-1 rounded-full"
                style={{ background: '#c9a84c' }}
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('previous')}
            className="relative px-6 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300"
            style={{
              background: !isCurrent
                ? 'linear-gradient(135deg, #c9a84c, #a68a3e)'
                : '#1a1710',
              color: !isCurrent ? '#0d0d0f' : '#8b7a4a',
              border: !isCurrent
                ? '1px solid rgba(201, 168, 76, 0.6)'
                : '1px solid rgba(201, 168, 76, 0.15)',
            }}
          >
            Previous Roster
            {!isCurrent && (
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-8 h-1 rounded-full"
                style={{ background: '#c9a84c' }}
              />
            )}
          </button>
        </div>

        {/* ═══ PLAYER GRID ═══ */}
        <div
          className="transition-opacity duration-300"
          style={{ opacity: 1 }}
          key={activeTab}
        >
          {isCurrent ? (
            activePlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {activePlayers.map((p, i) => (
                  <PlayerCard key={p.id} player={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p style={{ color: '#8b7a4a' }} className="text-lg">No active players in the roster</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {previousPlayers.map((p, i) => (
                <PlayerCard key={p.id} player={p} index={i} inactive />
              ))}
            </div>
          )}

          {/* ═══ TIMELINE ═══ */}
          <Timeline events={isCurrent ? CURRENT_TIMELINE : PREVIOUS_TIMELINE} />
        </div>
      </div>
    </div>
  );
}
