import React from 'react';
import { Link } from 'react-router-dom';
import { getLiveMatch, getFinishedMatches } from '../data/store';

function MatchResultCard({ match }) {
  const isWin = match.godlike_score > match.opponent_score;
  return (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-grey uppercase tracking-wider">{match.tournament}</span>
        <span className={`text-xs font-bold px-2 py-1 rounded ${isWin ? 'bg-win/20 text-win' : 'bg-loss/20 text-loss'}`}>
          {isWin ? 'WIN' : 'LOSS'}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-accent font-bold text-sm">GL</span>
          </div>
          <span className="font-heading font-semibold">GodLike FFM</span>
        </div>
        <div className="flex items-center gap-3 font-heading text-2xl font-bold">
          <span className="text-accent">{match.godlike_score}</span>
          <span className="text-grey text-lg">-</span>
          <span className="text-white">{match.opponent_score}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-heading font-semibold">{match.opponent}</span>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-grey font-bold text-sm">{match.opponent.substring(0, 2).toUpperCase()}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 mt-4 text-sm text-grey">
        <span>{match.kills} Kills</span>
        <span>Rank #{match.rank}</span>
        <span>{match.date}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const live = getLiveMatch();
  const finished = getFinishedMatches();
  const latestFinished = finished[0];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent" />
        <div className="relative z-10">
          <h1 className="font-heading font-bold text-7xl sm:text-8xl md:text-9xl leading-none mb-2 tracking-tight">
            <span className="text-white">GODLIKE</span>
            <br />
            <span className="text-accent">FFM</span>
          </h1>
          <p className="text-grey text-lg sm:text-xl mt-4 mb-8 font-body">
            Professional Free Fire Mobile Esports
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/live"
              className="px-8 py-3 bg-accent hover:bg-accent-dark text-white font-heading font-semibold text-lg rounded-lg transition no-underline"
            >
              Live Scores
            </Link>
            <Link
              to="/roster"
              className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-dark font-heading font-semibold text-lg rounded-lg transition no-underline"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Live banner */}
      {live && (
        <Link to="/live" className="block no-underline">
          <div className="max-w-3xl mx-auto px-4 mb-12">
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

      {/* Latest result */}
      {latestFinished && (
        <section className="max-w-3xl mx-auto px-4 mb-16">
          <h2 className="font-heading font-bold text-2xl text-white mb-4 uppercase tracking-wider">Latest Result</h2>
          <MatchResultCard match={latestFinished} />
        </section>
      )}
    </div>
  );
}
