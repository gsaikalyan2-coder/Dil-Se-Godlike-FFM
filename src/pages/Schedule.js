import React from 'react';
import { getUpcomingMatches } from '../data/store';

export default function Schedule() {
  const upcoming = getUpcomingMatches();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider mb-2">
          Match <span className="text-accent">Schedule</span>
        </h1>
        <p className="text-grey mb-10">Upcoming matches sorted by date</p>

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
