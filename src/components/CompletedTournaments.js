import React, { useState } from 'react';
import {
  godlikeOverallStats, teamLogos,
  ffmic2025, ffmicBrGodlike, ffmicBrFinals, ffmicCsGodlike, ffmicCsBracket, ffmicCsPrizes,
  ffmai2025, ffmaiBrGodlike, ffmaiBrFinals, ffmaiCsGodlike, ffmaiCsPrizes,
  lidomaEndless2025, lidomaIndiaStage, lidomaSouthAsia, lidomaSouthAsiaStandings,
  lidomaSouthAsiaMatchBreakdown, lidomaAsiaClash, lidomaAsiaPlayoffs, lidomaAsiaFinals,
  godlikeLidomaSummary,
  zeeMediaAOC, aocFormat, aocGodlikeJourney, aocGrandFinalsStandings, aocNotableEvents, aocYoutubeVODs,
  iqooProS3, iqooPS3Format, iqooPS3GodlikeJourney, iqooPS3GrandFinalsStandings,
  iqooPS3GodlikeDayByDay, iqooPS3GodlikeAnalysis, iqooPS3VODs,
  ngAsiaChamp, ngACFormat, ngACGodlikeJourney, ngACSemifinalsStandings,
  ngACGrandFinalsStandings, ngACGodlikeAnalysis, ngACBroadcast,
  prgSurvivorSeries, prgGodlikeJourney, prgGroup1Standings, prgGrandFinalsStandings, prgGodlikeAnalysis,
  rapidDignityCup, rapidGFStandings, rapidGodlikeJourney, rapidGodlikeAnalysis,
  lidomaRegionalWars, lidomaRWFormat, lidomaRWGodlikeJourney, lidomaRWPlayoffsStandings,
  lidomaRWLastChanceStandings, lidomaRWGrandFinalsStandings, lidomaRWGodlikeAnalysis,
  oneBladeInferno, oneBladeFormat, oneBladeGodlikeJourney, oneBladePlayInsGroupB,
  oneBladeGrandFinalsStandings, oneBladeGodlikeAnalysis,
  urbanskySeries, urbanskyFormat, urbanskyGodlikeJourney,
  urbanskyGrandFinalsStandings, urbanskyGodlikeAnalysis,
  rbzRegionalBR, rbzBRFormat, rbzBRGodlikeJourney, rbzBRGrandFinalsStandings,
  rbzBRGodlikeAnalysis, rbzBRVODs,
  rbzRegionalCS, rbzCSFormat, rbzCSGodlikeJourney, rbzCSGodlikeAnalysis, rbzCSVODs
} from '../data/tournaments';

/* ═══════════════════════════════════════════
   COUNTRY FLAG EMOJI HELPER
   ═══════════════════════════════════════════ */
const countryFlags = {
  'India': '\u{1F1EE}\u{1F1F3}', 'Thailand': '\u{1F1F9}\u{1F1ED}', 'Indonesia': '\u{1F1EE}\u{1F1E9}',
  'Vietnam': '\u{1F1FB}\u{1F1F3}', 'Nepal': '\u{1F1F3}\u{1F1F5}', 'Bangladesh': '\u{1F1E7}\u{1F1E9}',
  'Pakistan': '\u{1F1F5}\u{1F1F0}'
};

/* ═══════════════════════════════════════════
   RANK COLORS & STYLING HELPERS
   ═══════════════════════════════════════════ */
function getRankStyle(rank) {
  const r = Number(rank);
  if (r === 1) return {
    bg: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(201,168,76,0.08))',
    border: 'rgba(201,168,76,0.5)',
    numColor: '#c9a84c',
    glow: '0 0 20px rgba(201,168,76,0.15)',
    icon: '\u{1F3C6}', // trophy
  };
  if (r === 2) return {
    bg: 'linear-gradient(135deg, rgba(192,192,192,0.15), rgba(192,192,192,0.04))',
    border: 'rgba(192,192,192,0.35)',
    numColor: '#c0c0c0',
    glow: '0 0 15px rgba(192,192,192,0.1)',
    icon: '\u{1F948}', // silver medal
  };
  if (r === 3) return {
    bg: 'linear-gradient(135deg, rgba(205,127,50,0.15), rgba(205,127,50,0.04))',
    border: 'rgba(205,127,50,0.35)',
    numColor: '#cd7f32',
    glow: '0 0 15px rgba(205,127,50,0.1)',
    icon: '\u{1F949}', // bronze medal
  };
  return {
    bg: '#111010',
    border: 'rgba(255,255,255,0.04)',
    numColor: '#555',
    glow: 'none',
    icon: null,
  };
}

/* ═══════════════════════════════════════════
   TEAM LOGO COMPONENT
   ═══════════════════════════════════════════ */
function TeamLogo({ team, size = 32 }) {
  const logo = teamLogos[team];
  if (logo) {
    return (
      <div
        className="flex-shrink-0 rounded-lg flex items-center justify-center overflow-hidden"
        style={{
          width: size, height: size,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <img
          src={logo}
          alt={team}
          className="object-contain"
          style={{ width: size - 6, height: size - 6 }}
          onError={e => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<span style="color:#8b7a4a;font-size:${size/2.5}px;font-weight:700">${(team||'?')[0]}</span>`; }}
        />
      </div>
    );
  }
  return (
    <div
      className="flex-shrink-0 rounded-lg flex items-center justify-center"
      style={{
        width: size, height: size,
        background: 'rgba(201,168,76,0.08)',
        border: '1px solid rgba(201,168,76,0.12)',
      }}
    >
      <span className="font-bold" style={{ color: '#8b7a4a', fontSize: size / 2.5 }}>{(team || '?')[0]}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   STAT CARD — small summary cards
   ═══════════════════════════════════════════ */
function StatCard({ label, value, sub }) {
  return (
    <div
      className="rounded-2xl p-5 transition-all duration-300"
      style={{
        background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)',
        border: '1px solid rgba(201, 168, 76, 0.15)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.border = '1px solid rgba(201, 168, 76, 0.35)';
        e.currentTarget.style.boxShadow = '0 0 20px rgba(201, 168, 76, 0.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.border = '1px solid rgba(201, 168, 76, 0.15)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] font-medium mb-2" style={{ color: '#8b7a4a' }}>{label}</p>
      <p className="font-heading font-bold text-2xl" style={{ color: '#c9a84c' }}>{value}</p>
      {sub && <p className="text-xs mt-1" style={{ color: '#666' }}>{sub}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STANDINGS TABLE — Premium Esports Design
   ═══════════════════════════════════════════ */
function StandingsTable({ data, showCountry = false }) {
  return (
    <div className="space-y-1.5">
      {/* Header Row */}
      <div
        className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(201,168,76,0.1)',
          color: '#8b7a4a',
        }}
      >
        <div style={{ width: '3.5rem' }} className="text-center">#</div>
        <div className="flex-1">Team</div>
        {showCountry && <div style={{ width: '5.5rem' }}>Region</div>}
        <div style={{ width: '4.5rem' }} className="text-center">Pts</div>
        <div style={{ width: '5rem' }} className="text-center">Booyahs</div>
        <div style={{ width: '6rem' }} className="text-right">Prize</div>
      </div>

      {/* Data Rows */}
      {data.map((row, i) => {
        const rankStyle = getRankStyle(row.rank);
        const isTop3 = Number(row.rank) <= 3;
        const isGL = row.isGodlike;

        return (
          <div
            key={i}
            className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-default"
            style={{
              background: isGL
                ? 'linear-gradient(90deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.03) 100%)'
                : rankStyle.bg,
              border: `1px solid ${isGL ? 'rgba(201,168,76,0.4)' : rankStyle.border}`,
              boxShadow: isGL ? '0 0 25px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)' : rankStyle.glow,
              animationDelay: `${i * 50}ms`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isGL
                ? '0 8px 30px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.15)'
                : isTop3
                  ? `0 8px 25px ${rankStyle.border}`
                  : '0 8px 20px rgba(0,0,0,0.3)';
              if (!isGL) e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isGL ? '0 0 25px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)' : rankStyle.glow;
              if (!isGL) e.currentTarget.style.borderColor = rankStyle.border;
            }}
          >
            {/* Rank */}
            <div style={{ width: '3.5rem' }} className="flex items-center justify-center gap-1 flex-shrink-0">
              {rankStyle.icon && <span className="text-base">{rankStyle.icon}</span>}
              <span className="font-heading font-black text-lg" style={{ color: rankStyle.numColor }}>
                {String(row.rank)}
              </span>
            </div>

            {/* Team */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <TeamLogo team={row.team} size={36} />
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm truncate" style={{ color: isGL ? '#c9a84c' : '#fff' }}>
                  {row.team}
                </p>
                {row.note && (
                  <p className="text-[10px] truncate mt-0.5" style={{ color: '#666' }}>{row.note}</p>
                )}
                {/* Mobile-only stats */}
                <div className="flex items-center gap-3 mt-1 sm:hidden">
                  {showCountry && row.country && (
                    <span className="text-[10px]" style={{ color: '#888' }}>{countryFlags[row.country] || ''} {row.country}</span>
                  )}
                  <span className="text-[10px]" style={{ color: '#8b7a4a' }}>Pts: <strong style={{ color: '#c9a84c' }}>{row.points ?? '—'}</strong></span>
                  <span className="text-[10px]" style={{ color: '#8b7a4a' }}>{row.prize || ''}</span>
                </div>
              </div>
            </div>

            {/* Region (desktop) */}
            {showCountry && (
              <div style={{ width: '5.5rem' }} className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                <span className="text-sm">{countryFlags[row.country] || ''}</span>
                <span className="text-xs font-medium" style={{ color: '#999' }}>{row.country || '—'}</span>
              </div>
            )}

            {/* Points (desktop) */}
            <div style={{ width: '4.5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
              <span
                className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-heading font-bold text-sm"
                style={{
                  background: row.points ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: row.points ? '#c9a84c' : '#333',
                  border: row.points ? '1px solid rgba(201,168,76,0.15)' : 'none',
                }}
              >
                {row.points ?? '—'}
              </span>
            </div>

            {/* Booyahs (desktop) */}
            <div style={{ width: '5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-medium" style={{ color: row.booyahs ? '#b0a080' : '#333' }}>
                {row.booyahs ?? '—'}
              </span>
            </div>

            {/* Prize (desktop) */}
            <div style={{ width: '6rem' }} className="hidden sm:flex items-center justify-end flex-shrink-0">
              <span
                className="inline-flex items-center px-3 py-1 rounded-lg font-heading font-bold text-xs"
                style={{
                  background: row.prize ? 'rgba(34,197,94,0.08)' : 'transparent',
                  color: row.prize ? '#4ade80' : '#333',
                  border: row.prize ? '1px solid rgba(34,197,94,0.12)' : 'none',
                }}
              >
                {row.prize || '—'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PRIZE TABLE — Premium Reusable for CS
   ═══════════════════════════════════════════ */
function PrizeTable({ data, showCountry = false }) {
  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div
        className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
          border: '1px solid rgba(201,168,76,0.1)',
          color: '#8b7a4a',
        }}
      >
        <div style={{ width: '3.5rem' }} className="text-center">#</div>
        <div className="flex-1">Team</div>
        {showCountry && <div style={{ width: '5.5rem' }}>Region</div>}
        <div style={{ width: '6rem' }} className="text-right">Prize</div>
      </div>

      {/* Rows */}
      {data.map((row, i) => {
        const rankStyle = getRankStyle(Number(String(row.rank).replace(/[^0-9]/g, '')) || 99);
        const isGL = row.isGodlike;

        return (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-default"
            style={{
              background: isGL
                ? 'linear-gradient(90deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.03) 100%)'
                : rankStyle.bg,
              border: `1px solid ${isGL ? 'rgba(201,168,76,0.4)' : rankStyle.border}`,
              boxShadow: isGL ? '0 0 25px rgba(201,168,76,0.1)' : 'none',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = isGL ? '0 6px 25px rgba(201,168,76,0.15)' : '0 6px 20px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isGL ? '0 0 25px rgba(201,168,76,0.1)' : 'none';
            }}
          >
            {/* Rank */}
            <div style={{ width: '3.5rem' }} className="flex items-center justify-center gap-1 flex-shrink-0">
              {rankStyle.icon && <span className="text-sm">{rankStyle.icon}</span>}
              <span className="font-heading font-black text-base" style={{ color: rankStyle.numColor }}>
                {String(row.rank)}
              </span>
            </div>

            {/* Team */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <TeamLogo team={row.team} size={32} />
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm truncate" style={{ color: isGL ? '#c9a84c' : '#fff' }}>
                  {row.team}
                </p>
                {/* Mobile stats */}
                <div className="flex items-center gap-3 mt-0.5 sm:hidden">
                  {showCountry && row.country && (
                    <span className="text-[10px]" style={{ color: '#888' }}>{countryFlags[row.country] || ''} {row.country}</span>
                  )}
                  <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>{row.prize}</span>
                </div>
              </div>
            </div>

            {/* Region (desktop) */}
            {showCountry && (
              <div style={{ width: '5.5rem' }} className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
                <span className="text-sm">{countryFlags[row.country] || ''}</span>
                <span className="text-xs font-medium" style={{ color: '#999' }}>{row.country || '—'}</span>
              </div>
            )}

            {/* Prize (desktop) */}
            <div style={{ width: '6rem' }} className="hidden sm:flex items-center justify-end flex-shrink-0">
              <span
                className="inline-flex items-center px-3 py-1 rounded-lg font-heading font-bold text-xs"
                style={{
                  background: 'rgba(34,197,94,0.08)',
                  color: '#4ade80',
                  border: '1px solid rgba(34,197,94,0.12)',
                }}
              >
                {row.prize}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   JOURNEY TIMELINE — stage progression
   ═══════════════════════════════════════════ */
function JourneyTimeline({ stages }) {
  return (
    <div className="relative pl-8">
      {/* Vertical line */}
      <div className="absolute left-3 top-2 bottom-2 w-0.5" style={{ background: 'linear-gradient(to bottom, #c9a84c, #8b7a4a33)' }} />

      {stages.map((stage, i) => (
        <div key={i} className="relative mb-6 last:mb-0">
          {/* Dot */}
          <div
            className="absolute -left-5 top-1 w-3 h-3 rounded-full border-2"
            style={{
              borderColor: stage.qualified === false ? '#ef4444' : '#c9a84c',
              background: stage.qualified === false ? '#ef4444' : '#c9a84c',
            }}
          />

          <div
            className="rounded-xl p-4 transition-all duration-200"
            style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h4 className="font-heading font-bold text-sm uppercase" style={{ color: '#c9a84c' }}>{stage.stage}</h4>
              {stage.qualified !== undefined && (
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{
                    background: stage.qualified ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                    color: stage.qualified ? '#22c55e' : '#ef4444',
                    border: `1px solid ${stage.qualified ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                  }}
                >
                  {stage.qualified ? 'QUALIFIED' : 'ELIMINATED'}
                </span>
              )}
            </div>

            <p className="text-xs mb-2" style={{ color: '#888' }}>{stage.date || stage.dates}</p>

            <div className="flex flex-wrap gap-4 text-xs">
              {stage.position && <span style={{ color: '#b0a080' }}>Position: <strong style={{ color: '#c9a84c' }}>#{stage.position}</strong></span>}
              {stage.points && <span style={{ color: '#b0a080' }}>Points: <strong style={{ color: '#c9a84c' }}>{stage.points}</strong></span>}
              {stage.booyahs !== undefined && stage.booyahs !== null && <span style={{ color: '#b0a080' }}>Booyahs: <strong style={{ color: '#c9a84c' }}>{stage.booyahs}</strong></span>}
              {stage.kills && <span style={{ color: '#b0a080' }}>Kills: <strong style={{ color: '#c9a84c' }}>{stage.kills}</strong></span>}
              {stage.matches && <span style={{ color: '#b0a080' }}>Matches: <strong style={{ color: '#c9a84c' }}>{stage.matches}</strong></span>}
              {stage.prizeMoney && <span style={{ color: '#b0a080' }}>Prize: <strong style={{ color: '#c9a84c' }}>{stage.prizeMoney}</strong></span>}
            </div>

            {stage.result && <p className="text-xs mt-2 italic" style={{ color: '#666' }}>{stage.result}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   BRACKET VIEW — CS knockout bracket
   ═══════════════════════════════════════════ */
function BracketView({ bracket }) {
  const BracketMatch = ({ label, match, isGrandFinal = false }) => (
    <div
      className="rounded-xl p-4 transition-all duration-300"
      style={{
        background: isGrandFinal ? 'linear-gradient(145deg, #1a1710, #141210)' : '#141210',
        border: isGrandFinal ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(201,168,76,0.1)',
        boxShadow: isGrandFinal ? '0 0 30px rgba(201,168,76,0.08)' : 'none',
      }}
    >
      <p className="text-[10px] uppercase tracking-wider font-bold mb-3" style={{ color: isGrandFinal ? '#c9a84c' : '#8b7a4a' }}>
        {isGrandFinal && '\u{1F3C6} '}{label}
      </p>
      {[match.team1, match.team2].map((team, idx) => {
        const isWinner = team === match.winner;
        const isGL = team === 'GodLike Esports';
        return (
          <div
            key={idx}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg mb-1.5"
            style={{
              background: isWinner ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.02)',
              borderLeft: isGL ? '3px solid #c9a84c' : '3px solid transparent',
              border: isWinner ? '1px solid rgba(34,197,94,0.15)' : '1px solid rgba(255,255,255,0.03)',
              borderLeftWidth: isGL ? '3px' : undefined,
              borderLeftColor: isGL ? '#c9a84c' : undefined,
            }}
          >
            <div className="flex items-center gap-2.5">
              <TeamLogo team={team} size={24} />
              <span className="text-sm font-heading font-semibold" style={{ color: isGL ? '#c9a84c' : '#fff' }}>
                {team}
              </span>
            </div>
            {isWinner && (
              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>
                WIN
              </span>
            )}
          </div>
        );
      })}
      <div className="text-center mt-3 pt-2" style={{ borderTop: '1px solid rgba(201,168,76,0.08)' }}>
        <span className="font-heading font-bold text-sm" style={{ color: '#c9a84c' }}>{match.score}</span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <BracketMatch label="Semi-Final 1" match={bracket.semiFinal1} />
      <BracketMatch label="Grand Final" match={bracket.grandFinal} isGrandFinal />
      <BracketMatch label="Semi-Final 2" match={bracket.semiFinal2} />
    </div>
  );
}

/* ═══════════════════════════════════════════
   MATCH SCORE CARD — CS round-by-round
   ═══════════════════════════════════════════ */
function MatchScoreCard({ matchData }) {
  return (
    <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-heading font-bold text-sm" style={{ color: '#c9a84c' }}>{matchData.stage}</h4>
          <p className="text-xs" style={{ color: '#888' }}>vs {matchData.opponent} • {matchData.format}</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-heading font-bold" style={{ color: matchData.result === 'WIN' ? '#22c55e' : '#ef4444' }}>
            {matchData.score}
          </span>
          <span className="block text-[9px] font-bold uppercase tracking-wider" style={{ color: matchData.result === 'WIN' ? '#22c55e' : '#ef4444' }}>
            {matchData.result}
          </span>
        </div>
      </div>

      {matchData.roundByRound && (
        <div className="flex gap-2 flex-wrap">
          {matchData.roundByRound.map((round, i) => (
            <div
              key={i}
              className="flex-1 min-w-[60px] rounded-lg p-2 text-center"
              style={{
                background: round.result === 'WIN' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${round.result === 'WIN' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}
            >
              <p className="text-[9px] uppercase font-bold mb-1" style={{ color: '#888' }}>R{round.round}</p>
              <p className="text-xs font-bold" style={{ color: round.result === 'WIN' ? '#22c55e' : '#ef4444' }}>
                {round.result}
              </p>
              {round.mapScore && <p className="text-[10px] mt-0.5" style={{ color: '#666' }}>{round.mapScore}</p>}
            </div>
          ))}
        </div>
      )}

      {matchData.details && <p className="text-xs mt-3 italic" style={{ color: '#666' }}>{matchData.details}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   CS SWISS STAGE — match results
   ═══════════════════════════════════════════ */
function SwissStageResults({ data }) {
  return (
    <div className="space-y-1.5">
      {data.results.map((m, i) => (
        <div
          key={i}
          className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200"
          style={{ background: '#111010', border: '1px solid rgba(255,255,255,0.04)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2 py-0.5 rounded-md" style={{ background: 'rgba(201,168,76,0.08)', color: '#8b7a4a' }}>M{m.match}</span>
            <div className="flex items-center gap-2">
              <TeamLogo team={m.opponent} size={24} />
              <span className="text-sm font-heading font-medium text-white">{m.opponent}</span>
            </div>
          </div>
          <span
            className="text-xs font-bold uppercase px-3 py-1 rounded-lg"
            style={{
              background: m.result === 'WIN' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color: m.result === 'WIN' ? '#22c55e' : '#ef4444',
              border: `1px solid ${m.result === 'WIN' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
            }}
          >
            {m.result}
          </span>
        </div>
      ))}
      {/* Record Summary */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.15)' }}
      >
        <span className="text-xs font-heading font-bold" style={{ color: '#c9a84c' }}>Record: {data.record}</span>
        <span
          className="text-[9px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full"
          style={{
            background: data.qualified ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: data.qualified ? '#22c55e' : '#ef4444',
            border: `1px solid ${data.qualified ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
          }}
        >
          {data.qualified ? 'QUALIFIED' : 'ELIMINATED'}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOURNAMENT SECTION — per tournament
   ═══════════════════════════════════════════ */
function TournamentSection({ tournament, brContent, csContent }) {
  const [activeMode, setActiveMode] = useState('br');

  return (
    <div className="mb-12">
      {/* Tournament Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>
                {tournament.shortName}
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>
                {tournament.status}
              </span>
              {tournament.scope && (
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                  {tournament.scope}
                </span>
              )}
            </div>
            <p className="text-sm text-white font-heading">{tournament.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{tournament.dates} • {tournament.location}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{tournament.totalPrizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>BR: {tournament.brPrizePool} • CS: {tournament.csPrizePool}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: '#888' }}>
          <span>Teams: <strong className="text-white">{tournament.totalTeams}</strong></span>
          <span>Format: <strong className="text-white">{tournament.format}</strong></span>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'br', label: 'Battle Royale' },
          { key: 'cs', label: 'Clash Squad' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveMode(tab.key)}
            className="px-5 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300"
            style={{
              background: activeMode === tab.key ? 'linear-gradient(135deg, #c9a84c, #a68a3e)' : '#1a1710',
              color: activeMode === tab.key ? '#0d0d0f' : '#8b7a4a',
              border: activeMode === tab.key ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.15)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        {activeMode === 'br' ? brContent : csContent}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FFMIC BR CONTENT
   ═══════════════════════════════════════════ */
function FfmicBrContent() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          GodLike's BR Journey
        </h4>
        <JourneyTimeline stages={[ffmicBrGodlike.qualifiers, ffmicBrGodlike.leagueStage, ffmicBrGodlike.grandFinals]} />
      </div>

      {/* Weekly Performance */}
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          League Stage Weekly Performance
        </h4>
        <div className="space-y-1.5">
          {/* Header */}
          <div
            className="hidden sm:grid grid-cols-6 gap-4 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold"
            style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.1)', color: '#8b7a4a' }}
          >
            <div>Week</div><div className="text-center">Matches</div><div className="text-center">Points</div><div className="text-center">Rank</div><div className="text-center">Booyahs</div><div className="text-center">Kills</div>
          </div>
          {ffmicBrGodlike.leagueStage.weeklyPerformance.map((w, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 px-4 py-3 rounded-xl items-center transition-all duration-200"
              style={{ background: '#111010', border: '1px solid rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'; }}
            >
              <div className="text-sm font-heading font-medium text-white">{w.week}</div>
              <div className="text-center text-sm" style={{ color: '#888' }}>{w.matches}</div>
              <div className="text-center">
                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md font-bold text-sm" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c' }}>
                  {w.points}
                </span>
              </div>
              <div className="text-center text-sm font-medium" style={{ color: '#b0a080' }}>#{w.rank}</div>
              <div className="text-center text-sm" style={{ color: '#888' }}>{w.booyahs ?? '—'}</div>
              <div className="text-center text-sm" style={{ color: '#888' }}>{w.kills ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          BR Grand Finals Standings
        </h4>
        <StandingsTable data={ffmicBrFinals} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FFMIC CS CONTENT
   ═══════════════════════════════════════════ */
function FfmicCsContent() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Swiss Stage Results
        </h4>
        <SwissStageResults data={ffmicCsGodlike.swissStage} />
      </div>

      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Finals Bracket
        </h4>
        <BracketView bracket={ffmicCsBracket} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MatchScoreCard matchData={ffmicCsGodlike.semiFinal} />
        <MatchScoreCard matchData={ffmicCsGodlike.grandFinal} />
      </div>

      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          CS Prize Distribution
        </h4>
        <PrizeTable data={ffmicCsPrizes} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FFMAI BR CONTENT
   ═══════════════════════════════════════════ */
function FfmaiBrContent() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          GodLike's BR Journey
        </h4>
        <JourneyTimeline stages={[ffmaiBrGodlike.playIns, ffmaiBrGodlike.mainEvent, ffmaiBrGodlike.grandFinals]} />
      </div>

      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          BR Grand Finals Standings
        </h4>
        <StandingsTable data={ffmaiBrFinals} showCountry />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FFMAI CS CONTENT
   ═══════════════════════════════════════════ */
function FfmaiCsContent() {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          GodLike's CS Journey
        </h4>
        <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-heading font-bold text-sm" style={{ color: '#c9a84c' }}>{ffmaiCsGodlike.qualifier.stage}</h4>
              <p className="text-xs" style={{ color: '#888' }}>vs {ffmaiCsGodlike.qualifier.opponent} • {ffmaiCsGodlike.qualifier.format}</p>
              <p className="text-xs" style={{ color: '#888' }}>{ffmaiCsGodlike.qualifier.date}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                ELIMINATED
              </span>
            </div>
          </div>
          <p className="text-xs italic" style={{ color: '#666' }}>{ffmaiCsGodlike.qualifier.finalResult}</p>
          <p className="text-xs mt-2" style={{ color: '#b0a080' }}>
            Placement: <strong style={{ color: '#c9a84c' }}>{ffmaiCsGodlike.finalPlacement}</strong> • Prize: <strong style={{ color: '#c9a84c' }}>{ffmaiCsGodlike.prizeMoney}</strong>
          </p>
        </div>
      </div>

      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          CS Prize Distribution
        </h4>
        <PrizeTable data={ffmaiCsPrizes} showCountry />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   JOURNEY PROGRESS BAR — Lidoma stage progression
   ═══════════════════════════════════════════ */
function JourneyProgressBar({ stages }) {
  const statusStyles = {
    passed: { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
    podium: { color: '#c9a84c', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.25)' },
    eliminated: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
  };

  return (
    <div
      className="rounded-2xl p-5 mb-8"
      style={{ background: 'linear-gradient(145deg, #1a1710, #0f0e0c)', border: '1px solid rgba(201,168,76,0.15)' }}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-4" style={{ color: '#8b7a4a' }}>
        GodLike's Journey
      </p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0">
        {stages.map((s, i) => {
          const st = statusStyles[s.status] || statusStyles.passed;
          return (
            <React.Fragment key={i}>
              <div
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl flex-shrink-0"
                style={{ background: st.bg, border: `1px solid ${st.border}` }}
              >
                <span className="text-base">
                  {s.status === 'passed' ? '\u2705' : s.status === 'podium' ? '\u{1F948}' : '\u274C'}
                </span>
                <div>
                  <p className="text-xs font-heading font-bold" style={{ color: st.color }}>{s.stage}</p>
                  <p className="text-[10px]" style={{ color: '#666' }}>{s.result}</p>
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className="hidden sm:block flex-1 h-0.5 mx-2 min-w-[20px]" style={{ background: `linear-gradient(90deg, ${st.color}44, ${statusStyles[stages[i + 1].status]?.color || '#555'}44)` }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MATCH BREAKDOWN TABLE — game-by-game analysis
   ═══════════════════════════════════════════ */
function MatchBreakdownTable({ games, totalPoints, avgPoints }) {
  const getBarStyle = (pts) => {
    if (pts >= 15) return { bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.15)', bar: '#22c55e' };
    if (pts >= 5) return { bg: 'rgba(234,179,8,0.06)', border: 'rgba(234,179,8,0.12)', bar: '#eab308' };
    return { bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.12)', bar: '#ef4444' };
  };

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div
        className="hidden sm:grid grid-cols-12 gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.1)', color: '#8b7a4a' }}
      >
        <div className="col-span-2">Game</div>
        <div className="col-span-2 text-center">Placement</div>
        <div className="col-span-2 text-center">Points</div>
        <div className="col-span-3">Performance</div>
        <div className="col-span-3">Note</div>
      </div>

      {/* Rows */}
      {games.map((g, i) => {
        const colors = getBarStyle(g.totalPts);
        const barWidth = Math.min((g.totalPts / 22) * 100, 100);
        return (
          <div
            key={i}
            className="grid grid-cols-12 gap-3 px-4 py-3 rounded-xl items-center transition-all duration-200"
            style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <div className="col-span-2 text-sm font-heading font-bold" style={{ color: '#c9a84c' }}>
              Game {g.game}
            </div>
            <div className="col-span-2 text-center text-sm font-medium" style={{ color: '#b0a080' }}>
              {g.placement}
            </div>
            <div className="col-span-2 text-center">
              <span
                className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-lg font-bold text-sm"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                {g.totalPts}
              </span>
            </div>
            <div className="col-span-3 hidden sm:block">
              <div className="w-full h-2.5 rounded-full" style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${barWidth}%`, background: colors.bar, boxShadow: `0 0 8px ${colors.bar}44` }}
                />
              </div>
            </div>
            <div className="col-span-3 text-xs" style={{ color: '#666' }}>{g.note}</div>
          </div>
        );
      })}

      {/* Summary */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-xl mt-2"
        style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(201,168,76,0.03))', border: '1px solid rgba(201,168,76,0.2)' }}
      >
        <span className="text-sm font-heading font-bold" style={{ color: '#c9a84c' }}>
          Total: {totalPoints} pts ({games.length} games)
        </span>
        <span className="text-xs font-medium" style={{ color: '#8b7a4a' }}>
          Avg: {avgPoints} pts/game
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIDOMA STANDINGS TABLE — with qualification badges
   ═══════════════════════════════════════════ */
function LidomaStandingsTable({ data, showQualification = false }) {
  return (
    <div className="space-y-1.5">
      {/* Header */}
      <div
        className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold"
        style={{
          background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
          border: '1px solid rgba(201,168,76,0.1)',
          color: '#8b7a4a',
        }}
      >
        <div style={{ width: '3.5rem' }} className="text-center">#</div>
        <div className="flex-1">Team</div>
        <div style={{ width: '5.5rem' }}>Region</div>
        {data[0]?.points !== undefined && <div style={{ width: '4.5rem' }} className="text-center">Pts</div>}
        <div style={{ width: '6rem' }} className="text-right">Prize</div>
        {showQualification && <div style={{ width: '5rem' }} className="text-center">Status</div>}
      </div>

      {/* Rows */}
      {data.map((row, i) => {
        const rankStyle = getRankStyle(Number(String(row.rank).replace(/[^0-9]/g, '')) || 99);
        const isGL = row.isGodlike;

        return (
          <div
            key={i}
            className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-default"
            style={{
              background: isGL
                ? 'linear-gradient(90deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.03) 100%)'
                : rankStyle.bg,
              border: `1px solid ${isGL ? 'rgba(201,168,76,0.4)' : rankStyle.border}`,
              boxShadow: isGL ? '0 0 25px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)' : rankStyle.glow,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = isGL
                ? '0 8px 30px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.15)'
                : '0 8px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = isGL ? '0 0 25px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)' : rankStyle.glow;
            }}
          >
            {/* Rank */}
            <div style={{ width: '3.5rem' }} className="flex items-center justify-center gap-1 flex-shrink-0">
              {rankStyle.icon && <span className="text-base">{rankStyle.icon}</span>}
              <span className="font-heading font-black text-lg" style={{ color: rankStyle.numColor }}>
                {String(row.rank)}
              </span>
            </div>

            {/* Team */}
            <div className="flex-1 flex items-center gap-3 min-w-0">
              <TeamLogo team={row.team} size={36} />
              <div className="min-w-0">
                <p className="font-heading font-bold text-sm truncate" style={{ color: isGL ? '#c9a84c' : '#fff' }}>
                  {row.team}
                </p>
                {/* Mobile stats */}
                <div className="flex items-center gap-3 mt-1 sm:hidden">
                  <span className="text-[10px]" style={{ color: '#888' }}>{countryFlags[row.country] || ''} {row.country}</span>
                  {row.points !== undefined && (
                    <span className="text-[10px]" style={{ color: '#8b7a4a' }}>Pts: <strong style={{ color: '#c9a84c' }}>{row.points}</strong></span>
                  )}
                  {row.prize && <span className="text-[10px] font-bold" style={{ color: '#4ade80' }}>{row.prize}</span>}
                  {showQualification && (
                    <span className="text-[9px] font-bold" style={{ color: row.qualified ? '#22c55e' : '#555' }}>
                      {row.qualified ? 'QUALIFIED' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Region (desktop) */}
            <div style={{ width: '5.5rem' }} className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
              <span className="text-sm">{countryFlags[row.country] || ''}</span>
              <span className="text-xs font-medium" style={{ color: '#999' }}>{row.country || '—'}</span>
            </div>

            {/* Points (desktop) */}
            {row.points !== undefined && (
              <div style={{ width: '4.5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                <span
                  className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg font-heading font-bold text-sm"
                  style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.15)' }}
                >
                  {row.points}
                </span>
              </div>
            )}

            {/* Prize (desktop) */}
            <div style={{ width: '6rem' }} className="hidden sm:flex items-center justify-end flex-shrink-0">
              <span
                className="inline-flex items-center px-3 py-1 rounded-lg font-heading font-bold text-xs"
                style={{
                  background: row.prize ? 'rgba(34,197,94,0.08)' : 'transparent',
                  color: row.prize ? '#4ade80' : '#333',
                  border: row.prize ? '1px solid rgba(34,197,94,0.12)' : 'none',
                }}
              >
                {row.prize || '—'}
              </span>
            </div>

            {/* Qualification badge (desktop) */}
            {showQualification && (
              <div style={{ width: '5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                {row.qualified && (
                  <span
                    className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}
                  >
                    QUALIFIED
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIDOMA INDIA CONTENT
   ═══════════════════════════════════════════ */
function LidomaIndiaContent() {
  return (
    <div className="space-y-6">
      {/* Stage Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tier" value={lidomaIndiaStage.tier} sub={lidomaIndiaStage.dates} />
        <StatCard label="Teams" value={lidomaIndiaStage.totalTeams} sub={lidomaIndiaStage.location} />
        <StatCard label="Prize Pool" value={lidomaIndiaStage.prizePool} />
        <StatCard label="GodLike Result" value="Qualified" sub="Advanced to South Asia Stage" />
      </div>

      {/* Format */}
      <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Format
        </h4>
        <p className="text-sm" style={{ color: '#b0a080' }}>{lidomaIndiaStage.format}</p>
        <p className="text-xs mt-3 italic" style={{ color: '#666' }}>{lidomaIndiaStage.godlikeResult.note}</p>
      </div>

      {/* GodLike Status */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'linear-gradient(90deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))', border: '1px solid rgba(34,197,94,0.2)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{'\u2705'}</span>
          <div>
            <p className="font-heading font-bold text-sm" style={{ color: '#22c55e' }}>{lidomaIndiaStage.godlikeResult.result}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>GodLike was among the top teams advancing from the India Open stage</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIDOMA SOUTH ASIA CONTENT
   ═══════════════════════════════════════════ */
function LidomaSouthAsiaContent() {
  return (
    <div className="space-y-8">
      {/* Stage Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tier" value={lidomaSouthAsia.tier} sub={lidomaSouthAsia.dates} />
        <StatCard label="Teams" value={lidomaSouthAsia.totalTeams} sub={lidomaSouthAsia.location} />
        <StatCard label="Prize Pool" value={lidomaSouthAsia.prizePool} />
        <StatCard label="GodLike Result" value="2nd Place" sub="$1,250 + YOGI MVP ($150)" />
      </div>

      {/* GodLike Journey */}
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          GodLike's Journey
        </h4>
        <JourneyTimeline stages={[
          { stage: 'Group Stage', dates: lidomaSouthAsia.dates, points: null, position: null, qualified: true, result: 'Advanced to Playoffs' },
          { stage: 'Playoffs (24 matches)', dates: lidomaSouthAsia.dates, points: 79, matches: 6, qualified: true, result: 'Qualified for Grand Finals — 79 total points' },
          { stage: 'Grand Finals', dates: '21/08/2025', position: 2, qualified: true, prizeMoney: '$1,250', result: '2nd Place — Runner-Up behind Red Hawks' }
        ]} />
      </div>

      {/* Playoff Match Breakdown */}
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Playoff Game-by-Game Breakdown
        </h4>
        <MatchBreakdownTable
          games={lidomaSouthAsiaMatchBreakdown}
          totalPoints={79}
          avgPoints={13.2}
        />
      </div>

      {/* Standings */}
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          South Asia Championship Standings
        </h4>
        <LidomaStandingsTable data={lidomaSouthAsiaStandings} showQualification />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIDOMA ASIA INTERCONTINENTAL CONTENT
   ═══════════════════════════════════════════ */
function LidomaAsiaContent() {
  return (
    <div className="space-y-8">
      {/* Stage Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Tier" value={lidomaAsiaClash.tier} sub={lidomaAsiaClash.dates} />
        <StatCard label="Teams" value={lidomaAsiaClash.totalTeams} sub="South Asia + Southeast Asia" />
        <StatCard label="Prize Pool" value={lidomaAsiaClash.prizePool} />
        <StatCard label="GodLike Result" value="7th–12th" sub="$200 — Did not qualify for Global" />
      </div>

      {/* GodLike Status */}
      <div
        className="rounded-xl p-5"
        style={{ background: 'linear-gradient(90deg, rgba(239,68,68,0.06), rgba(239,68,68,0.02))', border: '1px solid rgba(239,68,68,0.15)' }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{'\u274C'}</span>
          <div>
            <p className="font-heading font-bold text-sm" style={{ color: '#ef4444' }}>
              Eliminated — Did Not Qualify for Global Championship
            </p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>
              {lidomaAsiaClash.godlikeResult.note}
            </p>
            <p className="text-xs mt-1" style={{ color: '#b0a080' }}>
              Prize: <strong style={{ color: '#c9a84c' }}>{lidomaAsiaClash.godlikeResult.prizeMoney}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Playoff Standings */}
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Playoff Standings (Top 12)
        </h4>
        <LidomaStandingsTable data={lidomaAsiaPlayoffs} />
      </div>

      {/* Grand Finals / Global Qualifiers */}
      <div>
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Grand Finals — Prize Distribution
        </h4>
        <LidomaStandingsTable data={lidomaAsiaFinals} showQualification />
      </div>

      {/* Global Championship note */}
      <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-2" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Global Championship — Abu Dhabi
        </h4>
        <p className="text-xs" style={{ color: '#888' }}>
          The top 6 teams qualified for the Lidoma Endless Series 2025 Global Championship in Abu Dhabi, UAE ($40,000 prize pool).
          <strong style={{ color: '#b0a080' }}> Team Elite was the only Indian team to qualify.</strong> GodLike did not advance past the Asia Intercontinental stage.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIDOMA SECTION — full tournament widget
   ═══════════════════════════════════════════ */
function LidomaSection() {
  const [activeStage, setActiveStage] = useState('southasia');

  return (
    <div className="mb-12">
      {/* Tournament Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>
                {lidomaEndless2025.shortName}
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>
                {lidomaEndless2025.status}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                {lidomaEndless2025.scope}
              </span>
            </div>
            <p className="text-sm text-white font-heading">{lidomaEndless2025.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{lidomaEndless2025.dates} • {lidomaEndless2025.organizer}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Total Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{lidomaEndless2025.totalPrizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{lidomaEndless2025.totalTeams} teams worldwide</p>
          </div>
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: '#888' }}>
          <span>Format: <strong className="text-white">{lidomaEndless2025.format}</strong></span>
        </div>
      </div>

      {/* Journey Progress Bar */}
      <JourneyProgressBar stages={godlikeLidomaSummary.journey} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Stages Played" value={godlikeLidomaSummary.totalStagesPlayed} sub="India → South Asia → Asia" />
        <StatCard label="Total Earnings" value={godlikeLidomaSummary.totalEarnings} sub="$1,250 (SA) + $200 (Asia)" />
        <StatCard label="Best Result" value={godlikeLidomaSummary.bestResult} />
      </div>

      {/* Stage Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'india', label: 'India Stage' },
          { key: 'southasia', label: 'South Asia Stage' },
          { key: 'asia', label: 'Asia Stage' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveStage(tab.key)}
            className="px-5 py-2.5 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300"
            style={{
              background: activeStage === tab.key ? 'linear-gradient(135deg, #c9a84c, #a68a3e)' : '#1a1710',
              color: activeStage === tab.key ? '#0d0d0f' : '#8b7a4a',
              border: activeStage === tab.key ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.15)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stage Content */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        {activeStage === 'india' && <LidomaIndiaContent />}
        {activeStage === 'southasia' && <LidomaSouthAsiaContent />}
        {activeStage === 'asia' && <LidomaAsiaContent />}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TOURNAMENT FORMAT FLOW — visual flowchart
   ═══════════════════════════════════════════ */
function TournamentFormatFlow({ stages }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-2">
      {stages.map((s, i) => (
        <React.Fragment key={i}>
          <div
            className="flex-1 rounded-xl p-4 transition-all duration-200"
            style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; }}
          >
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold mb-1.5" style={{ color: '#8b7a4a' }}>{s.label}</p>
            <p className="text-sm font-heading font-bold mb-1" style={{ color: '#c9a84c' }}>{s.title}</p>
            <p className="text-[11px]" style={{ color: '#888' }}>{s.detail}</p>
          </div>
          {i < stages.length - 1 && (
            <div className="hidden sm:flex items-center justify-center px-1 flex-shrink-0">
              <span className="text-lg" style={{ color: '#8b7a4a' }}>{'\u2192'}</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   ZEE MEDIA AOC SECTION
   ═══════════════════════════════════════════ */
function ZeeAocSection() {
  return (
    <div className="mb-12">
      {/* Tournament Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>
                {zeeMediaAOC.shortName}
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>
                {zeeMediaAOC.status}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                {zeeMediaAOC.tier}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                {zeeMediaAOC.scope}
              </span>
            </div>
            <p className="text-sm text-white font-heading">{zeeMediaAOC.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{zeeMediaAOC.dates} • {zeeMediaAOC.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>
              Organizer: {zeeMediaAOC.organizer} | Execution: {zeeMediaAOC.executionPartner} | Platform: {zeeMediaAOC.platformPartner}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{zeeMediaAOC.totalPrizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{zeeMediaAOC.totalRegistrations} teams registered</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs" style={{ color: '#888' }}>
          <span>Teams (Finals): <strong className="text-white">{zeeMediaAOC.totalTeams}</strong></span>
          <span>Digital Views: <strong className="text-white">{zeeMediaAOC.totalDigitalViews}</strong></span>
          <span>New Community: <strong className="text-white">{zeeMediaAOC.newCommunityMembers}</strong></span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={zeeMediaAOC.champion} sub="Grand Finals Winner" />
        <StatCard label="Runner-Up" value={zeeMediaAOC.runnerUp} />
        <StatCard label="Finals MVP" value={zeeMediaAOC.finalsMVP} />
        <StatCard label="GodLike Result" value="Top 12" sub="Grand Finals participant" />
      </div>

      {/* Tournament Format Flowchart */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Tournament Format
        </h4>
        <TournamentFormatFlow stages={[
          { label: 'Stage 1', title: aocFormat.qualifiers.name, detail: aocFormat.qualifiers.teamsAdvancing },
          { label: 'Stage 2', title: aocFormat.groupStage.name, detail: `${aocFormat.groupStage.groups} groups × ${aocFormat.groupStage.teamsPerGroup} teams` },
          { label: 'Stage 3', title: 'Upper/Lower Bracket', detail: `UB → Top 6, LB → Top 4 to Finals` },
          { label: 'Stage 4', title: aocFormat.grandFinals.name, detail: `${aocFormat.grandFinals.totalTeams} teams — Champion Rush` },
        ]} />

        {/* Point System */}
        <div className="mt-4 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
            Point System
          </h4>
          <div className="flex flex-wrap gap-2">
            {aocFormat.pointSystem.placement.map((p, i) => (
              <div key={i} className="px-3 py-1.5 rounded-lg text-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <p className="text-[10px] font-medium" style={{ color: '#888' }}>{p.position}</p>
                <p className="text-sm font-heading font-bold" style={{ color: '#c9a84c' }}>{p.points} pts</p>
              </div>
            ))}
            <div className="px-3 py-1.5 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <p className="text-[10px] font-medium" style={{ color: '#888' }}>Per Kill</p>
              <p className="text-sm font-heading font-bold" style={{ color: '#ef4444' }}>{aocFormat.pointSystem.killPoints} pt</p>
            </div>
          </div>
          <p className="text-[10px] mt-3 italic" style={{ color: '#666' }}>{aocFormat.pointSystem.headstartPoints}</p>
        </div>
      </div>

      {/* GodLike's Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          GodLike's AOC Journey
        </h4>
        <JourneyTimeline stages={[
          aocGodlikeJourney.qualifiers,
          aocGodlikeJourney.groupStage,
          aocGodlikeJourney.bracket,
          aocGodlikeJourney.grandFinals,
        ]} />

        {/* Highlights */}
        <div className="mt-4 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
            Key Highlights
          </h4>
          <div className="space-y-1.5">
            {aocGodlikeJourney.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#b0a080' }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#c9a84c' }} />
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grand Finals Standings */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Grand Finals Standings
        </h4>
        <div className="space-y-1.5">
          {/* Header */}
          <div
            className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold"
            style={{
              background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))',
              border: '1px solid rgba(201,168,76,0.1)',
              color: '#8b7a4a',
            }}
          >
            <div style={{ width: '3.5rem' }} className="text-center">#</div>
            <div className="flex-1">Team</div>
            <div style={{ width: '6rem' }} className="text-right">Prize</div>
            <div style={{ width: '5rem' }} className="text-right">Note</div>
          </div>

          {aocGrandFinalsStandings.map((row, i) => {
            const rankStyle = getRankStyle(row.rank);
            const isGL = row.isGodlike;
            const isTBD = row.team === 'TBD';

            return (
              <div
                key={i}
                className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-default"
                style={{
                  background: isGL
                    ? 'linear-gradient(90deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.03) 100%)'
                    : rankStyle.bg,
                  border: `1px solid ${isGL ? 'rgba(201,168,76,0.4)' : rankStyle.border}`,
                  boxShadow: isGL ? '0 0 25px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)' : rankStyle.glow,
                  opacity: isTBD ? 0.5 : 1,
                }}
                onMouseEnter={e => {
                  if (!isTBD) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = isGL
                      ? '0 8px 30px rgba(201,168,76,0.2), inset 0 1px 0 rgba(201,168,76,0.15)'
                      : '0 8px 20px rgba(0,0,0,0.3)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isGL ? '0 0 25px rgba(201,168,76,0.1), inset 0 1px 0 rgba(201,168,76,0.1)' : rankStyle.glow;
                }}
              >
                {/* Rank */}
                <div style={{ width: '3.5rem' }} className="flex items-center justify-center gap-1 flex-shrink-0">
                  {rankStyle.icon && <span className="text-base">{rankStyle.icon}</span>}
                  <span className="font-heading font-black text-lg" style={{ color: rankStyle.numColor }}>
                    {String(row.rank)}
                  </span>
                </div>

                {/* Team */}
                <div className="flex-1 flex items-center gap-3 min-w-0">
                  {!isTBD && <TeamLogo team={row.team} size={36} />}
                  <div className="min-w-0">
                    <p
                      className="font-heading font-bold text-sm truncate"
                      style={{ color: isGL ? '#c9a84c' : isTBD ? '#555' : '#fff', fontStyle: isTBD ? 'italic' : 'normal' }}
                    >
                      {row.team}
                    </p>
                    {row.note && (
                      <p className="text-[10px] truncate mt-0.5" style={{ color: row.note.includes('penalized') ? '#ef4444' : '#666' }}>{row.note}</p>
                    )}
                    {/* Mobile stats */}
                    <div className="flex items-center gap-3 mt-1 sm:hidden">
                      <span className="text-[10px]" style={{ color: isTBD ? '#444' : '#8b7a4a' }}>{row.prize}</span>
                    </div>
                  </div>
                </div>

                {/* Prize (desktop) */}
                <div style={{ width: '6rem' }} className="hidden sm:flex items-center justify-end flex-shrink-0">
                  <span
                    className="inline-flex items-center px-3 py-1 rounded-lg font-heading font-bold text-xs"
                    style={{
                      background: isTBD ? 'transparent' : 'rgba(34,197,94,0.08)',
                      color: isTBD ? '#444' : '#4ade80',
                      border: isTBD ? 'none' : '1px solid rgba(34,197,94,0.12)',
                      fontStyle: isTBD ? 'italic' : 'normal',
                    }}
                  >
                    {row.prize}
                  </span>
                </div>

                {/* Note (desktop) */}
                <div style={{ width: '5rem' }} className="hidden sm:flex items-center justify-end flex-shrink-0">
                  {row.note && (
                    <span className="text-[10px] font-medium truncate" style={{ color: row.note.includes('penalized') ? '#ef4444' : '#888' }}>
                      {row.note.includes('Champion') ? '\u{1F3C6}' : row.note.includes('Runner') ? '\u{1F948}' : row.note.includes('2nd Runner') ? '\u{1F949}' : ''} {row.note.split('(')[0]}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notable Events */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Notable Events
        </h4>
        <div className="space-y-2">
          {aocNotableEvents.map((evt, i) => {
            const isPenalty = evt.type === 'penalty';
            return (
              <div
                key={i}
                className="flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: isPenalty ? 'rgba(239,68,68,0.05)' : 'rgba(201,168,76,0.05)',
                  border: `1px solid ${isPenalty ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.15)'}`,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = isPenalty ? 'rgba(239,68,68,0.3)' : 'rgba(201,168,76,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = isPenalty ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.15)'; }}
              >
                <span className="text-lg mt-0.5">{isPenalty ? '\u{1F6A8}' : '\u{1F3C6}'}</span>
                <div>
                  <p className="text-sm font-heading font-bold" style={{ color: isPenalty ? '#ef4444' : '#c9a84c' }}>
                    {evt.event}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#888' }}>{evt.details}</p>
                  <p className="text-[10px] mt-1" style={{ color: '#555' }}>{evt.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Watch VODs Button */}
      <div className="rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <div>
          <h4 className="font-heading font-bold text-sm uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
            Watch Match VODs
          </h4>
          <p className="text-xs mt-1" style={{ color: '#888' }}>{aocYoutubeVODs.note}</p>
        </div>
        <a
          href={aocYoutubeVODs.channelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, #ff0000, #cc0000)',
            color: '#fff',
            border: '1px solid rgba(255,0,0,0.4)',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(255,0,0,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   iQOO PRO SERIES SEASON 3 SECTION
   ═══════════════════════════════════════════ */
function IqooPS3Section() {
  const [showAnalysis, setShowAnalysis] = useState(false);

  return (
    <div className="mb-12">
      {/* Tournament Header */}
      <div
        className="rounded-2xl p-6 mb-6"
        style={{
          background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)',
          border: '1px solid rgba(201,168,76,0.2)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>
                {iqooProS3.shortName}
              </h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>
                {iqooProS3.status}
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>
                {iqooProS3.tier}
              </span>
            </div>
            <p className="text-sm text-white font-heading">{iqooProS3.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{iqooProS3.dates} • {iqooProS3.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {iqooProS3.organizer} | Sponsor: {iqooProS3.sponsor}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>₹10,00,000</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{iqooProS3.totalTeams} teams • {iqooProS3.communityTeams}+ community</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={iqooProS3.champion} sub="319 pts, 3 Booyahs" />
        <StatCard label="Runner-Up" value={iqooProS3.runnerUp} sub="317 pts" />
        <StatCard label="GF MVP" value={`${iqooProS3.mvp.name} (${iqooProS3.mvp.kills} kills)`} sub={iqooProS3.mvp.team} />
        <StatCard label="GodLike Result" value="7th Place" sub="228 pts • ₹35,000" />
      </div>

      {/* Tournament Format Flowchart */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Tournament Format
        </h4>
        <TournamentFormatFlow stages={[
          { label: 'Open', title: 'Community Cup', detail: `${iqooPS3Format.communityCup.teamsRegistered}+ teams → Top 2 qualify` },
          { label: 'Stage 1', title: 'Playoffs', detail: `${iqooPS3Format.playoffs.totalTeams} teams (3 groups) → Top 12` },
          { label: 'Stage 2', title: 'Grand Finals', detail: `${iqooPS3Format.grandFinals.totalTeams} teams × ${iqooPS3Format.grandFinals.matchesTotal} matches` },
        ]} />

        {/* Point System */}
        <div className="mt-4 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
            Point System
          </h4>
          <div className="flex flex-wrap gap-2">
            {iqooPS3Format.pointSystem.placement.map((p, i) => (
              <div key={i} className="px-3 py-1.5 rounded-lg text-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <p className="text-[10px] font-medium" style={{ color: '#888' }}>{p.position}</p>
                <p className="text-sm font-heading font-bold" style={{ color: '#c9a84c' }}>{p.points} pts</p>
              </div>
            ))}
            <div className="px-3 py-1.5 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <p className="text-[10px] font-medium" style={{ color: '#888' }}>Per Kill</p>
              <p className="text-sm font-heading font-bold" style={{ color: '#ef4444' }}>{iqooPS3Format.pointSystem.killPoints} pt</p>
            </div>
          </div>
        </div>
      </div>

      {/* Playoff Groups */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Playoff Groups
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(iqooPS3Format.playoffs.groups).map(([key, teams]) => {
            const groupLabel = key.replace('group', 'Group ');
            return (
              <div
                key={key}
                className="rounded-xl p-4"
                style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}
              >
                <p className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>{groupLabel}</p>
                <div className="space-y-2">
                  {teams.map((team, i) => {
                    const isGL = team === 'GodLike Esports';
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg"
                        style={{
                          background: isGL ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)',
                          border: `1px solid ${isGL ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.04)'}`,
                        }}
                      >
                        <TeamLogo team={team} size={24} />
                        <span className="text-xs font-medium" style={{ color: isGL ? '#c9a84c' : '#ccc' }}>{team}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GodLike's Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          GodLike's iQOO PS S3 Journey
        </h4>
        <JourneyTimeline stages={[
          {
            stage: 'Entry: Direct Invite',
            qualified: true,
            result: iqooPS3GodlikeJourney.entryMethod.note,
          },
          {
            stage: 'Playoffs (Group B)',
            dates: iqooPS3GodlikeJourney.playoffs.dates,
            matches: iqooPS3GodlikeJourney.playoffs.matches,
            points: iqooPS3GodlikeJourney.playoffs.points,
            position: iqooPS3GodlikeJourney.playoffs.position,
            qualified: true,
            result: iqooPS3GodlikeJourney.playoffs.result,
          },
          {
            stage: 'Grand Finals',
            dates: iqooPS3GodlikeJourney.grandFinals.dates,
            matches: iqooPS3GodlikeJourney.grandFinals.matches,
            points: iqooPS3GodlikeJourney.grandFinals.points,
            kills: iqooPS3GodlikeJourney.grandFinals.kills,
            booyahs: iqooPS3GodlikeJourney.grandFinals.booyahs,
            position: iqooPS3GodlikeJourney.grandFinals.position,
            prizeMoney: iqooPS3GodlikeJourney.grandFinals.prizeMoney,
            qualified: true,
            result: iqooPS3GodlikeJourney.grandFinals.result,
          },
        ]} />

        {/* Highlights */}
        <div className="mt-4 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
            Key Highlights
          </h4>
          <div className="space-y-1.5">
            {iqooPS3GodlikeJourney.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#b0a080' }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#c9a84c' }} />
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GodLike Day-by-Day Breakdown */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          GodLike — Match Breakdown
        </h4>
        {[iqooPS3GodlikeDayByDay.day1, iqooPS3GodlikeDayByDay.day2, iqooPS3GodlikeDayByDay.day3].map((day, di) => (
          <div key={di} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-heading font-bold text-sm uppercase" style={{ color: '#c9a84c' }}>
                Day {di + 1} — {day.date}
              </p>
              <span
                className="text-xs font-heading font-bold px-3 py-1 rounded-lg"
                style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.15)' }}
              >
                {day.dayTotal} pts
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {day.games.map((g) => (
                <div
                  key={g.game}
                  className="rounded-lg p-3 text-center transition-all duration-200"
                  style={{
                    background: g.points >= 20 ? 'rgba(34,197,94,0.08)' : g.points <= 5 ? 'rgba(239,68,68,0.06)' : '#141210',
                    border: `1px solid ${g.points >= 20 ? 'rgba(34,197,94,0.2)' : g.points <= 5 ? 'rgba(239,68,68,0.15)' : 'rgba(201,168,76,0.1)'}`,
                  }}
                >
                  <p className="text-[9px] uppercase tracking-wider font-bold mb-1" style={{ color: '#666' }}>Game {g.game}</p>
                  <p className="text-[10px] mb-1" style={{ color: '#888' }}>{g.map}</p>
                  <p className="font-heading font-bold text-lg" style={{ color: g.points >= 20 ? '#4ade80' : g.points <= 5 ? '#ef4444' : '#c9a84c' }}>
                    {g.points}
                  </p>
                  <p className="text-[9px] mt-1" style={{ color: '#777' }}>#{g.placement} • {g.kills}K</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Day summary bar */}
        <div className="flex items-center gap-3 mt-2 rounded-xl p-4" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>Total</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{iqooPS3GodlikeDayByDay.grandTotal}</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(201,168,76,0.15)' }} />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>Kills</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#ef4444' }}>{iqooPS3GodlikeDayByDay.totalKills}</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(201,168,76,0.15)' }} />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>Avg/Game</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#8b7a4a' }}>{iqooPS3GodlikeDayByDay.avgPointsPerGame}</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(201,168,76,0.15)' }} />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>Best</p>
            <p className="font-heading font-bold text-sm" style={{ color: '#4ade80' }}>G{iqooPS3GodlikeDayByDay.bestGame.game} ({iqooPS3GodlikeDayByDay.bestGame.points}pts)</p>
          </div>
        </div>
      </div>

      {/* Grand Finals Standings */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Grand Finals Standings
        </h4>
        <StandingsTable data={iqooPS3GrandFinalsStandings} />
      </div>

      {/* Performance Analysis (collapsible) */}
      <div className="mb-8">
        <button
          onClick={() => setShowAnalysis(!showAnalysis)}
          className="w-full flex items-center justify-between px-5 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300"
          style={{
            background: showAnalysis ? 'rgba(201,168,76,0.08)' : '#141210',
            color: '#c9a84c',
            border: '1px solid rgba(201,168,76,0.15)',
          }}
        >
          <span>Performance Analysis</span>
          <span style={{ transform: showAnalysis ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>{'\u25BC'}</span>
        </button>

        {showAnalysis && (
          <div className="mt-4 space-y-4">
            {/* Strengths */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#4ade80', letterSpacing: '0.1em' }}>
                Strengths
              </h4>
              <div className="space-y-1.5">
                {iqooPS3GodlikeAnalysis.strengthsObserved.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#a0d8a0' }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4ade80' }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>

            {/* Weaknesses */}
            <div className="rounded-xl p-5" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#ef4444', letterSpacing: '0.1em' }}>
                Weaknesses
              </h4>
              <div className="space-y-1.5">
                {iqooPS3GodlikeAnalysis.weaknessesObserved.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#d8a0a0' }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#ef4444' }} />
                    {w}
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Tournament Comparison */}
            <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.15)' }}>
              <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
                Cross-Tournament Comparison
              </h4>
              <div className="space-y-1.5">
                {/* Header */}
                <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: '#8b7a4a' }}>
                  <div className="flex-1">Tournament</div>
                  <div style={{ width: '6rem' }} className="text-center">Result</div>
                  <div style={{ width: '10rem' }} className="text-right">Note</div>
                </div>
                {iqooPS3GodlikeAnalysis.comparisonAcrossTournaments.map((t, i) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-3 py-2 rounded-lg"
                    style={{
                      background: t.tournament === 'iQOO PS S3' ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)',
                      border: `1px solid ${t.tournament === 'iQOO PS S3' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)'}`,
                    }}
                  >
                    <div className="flex-1 text-xs font-medium" style={{ color: t.tournament === 'iQOO PS S3' ? '#c9a84c' : '#ccc' }}>{t.tournament}</div>
                    <div className="text-xs font-heading font-bold text-center" style={{ width: '6rem', color: t.result.includes('1st') || t.result.includes('2nd') || t.result.includes('Runner') ? '#4ade80' : t.result.includes('Did not') || t.result.includes('Eliminated') ? '#ef4444' : '#c9a84c' }}>{t.result}</div>
                    <div className="text-[10px] text-right" style={{ width: '10rem', color: '#888' }}>{t.note}</div>
                  </div>
                ))}
              </div>

              {/* Verdict */}
              <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <p className="text-xs italic" style={{ color: '#b0a080' }}>{iqooPS3GodlikeAnalysis.verdict}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MVP Card */}
      <div className="mb-8 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.4)' }}>
          <span className="text-2xl">{'\u{1F3C6}'}</span>
        </div>
        <div className="text-center sm:text-left">
          <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Grand Finals MVP</p>
          <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>{iqooProS3.mvp.name}</p>
          <p className="text-xs" style={{ color: '#888' }}>{iqooProS3.mvp.team} — {iqooProS3.mvp.kills} kills — {iqooProS3.mvp.prize}</p>
        </div>
      </div>

      {/* Watch VODs */}
      <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
          Watch Grand Finals VODs
        </h4>
        <div className="flex flex-wrap gap-3">
          {iqooPS3VODs.vods.map((vod, i) => (
            <a
              key={i}
              href={vod.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #ff0000, #cc0000)',
                color: '#fff',
                border: '1px solid rgba(255,0,0,0.4)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 15px rgba(255,0,0,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              {vod.day} ({vod.date})
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NG ASIA CHAMPIONSHIP SECTION
   ═══════════════════════════════════════════ */
function NgAsiaChampSection() {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showSemifinals, setShowSemifinals] = useState(false);

  return (
    <div className="mb-12">
      {/* Tournament Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{ngAsiaChamp.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{ngAsiaChamp.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{ngAsiaChamp.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{ngAsiaChamp.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{ngAsiaChamp.dates} {'\u2022'} {ngAsiaChamp.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {ngAsiaChamp.organizer} | Sponsor: {ngAsiaChamp.sponsor}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{'\u20B9'}1,00,000</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{ngAsiaChamp.totalTeams} teams {'\u2022'} {ngAsiaChamp.scope}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={ngAsiaChamp.champion} sub="390 pts (Vietnam)" />
        <StatCard label="Runner-Up" value={ngAsiaChamp.runnerUp} sub="387 pts (Vietnam)" />
        <StatCard label="3rd Place" value={ngAsiaChamp.thirdPlace} sub="290 pts (Indonesia)" />
        <StatCard label="GodLike Result" value="11th Place" sub={`153 pts \u2022 No Prize`} />
      </div>

      {/* Tournament Format */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Tournament Format</h4>
        <TournamentFormatFlow stages={[
          { label: 'Stage 1', title: 'Esports Qualifier', detail: 'Open qualifier (Jan 15\u201319)' },
          { label: 'Stage 2', title: 'Group Stage', detail: 'Group seeding (Jan 20\u201321)' },
          { label: 'Stage 3', title: 'Regional Semifinals', detail: '18 teams \u2192 Top 12 qualify' },
          { label: 'Stage 4', title: "Int'l Semifinals", detail: '18 teams (12+6 SEA) \u2192 Top 12' },
          { label: 'Stage 5', title: 'Grand Finals', detail: '12 teams \u00D7 18 matches' },
        ]} />
        <div className="mt-4 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Point System</h4>
          <div className="flex flex-wrap gap-2">
            {ngACFormat.pointSystem.placement.map((p, i) => (
              <div key={i} className="px-3 py-1.5 rounded-lg text-center" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <p className="text-[10px] font-medium" style={{ color: '#888' }}>{p.position}</p>
                <p className="text-sm font-heading font-bold" style={{ color: '#c9a84c' }}>{p.points} pts</p>
              </div>
            ))}
            <div className="px-3 py-1.5 rounded-lg text-center" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)' }}>
              <p className="text-[10px] font-medium" style={{ color: '#888' }}>Per Kill</p>
              <p className="text-sm font-heading font-bold" style={{ color: '#ef4444' }}>{ngACFormat.pointSystem.killPoints} pt</p>
            </div>
          </div>
          <p className="text-[10px] mt-3" style={{ color: '#666' }}>Tiebreaker: {ngACFormat.pointSystem.tiebreaker}</p>
        </div>
      </div>

      {/* GodLike Roster */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike Roster</h4>
        <div className="flex flex-wrap gap-3">
          {ngACGodlikeJourney.roster.map((p, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)' }}>
                <span className="text-xs font-bold" style={{ color: '#c9a84c' }}>{p.ign[0]}</span>
              </div>
              <div>
                <p className="font-heading font-bold text-sm" style={{ color: '#c9a84c' }}>{p.ign}</p>
                <p className="text-[10px]" style={{ color: '#666' }}>{p.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* International Semifinals Groups */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>International Semifinals Groups</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(ngACFormat.internationalSemifinals.groups).map(([key, teams]) => {
            const groupLabel = key.replace('group', 'Group ');
            const schedule = key === 'groupA' ? 'Days 1 & 3' : key === 'groupB' ? 'Days 1 & 2' : 'Days 2 & 3';
            return (
              <div key={key} className="rounded-xl p-4" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-heading font-bold text-sm uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>{groupLabel}</p>
                  <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.06)', color: '#8b7a4a', border: '1px solid rgba(201,168,76,0.1)' }}>{schedule}</span>
                </div>
                <div className="space-y-2">
                  {teams.map((team, i) => {
                    const isGL = team === 'GodLike Esports';
                    return (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: isGL ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${isGL ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.04)'}` }}>
                        <TeamLogo team={team} size={24} />
                        <span className="text-xs font-medium" style={{ color: isGL ? '#c9a84c' : '#ccc' }}>{team}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* GodLike's Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's NG AC Journey</h4>
        <JourneyTimeline stages={[
          { stage: ngACGodlikeJourney.qualifier.stage, qualified: true, result: ngACGodlikeJourney.qualifier.note },
          { stage: 'Regional Semifinals', dates: ngACGodlikeJourney.regionalSemifinals.dates, position: ngACGodlikeJourney.regionalSemifinals.position, qualified: true, result: ngACGodlikeJourney.regionalSemifinals.result },
          { stage: "Int'l Semifinals (Group B)", dates: ngACGodlikeJourney.internationalSemifinals.dates, points: ngACGodlikeJourney.internationalSemifinals.points, position: ngACGodlikeJourney.internationalSemifinals.position, qualified: true, result: ngACGodlikeJourney.internationalSemifinals.result },
          { stage: 'Grand Finals', dates: ngACGodlikeJourney.grandFinals.dates, points: ngACGodlikeJourney.grandFinals.points, position: ngACGodlikeJourney.grandFinals.position, qualified: false, result: ngACGodlikeJourney.grandFinals.result },
        ]} />
        <div className="mt-4 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Key Highlights</h4>
          <div className="space-y-1.5">
            {ngACGodlikeJourney.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#b0a080' }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#c9a84c' }} />
                {h}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Day-by-Day Performance */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike {'\u2014'} Day-by-Day Performance</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { day: 'Day 1', pts: ngACGodlikeJourney.grandFinals.day1 },
            { day: 'Day 2', pts: ngACGodlikeJourney.grandFinals.day2 },
            { day: 'Day 3', pts: ngACGodlikeJourney.grandFinals.day3 },
          ].map((d, i) => (
            <div key={i} className="rounded-xl p-4 text-center" style={{ background: d.pts <= 35 ? 'rgba(239,68,68,0.06)' : d.pts >= 60 ? 'rgba(201,168,76,0.06)' : '#141210', border: `1px solid ${d.pts <= 35 ? 'rgba(239,68,68,0.15)' : d.pts >= 60 ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.1)'}` }}>
              <p className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: '#666' }}>{d.day}</p>
              <p className="font-heading font-bold text-3xl" style={{ color: d.pts <= 35 ? '#ef4444' : d.pts >= 60 ? '#c9a84c' : '#8b7a4a' }}>{d.pts}</p>
              <p className="text-[10px] mt-1" style={{ color: '#666' }}>pts (Grand Finals)</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-xl p-4" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.15)' }}>
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>GF Total</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{ngACGodlikeJourney.grandFinals.points}</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(201,168,76,0.15)' }} />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>Semi Total</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#8b7a4a' }}>{ngACGodlikeJourney.internationalSemifinals.points}</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(201,168,76,0.15)' }} />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>GF Avg/Game</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#ef4444' }}>{ngACGodlikeAnalysis.avgPointsPerGame}</p>
          </div>
          <div className="w-px h-8" style={{ background: 'rgba(201,168,76,0.15)' }} />
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: '#666' }}>GF Position</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#ef4444' }}>11th</p>
          </div>
        </div>
      </div>

      {/* International Semifinals Standings (collapsible) */}
      <div className="mb-8">
        <button onClick={() => setShowSemifinals(!showSemifinals)} className="w-full flex items-center justify-between px-5 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300" style={{ background: showSemifinals ? 'rgba(201,168,76,0.08)' : '#141210', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.15)' }}>
          <span>International Semifinals Standings (18 Teams)</span>
          <span style={{ transform: showSemifinals ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>{'\u25BC'}</span>
        </button>
        {showSemifinals && (
          <div className="mt-4 space-y-1.5">
            <div className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.1)', color: '#8b7a4a' }}>
              <div style={{ width: '2.5rem' }} className="text-center">#</div>
              <div className="flex-1">Team</div>
              <div style={{ width: '4rem' }} className="text-center">Region</div>
              <div style={{ width: '4rem' }} className="text-center">Pts</div>
              <div style={{ width: '4rem' }} className="text-center">Day 1</div>
              <div style={{ width: '4rem' }} className="text-center">Day 2</div>
              <div style={{ width: '4rem' }} className="text-center">Day 3</div>
              <div style={{ width: '5rem' }} className="text-right">Status</div>
            </div>
            {ngACSemifinalsStandings.map((row, i) => {
              const isGL = row.isGodlike;
              const isQ = row.qualified;
              return (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl transition-all duration-300" style={{ background: isGL ? 'linear-gradient(90deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.03) 100%)' : !isQ ? 'rgba(239,68,68,0.03)' : '#111010', border: `1px solid ${isGL ? 'rgba(201,168,76,0.4)' : !isQ ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)'}`, boxShadow: isGL ? '0 0 25px rgba(201,168,76,0.1)' : 'none' }}>
                  <div style={{ width: '2.5rem' }} className="flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-black text-sm" style={{ color: isGL ? '#c9a84c' : '#555' }}>{row.rank}</span>
                  </div>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <TeamLogo team={row.team} size={28} />
                    <div className="min-w-0">
                      <p className="font-heading font-bold text-xs truncate" style={{ color: isGL ? '#c9a84c' : '#fff' }}>{row.team}</p>
                      {row.note && <p className="text-[9px] truncate" style={{ color: '#666' }}>{row.note}</p>}
                      <div className="flex items-center gap-3 mt-1 sm:hidden">
                        <span className="text-[10px]" style={{ color: '#888' }}>{countryFlags[row.country] || ''} {row.country}</span>
                        <span className="text-[10px]" style={{ color: '#c9a84c' }}>{row.points} pts</span>
                        <span className="text-[9px] font-bold" style={{ color: isQ ? '#4ade80' : '#ef4444' }}>{isQ ? 'Q' : 'E'}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ width: '4rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px]" style={{ color: '#888' }}>{countryFlags[row.country] || ''}</span>
                  </div>
                  <div style={{ width: '4rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-heading font-bold" style={{ color: '#c9a84c' }}>{row.points}</span>
                  </div>
                  <div style={{ width: '4rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                    <span className="text-xs" style={{ color: row.day1 ? '#b0a080' : '#333' }}>{row.day1 ?? '\u2014'}</span>
                  </div>
                  <div style={{ width: '4rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                    <span className="text-xs" style={{ color: row.day2 ? '#b0a080' : '#333' }}>{row.day2 ?? '\u2014'}</span>
                  </div>
                  <div style={{ width: '4rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                    <span className="text-xs" style={{ color: row.day3 ? '#b0a080' : '#333' }}>{row.day3 ?? '\u2014'}</span>
                  </div>
                  <div style={{ width: '5rem' }} className="hidden sm:flex items-center justify-end flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase" style={{ background: isQ ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isQ ? '#4ade80' : '#ef4444', border: `1px solid ${isQ ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      {isQ ? 'Qualified' : 'Eliminated'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grand Finals Standings */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals Standings</h4>
        <div className="space-y-1.5">
          <div className="hidden sm:flex items-center gap-3 px-4 py-3 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08), rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.1)', color: '#8b7a4a' }}>
            <div style={{ width: '2.5rem' }} className="text-center">#</div>
            <div className="flex-1">Team</div>
            <div style={{ width: '3.5rem' }} className="text-center">Region</div>
            <div style={{ width: '3.5rem' }} className="text-center">Day 1</div>
            <div style={{ width: '3.5rem' }} className="text-center">Day 2</div>
            <div style={{ width: '3.5rem' }} className="text-center">Day 3</div>
            <div style={{ width: '4rem' }} className="text-center">Total</div>
            <div style={{ width: '5rem' }} className="text-right">Prize</div>
          </div>
          {ngACGrandFinalsStandings.map((row, i) => {
            const rankStyle = getRankStyle(row.rank);
            const isGL = row.isGodlike;
            return (
              <div key={i} className="group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 px-4 py-3 rounded-xl transition-all duration-300 cursor-default" style={{ background: isGL ? 'linear-gradient(90deg, rgba(201,168,76,0.15) 0%, rgba(201,168,76,0.03) 100%)' : rankStyle.bg, border: `1px solid ${isGL ? 'rgba(201,168,76,0.4)' : rankStyle.border}`, boxShadow: isGL ? '0 0 25px rgba(201,168,76,0.1)' : rankStyle.glow }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = isGL ? '0 8px 30px rgba(201,168,76,0.2)' : '0 8px 20px rgba(0,0,0,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = isGL ? '0 0 25px rgba(201,168,76,0.1)' : rankStyle.glow; }}>
                <div style={{ width: '2.5rem' }} className="flex items-center justify-center gap-1 flex-shrink-0">
                  {rankStyle.icon && <span className="text-sm">{rankStyle.icon}</span>}
                  <span className="font-heading font-black text-base" style={{ color: rankStyle.numColor }}>{row.rank}</span>
                </div>
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <TeamLogo team={row.team} size={32} />
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-sm truncate" style={{ color: isGL ? '#c9a84c' : '#fff' }}>{row.team}</p>
                    {row.note && <p className="text-[9px] truncate mt-0.5" style={{ color: '#666' }}>{row.note}</p>}
                    <div className="flex items-center gap-3 mt-1 sm:hidden">
                      <span className="text-[10px]" style={{ color: '#888' }}>{countryFlags[row.country] || ''} {row.country}</span>
                      <span className="text-[10px]" style={{ color: '#c9a84c' }}>{row.points} pts</span>
                      <span className="text-[10px]" style={{ color: '#4ade80' }}>{row.prize}</span>
                    </div>
                  </div>
                </div>
                <div style={{ width: '3.5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0"><span className="text-[10px]" style={{ color: '#888' }}>{countryFlags[row.country] || ''}</span></div>
                <div style={{ width: '3.5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0"><span className="text-xs font-medium" style={{ color: '#b0a080' }}>{row.day1}</span></div>
                <div style={{ width: '3.5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0"><span className="text-xs font-medium" style={{ color: '#b0a080' }}>{row.day2}</span></div>
                <div style={{ width: '3.5rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0"><span className="text-xs font-medium" style={{ color: '#b0a080' }}>{row.day3}</span></div>
                <div style={{ width: '4rem' }} className="hidden sm:flex items-center justify-center flex-shrink-0">
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-lg font-heading font-bold text-sm" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.15)' }}>{row.points}</span>
                </div>
                <div style={{ width: '5rem' }} className="hidden sm:flex items-center justify-end flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg font-heading font-bold text-xs" style={{ background: row.prize !== '\u2014' ? 'rgba(34,197,94,0.08)' : 'transparent', color: row.prize !== '\u2014' ? '#4ade80' : '#333', border: row.prize !== '\u2014' ? '1px solid rgba(34,197,94,0.12)' : 'none' }}>{row.prize}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Analysis (collapsible) */}
      <div className="mb-8">
        <button onClick={() => setShowAnalysis(!showAnalysis)} className="w-full flex items-center justify-between px-5 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300" style={{ background: showAnalysis ? 'rgba(201,168,76,0.08)' : '#141210', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.15)' }}>
          <span>Performance Analysis</span>
          <span style={{ transform: showAnalysis ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>{'\u25BC'}</span>
        </button>
        {showAnalysis && (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl p-5" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}>
              <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#4ade80', letterSpacing: '0.1em' }}>Strengths</h4>
              <div className="space-y-1.5">
                {ngACGodlikeAnalysis.strengthsObserved.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#a0d8a0' }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#4ade80' }} />{s}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#ef4444', letterSpacing: '0.1em' }}>Weaknesses</h4>
              <div className="space-y-1.5">
                {ngACGodlikeAnalysis.weaknessesObserved.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#d8a0a0' }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#ef4444' }} />{w}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.15)' }}>
              <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Cross-Tournament Comparison</h4>
              <div className="space-y-1.5">
                <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-lg text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: '#8b7a4a' }}>
                  <div className="flex-1">Tournament</div>
                  <div style={{ width: '6rem' }} className="text-center">Result</div>
                  <div style={{ width: '10rem' }} className="text-right">Note</div>
                </div>
                {ngACGodlikeAnalysis.comparisonAcrossTournaments.map((t, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 px-3 py-2 rounded-lg" style={{ background: t.tournament === 'NG AC' ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${t.tournament === 'NG AC' ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)'}` }}>
                    <div className="flex-1 text-xs font-medium" style={{ color: t.tournament === 'NG AC' ? '#c9a84c' : '#ccc' }}>{t.tournament}</div>
                    <div className="text-xs font-heading font-bold text-center" style={{ width: '6rem', color: t.result.includes('1st') || t.result.includes('2nd') || t.result.includes('Runner') ? '#4ade80' : t.result.includes('Did not') || t.result.includes('Eliminated') ? '#ef4444' : '#c9a84c' }}>{t.result}</div>
                    <div className="text-[10px] text-right" style={{ width: '10rem', color: '#888' }}>{t.note}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 px-4 py-3 rounded-lg" style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' }}>
                <p className="text-xs italic" style={{ color: '#b0a080' }}>{ngACGodlikeAnalysis.verdict}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Country Representation */}
      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Country Representation (Grand Finals)</h4>
        <div className="flex flex-wrap gap-3">
          {[
            { country: 'India', flag: '\u{1F1EE}\u{1F1F3}', players: 20, pct: '42%' },
            { country: 'Vietnam', flag: '\u{1F1FB}\u{1F1F3}', players: 16, pct: '33%' },
            { country: 'Nepal', flag: '\u{1F1F3}\u{1F1F5}', players: 4, pct: '8%' },
            { country: 'Indonesia', flag: '\u{1F1EE}\u{1F1E9}', players: 4, pct: '8%' },
            { country: 'Thailand', flag: '\u{1F1F9}\u{1F1ED}', players: 4, pct: '8%' },
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)' }}>
              <span className="text-lg">{c.flag}</span>
              <div>
                <p className="text-xs font-medium" style={{ color: '#ccc' }}>{c.country}</p>
                <p className="text-[10px]" style={{ color: '#666' }}>{c.players} players ({c.pct})</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Info */}
      <div className="rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Broadcast</h4>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,0,0,0.1)', border: '1px solid rgba(255,0,0,0.2)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ff0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </div>
          <div>
            <p className="font-heading font-bold text-sm" style={{ color: '#fff' }}>{ngACBroadcast.caster}</p>
            <p className="text-xs" style={{ color: '#888' }}>{ngACBroadcast.language} {'\u2022'} {ngACBroadcast.platform} {'\u2022'} {ngACBroadcast.channel}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT — CompletedTournaments
   ═══════════════════════════════════════════ */

/* ═══════════════════════════════════════════
   PRG SURVIVOR SERIES SECTION
   ═══════════════════════════════════════════ */
function PrgSurvivorSection() {
  const [showSemis, setShowSemis] = useState(false);
  return (
    <div className="mb-12">
      {/* Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{prgSurvivorSeries.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{prgSurvivorSeries.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{prgSurvivorSeries.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{prgSurvivorSeries.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{prgSurvivorSeries.dates} • {prgSurvivorSeries.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {prgSurvivorSeries.organizer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{prgSurvivorSeries.prizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{prgSurvivorSeries.totalTeams} teams • {prgSurvivorSeries.scope}</p>
          </div>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={prgSurvivorSeries.champion} sub="380 pts" />
        <StatCard label="Runner-Up" value={prgSurvivorSeries.runnerUp} sub="318 pts" />
        <StatCard label="3rd Place" value={prgSurvivorSeries.thirdPlace} sub="318 pts" />
        <StatCard label="GodLike Result" value="3rd Place" sub="318 pts — ₹7,500" />
      </div>

      {/* GodLike Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's PRG Journey</h4>
        <JourneyTimeline stages={[
          { stage: prgGodlikeJourney.semiFinals.stage, points: prgGodlikeJourney.semiFinals.points, booyahs: prgGodlikeJourney.semiFinals.booyahs, kills: prgGodlikeJourney.semiFinals.kills, qualified: true, result: prgGodlikeJourney.semiFinals.result + " — " + prgGodlikeJourney.semiFinals.note },
          { stage: 'Grand Finals', points: prgGodlikeJourney.grandFinals.points, position: 3, qualified: true, result: prgGodlikeJourney.grandFinals.result + " — " + prgGodlikeJourney.grandFinals.note }
        ]} />
      </div>

      {/* Day-by-Day Performance */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals — Day-by-Day</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {[
            { day: 'Day 1', pts: prgGodlikeJourney.grandFinals.day1, date: 'Feb 12', color: '#4ade80' },
            { day: 'Day 2', pts: prgGodlikeJourney.grandFinals.day2, date: 'Feb 16', color: '#facc15' },
            { day: 'Day 3', pts: prgGodlikeJourney.grandFinals.day3, date: 'Feb 17', color: '#f87171' },
          ].map(d => (
            <div key={d.day} className="rounded-xl p-4 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>{d.day} <span style={{ color: '#555' }}>({d.date})</span></p>
              <p className="font-heading font-bold text-2xl" style={{ color: d.color }}>{d.pts}</p>
              <p className="text-[10px] mt-1" style={{ color: '#666' }}>{(d.pts / 6).toFixed(1)} avg / game</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>GF Total</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>{prgGodlikeJourney.grandFinals.points}</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Semi Total</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>{prgGodlikeJourney.semiFinals.points}</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>GF Avg</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>{(prgGodlikeJourney.grandFinals.points / 18).toFixed(1)}</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Position</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#4ade80' }}>3rd</p>
          </div>
        </div>
      </div>

      {/* Grand Finals Standings */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals Standings</h4>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
          <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Day 1</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Day 2</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Day 3</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Total</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Prize</th>
              </tr>
            </thead>
            <tbody>
              {prgGrandFinalsStandings.map((t, i) => (
                <tr key={i} style={{
                  background: t.isGodlike ? 'rgba(201,168,76,0.12)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderLeft: t.isGodlike ? '3px solid #c9a84c' : '3px solid transparent'
                }}>
                  <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 3 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <TeamLogo team={t.team} size={20} />
                      <div>
                        <span className="font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#ccc' }}>{t.team}</span>
                        {t.note && <span className="text-[9px] ml-2" style={{ color: t.rank <= 3 ? '#4ade80' : '#f87171' }}>{t.note}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center font-mono" style={{ color: t.day1 === 0 ? '#444' : '#ccc' }}>{t.day1 || '—'}</td>
                  <td className="px-3 py-2 text-center font-mono" style={{ color: t.day2 === 0 ? '#444' : '#ccc' }}>{t.day2 || '—'}</td>
                  <td className="px-3 py-2 text-center font-mono" style={{ color: t.day3 === 0 ? '#444' : '#ccc' }}>{t.day3 || '—'}</td>
                  <td className="px-3 py-2 text-center font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#fff' }}>{t.points}</td>
                  <td className="px-3 py-2 text-center" style={{ color: t.prize !== '—' ? '#4ade80' : '#444' }}>{t.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collapsible Semi Finals */}
      <div className="mb-8">
        <button onClick={() => setShowSemis(!showSemis)} className="flex items-center gap-2 mb-4 group cursor-pointer">
          <h4 className="font-heading font-bold text-lg uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Semi Finals (Group 1) Standings</h4>
          <span className="text-xs transition-transform" style={{ color: '#8b7a4a', transform: showSemis ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
        </button>
        {showSemis && <StandingsTable data={prgGroup1Standings} />}
      </div>

      {/* Performance Analysis */}
      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#4ade80' }}>{prgGodlikeAnalysis.overallRating}</span></p>
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Avg Points / Game (GF):</strong> <span style={{ color: '#4ade80' }}>{prgGodlikeAnalysis.avgPointsPerGame}</span></p>
        </div>
        {prgGodlikeAnalysis.strengths && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>Strengths</p>
              {prgGodlikeAnalysis.strengths.map((s, i) => (
                <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>+ {s}</p>
              ))}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#f87171' }}>Weaknesses</p>
              {prgGodlikeAnalysis.weaknesses.map((w, i) => (
                <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>- {w}</p>
              ))}
            </div>
          </div>
        )}
        {prgGodlikeAnalysis.crossTournament && (
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8b7a4a' }}>Cross-Tournament Comparison</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <th className="text-left py-1 pr-4" style={{ color: '#8b7a4a' }}>Tournament</th>
                  <th className="text-center py-1 px-3" style={{ color: '#8b7a4a' }}>Result</th>
                  <th className="text-left py-1 pl-3" style={{ color: '#8b7a4a' }}>Note</th>
                </tr></thead>
                <tbody>{prgGodlikeAnalysis.crossTournament.map((ct, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="py-1 pr-4" style={{ color: '#ccc' }}>{ct.tournament}</td>
                    <td className="py-1 px-3 text-center font-bold" style={{ color: '#c9a84c' }}>{ct.result}</td>
                    <td className="py-1 pl-3" style={{ color: '#888' }}>{ct.note}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs mt-3 italic" style={{ color: '#888' }}>{prgGodlikeAnalysis.verdict}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RAPID DIGNITY CUP SECTION
   ═══════════════════════════════════════════ */
function RapidDignitySection() {
  return (
    <div className="mb-12">
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{rapidDignityCup.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{rapidDignityCup.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{rapidDignityCup.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{rapidDignityCup.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{rapidDignityCup.dates} • {rapidDignityCup.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {rapidDignityCup.organizer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{rapidDignityCup.prizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{rapidDignityCup.totalTeams} teams • {rapidDignityCup.scope}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={rapidDignityCup.champion} sub="265 pts" />
        <StatCard label="Runner-Up" value={rapidDignityCup.runnerUp} sub="215 pts" />
        <StatCard label="3rd Place" value={rapidDignityCup.thirdPlace} sub="197 pts" />
        <StatCard label="GodLike Result" value="5th Place" sub="188 pts" />
      </div>

      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's RDC Journey</h4>
        <JourneyTimeline stages={[
          { stage: rapidGodlikeJourney.semiFinals.stage, qualified: true, result: rapidGodlikeJourney.semiFinals.result + " — " + rapidGodlikeJourney.semiFinals.note },
          { stage: 'Grand Finals', points: rapidGodlikeJourney.grandFinals.points, position: 5, qualified: false, result: rapidGodlikeJourney.grandFinals.result + " — " + rapidGodlikeJourney.grandFinals.note }
        ]} />
      </div>

      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals Standings</h4>
        <StandingsTable data={rapidGFStandings} />
      </div>

      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#4ade80' }}>{rapidGodlikeAnalysis.overallRating}</span></p>
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Avg Points / Game:</strong> <span style={{ color: '#4ade80' }}>{rapidGodlikeAnalysis.avgPointsPerGame}</span></p>
          <p className="text-xs mt-2 italic" style={{ color: '#888' }}>{rapidGodlikeAnalysis.verdict}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   LIDOMA REGIONAL WARS SECTION
   ═══════════════════════════════════════════ */
function LidomaRWSection() {
  const [showPlayoffs, setShowPlayoffs] = useState(false);
  const [showLastChance, setShowLastChance] = useState(false);
  const [showGF, setShowGF] = useState(false);
  return (
    <div className="mb-12">
      {/* Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{lidomaRegionalWars.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{lidomaRegionalWars.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{lidomaRegionalWars.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{lidomaRegionalWars.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{lidomaRegionalWars.dates} • {lidomaRegionalWars.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {lidomaRegionalWars.organizer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{lidomaRegionalWars.prizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{lidomaRegionalWars.totalTeams} teams • {lidomaRegionalWars.scope}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={lidomaRegionalWars.champion} sub="227 pts (GF)" />
        <StatCard label="Runner-Up" value={lidomaRegionalWars.runnerUp} sub="214 pts (GF)" />
        <StatCard label="3rd Place" value={lidomaRegionalWars.thirdPlace} sub="193 pts (GF)" />
        <StatCard label="GodLike Result" value="Eliminated" sub="Did not reach GF" />
      </div>

      {/* Format */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Tournament Format</h4>
        <TournamentFormatFlow stages={[
          { name: lidomaRWFormat.playoffs.name, teams: lidomaRWFormat.playoffs.totalTeams, detail: lidomaRWFormat.playoffs.description },
          { name: lidomaRWFormat.lastChance.name, teams: lidomaRWFormat.lastChance.totalTeams, detail: lidomaRWFormat.lastChance.description },
          { name: lidomaRWFormat.grandFinals.name, teams: lidomaRWFormat.grandFinals.totalTeams, detail: lidomaRWFormat.grandFinals.description },
        ]} />
      </div>

      {/* GodLike Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's Journey</h4>
        <JourneyTimeline stages={[
          { stage: lidomaRWGodlikeJourney.playoffs.stage, points: lidomaRWGodlikeJourney.playoffs.points, kills: lidomaRWGodlikeJourney.playoffs.kills, booyahs: lidomaRWGodlikeJourney.playoffs.booyahs, qualified: false, result: lidomaRWGodlikeJourney.playoffs.result + " — " + lidomaRWGodlikeJourney.playoffs.note },
          { stage: lidomaRWGodlikeJourney.lastChance.stage, points: lidomaRWGodlikeJourney.lastChance.points, kills: lidomaRWGodlikeJourney.lastChance.kills, booyahs: lidomaRWGodlikeJourney.lastChance.booyahs, qualified: false, result: lidomaRWGodlikeJourney.lastChance.result + " — " + lidomaRWGodlikeJourney.lastChance.note },
        ]} />
      </div>

      {/* Performance Comparison */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike Stage Comparison</h4>
        <div className="grid grid-cols-2 gap-4">
          {[
            { stage: 'Playoffs', pts: lidomaRWGodlikeJourney.playoffs.points, kills: lidomaRWGodlikeJourney.playoffs.kills, booyahs: lidomaRWGodlikeJourney.playoffs.booyahs, pos: '12th / 18', color: '#facc15' },
            { stage: 'Last Chance', pts: lidomaRWGodlikeJourney.lastChance.points, kills: lidomaRWGodlikeJourney.lastChance.kills, booyahs: lidomaRWGodlikeJourney.lastChance.booyahs, pos: '10th / 12', color: '#f87171' },
          ].map(s => (
            <div key={s.stage} className="rounded-xl p-4 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8b7a4a' }}>{s.stage}</p>
              <p className="font-heading font-bold text-2xl mb-1" style={{ color: s.color }}>{s.pts}</p>
              <p className="text-[10px]" style={{ color: '#888' }}>{s.kills} kills • {s.booyahs} booyahs</p>
              <p className="text-[10px] mt-1 font-bold" style={{ color: s.color }}>{s.pos}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Combined Pts</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>270</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Total Kills</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>160</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Result</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#f87171' }}>OUT</p>
          </div>
        </div>
      </div>

      {/* Collapsible Playoffs */}
      <div className="mb-8">
        <button onClick={() => setShowPlayoffs(!showPlayoffs)} className="flex items-center gap-2 mb-4 cursor-pointer">
          <h4 className="font-heading font-bold text-lg uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Playoffs Standings (18 Teams)</h4>
          <span className="text-xs transition-transform" style={{ color: '#8b7a4a', transform: showPlayoffs ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
        </button>
        {showPlayoffs && (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>W</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Pos</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Kills</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Total</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lidomaRWPlayoffsStandings.map((t, i) => (
                  <tr key={i} style={{
                    background: t.isGodlike ? 'rgba(201,168,76,0.12)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderLeft: t.isGodlike ? '3px solid #c9a84c' : '3px solid transparent'
                  }}>
                    <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 3 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo team={t.team} size={20} />
                        <span className="font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#ccc' }}>{t.team}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.booyahs}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.placementPts}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.kills}</td>
                    <td className="px-3 py-2 text-center font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#fff' }}>{t.points}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: t.qualified ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: t.qualified ? '#4ade80' : '#f87171', border: `1px solid ${t.qualified ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                        {t.qualified ? 'Advanced' : 'Last Chance'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collapsible Last Chance */}
      <div className="mb-8">
        <button onClick={() => setShowLastChance(!showLastChance)} className="flex items-center gap-2 mb-4 cursor-pointer">
          <h4 className="font-heading font-bold text-lg uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Last Chance Standings (12 Teams)</h4>
          <span className="text-xs transition-transform" style={{ color: '#8b7a4a', transform: showLastChance ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
        </button>
        {showLastChance && (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>W</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Pos</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Kills</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Total</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lidomaRWLastChanceStandings.map((t, i) => (
                  <tr key={i} style={{
                    background: t.isGodlike ? 'rgba(201,168,76,0.12)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderLeft: t.isGodlike ? '3px solid #c9a84c' : '3px solid transparent'
                  }}>
                    <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 3 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo team={t.team} size={20} />
                        <span className="font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#ccc' }}>{t.team}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.booyahs}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.placementPts}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.kills}</td>
                    <td className="px-3 py-2 text-center font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#fff' }}>{t.points}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: t.qualified ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: t.qualified ? '#4ade80' : '#f87171', border: `1px solid ${t.qualified ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                        {t.qualified ? 'Qualified' : 'Eliminated'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Collapsible Grand Finals */}
      <div className="mb-8">
        <button onClick={() => setShowGF(!showGF)} className="flex items-center gap-2 mb-4 cursor-pointer">
          <h4 className="font-heading font-bold text-lg uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals Standings (GodLike not participating)</h4>
          <span className="text-xs transition-transform" style={{ color: '#8b7a4a', transform: showGF ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
        </button>
        {showGF && (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Day 1</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Day 2</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Total</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Prize</th>
                </tr>
              </thead>
              <tbody>
                {lidomaRWGrandFinalsStandings.map((t, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 3 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo team={t.team} size={20} />
                        <span className="font-bold" style={{ color: '#ccc' }}>{t.team}</span>
                        {t.note && <span className="text-[9px] ml-1" style={{ color: '#4ade80' }}>{t.note}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.day1}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.day2}</td>
                    <td className="px-3 py-2 text-center font-bold" style={{ color: '#fff' }}>{t.points}</td>
                    <td className="px-3 py-2 text-center" style={{ color: t.prize !== '—' ? '#4ade80' : '#444' }}>{t.prize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Analysis */}
      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#f87171' }}>{lidomaRWGodlikeAnalysis.overallRating}</span></p>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>Strengths</p>
            {lidomaRWGodlikeAnalysis.strengths.map((s, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>+ {s}</p>
            ))}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#f87171' }}>Weaknesses</p>
            {lidomaRWGodlikeAnalysis.weaknesses.map((w, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>- {w}</p>
            ))}
          </div>
        </div>
        <p className="text-xs mt-3 italic" style={{ color: '#888' }}>{lidomaRWGodlikeAnalysis.verdict}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ONEBLADE INFERNO LEAGUE SECTION
   ═══════════════════════════════════════════ */
function OneBladeSection() {
  const [showPlayIns, setShowPlayIns] = useState(false);
  const [showGF, setShowGF] = useState(false);
  return (
    <div className="mb-12">
      {/* Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{oneBladeInferno.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{oneBladeInferno.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{oneBladeInferno.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{oneBladeInferno.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{oneBladeInferno.dates} • {oneBladeInferno.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {oneBladeInferno.organizer} • Sponsors: {oneBladeInferno.sponsors}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{oneBladeInferno.prizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{oneBladeInferno.totalTeams} teams • {oneBladeInferno.scope}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={oneBladeInferno.champion} sub="206 pts" />
        <StatCard label="Runner-Up" value={oneBladeInferno.runnerUp} sub="205 pts" />
        <StatCard label="3rd Place" value={oneBladeInferno.thirdPlace} sub="199 pts" />
        <StatCard label="GodLike Result" value="Eliminated" sub="Play-Ins Group B (84 pts)" />
      </div>

      {/* Format */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Tournament Format</h4>
        <TournamentFormatFlow stages={[
          { name: oneBladeFormat.leagueStage.name, teams: oneBladeFormat.leagueStage.totalTeams, detail: oneBladeFormat.leagueStage.description },
          { name: oneBladeFormat.playIns.name, teams: oneBladeFormat.playIns.totalTeams, detail: oneBladeFormat.playIns.description },
          { name: oneBladeFormat.grandFinals.name, teams: oneBladeFormat.grandFinals.totalTeams, detail: oneBladeFormat.grandFinals.description },
        ]} />
      </div>

      {/* GodLike Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's Journey</h4>
        <JourneyTimeline stages={[
          { stage: oneBladeGodlikeJourney.leagueStage.stage, qualified: false, result: oneBladeGodlikeJourney.leagueStage.result + " — " + oneBladeGodlikeJourney.leagueStage.note },
          { stage: oneBladeGodlikeJourney.playIns.stage, points: oneBladeGodlikeJourney.playIns.points, qualified: false, result: oneBladeGodlikeJourney.playIns.result + " — " + oneBladeGodlikeJourney.playIns.note },
        ]} />
      </div>

      {/* Play-Ins Group B */}
      <div className="mb-8">
        <button onClick={() => setShowPlayIns(!showPlayIns)} className="flex items-center gap-2 mb-4 cursor-pointer">
          <h4 className="font-heading font-bold text-lg uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Play-Ins Group B Standings</h4>
          <span className="text-xs transition-transform" style={{ color: '#8b7a4a', transform: showPlayIns ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
        </button>
        {showPlayIns && (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Points</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {oneBladePlayInsGroupB.map((t, i) => (
                  <tr key={i} style={{
                    background: t.isGodlike ? 'rgba(201,168,76,0.12)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderLeft: t.isGodlike ? '3px solid #c9a84c' : '3px solid transparent'
                  }}>
                    <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 4 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo team={t.team} size={20} />
                        <span className="font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#ccc' }}>{t.team}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#fff' }}>{t.points}</td>
                    <td className="px-3 py-2 text-center">
                      <span className="text-[9px] px-2 py-0.5 rounded-full" style={{ background: t.qualified ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)', color: t.qualified ? '#4ade80' : '#f87171', border: `1px solid ${t.qualified ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                        {t.qualified ? 'Qualified' : 'Eliminated'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grand Finals Standings */}
      <div className="mb-8">
        <button onClick={() => setShowGF(!showGF)} className="flex items-center gap-2 mb-4 cursor-pointer">
          <h4 className="font-heading font-bold text-lg uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals Standings (GodLike not participating)</h4>
          <span className="text-xs transition-transform" style={{ color: '#8b7a4a', transform: showGF ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
        </button>
        {showGF && (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Day 1</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Day 2</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Total</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Prize</th>
                </tr>
              </thead>
              <tbody>
                {oneBladeGrandFinalsStandings.map((t, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent' }}>
                    <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 3 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo team={t.team} size={20} />
                        <span className="font-bold" style={{ color: '#ccc' }}>{t.team}</span>
                        {t.note && <span className="text-[9px] ml-1" style={{ color: '#4ade80' }}>{t.note}</span>}
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.day1}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.day2}</td>
                    <td className="px-3 py-2 text-center font-bold" style={{ color: '#fff' }}>{t.points}</td>
                    <td className="px-3 py-2 text-center" style={{ color: t.prize !== '—' ? '#4ade80' : '#444' }}>{t.prize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Performance Analysis */}
      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#f87171' }}>{oneBladeGodlikeAnalysis.overallRating}</span></p>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>Strengths</p>
            {oneBladeGodlikeAnalysis.strengths.map((s, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>+ {s}</p>
            ))}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#f87171' }}>Weaknesses</p>
            {oneBladeGodlikeAnalysis.weaknesses.map((w, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>- {w}</p>
            ))}
          </div>
        </div>
        <p className="text-xs mt-3 italic" style={{ color: '#888' }}>{oneBladeGodlikeAnalysis.verdict}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   URBANSKY GAMING SERIES SECTION
   ═══════════════════════════════════════════ */
function UrbanskySectionWidget() {
  return (
    <div className="mb-12">
      {/* Header */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl sm:text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.08em' }}>{urbanskySeries.shortName}</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,168,76,0.1)', color: '#c9a84c', border: '1px solid rgba(201,168,76,0.2)' }}>{urbanskySeries.status}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,163,175,0.1)', color: '#9ca3af', border: '1px solid rgba(156,163,175,0.2)' }}>{urbanskySeries.tier}</span>
            </div>
            <p className="text-sm text-white font-heading">{urbanskySeries.name}</p>
            <p className="text-xs mt-1" style={{ color: '#888' }}>{urbanskySeries.dates} • {urbanskySeries.location}</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Organizer: {urbanskySeries.organizer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>Prize Pool</p>
            <p className="font-heading font-bold text-xl" style={{ color: '#c9a84c' }}>{urbanskySeries.prizePool}</p>
            <p className="text-[10px] mt-1" style={{ color: '#666' }}>{urbanskySeries.totalTeams} teams • {urbanskySeries.scope}</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Champion" value={urbanskySeries.champion} sub="111 pts" />
        <StatCard label="Runner-Up" value={urbanskySeries.runnerUp} sub="100 pts" />
        <StatCard label="3rd Place" value={urbanskySeries.thirdPlace} sub="94 pts" />
        <StatCard label="GodLike Result" value="8th Place" sub="64 pts — 0 Booyahs" />
      </div>

      {/* Format */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Tournament Format</h4>
        <TournamentFormatFlow stages={[
          { name: urbanskyFormat.semiFinals.name, teams: urbanskyFormat.semiFinals.totalTeams, detail: urbanskyFormat.semiFinals.description },
          { name: urbanskyFormat.grandFinals.name, teams: urbanskyFormat.grandFinals.totalTeams, detail: urbanskyFormat.grandFinals.description },
        ]} />
      </div>

      {/* GodLike Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's Journey</h4>
        <JourneyTimeline stages={[
          { stage: urbanskyGodlikeJourney.semiFinals.stage, qualified: true, result: urbanskyGodlikeJourney.semiFinals.result + " — " + urbanskyGodlikeJourney.semiFinals.note },
          { stage: 'Grand Finals', points: urbanskyGodlikeJourney.grandFinals.points, position: 8, qualified: false, result: urbanskyGodlikeJourney.grandFinals.result + " — " + urbanskyGodlikeJourney.grandFinals.note },
        ]} />
      </div>

      {/* GodLike GF Breakdown */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike Grand Finals Breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Points', value: urbanskyGodlikeJourney.grandFinals.points, color: '#c9a84c' },
            { label: 'Placement Pts', value: urbanskyGodlikeJourney.grandFinals.placementPts, color: '#facc15' },
            { label: 'Kills', value: urbanskyGodlikeJourney.grandFinals.kills, color: '#4ade80' },
            { label: 'Booyahs', value: urbanskyGodlikeJourney.grandFinals.booyahs, color: '#f87171' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>{s.label}</p>
              <p className="font-heading font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
          <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Avg Points / Game (6 matches)</p>
          <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>{urbanskyGodlikeAnalysis.avgPointsPerGame}</p>
        </div>
      </div>

      {/* Grand Finals Standings */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Grand Finals Standings</h4>
        <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
          <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead>
              <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>W</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Pos</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Kills</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Total</th>
                <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Prize</th>
              </tr>
            </thead>
            <tbody>
              {urbanskyGrandFinalsStandings.map((t, i) => (
                <tr key={i} style={{
                  background: t.isGodlike ? 'rgba(201,168,76,0.12)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                  borderLeft: t.isGodlike ? '3px solid #c9a84c' : '3px solid transparent'
                }}>
                  <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 3 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <TeamLogo team={t.team} size={20} />
                      <div>
                        <span className="font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#ccc' }}>{t.team}</span>
                        {t.note && <span className="text-[9px] ml-2" style={{ color: t.rank <= 3 ? '#4ade80' : '#f87171' }}>{t.note}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.booyahs}</td>
                  <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.placementPts}</td>
                  <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.kills}</td>
                  <td className="px-3 py-2 text-center font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#fff' }}>{t.points}</td>
                  <td className="px-3 py-2 text-center" style={{ color: t.prize !== '—' ? '#4ade80' : '#444' }}>{t.prize}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#f87171' }}>{urbanskyGodlikeAnalysis.overallRating}</span></p>
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Avg Points / Game:</strong> <span style={{ color: '#facc15' }}>{urbanskyGodlikeAnalysis.avgPointsPerGame}</span></p>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>Strengths</p>
            {urbanskyGodlikeAnalysis.strengths.map((s, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>+ {s}</p>
            ))}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#f87171' }}>Weaknesses</p>
            {urbanskyGodlikeAnalysis.weaknesses.map((w, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>- {w}</p>
            ))}
          </div>
        </div>
        {urbanskyGodlikeAnalysis.crossTournament && (
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8b7a4a' }}>Cross-Tournament Comparison</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <th className="text-left py-1 pr-4" style={{ color: '#8b7a4a' }}>Tournament</th>
                  <th className="text-center py-1 px-3" style={{ color: '#8b7a4a' }}>Result</th>
                  <th className="text-left py-1 pl-3" style={{ color: '#8b7a4a' }}>Note</th>
                </tr></thead>
                <tbody>{urbanskyGodlikeAnalysis.crossTournament.map((ct, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="py-1 pr-4" style={{ color: '#ccc' }}>{ct.tournament}</td>
                    <td className="py-1 px-3 text-center font-bold" style={{ color: '#c9a84c' }}>{ct.result}</td>
                    <td className="py-1 pl-3" style={{ color: '#888' }}>{ct.note}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs mt-3 italic" style={{ color: '#888' }}>{urbanskyGodlikeAnalysis.verdict}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RBZ REGIONAL CUP — BATTLE ROYALE SECTION
   ═══════════════════════════════════════════ */
function RbzBRSection() {
  const [showStandings, setShowStandings] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>{rbzRegionalBR.name}</h3>
            <p className="text-xs mt-1" style={{ color: '#8b7a4a' }}>{rbzRegionalBR.organizer} | {rbzRegionalBR.tier} | {rbzRegionalBR.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(192,192,192,0.1)', border: '1px solid rgba(192,192,192,0.25)' }}>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: '#999' }}>GodLike Result</p>
              <p className="font-heading font-bold text-lg" style={{ color: '#c0c0c0' }}>2nd Place</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Final Position" value="2nd / 12" />
        <StatCard label="Total Points" value="132" />
        <StatCard label="Booyahs" value="2" />
        <StatCard label="Champion" value={rbzRegionalBR.champion} />
      </div>

      {/* Tournament Format */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Tournament Format</h4>
        <TournamentFormatFlow stages={[
          { name: rbzBRFormat.semiFinals.name, teams: '—', description: rbzBRFormat.semiFinals.description },
          { name: rbzBRFormat.pointRush.name, teams: '—', description: rbzBRFormat.pointRush.description },
          { name: rbzBRFormat.grandFinals.name, teams: rbzBRFormat.grandFinals.totalTeams, description: rbzBRFormat.grandFinals.description },
        ]} />
      </div>

      {/* GodLike Journey */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's Journey</h4>
        <JourneyTimeline stages={[
          { stage: rbzBRGodlikeJourney.semiFinals.stage, qualified: true, result: rbzBRGodlikeJourney.semiFinals.result + " — " + rbzBRGodlikeJourney.semiFinals.note },
          { stage: rbzBRGodlikeJourney.pointRush.stage, qualified: true, result: rbzBRGodlikeJourney.pointRush.result + " — " + rbzBRGodlikeJourney.pointRush.note },
          { stage: 'Grand Finals', points: rbzBRGodlikeJourney.grandFinals.points, position: 2, qualified: false, result: rbzBRGodlikeJourney.grandFinals.result + " — " + rbzBRGodlikeJourney.grandFinals.note },
        ]} />
      </div>

      {/* GodLike GF Breakdown */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike Grand Finals Breakdown</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Points', value: rbzBRGodlikeJourney.grandFinals.points, color: '#c9a84c' },
            { label: 'Placement Pts', value: rbzBRGodlikeJourney.grandFinals.placementPts, color: '#facc15' },
            { label: 'Kills', value: rbzBRGodlikeJourney.grandFinals.kills, color: '#4ade80' },
            { label: 'Booyahs', value: rbzBRGodlikeJourney.grandFinals.booyahs, color: '#60a5fa' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>{s.label}</p>
              <p className="font-heading font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
        {/* Gap Analysis */}
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(248,113,113,0.15)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Gap to 1st (Reckoning)</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#f87171' }}>-3 pts</p>
          </div>
          <div className="rounded-lg p-3 text-center" style={{ background: '#141210', border: '1px solid rgba(74,222,128,0.15)' }}>
            <p className="text-[9px] uppercase tracking-wider" style={{ color: '#8b7a4a' }}>Gap to 3rd (Total Gaming)</p>
            <p className="font-heading font-bold text-lg" style={{ color: '#4ade80' }}>+37 pts</p>
          </div>
        </div>
      </div>

      {/* Grand Finals Standings */}
      <div className="mb-8">
        <button
          onClick={() => setShowStandings(!showStandings)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider mb-3"
          style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.15)', color: '#c9a84c' }}
        >
          <span>Grand Finals Standings (12 Teams)</span>
          <span style={{ transform: showStandings ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </button>
        {showStandings && (
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(201,168,76,0.15)' }}>
            <table className="w-full text-xs" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'rgba(201,168,76,0.08)' }}>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>#</th>
                  <th className="px-3 py-2 text-left font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Team</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>W</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Kills</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Pos</th>
                  <th className="px-3 py-2 text-center font-heading uppercase tracking-wider" style={{ color: '#8b7a4a', fontSize: '9px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {rbzBRGrandFinalsStandings.map((t, i) => (
                  <tr key={i} style={{
                    background: t.isGodlike ? 'rgba(201,168,76,0.12)' : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                    borderLeft: t.isGodlike ? '3px solid #c9a84c' : '3px solid transparent'
                  }}>
                    <td className="px-3 py-2 font-bold" style={{ color: t.rank <= 3 ? '#c9a84c' : '#888' }}>{t.rank}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <TeamLogo team={t.team} size={20} />
                        <div>
                          <span className="font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#ccc' }}>{t.team}</span>
                          {t.note && <span className="text-[9px] ml-2" style={{ color: t.rank <= 3 ? '#4ade80' : '#888' }}>{t.note}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.booyahs}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.kills}</td>
                    <td className="px-3 py-2 text-center font-mono" style={{ color: '#ccc' }}>{t.placementPts}</td>
                    <td className="px-3 py-2 text-center font-bold" style={{ color: t.isGodlike ? '#c9a84c' : '#fff' }}>{t.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VOD Links */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>VOD Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rbzBRVODs.map((vod, i) => (
            <a key={i} href={vod.url} target="_blank" rel="noopener noreferrer"
              className="rounded-xl p-3 text-center transition-all duration-300"
              style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; }}
            >
              <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>{vod.stage}</p>
              <p className="text-xs font-bold" style={{ color: '#c9a84c' }}>Watch VOD →</p>
            </a>
          ))}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#4ade80' }}>{rbzBRGodlikeAnalysis.overallRating}</span></p>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>Strengths</p>
            {rbzBRGodlikeAnalysis.strengths.map((s, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>+ {s}</p>
            ))}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#f87171' }}>Weaknesses</p>
            {rbzBRGodlikeAnalysis.weaknesses.map((w, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>- {w}</p>
            ))}
          </div>
        </div>
        {rbzBRGodlikeAnalysis.crossTournament && (
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8b7a4a' }}>Cross-Tournament Comparison</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <th className="text-left py-1 pr-4" style={{ color: '#8b7a4a' }}>Tournament</th>
                  <th className="text-center py-1 px-3" style={{ color: '#8b7a4a' }}>Result</th>
                  <th className="text-left py-1 pl-3" style={{ color: '#8b7a4a' }}>Note</th>
                </tr></thead>
                <tbody>{rbzBRGodlikeAnalysis.crossTournament.map((ct, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="py-1 pr-4" style={{ color: '#ccc' }}>{ct.tournament}</td>
                    <td className="py-1 px-3 text-center font-bold" style={{ color: '#c9a84c' }}>{ct.result}</td>
                    <td className="py-1 pl-3" style={{ color: '#888' }}>{ct.note}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs mt-3 italic" style={{ color: '#888' }}>{rbzBRGodlikeAnalysis.verdict}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   RBZ REGIONAL CUP — CLASH SQUAD SECTION
   ═══════════════════════════════════════════ */
function RbzCSSection() {
  const [showBracketSeeding, setShowBracketSeeding] = useState(false);

  return (
    <div>
      {/* Header */}
      <div className="rounded-2xl p-6 mb-8" style={{ background: 'linear-gradient(145deg, #1a1710 0%, #0f0e0c 100%)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-2xl uppercase" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>{rbzRegionalCS.name}</h3>
            <p className="text-xs mt-1" style={{ color: '#8b7a4a' }}>{rbzRegionalCS.organizer} | {rbzRegionalCS.tier} | {rbzRegionalCS.location}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl text-center" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)' }}>
              <p className="text-[9px] uppercase tracking-wider" style={{ color: '#c9a84c' }}>GodLike Result</p>
              <p className="font-heading font-bold text-lg" style={{ color: '#c9a84c' }}>CHAMPIONS</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Result" value="CHAMPIONS" />
        <StatCard label="Game Record" value="7-0" />
        <StatCard label="Series Record" value="3-0" />
        <StatCard label="Round Win %" value="66.2%" />
      </div>

      {/* Tournament Format */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Tournament Format</h4>
        <TournamentFormatFlow stages={[
          { name: rbzCSFormat.round1.name, teams: rbzCSFormat.round1.totalTeams, description: rbzCSFormat.round1.format + " — " + rbzCSFormat.round1.description },
          { name: rbzCSFormat.semiFinals.name, teams: rbzCSFormat.semiFinals.totalTeams, description: rbzCSFormat.semiFinals.format + " — " + rbzCSFormat.semiFinals.description },
          { name: rbzCSFormat.grandFinals.name, teams: rbzCSFormat.grandFinals.totalTeams, description: rbzCSFormat.grandFinals.format + " — " + rbzCSFormat.grandFinals.description },
        ]} />
      </div>

      {/* Bracket Seeding */}
      <div className="mb-8">
        <button
          onClick={() => setShowBracketSeeding(!showBracketSeeding)}
          className="w-full flex items-center justify-between px-5 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider mb-3"
          style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.15)', color: '#c9a84c' }}
        >
          <span>Round 1 Bracket Seeding (from BR standings)</span>
          <span style={{ transform: showBracketSeeding ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>▼</span>
        </button>
        {showBracketSeeding && (
          <div className="space-y-2">
            {rbzCSFormat.round1.seeding.map((m, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
                <span className="text-[10px] font-bold uppercase" style={{ color: '#8b7a4a', width: '60px' }}>Match {m.match}</span>
                <span className="flex-1 text-xs font-bold" style={{ color: m.teamA.includes('GodLike') ? '#c9a84c' : '#ccc' }}>{m.teamA}</span>
                <span className="text-[10px] uppercase font-bold" style={{ color: '#555' }}>vs</span>
                <span className="flex-1 text-xs font-bold text-right" style={{ color: m.teamB.includes('GodLike') ? '#c9a84c' : '#ccc' }}>{m.teamB}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* GodLike Journey — Match-by-Match */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>GodLike's Journey — Match-by-Match</h4>

        {/* Round 1 vs NG Pros */}
        <div className="mb-4 rounded-xl p-4" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-heading font-bold text-sm uppercase" style={{ color: '#c9a84c' }}>{rbzCSGodlikeJourney.round1.stage}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8b7a4a' }}>vs {rbzCSGodlikeJourney.round1.opponent}</p>
            </div>
            <div className="px-3 py-1 rounded-lg" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <p className="text-xs font-bold" style={{ color: '#4ade80' }}>{rbzCSGodlikeJourney.round1.result}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {rbzCSGodlikeJourney.round1.games.map((g, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-[10px] font-bold uppercase" style={{ color: '#8b7a4a', width: '55px' }}>Game {g.game}</span>
                <span className="font-bold text-sm" style={{ color: '#4ade80' }}>{g.godlike}</span>
                <span className="text-[10px]" style={{ color: '#555' }}>—</span>
                <span className="font-bold text-sm" style={{ color: '#f87171' }}>{g.opponent}</span>
                <span className="text-[10px] ml-auto" style={{ color: '#4ade80' }}>{g.result}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-2 italic" style={{ color: '#888' }}>{rbzCSGodlikeJourney.round1.note}</p>
        </div>

        {/* Semi Finals vs NKG */}
        <div className="mb-4 rounded-xl p-4" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-heading font-bold text-sm uppercase" style={{ color: '#c9a84c' }}>{rbzCSGodlikeJourney.semiFinals.stage}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8b7a4a' }}>vs {rbzCSGodlikeJourney.semiFinals.opponent}</p>
            </div>
            <div className="px-3 py-1 rounded-lg" style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)' }}>
              <p className="text-xs font-bold" style={{ color: '#4ade80' }}>{rbzCSGodlikeJourney.semiFinals.result}</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {rbzCSGodlikeJourney.semiFinals.games.map((g, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-[10px] font-bold uppercase" style={{ color: '#8b7a4a', width: '55px' }}>Game {g.game}</span>
                <span className="font-bold text-sm" style={{ color: '#4ade80' }}>{g.godlike}</span>
                <span className="text-[10px]" style={{ color: '#555' }}>—</span>
                <span className="font-bold text-sm" style={{ color: '#f87171' }}>{g.opponent}</span>
                <span className="text-[10px] ml-auto" style={{ color: '#4ade80' }}>{g.result}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-2 italic" style={{ color: '#888' }}>{rbzCSGodlikeJourney.semiFinals.note}</p>
        </div>

        {/* Grand Finals vs Gyan Gaming */}
        <div className="mb-4 rounded-xl p-4" style={{ background: 'linear-gradient(145deg, rgba(201,168,76,0.08), #141210)', border: '1px solid rgba(201,168,76,0.25)' }}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-heading font-bold text-sm uppercase" style={{ color: '#c9a84c' }}>{rbzCSGodlikeJourney.grandFinals.stage}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#8b7a4a' }}>vs {rbzCSGodlikeJourney.grandFinals.opponent}</p>
            </div>
            <div className="px-3 py-1 rounded-lg" style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)' }}>
              <p className="text-xs font-bold" style={{ color: '#c9a84c' }}>CHAMPIONS (3-0)</p>
            </div>
          </div>
          <div className="space-y-1.5">
            {rbzCSGodlikeJourney.grandFinals.games.map((g, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-[10px] font-bold uppercase" style={{ color: '#8b7a4a', width: '55px' }}>Game {g.game}</span>
                <span className="font-bold text-sm" style={{ color: '#4ade80' }}>{g.godlike}</span>
                <span className="text-[10px]" style={{ color: '#555' }}>—</span>
                <span className="font-bold text-sm" style={{ color: '#f87171' }}>{g.opponent}</span>
                <span className="text-[10px] ml-auto" style={{ color: '#4ade80' }}>{g.result}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] mt-2 italic" style={{ color: '#888' }}>{rbzCSGodlikeJourney.grandFinals.note}</p>
        </div>
      </div>

      {/* Tournament Summary Stats */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-lg uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Tournament Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: 'Games Won', value: rbzCSGodlikeJourney.summary.totalGamesWon, color: '#4ade80' },
            { label: 'Games Lost', value: rbzCSGodlikeJourney.summary.totalGamesLost, color: '#f87171' },
            { label: 'Series Record', value: rbzCSGodlikeJourney.summary.seriesRecord, color: '#c9a84c' },
            { label: 'Rounds Won', value: rbzCSGodlikeJourney.summary.roundsWon, color: '#60a5fa' },
            { label: 'Rounds Lost', value: rbzCSGodlikeJourney.summary.roundsLost, color: '#fb923c' },
            { label: 'Round Win Rate', value: rbzCSGodlikeJourney.summary.roundWinRate, color: '#c9a84c' },
          ].map(s => (
            <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
              <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>{s.label}</p>
              <p className="font-heading font-bold text-xl" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Opponents Path */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Opponents Path</h4>
        <div className="space-y-2">
          {[rbzCSGodlikeJourney.round1, rbzCSGodlikeJourney.semiFinals, rbzCSGodlikeJourney.grandFinals].map((s, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3 rounded-xl" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.08)' }}>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase" style={{ color: '#8b7a4a' }}>{s.stage}</span>
                <span className="text-xs" style={{ color: '#ccc' }}>vs <strong>{s.opponent}</strong></span>
              </div>
              <span className="font-heading font-bold text-sm" style={{ color: '#4ade80' }}>{s.result}</span>
            </div>
          ))}
        </div>
      </div>

      {/* VOD Links */}
      <div className="mb-8">
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>VOD Links</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rbzCSVODs.map((vod, i) => (
            <a key={i} href={vod.url} target="_blank" rel="noopener noreferrer"
              className="rounded-xl p-3 text-center transition-all duration-300"
              style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.1)'; }}
            >
              <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: '#8b7a4a' }}>{vod.stage}</p>
              <p className="text-xs font-bold" style={{ color: '#c9a84c' }}>Watch VOD →</p>
            </a>
          ))}
        </div>
      </div>

      {/* Performance Analysis */}
      <div className="mb-8 rounded-xl p-5" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
        <h4 className="font-heading font-bold text-sm uppercase mb-3" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>Performance Analysis</h4>
        <div className="space-y-1.5">
          <p className="text-xs" style={{ color: '#ccc' }}><strong>Overall Rating:</strong> <span style={{ color: '#c9a84c' }}>{rbzCSGodlikeAnalysis.overallRating}</span></p>
        </div>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#4ade80' }}>Strengths</p>
            {rbzCSGodlikeAnalysis.strengths.map((s, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>+ {s}</p>
            ))}
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#f87171' }}>Weaknesses</p>
            {rbzCSGodlikeAnalysis.weaknesses.map((w, i) => (
              <p key={i} className="text-[11px] mb-1" style={{ color: '#aaa' }}>- {w}</p>
            ))}
          </div>
        </div>
        {rbzCSGodlikeAnalysis.crossTournament && (
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-wider mb-2" style={{ color: '#8b7a4a' }}>Cross-Tournament Comparison</p>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead><tr style={{ borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
                  <th className="text-left py-1 pr-4" style={{ color: '#8b7a4a' }}>Tournament</th>
                  <th className="text-center py-1 px-3" style={{ color: '#8b7a4a' }}>Result</th>
                  <th className="text-left py-1 pl-3" style={{ color: '#8b7a4a' }}>Note</th>
                </tr></thead>
                <tbody>{rbzCSGodlikeAnalysis.crossTournament.map((ct, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td className="py-1 pr-4" style={{ color: '#ccc' }}>{ct.tournament}</td>
                    <td className="py-1 px-3 text-center font-bold" style={{ color: '#c9a84c' }}>{ct.result}</td>
                    <td className="py-1 pl-3" style={{ color: '#888' }}>{ct.note}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        )}
        <p className="text-xs mt-3 italic" style={{ color: '#888' }}>{rbzCSGodlikeAnalysis.verdict}</p>
      </div>
    </div>
  );
}

export default function CompletedTournaments() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="mt-16 pt-12" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
      {/* Section Heading */}
      <h2
        className="font-heading font-bold text-3xl sm:text-4xl uppercase mb-2"
        style={{ letterSpacing: '0.12em', color: '#c9a84c' }}
      >
        Completed Tournaments
      </h2>
      <p className="text-xs uppercase mb-8" style={{ letterSpacing: '0.2em', color: '#8b7a4a' }}>
        DETAILED BREAKDOWN OF GODLIKE FFM'S TOURNAMENT PERFORMANCE
      </p>

      {/* Widget Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'ffmic', label: 'FFMIC 2025' },
          { key: 'ffmai', label: 'FFMAI 2025' },
          { key: 'lidoma', label: 'LIDOMA ES 2025' },
          { key: 'zeeaoc', label: 'ZEE AOC' },
          { key: 'iqoops3', label: 'iQOO PS S3' },
          { key: 'ngac', label: 'NG AC' },
          { key: 'prg', label: 'PRG Survivor' },
          { key: 'rdc', label: 'Rapid Dignity' },
          { key: 'lidomarw', label: 'Lidoma RW' },
          { key: 'oneblade', label: 'OneBlade' },
          { key: 'urbansky', label: 'Urbansky GS' },
          { key: 'rbzbr', label: 'RBZ Cup BR' },
          { key: 'rbzcs', label: 'RBZ Cup CS' }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-6 py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all duration-300"
            style={{
              background: activeTab === tab.key ? 'linear-gradient(135deg, #c9a84c, #a68a3e)' : '#1a1710',
              color: activeTab === tab.key ? '#0d0d0f' : '#8b7a4a',
              border: activeTab === tab.key ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(201,168,76,0.15)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ animation: 'fadeIn 0.3s ease' }}>
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Tournaments Played" value={godlikeOverallStats.totalTournaments} />
              <StatCard label="Total Earnings" value={godlikeOverallStats.totalEarnings} />
              <StatCard label="Best Result" value={godlikeOverallStats.bestResult} />
              <StatCard label="Total Matches" value={godlikeOverallStats.totalMatchesPlayed} />
            </div>

            <div className="rounded-2xl p-6" style={{ background: '#141210', border: '1px solid rgba(201,168,76,0.1)' }}>
              <h4 className="font-heading font-bold text-sm uppercase mb-4" style={{ color: '#c9a84c', letterSpacing: '0.1em' }}>
                Key Highlights
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {godlikeOverallStats.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs" style={{ color: '#b0a080' }}>
                    <span className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#c9a84c' }} />
                    {h}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'ffmic' && (
          <TournamentSection
            tournament={ffmic2025}
            brContent={<FfmicBrContent />}
            csContent={<FfmicCsContent />}
          />
        )}

        {activeTab === 'ffmai' && (
          <TournamentSection
            tournament={ffmai2025}
            brContent={<FfmaiBrContent />}
            csContent={<FfmaiCsContent />}
          />
        )}

        {activeTab === 'lidoma' && <LidomaSection />}

        {activeTab === 'zeeaoc' && <ZeeAocSection />}

        {activeTab === 'iqoops3' && <IqooPS3Section />}

        {activeTab === 'ngac' && <NgAsiaChampSection />}

        {activeTab === 'prg' && <PrgSurvivorSection />}

        {activeTab === 'rdc' && <RapidDignitySection />}

        {activeTab === 'lidomarw' && <LidomaRWSection />}

        {activeTab === 'oneblade' && <OneBladeSection />}

        {activeTab === 'urbansky' && <UrbanskySectionWidget />}

        {activeTab === 'rbzbr' && <RbzBRSection />}

        {activeTab === 'rbzcs' && <RbzCSSection />}
      </div>
    </div>
  );
}
