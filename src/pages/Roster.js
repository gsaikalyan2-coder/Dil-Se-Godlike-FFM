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
    <div className="mt-20">
      <div className="flex items-center gap-4 mb-10">
         <span className="material-symbols-outlined text-[#e6c364] text-3xl">history</span>
         <h2 className="font-headline font-black text-3xl sm:text-4xl text-white uppercase tracking-tighter">Timeline</h2>
      </div>

      <div className="relative pl-6 lg:pl-10">
        {/* Vertical Glow Line */}
        <div className="absolute left-[13px] lg:left-[29px] top-4 bottom-[-20px] w-1 bg-gradient-to-b from-[#e6c364]/40 via-[#e6c364]/10 to-transparent rounded-full" />

        {events.map((item, i) => {
          const isJoin = item.type === 'joined';
          const dotColor = isJoin ? 'bg-[#22c55e]' : 'bg-[#ef4444]';
          const glowColor = isJoin ? 'shadow-[0_0_15px_rgba(34,197,94,0.6)]' : 'shadow-[0_0_15px_rgba(239,68,68,0.6)]';
          const borderColor = isJoin ? 'border-[#22c55e]/20' : 'border-[#ef4444]/20';
          const borderSideColor = isJoin ? 'border-l-[#22c55e]' : 'border-l-[#ef4444]';

          return (
            <div key={i} className="relative mb-6 last:mb-0 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              {/* Timeline Node */}
              <div className={`absolute -left-[32px] lg:-left-[24px] top-6 w-[14px] h-[14px] rounded-full ${dotColor} ${glowColor}`} />

              {/* Event Card (Bento Style) */}
              <div className={`group relative bg-[#13110e]/80 backdrop-blur-xl border ${borderColor} rounded-2xl p-6 transition-all duration-300 hover:bg-[#1a1710]/90 border-l-[4px] ${borderSideColor} shadow-lg hover:shadow-xl hover:-translate-y-1`}>
                <p className="font-label font-bold text-xs tracking-widest uppercase mb-2 text-[#e6c364] opacity-80 group-hover:opacity-100 transition-opacity">
                  {item.date}
                </p>
                <p className="font-body text-white/80 text-sm leading-relaxed group-hover:text-white transition-colors">
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

/* ═══ Player Card Component (Pro Max Bento) ═══ */
function PlayerCard({ player, index, inactive }) {
  const navigate = useNavigate();
  const initial = player.game_name && player.game_name !== 'TBD' ? player.game_name.charAt(0).toUpperCase() : '?';
  const isTBD = player.game_name === 'TBD';
  const isClickable = !inactive && !isTBD;

  return (
    <div
      onClick={() => isClickable && navigate(`/player/${player.id}`)}
      className={`group relative bg-[#13110e]/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col justify-between transition-all duration-500 overflow-hidden ${
        isClickable ? 'cursor-pointer hover:border-[#e6c364]/40 hover:bg-[#1a1710]/90 hover:-translate-y-2 hover:shadow-[0_15px_40px_rgba(230,195,100,0.08)]' : 'cursor-default opacity-80'
      } animate-slide-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Background Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e6c364]/0 via-[#e6c364]/0 to-[#e6c364]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Status Badge */}
      <div className="absolute top-5 right-5 flex items-center gap-2">
        <span className={`w-2.5 h-2.5 rounded-full ${inactive ? 'bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]'}`} />
        <span className={`font-label text-[9px] font-bold uppercase tracking-widest ${inactive ? 'text-red-400' : 'text-green-400'}`}>
          {inactive ? 'Inactive' : 'Active'}
        </span>
      </div>

      <div className="relative z-10 w-full mb-6">
        {/* Avatar Area */}
        {player.photo_url ? (
          <div className="w-[80px] h-[80px] rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#e6c364]/50 transition-colors shadow-inner mb-5">
            <img src={player.photo_url} alt={player.game_name} className="w-full h-full object-cover object-top filter group-hover:brightness-110 transition-all scale-100 group-hover:scale-110 duration-500" />
          </div>
        ) : (
          <div className="w-[80px] h-[80px] rounded-2xl bg-[#0a0a09] border border-white/10 group-hover:border-[#e6c364]/30 flex items-center justify-center mb-5 shadow-inner transition-colors">
            {isTBD || inactive ? (
              <span className="material-symbols-outlined text-white/20 text-3xl">person</span>
            ) : (
              <span className="font-headline font-black text-4xl text-[#e6c364] opacity-50">{initial}</span>
            )}
          </div>
        )}

        {/* Role Pill */}
        <span className={`inline-block px-3 py-1.5 rounded-full font-label text-[9px] font-bold uppercase tracking-widest mb-3 ${
          inactive ? 'bg-white/5 text-white/40' : 'bg-gradient-to-r from-[#e6c364]/10 to-[#c9a84c]/5 border border-[#e6c364]/20 text-[#e6c364]'
        }`}>
          {player.role || 'Player'}
        </span>

        {/* Names */}
        <h3 className={`font-headline font-black text-2xl uppercase tracking-tighter mb-1 transition-colors ${inactive ? 'text-white/60' : 'text-white group-hover:text-[#e6c364]'}`}>
          {player.game_name}
        </h3>
        <p className="font-label text-[10px] uppercase tracking-[0.2em] text-white/30 hidden">
          Real Name
        </p>
      </div>

      {/* Stats Area (Neumorphic insertion) */}
      <div className="relative z-10 mt-auto pt-5 border-t border-white/5 grid grid-cols-2 gap-4">
        <div>
          <span className="block font-label text-[9px] uppercase tracking-widest text-[#e6c364]/60 mb-1">Kills</span>
          <span className={`font-headline font-black text-2xl ${inactive ? 'text-white/40' : 'text-white'}`}>{player.total_kills || 0}</span>
        </div>
        <div>
          <span className="block font-label text-[9px] uppercase tracking-widest text-[#e6c364]/60 mb-1">Matches</span>
          <span className={`font-headline font-black text-2xl ${inactive ? 'text-white/40' : 'text-white'}`}>{player.matches_played || 0}</span>
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
  const previousPlayers = inactivePlayers.length > 0 ? inactivePlayers : PREVIOUS_PLACEHOLDERS;

  const isCurrent = activeTab === 'current';
  const teamSize = isCurrent ? activePlayers.length : previousPlayers.length;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#0a0a0a] text-[#e5e2e1] font-body relative overflow-hidden">
      {/* Brutalist Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#e6c364 1px, transparent 1px), linear-gradient(90deg, #e6c364 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-[1400px] w-[95%] mx-auto px-4 lg:px-6 relative z-10">

        {/* ═══ HEADER (Pro-Max Legacy Brutalism) ═══ */}
        <div className="mb-16 animate-slide-up flex flex-col md:flex-row md:items-end justify-between gap-8 text-left">
          <div>
            <span className="font-label text-[#e6c364] tracking-[0.4em] text-xs font-bold uppercase mb-4 block">Deployment</span>
            <h1 className="font-headline font-black text-6xl sm:text-7xl lg:text-8xl text-white uppercase tracking-tighter leading-none shadow-sm mb-4">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e6c364] to-[#c9a84c]">Lineup</span>
            </h1>
            <p className="max-w-md text-white/50 font-body text-sm leading-relaxed border-l-2 border-[#e6c364]/30 pl-4 uppercase tracking-widest font-bold">
              {isCurrent ? 'The Golden Army representing GodLike Esports in active operations.' : 'Honoring the former operatives of the Golden Army.'}
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#13110e]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
             <div className="flex flex-col">
                <span className="font-label text-[#e6c364]/60 uppercase tracking-widest text-[10px] mb-1">Total Operators</span>
                <span className="font-headline font-black text-4xl text-white">{String(teamSize).padStart(2, '0')}</span>
             </div>
             <span className="material-symbols-outlined text-[#e6c364]/20 text-5xl ml-4">groups</span>
          </div>
        </div>

        {/* ═══ SLEEK GLASS TAB CONTROLS ═══ */}
        <div className="flex gap-4 mb-12">
          <button
            onClick={() => setActiveTab('current')}
            className={`relative px-8 py-4 rounded-2xl font-headline font-bold text-sm tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden group ${
              isCurrent ? 'text-[#0a0a0a]' : 'text-white/40 hover:text-white bg-[#131313]/50 border border-white/5'
            }`}
          >
            {isCurrent && <div className="absolute inset-0 bg-gradient-to-r from-[#e6c364] to-[#c9a84c] rounded-2xl" />}
            <span className="relative z-10 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isCurrent ? 'bg-[#0a0a0a]' : 'bg-transparent'}`}></span>
              Active Force
            </span>
          </button>
          
          <button
            onClick={() => setActiveTab('previous')}
            className={`relative px-8 py-4 rounded-2xl font-headline font-bold text-sm tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden group ${
              !isCurrent ? 'text-[#0a0a0a]' : 'text-white/40 hover:text-white bg-[#131313]/50 border border-white/5'
            }`}
          >
            {!isCurrent && <div className="absolute inset-0 bg-gradient-to-r from-[#e6c364] to-[#c9a84c] rounded-2xl" />}
            <span className="relative z-10 flex items-center gap-2">
              Previous Roster
            </span>
          </button>
        </div>

        {/* ═══ BENTO GRID PLAYER CARDS ═══ */}
        <div className="transition-all duration-500 ease-in-out" key={activeTab}>
          {isCurrent ? (
            activePlayers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {activePlayers.map((p, i) => (
                  <PlayerCard key={p.id} player={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="bg-[#131313]/30 border border-white/5 rounded-3xl p-16 text-center">
                <span className="material-symbols-outlined text-white/20 text-6xl mb-4">group_off</span>
                <p className="font-headline text-xl text-white/40 uppercase tracking-widest">No active operatives deployed.</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {previousPlayers.map((p, i) => (
                <PlayerCard key={p.id} player={p} index={i} inactive />
              ))}
            </div>
          )}

          {/* ═══ TIMELINE BENTO ═══ */}
          <div className="mt-20 border-t border-white/5 pt-10">
             <Timeline events={isCurrent ? CURRENT_TIMELINE : PREVIOUS_TIMELINE} />
          </div>
        </div>

      </div>
    </div>
  );
}
