import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initStore } from './data/store';
import { initTournamentStore } from './data/tournamentStore';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LiveScores from './pages/LiveScores';
import Roster from './pages/Roster';
import Schedule from './pages/Schedule';
import Admin from './pages/Admin';
import PlayerProfile from './pages/PlayerProfile';
import Tournaments from './pages/Tournaments';
import Heartbreak from './pages/Heartbreak';

// Initialize localStorage with defaults on first load
initStore();
initTournamentStore();

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark text-white font-body flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveScores />} />
            <Route path="/roster" element={<Roster />} />
            <Route path="/schedule" element={<Schedule />} />

            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/heartbreak" element={<Heartbreak />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


