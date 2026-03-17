import React from 'react';
import { getFinishedMatches } from '../data/store';

export default function History() {
  const finished = getFinishedMatches();
  const wins = finished.filter(m => m.godlike_score > m.opponent_score).length;
  const losses = finished.length - wins;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider mb-2">
          Match <span className="text-accent">History</span>
        </h1>
        <p className="text-grey mb-8">All finished matches</p>

        {/* Summary */}
        <div className="flex gap-4 mb-10">
          <div className="bg-win/10 border border-win/30 rounded-xl px-6 py-4 text-center">
            <p className="text-win font-heading font-bold text-3xl">{wins}</p>
            <p className="text-win/70 text-sm uppercase tracking-wider">Wins</p>
          </div>
          <div className="bg-loss/10 border border-loss/30 rounded-xl px-6 py-4 text-center">
            <p className="text-loss font-heading font-bold text-3xl">{losses}</p>
            <p className="text-loss/70 text-sm uppercase tracking-wider">Losses</p>
          </div>
        </div>

        {/* Match list */}
        {finished.length > 0 ? (
          <div className="grid gap-3">
            {finished.map((m, i) => {
              const isWin = m.godlike_score > m.opponent_score;
              return (
                <div
                  key={m.id}
                  className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3 animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${isWin ? 'bg-win/20 text-win' : 'bg-loss/20 text-loss'}`}>
                      {isWin ? 'Win' : 'Loss'}
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-grey text-xs font-bold">{m.opponent.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <span className="font-heading font-semibold">{m.opponent}</span>
                    </div>
                  </div>
                  <span className="text-grey text-sm">{m.tournament}</span>
                  <div className="font-heading font-bold text-lg">
                    <span className="text-accent">{m.godlike_score}</span>
                    <span className="text-grey mx-1">-</span>
                    <span className="text-white">{m.opponent_score}</span>
                  </div>
                  <div className="flex items-center gap-3 text-grey text-sm">
                    <span>{m.kills} Kills</span>
                    <span>Rank #{m.rank}</span>
                  </div>
                  <span className="text-grey text-sm">{m.date}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-grey text-lg">No match history yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
