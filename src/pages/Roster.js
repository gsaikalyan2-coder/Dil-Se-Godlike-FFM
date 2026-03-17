import React from 'react';
import { getActivePlayers } from '../data/store';

const roleColors = {
  IGL: 'bg-accent/20 text-accent',
  Sniper: 'bg-red-500/20 text-red-400',
  Assaulter: 'bg-yellow-500/20 text-yellow-400',
  Support: 'bg-blue-500/20 text-blue-400',
  'Entry Fragger': 'bg-purple-500/20 text-purple-400',
};

export default function Roster() {
  const players = getActivePlayers();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider mb-2">
          Our <span className="text-accent">Squad</span>
        </h1>
        <p className="text-grey mb-10">The roster powering GodLike FFM</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((p, i) => (
            <div
              key={p.id}
              className="bg-dark-card border border-dark-border rounded-2xl p-6 hover:border-accent/30 transition group animate-slide-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex flex-col items-center text-center">
                {p.photo_url ? (
                  <img
                    src={p.photo_url}
                    alt={p.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-accent/30 mb-4"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mb-4 group-hover:bg-accent/30 transition">
                    <span className="text-accent font-heading font-bold text-2xl">
                      {p.game_name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                <h3 className="font-heading font-bold text-xl text-white">{p.name}</h3>
                <p className="text-accent font-heading font-semibold text-lg">{p.game_name}</p>
                <span className={`text-xs font-bold px-3 py-1 rounded-full mt-2 ${roleColors[p.role] || 'bg-grey/20 text-grey'}`}>
                  {p.role}
                </span>
                <p className="text-grey text-sm mt-3">{p.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="text-center py-16">
            <p className="text-grey text-lg">No active players</p>
          </div>
        )}
      </div>
    </div>
  );
}
