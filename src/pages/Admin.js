import React, { useState, useEffect } from 'react';
import {
  getMatches, addMatch, updateMatch, deleteMatch, setLiveMatch,
  getPlayers, addPlayer, updatePlayer, deletePlayer,
  getSettings, saveSettings, getLiveMatch,
} from '../data/store';

const ROLES = ['IGL', 'Sniper', 'Assaulter', 'Support', 'Entry Fragger'];
const STATUSES = ['LIVE', 'UPCOMING', 'FINISHED'];

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-grey text-sm mb-1">{label}</label>
      <input
        className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none transition"
        {...props}
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-grey text-sm mb-1">{label}</label>
      <select
        className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none transition"
        {...props}
      >
        {options.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

// =================== MATCHES TAB ===================
function MatchesTab() {
  const [matches, setMatches] = useState(getMatches());
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const blank = { opponent: '', tournament: '', date: '', time: '', game: 'Free Fire', status: 'UPCOMING', godlike_score: 0, opponent_score: 0, kills: 0, rank: 0 };
  const [form, setForm] = useState(blank);

  const refresh = () => setMatches(getMatches());

  const openNew = () => { setForm(blank); setEditing(null); setShowForm(true); };
  const openEdit = (m) => { setForm({ ...m }); setEditing(m.id); setShowForm(true); };

  const handleSave = () => {
    if (editing) {
      updateMatch(editing, form);
    } else {
      addMatch({ ...form });
    }
    setShowForm(false);
    refresh();
  };

  const handleDelete = (id) => { deleteMatch(id); refresh(); };
  const handleSetLive = (id) => { setLiveMatch(id); refresh(); };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Matches</h2>
        <button onClick={openNew} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition text-sm">
          + Add Match
        </button>
      </div>

      {showForm && (
        <div className="bg-dark border border-dark-border rounded-xl p-5 mb-6 animate-slide-up">
          <h3 className="font-heading font-bold text-lg text-white mb-4">{editing ? 'Edit Match' : 'New Match'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Opponent" value={form.opponent} onChange={e => f('opponent', e.target.value)} />
            <Input label="Tournament" value={form.tournament} onChange={e => f('tournament', e.target.value)} />
            <Input label="Date" type="date" value={form.date} onChange={e => f('date', e.target.value)} />
            <Input label="Time" type="time" value={form.time} onChange={e => f('time', e.target.value)} />
            <Select label="Status" options={STATUSES} value={form.status} onChange={e => f('status', e.target.value)} />
            <Input label="GodLike Score" type="number" value={form.godlike_score} onChange={e => f('godlike_score', +e.target.value)} />
            <Input label="Opponent Score" type="number" value={form.opponent_score} onChange={e => f('opponent_score', +e.target.value)} />
            <Input label="Kills" type="number" value={form.kills} onChange={e => f('kills', +e.target.value)} />
            <Input label="Rank" type="number" value={form.rank} onChange={e => f('rank', +e.target.value)} />
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition">Save</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-dark-card border border-dark-border text-grey hover:text-white rounded-lg transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-grey text-left border-b border-dark-border">
              <th className="py-2 px-3">Opponent</th>
              <th className="py-2 px-3">Tournament</th>
              <th className="py-2 px-3">Date</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Score</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m.id} className="border-b border-dark-border/50 hover:bg-white/5">
                <td className="py-3 px-3 font-semibold">{m.opponent}</td>
                <td className="py-3 px-3 text-grey">{m.tournament}</td>
                <td className="py-3 px-3 text-grey">{m.date}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    m.status === 'LIVE' ? 'bg-green-500/20 text-green-400' :
                    m.status === 'UPCOMING' ? 'bg-upcoming-blue/20 text-upcoming-blue' :
                    'bg-grey/20 text-grey'
                  }`}>{m.status}</span>
                </td>
                <td className="py-3 px-3 font-heading font-bold">
                  <span className="text-accent">{m.godlike_score}</span>
                  <span className="text-grey mx-1">-</span>
                  {m.opponent_score}
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => openEdit(m)} className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition">Edit</button>
                    <button onClick={() => handleDelete(m.id)} className="px-2 py-1 text-xs bg-loss/20 text-loss hover:bg-loss/30 rounded transition">Delete</button>
                    {m.status !== 'LIVE' && (
                      <button onClick={() => handleSetLive(m.id)} className="px-2 py-1 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded transition">Set LIVE</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =================== LIVE SCORE UPDATER TAB ===================
function LiveUpdaterTab() {
  const [matches, setMatches] = useState(getMatches());
  const live = matches.find(m => m.status === 'LIVE');
  const [selectedId, setSelectedId] = useState(live?.id || '');
  const [scores, setScores] = useState({
    godlike_score: live?.godlike_score || 0,
    opponent_score: live?.opponent_score || 0,
    kills: live?.kills || 0,
    rank: live?.rank || 0,
  });

  useEffect(() => {
    const l = getLiveMatch();
    if (l) {
      setSelectedId(l.id);
      setScores({ godlike_score: l.godlike_score, opponent_score: l.opponent_score, kills: l.kills, rank: l.rank });
    }
  }, []);

  const refresh = () => setMatches(getMatches());

  const handleUpdate = () => {
    if (!selectedId) return;
    updateMatch(selectedId, scores);
    refresh();
  };

  const quickKill = () => {
    setScores(prev => ({ ...prev, kills: prev.kills + 1 }));
  };

  const liveMatches = matches.filter(m => m.status === 'LIVE');

  const handleSelect = (id) => {
    setSelectedId(+id);
    const m = matches.find(x => x.id === +id);
    if (m) setScores({ godlike_score: m.godlike_score, opponent_score: m.opponent_score, kills: m.kills, rank: m.rank });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-heading font-bold text-2xl text-white mb-6 text-center">Live Score Updater</h2>

      {liveMatches.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-grey text-lg">No match is currently LIVE.</p>
          <p className="text-grey text-sm mt-2">Go to Matches tab and set a match as LIVE first.</p>
        </div>
      ) : (
        <div className="bg-dark-card border border-accent/30 rounded-2xl p-6 animate-slide-up">
          <div className="mb-6">
            <label className="block text-grey text-sm mb-2">Select Live Match</label>
            <select
              value={selectedId}
              onChange={e => handleSelect(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg px-3 py-3 text-white focus:border-accent focus:outline-none transition text-lg"
            >
              {liveMatches.map(m => (
                <option key={m.id} value={m.id}>vs {m.opponent} — {m.tournament}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-accent text-sm mb-2 font-semibold">GodLike Score</label>
              <input
                type="number"
                value={scores.godlike_score}
                onChange={e => setScores(p => ({ ...p, godlike_score: +e.target.value }))}
                className="w-full bg-dark border border-accent/30 rounded-lg px-4 py-4 text-accent text-center text-3xl font-heading font-bold focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-grey text-sm mb-2 font-semibold">Opponent Score</label>
              <input
                type="number"
                value={scores.opponent_score}
                onChange={e => setScores(p => ({ ...p, opponent_score: +e.target.value }))}
                className="w-full bg-dark border border-dark-border rounded-lg px-4 py-4 text-white text-center text-3xl font-heading font-bold focus:border-dark-border focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-grey text-sm mb-2">Kills</label>
              <input
                type="number"
                value={scores.kills}
                onChange={e => setScores(p => ({ ...p, kills: +e.target.value }))}
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-3 text-white text-center text-xl font-heading font-bold focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-grey text-sm mb-2">Rank</label>
              <input
                type="number"
                value={scores.rank}
                onChange={e => setScores(p => ({ ...p, rank: +e.target.value }))}
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-3 text-white text-center text-xl font-heading font-bold focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="flex-1 py-4 bg-accent hover:bg-accent-dark text-white rounded-xl font-heading font-bold text-xl transition"
            >
              UPDATE SCORE
            </button>
            <button
              onClick={quickKill}
              className="px-6 py-4 bg-win/20 text-win hover:bg-win/30 rounded-xl font-heading font-bold transition"
            >
              +1 Kill
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// =================== PLAYERS TAB ===================
function PlayersTab() {
  const [players, setPlayers] = useState(getPlayers());
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const blank = { name: '', game_name: '', role: 'IGL', bio: '', photo_url: '', is_active: true };
  const [form, setForm] = useState(blank);

  const refresh = () => setPlayers(getPlayers());

  const openNew = () => { setForm(blank); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditing(p.id); setShowForm(true); };

  const handleSave = () => {
    if (editing) {
      updatePlayer(editing, form);
    } else {
      addPlayer({ ...form });
    }
    setShowForm(false);
    refresh();
  };

  const handleDelete = (id) => { deletePlayer(id); refresh(); };
  const toggleActive = (p) => { updatePlayer(p.id, { is_active: !p.is_active }); refresh(); };

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading font-bold text-2xl text-white">Players</h2>
        <button onClick={openNew} className="px-4 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition text-sm">
          + Add Player
        </button>
      </div>

      {showForm && (
        <div className="bg-dark border border-dark-border rounded-xl p-5 mb-6 animate-slide-up">
          <h3 className="font-heading font-bold text-lg text-white mb-4">{editing ? 'Edit Player' : 'New Player'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Full Name" value={form.name} onChange={e => f('name', e.target.value)} />
            <Input label="In-Game Name" value={form.game_name} onChange={e => f('game_name', e.target.value)} />
            <Select label="Role" options={ROLES} value={form.role} onChange={e => f('role', e.target.value)} />
            <Input label="Photo URL" value={form.photo_url} onChange={e => f('photo_url', e.target.value)} placeholder="Paste image link" />
            <div className="sm:col-span-2">
              <label className="block text-grey text-sm mb-1">Bio</label>
              <textarea
                value={form.bio}
                onChange={e => f('bio', e.target.value)}
                rows={2}
                className="w-full bg-dark border border-dark-border rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none transition resize-none"
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="text-grey text-sm">Active</label>
              <button
                onClick={() => f('is_active', !form.is_active)}
                className={`w-12 h-6 rounded-full transition ${form.is_active ? 'bg-accent' : 'bg-dark-border'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${form.is_active ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} className="px-5 py-2 bg-accent hover:bg-accent-dark text-white rounded-lg font-semibold transition">Save</button>
            <button onClick={() => setShowForm(false)} className="px-5 py-2 bg-dark-card border border-dark-border text-grey hover:text-white rounded-lg transition">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-grey text-left border-b border-dark-border">
              <th className="py-2 px-3">Name</th>
              <th className="py-2 px-3">IGN</th>
              <th className="py-2 px-3">Role</th>
              <th className="py-2 px-3">Status</th>
              <th className="py-2 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {players.map(p => (
              <tr key={p.id} className="border-b border-dark-border/50 hover:bg-white/5">
                <td className="py-3 px-3 font-semibold">{p.name}</td>
                <td className="py-3 px-3 text-accent">{p.game_name}</td>
                <td className="py-3 px-3 text-grey">{p.role}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${p.is_active ? 'bg-win/20 text-win' : 'bg-loss/20 text-loss'}`}>
                    {p.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => openEdit(p)} className="px-2 py-1 text-xs bg-white/10 hover:bg-white/20 rounded transition">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="px-2 py-1 text-xs bg-loss/20 text-loss hover:bg-loss/30 rounded transition">Delete</button>
                    <button onClick={() => toggleActive(p)} className={`px-2 py-1 text-xs rounded transition ${p.is_active ? 'bg-loss/20 text-loss hover:bg-loss/30' : 'bg-win/20 text-win hover:bg-win/30'}`}>
                      {p.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// =================== SETTINGS TAB ===================
function SettingsTab() {
  const [settings, setSettings] = useState(getSettings());
  const [saved, setSaved] = useState(false);

  const f = (key, val) => setSettings(prev => ({ ...prev, [key]: val }));

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Settings</h2>
      <div className="space-y-4">
        <Input label="Admin Password" type="password" value={settings.admin_password} onChange={e => f('admin_password', e.target.value)} />
        <Input label="Site Title" value={settings.site_title} onChange={e => f('site_title', e.target.value)} />
        <Input label="Team Name" value={settings.team_name} onChange={e => f('team_name', e.target.value)} />
        <hr className="border-dark-border" />
        <p className="text-grey text-sm uppercase tracking-wider">Social Media Links</p>
        <Input label="Instagram URL" value={settings.instagram} onChange={e => f('instagram', e.target.value)} placeholder="https://instagram.com/..." />
        <Input label="YouTube URL" value={settings.youtube} onChange={e => f('youtube', e.target.value)} placeholder="https://youtube.com/..." />
        <Input label="Twitter/X URL" value={settings.twitter} onChange={e => f('twitter', e.target.value)} placeholder="https://x.com/..." />
        <button onClick={handleSave} className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-heading font-bold text-lg transition">
          {saved ? '✓ Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

// =================== ADMIN PAGE ===================
const TABS = [
  { id: 'matches', label: 'Matches' },
  { id: 'live', label: 'Live Updater' },
  { id: 'players', label: 'Players' },
  { id: 'settings', label: 'Settings' },
];

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('matches');

  const handleLogin = (e) => {
    e.preventDefault();
    const settings = getSettings();
    if (password === settings.admin_password) {
      setAuthed(true);
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl p-8 animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
              <span className="text-accent font-heading font-bold text-2xl">GL</span>
            </div>
            <h1 className="font-heading font-bold text-2xl text-white">Admin Login</h1>
            <p className="text-grey text-sm mt-1">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition text-center text-lg"
              autoFocus
            />
            {error && <p className="text-loss text-sm text-center">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-heading font-bold text-lg transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider mb-8">
          Admin <span className="text-accent">Dashboard</span>
        </h1>

        {/* Desktop tabs */}
        <div className="hidden sm:flex gap-1 mb-8 bg-dark-card border border-dark-border rounded-xl p-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2.5 rounded-lg font-heading font-semibold text-sm transition ${
                tab === t.id ? 'bg-accent text-white' : 'text-grey hover:text-white hover:bg-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Mobile dropdown */}
        <div className="sm:hidden mb-8">
          <select
            value={tab}
            onChange={e => setTab(e.target.value)}
            className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white font-heading font-semibold focus:border-accent focus:outline-none"
          >
            {TABS.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        {/* Tab content */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-5 sm:p-8">
          {tab === 'matches' && <MatchesTab />}
          {tab === 'live' && <LiveUpdaterTab />}
          {tab === 'players' && <PlayersTab />}
          {tab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
