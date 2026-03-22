import React from 'react';
import CompletedTournaments from '../components/CompletedTournaments';
import DynamicCompletedTournaments from '../components/DynamicCompletedTournaments';

export default function Tournaments() {
  return (
    <div className="min-h-screen pt-24 pb-16" style={{ backgroundColor: '#0d0d0f' }}>
      <div className="max-w-6xl mx-auto px-4">
        <CompletedTournaments />
        <DynamicCompletedTournaments />
      </div>
    </div>
  );
}
