import React, { useState, useEffect, useCallback } from 'react';

export default function TournamentCountdown({ targetDate, className = '', compact = false }) {
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

  if (compact) {
    return (
      <span className={`text-accent font-heading font-semibold text-sm ${className}`}>
        {timeLeft.d}d {timeLeft.h}h {timeLeft.m}m
      </span>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`}>
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
