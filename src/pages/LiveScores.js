import React, { useState, useEffect, useCallback } from 'react';
import { getLiveMatch, getUpcomingMatches, getFinishedMatches } from '../data/store';

function Avatar({ text, color = 'accent' }) {
  const bg = color === 'accent' ? 'bg-accent/20' : 'bg-white/10';
  const tc = color === 'accent' ? 'text-accent' : 'text-grey';
  return (
    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${bg} flex items-center justify-center`}>
      <span className={`${tc} font-bold text-lg sm:text-xl`}>{text}</span>
    </div>
  );
}

function CountdownTimer({ targetDate }) {
  const calcTimeLeft = useCallback(() => {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return null;
    return {
      d: Math.floor(diff / (1000 * 60 * 60 * 24)),
      h: Math.floor((diff / (1000 * 60 * 60)) % 24),
      m: Math.floor((diff / (1000 * 60)) % 60),
      s: Math.floor((diff / 1000) % 60),
    };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calcTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calcTimeLeft]);

  if (!timeLeft) return <span className="text-accent text-sm">Starting soon...</span>;

  return (
    <div className="flex gap-3 mt-4">
      {[
        ['d', 'Days'],
        ['h', 'Hrs'],
        ['m', 'Min'],
        ['s', 'Sec'],
      ].map(([k, label]) => (
        <div key={k} className="text-center">
          <div className="stat-box rounded-lg px-3 py-2 min-w-[48px]">
            <span className="text-accent font-heading font-bold text-xl">{String(timeLeft[k]).padStart(2, '0')}</span>
          </div>
          <span className="text-grey text-xs mt-1 block">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default function LiveScores() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(interval);
  }, []);

  const live = getLiveMatch();
  const upcoming = getUpcomingMatches();
  const finished = getFinishedMatches();
  const nextUp = upcoming[0];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider mb-8">
          Live <span className="text-accent">Scores</span>
        </h1>

        {/* Hero card — LIVE or next upcoming */}
        {live ? (
          <div className="live-glow rounded-2xl p-6 sm:p-8 bg-dark-card mb-12 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse-live" />
              <span className="text-green-400 font-heading font-bold text-sm uppercase tracking-widest">Live Now</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar text="GL" color="accent" />
                <span className="font-heading font-semibold text-white">GodLike FFM</span>
              </div>
              <div className="flex items-center gap-4 sm:gap-8">
                <span className="font-heading font-bold text-5xl sm:text-6xl text-accent">{live.godlike_score}</span>
                <span className="text-grey font-heading text-3xl">:</span>
                <span className="font-heading font-bold text-5xl sm:text-6xl text-white">{live.opponent_score}</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Avatar text={live.opponent.substring(0, 2).toUpperCase()} color="grey" />
                <span className="font-heading font-semibold text-white">{live.opponent}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6 flex-wrap">
              <div className="stat-box rounded-lg px-4 py-3 text-center">
                <p className="text-grey text-xs uppercase tracking-wider mb-1">Kills</p>
                <p className="text-accent font-heading font-bold text-2xl">{live.kills}</p>
              </div>
              <div className="stat-box rounded-lg px-4 py-3 text-center">
                <p className="text-grey text-xs uppercase tracking-wider mb-1">Rank</p>
                <p className="text-accent font-heading font-bold text-2xl">#{live.rank}</p>
              </div>
            </div>
            <div className="mt-4 text-grey text-sm">
              {live.tournament} &middot; {live.date}
            </div>
          </div>
        ) : nextUp ? (
          <div className="rounded-2xl p-6 sm:p-8 bg-dark-card border border-upcoming-blue/30 mb-12 animate-slide-up">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 bg-upcoming-blue rounded-full" />
              <span className="text-upcoming-blue font-heading font-bold text-sm uppercase tracking-widest">Next Match</span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-6">
              <div className="flex flex-col items-center gap-2">
                <Avatar text="GL" color="accent" />
                <span className="font-heading font-semibold text-white">GodLike FFM</span>
              </div>
              <div className="font-heading font-bold text-3xl text-grey">VS</div>
              <div className="flex flex-col items-center gap-2">
                <Avatar text={nextUp.opponent.substring(0, 2).toUpperCase()} color="grey" />
                <span className="font-heading font-semibold text-white">{nextUp.opponent}</span>
              </div>
            </div>
            <div className="flex flex-col items-center mt-6">
              <p className="text-grey text-sm mb-2">Starts in</p>
              <CountdownTimer targetDate={`${nextUp.date}T${nextUp.time}`} />
            </div>
            <div className="mt-4 text-grey text-sm text-center">
              {nextUp.tournament} &middot; {nextUp.date} at {nextUp.time}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-8 bg-dark-card border border-dark-border mb-12 text-center">
            <p className="text-grey text-lg">No matches scheduled</p>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="mb-12">
            <h2 className="font-heading font-bold text-2xl text-white uppercase tracking-wider mb-4">Upcoming</h2>
            <div className="grid gap-3">
              {upcoming.map(m => (
                <div key={m.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-1 rounded bg-upcoming-blue/20 text-upcoming-blue uppercase">Upcoming</span>
                    <span className="text-grey text-sm">{m.tournament}</span>
                  </div>
                  <div className="font-heading font-semibold">
                    GodLike FFM <span className="text-grey mx-2">vs</span> {m.opponent}
                  </div>
                  <span className="text-grey text-sm">{m.date} at {m.time}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Finished */}
        {finished.length > 0 && (
          <section>
            <h2 className="font-heading font-bold text-2xl text-white uppercase tracking-wider mb-4">Finished</h2>
            <div className="grid gap-3">
              {finished.map(m => {
                const isWin = m.godlike_score > m.opponent_score;
                return (
                  <div key={m.id} className="bg-dark-card border border-dark-border rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${isWin ? 'bg-win/20 text-win' : 'bg-loss/20 text-loss'}`}>
                        {isWin ? 'Win' : 'Loss'}
                      </span>
                      <span className="text-grey text-sm">{m.tournament}</span>
                    </div>
                    <div className="font-heading font-semibold">
                      GodLike FFM
                      <span className="text-accent mx-2">{m.godlike_score}</span>
                      <span className="text-grey">-</span>
                      <span className="text-white mx-2">{m.opponent_score}</span>
                      {m.opponent}
                    </div>
                    <div className="flex items-center gap-3 text-grey text-sm">
                      <span>{m.kills} Kills</span>
                      <span>Rank #{m.rank}</span>
                      <span>{m.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
