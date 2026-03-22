import React from 'react';

function parsePosition(position) {
  if (!position) return { num: null, label: position || '' };
  const lower = position.toLowerCase();
  if (lower === 'champions' || lower === 'champion' || lower === '1st') return { num: 1, label: position };
  if (lower === 'runner-up' || lower === '2nd') return { num: 2, label: position };
  if (lower === '3rd') return { num: 3, label: position };
  const match = position.match(/^(\d+)/);
  if (match) return { num: parseInt(match[1], 10), label: position };
  if (lower.includes('eliminated')) return { num: 99, label: position };
  return { num: null, label: position };
}

function getPositionStyle(num) {
  if (num === 1) return { color: '#c9a84c', bg: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.3)', icon: '\uD83C\uDFC6' };
  if (num === 2) return { color: '#c0c0c0', bg: 'rgba(192,192,192,0.15)', border: 'rgba(192,192,192,0.3)', icon: '' };
  if (num === 3) return { color: '#cd7f32', bg: 'rgba(205,127,50,0.15)', border: 'rgba(205,127,50,0.3)', icon: '' };
  if (num >= 4 && num <= 6) return { color: '#86efac', bg: 'rgba(134,239,172,0.1)', border: 'rgba(134,239,172,0.2)', icon: '' };
  if (num >= 7 && num <= 12) return { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)', icon: '' };
  if (num >= 13 || num === 99) return { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)', icon: '' };
  return { color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', border: 'rgba(156,163,175,0.2)', icon: '' };
}

export default function PositionBadge({ position }) {
  const { num, label } = parsePosition(position);
  const style = getPositionStyle(num);

  return (
    <span
      className="text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1"
      style={{ backgroundColor: style.bg, color: style.color, border: `1px solid ${style.border}` }}
    >
      {style.icon && <span>{style.icon}</span>}
      {label}
    </span>
  );
}
