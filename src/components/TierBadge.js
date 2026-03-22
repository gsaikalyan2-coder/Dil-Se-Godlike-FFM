import React from 'react';

const TIER_STYLES = {
  S:         { bg: 'rgba(201,168,76,0.2)', text: '#c9a84c', border: 'rgba(201,168,76,0.4)' },
  A:         { bg: 'rgba(167,139,250,0.2)', text: '#a78bfa', border: 'rgba(167,139,250,0.4)' },
  B:         { bg: 'rgba(96,165,250,0.2)',  text: '#60a5fa', border: 'rgba(96,165,250,0.4)' },
  C:         { bg: 'rgba(74,222,128,0.2)',  text: '#4ade80', border: 'rgba(74,222,128,0.4)' },
  D:         { bg: 'rgba(156,163,175,0.2)', text: '#9ca3af', border: 'rgba(156,163,175,0.4)' },
  Community: { bg: 'rgba(180,160,130,0.2)', text: '#b4a082', border: 'rgba(180,160,130,0.4)' },
};

export default function TierBadge({ tier }) {
  const style = TIER_STYLES[tier] || TIER_STYLES.D;
  return (
    <span
      className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block"
      style={{ backgroundColor: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      {tier === 'Community' ? 'Community' : `${tier}-Tier`}
    </span>
  );
}
