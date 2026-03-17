import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initStore } from './data/store';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import LiveScores from './pages/LiveScores';
import Roster from './pages/Roster';
import Schedule from './pages/Schedule';
import History from './pages/History';
import Admin from './pages/Admin';

// Initialize localStorage with defaults on first load
initStore();

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
            <Route path="/history" element={<History />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}


