import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  createTournamentInDB,
  updateTournamentInDB,
  deleteTournamentFromDB,
  changeTournamentStatus,
  appendBrMatchToLastStage,
  fetchTournamentsByStatus,
} from '../lib/supabaseTournaments';
import {
  fetchScheduleEntries,
  addScheduleEntryToDB,
  updateScheduleEntryInDB,
  deleteScheduleEntryFromDB,
} from '../lib/supabaseSchedule';
import {
  getMatches, addMatch, updateMatch, deleteMatch, setLiveMatch,
  getPlayers, addPlayer, updatePlayer, deletePlayer,
  getSettings, saveSettings, getLiveMatch,
} from '../data/store';
import {
  getAllTournaments, getTournamentsByStatus, getTournamentIndex,
  validateTournament,
  createBlankTournament,
  getActivityLog, clearActivityLog,
  undo, redo, canUndo, canRedo,
  computeAutoStandings,
  duplicateTournament, exportTournamentAsMarkdown,
} from '../data/tournamentStore';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const ROLES = ['IGL', 'Sniper', 'Assaulter', 'Support', 'Entry Fragger'];
const STATUSES = ['LIVE', 'UPCOMING', 'FINISHED'];
const TIER_OPTIONS = ['S', 'A', 'B', 'C', 'D', 'Community'];
const GAME_MODE_OPTIONS = ['BR', 'CS'];
const TOURNAMENT_STATUS_OPTIONS = ['upcoming', 'live', 'completed'];
const STAGE_TYPE_OPTIONS = ['br_points', 'cs_bracket', 'round_robin', 'swiss'];
const CS_FORMAT_OPTIONS = ['Bo1', 'Bo3', 'Bo5'];
const CHART_COLORS = ['#c9a84c', '#6366f1', '#22c55e', '#ef4444', '#3b82f6', '#f59e0b'];



function relativeTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return `${Math.floor(diff / 86400000)}d ago`;
}

function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 animate-slide-up">
      <div className="bg-dark-card border border-dark-border rounded-2xl p-6 max-w-sm w-full mx-4">
        <h3 className="font-heading font-bold text-lg text-white mb-2">{title}</h3>
        <p className="text-grey text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 bg-dark border border-dark-border text-grey hover:text-white rounded-lg transition text-sm">Cancel</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-loss hover:bg-loss/80 text-white rounded-lg font-semibold transition text-sm">Confirm</button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-grey text-sm mb-1">{label}</label>
      <input
        className={`w-full bg-dark border rounded-lg px-3 py-2 text-white focus:border-accent focus:outline-none transition ${error ? 'border-loss' : 'border-dark-border'}`}
        {...props}
      />
      {error && <p className="text-loss text-xs mt-1">{error}</p>}
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

// ─── Status badge helper ───
function StatusBadge({ status }) {
  const styles = {
    upcoming: 'bg-upcoming-blue/20 text-upcoming-blue',
    live: 'bg-green-500/20 text-green-400',
    completed: 'bg-grey/20 text-grey',
  };
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${styles[status] || styles.completed}`}>
      {status}
    </span>
  );
}

// ─── Tier badge helper ───
function TierBadge({ tier }) {
  const colors = { S: 'text-yellow-400 bg-yellow-400/10', A: 'text-orange-400 bg-orange-400/10', B: 'text-blue-400 bg-blue-400/10', C: 'text-green-400 bg-green-400/10', D: 'text-grey bg-grey/10', Community: 'text-purple-400 bg-purple-400/10' };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${colors[tier] || colors.D}`}>{tier}-Tier</span>;
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
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${m.status === 'LIVE' ? 'bg-green-500/20 text-green-400' :
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
  const blank = { name: '', game_name: '', role: 'IGL', bio: '', photo_url: '', is_active: true, total_kills: 0, matches_played: 0, best_rank: 0, win_rate: 0, avg_kills: 0, tournaments_played: 0, instagram: '', youtube: '', twitter: '' };
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
            <div className="sm:col-span-2">
              <hr className="border-dark-border my-2" />
              <p className="text-grey text-sm uppercase tracking-wider mb-3">Player Stats</p>
            </div>
            <Input label="Total Kills" type="number" value={form.total_kills || 0} onChange={e => f('total_kills', +e.target.value)} />
            <Input label="Matches Played" type="number" value={form.matches_played || 0} onChange={e => f('matches_played', +e.target.value)} />
            <Input label="Best Rank" type="number" value={form.best_rank || 0} onChange={e => f('best_rank', +e.target.value)} />
            <Input label="Win Rate %" type="number" value={form.win_rate || 0} onChange={e => f('win_rate', +e.target.value)} />
            <Input label="Avg Kills Per Match" type="number" value={form.avg_kills || 0} onChange={e => {
              f('avg_kills', +e.target.value);
            }} />
            <Input label="Tournaments Played" type="number" value={form.tournaments_played || 0} onChange={e => f('tournaments_played', +e.target.value)} />
            <div className="sm:col-span-2">
              <hr className="border-dark-border my-2" />
              <p className="text-grey text-sm uppercase tracking-wider mb-3">Social Links</p>
            </div>
            <Input label="Instagram URL" value={form.instagram || ''} onChange={e => f('instagram', e.target.value)} placeholder="https://instagram.com/..." />
            <Input label="YouTube URL" value={form.youtube || ''} onChange={e => f('youtube', e.target.value)} placeholder="https://youtube.com/..." />
            <Input label="Twitter/X URL" value={form.twitter || ''} onChange={e => f('twitter', e.target.value)} placeholder="https://x.com/..." />
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
              <th className="py-2 px-3">Kills</th>
              <th className="py-2 px-3">Matches</th>
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
                <td className="py-3 px-3 text-grey">{p.total_kills || 0}</td>
                <td className="py-3 px-3 text-grey">{p.matches_played || 0}</td>
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

// =================== LIVE CONTROL PANEL TAB ===================
function LiveControlPanelTab() {
  const [liveTournaments, setLiveTournaments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [tournament, setTournament] = useState(null);
  const [autoStandings, setAutoStandings] = useState(true);
  const [toast, setToast] = useState('');

  const refresh = useCallback(async () => {
    const live = await fetchTournamentsByStatus('live');
    setLiveTournaments(live);
    if (selectedId) {
      const t = live.find(x => x.id === selectedId);
      setTournament(t || null);
    }
  }, [selectedId]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (liveTournaments.length > 0 && !selectedId) {
      setSelectedId(liveTournaments[0].id);
      setTournament(liveTournaments[0]);
    }
  }, [liveTournaments, selectedId]);

  const selectTournament = (id) => {
    setSelectedId(id);
    const t = liveTournaments.find(x => x.id === id);
    setTournament(t || null);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  // Quick add match to the last stage
  const addQuickMatch = async (placement, kills, booyah, playerKills) => {
    if (!tournament || !selectedId) return;
    const rosterFallback = (tournament.playingFour?.length > 0 ? tournament.playingFour : (tournament.roster || ['YOGI', 'MARCO', 'NOBITA', 'ECOECO', 'NANCY']));
    const defaultPK = rosterFallback.reduce((acc, p) => ({ ...acc, [p]: 0 }), {});
    const matchData = {
      matchNum: ((tournament.stages || []).at(-1)?.matches?.length || 0) + 1,
      placement: placement || 0,
      kills: kills || 0,
      booyah: booyah || false,
      playerKills: playerKills || defaultPK,
      map: '',
    };
    try {
      await appendBrMatchToLastStage(selectedId, matchData);
      showToast('Match saved!');
      refresh();
    } catch (err) {
      showToast('Error: ' + err.message);
    }
  };

  const handleEndTournament = async () => {
    if (!selectedId) return;
    await changeTournamentStatus(selectedId, 'completed');
    showToast('Tournament marked complete');
    refresh();
  };

  // Derive active roster from tournament
  const activeRoster = tournament?.playingFour?.length > 0 ? tournament.playingFour : (tournament?.roster || ['YOGI', 'MARCO', 'NOBITA', 'ECOECO', 'NANCY']);
  const buildEmptyPK = (roster) => roster.reduce((acc, p) => ({ ...acc, [p]: 0 }), {});

  // Quick entry state
  const [qPlacement, setQPlacement] = useState(0);
  const [qKills, setQKills] = useState(0);
  const [qBooyah, setQBooyah] = useState(false);
  const [qPlayerKills, setQPlayerKills] = useState(() => buildEmptyPK(activeRoster));

  // Reset qPlayerKills when tournament changes
  useEffect(() => {
    setQPlayerKills(buildEmptyPK(activeRoster));
  }, [tournament?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPlayerKills = Object.values(qPlayerKills).reduce((a, b) => a + b, 0);
  const killMismatch = qKills > 0 && totalPlayerKills > 0 && totalPlayerKills !== qKills;

  const handleSaveMatch = () => {
    addQuickMatch(qPlacement, qKills, qBooyah, { ...qPlayerKills });
    setQPlacement(0); setQKills(0); setQBooyah(false);
    setQPlayerKills(buildEmptyPK(activeRoster));
  };

  const autoSummary = tournament ? computeAutoStandings(tournament) : null;

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Live Control Panel</h2>

      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-win/90 text-white px-4 py-2 rounded-lg text-sm font-semibold animate-slide-up">
          {toast}
        </div>
      )}

      {liveTournaments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-grey text-lg">No live tournaments.</p>
          <p className="text-grey text-sm mt-2">Move a tournament to LIVE status first.</p>
        </div>
      ) : (
        <>
          {/* Tournament Selector */}
          <div className="mb-6">
            <label className="block text-grey text-sm mb-2">Select Tournament</label>
            <select
              value={selectedId}
              onChange={e => selectTournament(e.target.value)}
              className="w-full bg-dark border border-dark-border rounded-lg px-3 py-3 text-white focus:border-accent focus:outline-none transition"
            >
              {liveTournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name} — {t.gameMode}</option>
              ))}
            </select>
          </div>

          {tournament && (
            <div className="space-y-6">
              {/* Current match indicator */}
              <div className="bg-dark border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Live Now</span>
                </div>
                <p className="text-white font-heading font-bold text-lg">{tournament.name}</p>
                <p className="text-grey text-xs">{tournament.organizer} — {tournament.gameMode} — {tournament.stages?.length || 0} stages — Match #{(tournament.stages?.at(-1)?.matches?.length || 0) + 1}</p>
              </div>

              {/* Quick Score Entry */}
              <div className="bg-dark-card border border-dark-border rounded-xl p-5">
                <p className="text-grey text-xs uppercase tracking-wider font-semibold mb-4">Quick Score Entry</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                  <Input label="Placement Points" type="number" value={qPlacement} onChange={e => setQPlacement(Math.max(0, +e.target.value))} />
                  <Input label="Total Kills" type="number" value={qKills} onChange={e => setQKills(Math.max(0, +e.target.value))} />
                  <div className="flex items-end gap-2">
                    <label className="text-grey text-xs">Booyah</label>
                    <button
                      onClick={() => setQBooyah(!qBooyah)}
                      className={`w-10 h-5 rounded-full transition ${qBooyah ? 'bg-accent' : 'bg-dark-border'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${qBooyah ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                </div>

                {/* Per-player kills */}
                <p className="text-grey text-[10px] uppercase tracking-wider mb-2">Player Kills</p>
                <div className={`grid gap-2 mb-3`} style={{ gridTemplateColumns: `repeat(${activeRoster.length}, minmax(0, 1fr))` }}>
                  {activeRoster.map(p => (
                    <div key={p} className="text-center">
                      <p className="text-grey text-[9px] mb-1">{p}</p>
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={qPlayerKills[p] || 0}
                          onChange={e => setQPlayerKills(prev => ({ ...prev, [p]: Math.max(0, +e.target.value) }))}
                          className="w-10 bg-dark border border-dark-border rounded text-white text-center text-xs py-1"
                        />
                        <button
                          onClick={() => setQPlayerKills(prev => ({ ...prev, [p]: prev[p] + 1 }))}
                          className="px-1.5 py-1 bg-win/20 text-win rounded text-[10px] hover:bg-win/30 transition"
                        >+1</button>
                      </div>
                    </div>
                  ))}
                </div>

                {killMismatch && (
                  <p className="text-yellow-400 text-[10px] mb-3">Player kills ({totalPlayerKills}) don't match total kills ({qKills})</p>
                )}

                <div className="flex gap-3">
                  <button onClick={handleSaveMatch} className="flex-1 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-heading font-bold transition">
                    Save Match
                  </button>
                  <button onClick={handleEndTournament} className="px-4 py-3 bg-loss/20 text-loss hover:bg-loss/30 rounded-lg font-semibold transition text-sm">
                    End Tournament
                  </button>
                </div>
              </div>

              {/* Auto-standings toggle & summary */}
              <div className="bg-dark border border-dark-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-grey text-xs uppercase tracking-wider font-semibold">Auto-Standings</p>
                  <button
                    onClick={() => setAutoStandings(!autoStandings)}
                    className={`w-10 h-5 rounded-full transition ${autoStandings ? 'bg-accent' : 'bg-dark-border'}`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoStandings ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {autoSummary && (
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div><p className="text-grey text-[9px] uppercase">Matches</p><p className="text-white font-bold">{autoSummary.matchesPlayed}</p></div>
                    <div><p className="text-grey text-[9px] uppercase">Kills</p><p className="text-white font-bold">{autoSummary.kills}</p></div>
                    <div><p className="text-grey text-[9px] uppercase">Points</p><p className="text-accent font-bold">{autoSummary.points}</p></div>
                    <div><p className="text-grey text-[9px] uppercase">Booyahs</p><p className="text-yellow-400 font-bold">{autoSummary.booyahs}</p></div>
                  </div>
                )}
              </div>

              {/* Saved Matches History */}
              {(() => {
                const allMatches = (tournament.stages || []).flatMap((s, si) =>
                  (s.matches || []).map((m, mi) => ({ ...m, stageName: s.name || `Stage ${si + 1}`, stageIdx: si, matchIdx: mi }))
                );
                if (allMatches.length === 0) return null;
                return (
                  <div className="bg-dark border border-dark-border rounded-xl p-4">
                    <p className="text-grey text-xs uppercase tracking-wider font-semibold mb-4">Match History ({allMatches.length} matches)</p>
                    <div className="space-y-2">
                      {allMatches.map((m, i) => {
                        const placementPts = Number(m.placement) || 0;
                        const matchPts = placementPts + (m.kills || 0);
                        const playerKillEntries = Object.entries(m.playerKills || {}).filter(([, v]) => v > 0);
                        return (
                          <div key={i} className="bg-dark-card border border-dark-border/50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="text-accent text-[10px] font-bold">Match {m.matchNum || i + 1}</span>
                                <span className="text-grey text-[10px]">{m.stageName}</span>
                                {m.map && <span className="text-grey text-[10px]">| {m.map}</span>}
                              </div>
                              <div className="flex items-center gap-2">
                                {m.booyah && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent">BOOYAH!</span>}
                                <span className="text-white font-heading font-bold text-sm">{matchPts} pts</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <span className="text-grey text-[10px]">Placement Pts:</span>
                                <span className="text-white text-xs font-semibold">{placementPts}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-grey text-[10px]">Kills:</span>
                                <span className="text-white text-xs font-semibold">{m.kills || 0}</span>
                              </div>
                            </div>
                            {playerKillEntries.length > 0 && (
                              <div className="flex gap-3 mt-1.5 flex-wrap">
                                {playerKillEntries.map(([p, k]) => (
                                  <span key={p} className="text-[10px]"><span className="text-grey">{p}:</span> <span className="text-white font-semibold">{k}</span></span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// =================== ANALYTICS TAB ===================
function AnalyticsTab() {
  const completed = getTournamentsByStatus('completed');

  // Stat calculations
  const totalTournaments = completed.length;
  let totalMatches = 0, totalKills = 0, totalBooyahs = 0, totalPlacementSum = 0, matchesWithPlacement = 0;
  const tierCounts = {};
  const killsPerGame = [];

  completed.forEach(t => {
    tierCounts[t.tier] = (tierCounts[t.tier] || 0) + 1;
    (t.stages || []).forEach(stage => {
      (stage.matches || []).forEach(m => {
        totalMatches++;
        totalKills += m.kills || 0;
        if (m.booyah) totalBooyahs++;
        if (m.placement > 0) { totalPlacementSum += m.placement; matchesWithPlacement++; }
        killsPerGame.push({ game: `G${killsPerGame.length + 1}`, kills: m.kills || 0 });
      });
    });
  });

  const avgPosition = matchesWithPlacement > 0 ? (totalPlacementSum / matchesWithPlacement).toFixed(1) : '—';
  const winRate = totalMatches > 0 ? ((totalBooyahs / totalMatches) * 100).toFixed(1) : '0';
  const avgKills = totalMatches > 0 ? (totalKills / totalMatches).toFixed(1) : '0';

  // Chart data
  const tierData = Object.entries(tierCounts).map(([tier, count]) => ({ name: tier + '-Tier', value: count }));
  const winRateData = [
    { name: 'Booyahs', value: totalBooyahs },
    { name: 'Other', value: Math.max(0, totalMatches - totalBooyahs) },
  ];

  const tournamentHistory = completed.slice(0, 10).reverse().map(t => {
    const auto = computeAutoStandings(t);
    return { name: t.name.length > 12 ? t.name.slice(0, 12) + '...' : t.name, kills: auto?.kills || 0, points: auto?.points || 0 };
  });

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Analytics</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Avg Position', value: avgPosition, color: 'text-upcoming-blue' },
          { label: 'Win Rate', value: `${winRate}%`, color: 'text-win' },
          { label: 'Avg Kills/Game', value: avgKills, color: 'text-accent' },
          { label: 'Tournaments', value: totalTournaments, color: 'text-white' },
        ].map(s => (
          <div key={s.label} className="bg-dark border border-dark-border rounded-xl p-4 text-center">
            <p className="text-grey text-[10px] uppercase tracking-wider mb-1">{s.label}</p>
            <p className={`font-heading font-bold text-2xl ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {totalMatches > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Win Rate Donut */}
          <div className="bg-dark border border-dark-border rounded-xl p-5">
            <p className="text-grey text-xs uppercase tracking-wider font-semibold mb-4">Win Rate</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={winRateData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                  {winRateData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid #2a2a2f', borderRadius: 8, color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tier Breakdown */}
          <div className="bg-dark border border-dark-border rounded-xl p-5">
            <p className="text-grey text-xs uppercase tracking-wider font-semibold mb-4">Tier Breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={tierData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2f" />
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 10 }} />
                <YAxis tick={{ fill: '#888', fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid #2a2a2f', borderRadius: 8, color: '#fff' }} />
                <Bar dataKey="value" fill="#c9a84c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Kills Trend */}
          {killsPerGame.length > 1 && (
            <div className="bg-dark border border-dark-border rounded-xl p-5">
              <p className="text-grey text-xs uppercase tracking-wider font-semibold mb-4">Kills Per Game (Trend)</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={killsPerGame.slice(-20)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2f" />
                  <XAxis dataKey="game" tick={{ fill: '#888', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#888', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid #2a2a2f', borderRadius: 8, color: '#fff' }} />
                  <Line type="monotone" dataKey="kills" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Tournament History */}
          {tournamentHistory.length > 0 && (
            <div className="bg-dark border border-dark-border rounded-xl p-5">
              <p className="text-grey text-xs uppercase tracking-wider font-semibold mb-4">Tournament History</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={tournamentHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2f" />
                  <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 8 }} angle={-20} textAnchor="end" height={50} />
                  <YAxis tick={{ fill: '#888', fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: '#1a1a1f', border: '1px solid #2a2a2f', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="kills" fill="#ef4444" radius={[4, 4, 0, 0]} name="Kills" />
                  <Bar dataKey="points" fill="#c9a84c" radius={[4, 4, 0, 0]} name="Points" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {totalMatches === 0 && (
        <div className="text-center py-10">
          <p className="text-grey text-lg">No match data yet.</p>
          <p className="text-grey text-sm mt-2">Analytics will appear once tournaments have match results.</p>
        </div>
      )}
    </div>
  );
}

// =================== OVERVIEW TAB ===================
function OverviewTab({ setTab }) {
  const index = getTournamentIndex();
  const counts = { upcoming: 0, live: 0, completed: 0 };
  index.forEach(e => { if (counts[e.status] !== undefined) counts[e.status]++; });

  const all = getAllTournaments().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)).slice(0, 5);

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Tournament Overview</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Upcoming', count: counts.upcoming, color: 'text-upcoming-blue', bg: 'bg-upcoming-blue/10 border-upcoming-blue/20', tab: 'upcoming' },
          { label: 'Live', count: counts.live, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', tab: 'live-tournaments' },
          { label: 'Completed', count: counts.completed, color: 'text-grey', bg: 'bg-grey/10 border-grey/20', tab: 'completed' },
        ].map(c => (
          <button
            key={c.label}
            onClick={() => setTab(c.tab)}
            className={`rounded-xl p-5 border text-left transition hover:scale-[1.02] ${c.bg}`}
          >
            <p className="text-grey text-xs uppercase tracking-wider mb-1">{c.label}</p>
            <p className={`font-heading font-bold text-4xl ${c.color}`}>{c.count}</p>
          </button>
        ))}
      </div>

      {/* Recent Tournaments */}
      <div className="bg-dark border border-dark-border rounded-xl p-5">
        <h3 className="font-heading font-bold text-sm text-grey uppercase tracking-wider mb-4">Recently Updated</h3>
        {all.length === 0 ? (
          <p className="text-grey text-sm">No tournaments found.</p>
        ) : (
          <div className="space-y-2">
            {all.map(t => (
              <div key={t.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-dark-card border border-dark-border/50 hover:border-accent/30 transition">
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{t.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <TierBadge tier={t.tier} />
                    <span className="text-[10px] text-grey">{t.gameMode}</span>
                    <span className="text-[10px] text-grey">{t.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <StatusBadge status={t.status} />
                  <span className="text-[10px] text-grey">{t.godlikeFinalPosition || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =================== CREATE TOURNAMENT TAB ===================
function CreateTournamentTab({ onCreated }) {
  const blank = {
    ...createBlankTournament(),
    name: '', organizer: '', gameMode: 'BR', region: '', tier: 'C',
    status: 'upcoming', startDate: '', endDate: '', prizePoolINR: 0, prizePoolUSD: 0,
    teamsCount: 0, liquipediaURL: '', instagramURL: '', vodLinks: [],
  };
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState([]);
  const [saved, setSaved] = useState(false);

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const addVod = () => setForm(prev => ({ ...prev, vodLinks: [...prev.vodLinks, { stage: '', url: '' }] }));
  const removeVod = (i) => setForm(prev => ({ ...prev, vodLinks: prev.vodLinks.filter((_, idx) => idx !== i) }));
  const updateVod = (i, key, val) => setForm(prev => ({
    ...prev,
    vodLinks: prev.vodLinks.map((v, idx) => idx === i ? { ...v, [key]: val } : v),
  }));

  const handleSubmit = async () => {
    const validation = validateTournament(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    setErrors([]);
    try {
      await createTournamentInDB(form);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        setForm(blank);
        if (onCreated) onCreated();
      }, 1500);
    } catch (err) {
      setErrors([err.message]);
    }
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-white mb-6">Create Tournament</h2>

      {errors.length > 0 && (
        <div className="bg-loss/10 border border-loss/30 rounded-lg p-4 mb-6">
          {errors.map((e, i) => <p key={i} className="text-loss text-sm">{e}</p>)}
        </div>
      )}

      {saved && (
        <div className="bg-win/10 border border-win/30 rounded-lg p-4 mb-6 animate-slide-up">
          <p className="text-win text-sm font-semibold">Tournament created successfully!</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Input label="Tournament Name *" value={form.name} onChange={e => f('name', e.target.value)} />
        <Input label="Organizer *" value={form.organizer} onChange={e => f('organizer', e.target.value)} />
        <Select label="Game Mode *" options={GAME_MODE_OPTIONS} value={form.gameMode} onChange={e => f('gameMode', e.target.value)} />
        <Input label="Region *" value={form.region} onChange={e => f('region', e.target.value)} />
        <Select label="Tier *" options={TIER_OPTIONS} value={form.tier} onChange={e => f('tier', e.target.value)} />
        <Select label="Status *" options={TOURNAMENT_STATUS_OPTIONS} value={form.status} onChange={e => f('status', e.target.value)} />
        <Input label="Start Date *" type="date" value={form.startDate} onChange={e => f('startDate', e.target.value)} />
        <Input label="End Date *" type="date" value={form.endDate} onChange={e => f('endDate', e.target.value)} />
        <Input label="Prize Pool (INR)" type="number" value={form.prizePoolINR} onChange={e => f('prizePoolINR', e.target.value === '' ? '' : +e.target.value)} />
        <Input label="Prize Pool (USD)" type="number" value={form.prizePoolUSD} onChange={e => f('prizePoolUSD', e.target.value === '' ? '' : +e.target.value)} />
        <Input label="Teams Count *" type="number" value={form.teamsCount} onChange={e => f('teamsCount', +e.target.value)} />
        <Input label="Liquipedia URL" value={form.liquipediaURL} onChange={e => f('liquipediaURL', e.target.value)} placeholder="https://liquipedia.net/..." />
        <Input label="Instagram Link" value={form.instagramURL} onChange={e => f('instagramURL', e.target.value)} placeholder="https://instagram.com/..." />
      </div>

      {/* VOD Links */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-grey text-sm uppercase tracking-wider">VOD Links</p>
          <button onClick={addVod} className="px-3 py-1 text-xs bg-accent/20 text-accent hover:bg-accent/30 rounded transition">
            + Add VOD Link
          </button>
        </div>
        {form.vodLinks.map((v, i) => (
          <div key={i} className="flex gap-2 mb-2 items-end">
            <div className="flex-1">
              <Input label="Stage" value={v.stage} onChange={e => updateVod(i, 'stage', e.target.value)} placeholder="e.g. Grand Finals" />
            </div>
            <div className="flex-[2]">
              <Input label="URL" value={v.url} onChange={e => updateVod(i, 'url', e.target.value)} placeholder="https://youtube.com/..." />
            </div>
            <button onClick={() => removeVod(i)} className="px-2 py-2 text-xs bg-loss/20 text-loss hover:bg-loss/30 rounded transition mb-0.5">X</button>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-heading font-bold text-lg transition">
        {saved ? '✓ Created!' : 'Create Tournament'}
      </button>
    </div>
  );
}

// =================== TOURNAMENT LIST (shared by Upcoming/Live/Completed tabs) ===================
function TournamentListTab({ statusFilter, setTab }) {
  const [tournaments, setTournaments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editErrors, setEditErrors] = useState([]);
  const [editSaved, setEditSaved] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null });
  const [toast, setToast] = useState('');
  const [previewId, setPreviewId] = useState(null);
  const autoSaveTimer = useRef(null);

  const refresh = useCallback(async () => {
    const data = await fetchTournamentsByStatus(statusFilter);
    setTournaments(data);
  }, [statusFilter]);

  useEffect(() => { refresh(); }, [refresh]);

  // Escape key to close editor
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && editingId) closeEdit(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  const labels = { upcoming: 'Upcoming', live: 'Live', completed: 'Completed' };

  const confirm = (title, message, onConfirm) => setConfirmDialog({ open: true, title, message, onConfirm });
  const closeConfirm = () => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null });

  const handleDelete = (id) => {
    confirm('Delete Tournament', 'Delete this tournament? This cannot be undone.', async () => {
      await deleteTournamentFromDB(id);
      refresh();
      closeConfirm();
    });
  };

  const handleGoLive = (id) => {
    confirm('Go Live', 'Move this tournament to LIVE status?', async () => {
      await changeTournamentStatus(id, 'live');
      refresh();
      closeConfirm();
    });
  };

  const handleMarkComplete = (id) => {
    confirm('Mark Complete', 'Mark this tournament as COMPLETED?', async () => {
      await changeTournamentStatus(id, 'completed');
      refresh();
      closeConfirm();
    });
  };

  const handleRevert = (id) => {
    confirm('Revert Status', 'Revert this tournament to previous status?', async () => {
      const t = tournaments.find(x => x.id === id);
      const prev = t?.status === 'completed' ? 'live' : 'upcoming';
      await changeTournamentStatus(id, prev);
      refresh();
      closeConfirm();
    });
  };

  const handleDuplicate = (id) => {
    const dup = duplicateTournament(id);
    if (dup) showToast(`Duplicated as "${dup.name}"`);
    refresh();
  };

  const handleExport = (id) => {
    const md = exportTournamentAsMarkdown(id);
    if (!md) return;
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tournament-${id}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported as Markdown');
  };

  const openEdit = (t) => {
    setEditingId(t.id);
    setEditForm({ ...t, playingFour: t.playingFour || [] });
    setEditErrors([]);
    setEditSaved(false);
  };

  const closeEdit = () => { setEditingId(null); setEditForm(null); setEditErrors([]); if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current); };

  const ef = (key, val) => {
    setEditForm(prev => ({ ...prev, [key]: val }));
    // Auto-save with 2s debounce
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      setEditForm(current => {
        if (current && editingId) {
          const validation = validateTournament(current);
          if (validation.valid) {
            updateTournamentInDB(editingId, current).then(() => showToast('Auto-saved')).catch(() => {});
          }
        }
        return current;
      });
    }, 2000);
  };

  // ─── Stage management helpers ───
  const addStage = () => ef('stages', [...(editForm.stages || []), { name: '', type: 'br_points', dateRange: '', teamsInStage: 0, qualificationRule: '' }]);
  const removeStage = (i) => ef('stages', (editForm.stages || []).filter((_, idx) => idx !== i));
  const updateStage = (i, key, val) => ef('stages', (editForm.stages || []).map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  // ─── BR match helpers within a stage ───
  const addBRMatch = (stageIdx) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    const activeRoster = editForm.playingFour?.length > 0 ? editForm.playingFour : (editForm.roster || []);
    const playerKills = activeRoster.reduce((acc, p) => ({ ...acc, [p]: 0 }), {});
    stage.matches = [...(stage.matches || []), { matchNum: (stage.matches || []).length + 1, placement: 0, kills: 0, playerKills, booyah: false, map: '' }];
    stages[stageIdx] = stage;
    ef('stages', stages);
  };
  const removeBRMatch = (stageIdx, matchIdx) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    stage.matches = (stage.matches || []).filter((_, i) => i !== matchIdx);
    stages[stageIdx] = stage;
    ef('stages', stages);
  };
  const updateBRMatch = (stageIdx, matchIdx, key, val) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    stage.matches = (stage.matches || []).map((m, i) => i === matchIdx ? { ...m, [key]: val } : m);
    stages[stageIdx] = stage;
    ef('stages', stages);
  };
  const updatePlayerKill = (stageIdx, matchIdx, player, val) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    stage.matches = (stage.matches || []).map((m, i) => {
      if (i !== matchIdx) return m;
      return { ...m, playerKills: { ...m.playerKills, [player]: val } };
    });
    stages[stageIdx] = stage;
    ef('stages', stages);
  };

  // ─── CS match helpers within a stage ───
  const addCSMatch = (stageIdx) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    stage.csMatches = [...(stage.csMatches || []), { roundName: '', format: 'Bo3', opponent: '', games: [] }];
    stages[stageIdx] = stage;
    ef('stages', stages);
  };
  const removeCSMatch = (stageIdx, matchIdx) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    stage.csMatches = (stage.csMatches || []).filter((_, i) => i !== matchIdx);
    stages[stageIdx] = stage;
    ef('stages', stages);
  };
  const updateCSMatch = (stageIdx, matchIdx, key, val) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    stage.csMatches = (stage.csMatches || []).map((m, i) => i === matchIdx ? { ...m, [key]: val } : m);
    stages[stageIdx] = stage;
    ef('stages', stages);
  };
  const addCSGame = (stageIdx, matchIdx) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    const maxGames = { Bo1: 1, Bo3: 3, Bo5: 5 }[stage.csMatches[matchIdx].format] || 5;
    if ((stage.csMatches[matchIdx].games || []).length >= maxGames) return;
    stage.csMatches = (stage.csMatches || []).map((m, i) => {
      if (i !== matchIdx) return m;
      return { ...m, games: [...(m.games || []), { godlikeScore: 0, opponentScore: 0 }] };
    });
    stages[stageIdx] = stage;
    ef('stages', stages);
  };
  const updateCSGame = (stageIdx, matchIdx, gameIdx, key, val) => {
    const stages = [...(editForm.stages || [])];
    const stage = { ...stages[stageIdx] };
    stage.csMatches = (stage.csMatches || []).map((m, i) => {
      if (i !== matchIdx) return m;
      return { ...m, games: (m.games || []).map((g, gi) => gi === gameIdx ? { ...g, [key]: val } : g) };
    });
    stages[stageIdx] = stage;
    ef('stages', stages);
  };

  // ─── Standings helpers ───
  const addStandingsRow = () => ef('standings', [...(editForm.standings || []), { rank: (editForm.standings || []).length + 1, team: '', booyahs: 0, kills: 0, placementPts: 0, points: 0, prizeINR: 0, prizeUSD: 0 }]);
  const removeStandingsRow = (i) => ef('standings', (editForm.standings || []).filter((_, idx) => idx !== i));
  const updateStandingsRow = (i, key, val) => ef('standings', (editForm.standings || []).map((r, idx) => idx === i ? { ...r, [key]: val } : r));

  // ─── Journey helpers ───
  const addJourneyStage = () => ef('godlikeJourney', [...(editForm.godlikeJourney || []), { stage: '', position: '', points: 0, outcome: 'advanced', notes: '' }]);
  const removeJourneyStage = (i) => ef('godlikeJourney', (editForm.godlikeJourney || []).filter((_, idx) => idx !== i));
  const updateJourneyStage = (i, key, val) => ef('godlikeJourney', (editForm.godlikeJourney || []).map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  const handleEditSave = async () => {
    const validation = validateTournament(editForm);
    if (!validation.valid) {
      setEditErrors(validation.errors);
      return;
    }
    setEditErrors([]);
    try {
      await updateTournamentInDB(editingId, editForm);
      setEditSaved(true);
      setTimeout(() => { setEditSaved(false); closeEdit(); refresh(); }, 1200);
    } catch (err) {
      setEditErrors([err.message]);
    }
  };

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-white mb-6">{labels[statusFilter]} Tournaments</h2>

      {tournaments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-grey text-lg">No {statusFilter} tournaments.</p>
          <p className="text-grey text-sm mt-2">Create one from the "Create Tournament" tab.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tournaments.map(t => (
            <div key={t.id}>
              {/* Tournament Card */}
              <div className="bg-dark border border-dark-border rounded-xl p-5 hover:border-accent/30 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-heading font-bold text-lg text-white truncate">{t.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <TierBadge tier={t.tier} />
                      <span className="text-[10px] text-grey uppercase">{t.gameMode}</span>
                      <span className="text-[10px] text-grey">{t.region}</span>
                      <span className="text-[10px] text-grey">{t.teamsCount} teams</span>
                      {t.prizePoolINR > 0 && <span className="text-[10px] text-accent">INR {t.prizePoolINR.toLocaleString()}</span>}
                      {t.prizePoolUSD > 0 && <span className="text-[10px] text-accent">${t.prizePoolUSD.toLocaleString()}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-grey">{t.startDate || '—'} to {t.endDate || '—'}</span>
                      {t.godlikeFinalPosition && <span className="text-[10px] text-accent font-semibold">GodLike: {t.godlikeFinalPosition}</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    <button onClick={() => editingId === t.id ? closeEdit() : openEdit(t)} className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition font-semibold">
                      {editingId === t.id ? 'Close' : 'Edit'}
                    </button>
                    <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 text-xs bg-loss/20 text-loss hover:bg-loss/30 rounded-lg transition font-semibold">Delete</button>
                    {statusFilter === 'upcoming' && (
                      <>
                        <button onClick={() => handleGoLive(t.id)} className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition font-semibold">Go Live</button>
                        <button onClick={() => handleMarkComplete(t.id)} className="px-3 py-1.5 text-xs bg-grey/20 text-grey hover:bg-grey/30 rounded-lg transition font-semibold">Mark Complete</button>
                      </>
                    )}
                    {statusFilter === 'live' && (
                      <>
                        <button onClick={() => handleMarkComplete(t.id)} className="px-3 py-1.5 text-xs bg-grey/20 text-grey hover:bg-grey/30 rounded-lg transition font-semibold">Mark Complete</button>
                        <button onClick={() => handleRevert(t.id)} className="px-3 py-1.5 text-xs bg-upcoming-blue/20 text-upcoming-blue hover:bg-upcoming-blue/30 rounded-lg transition font-semibold">Revert</button>
                      </>
                    )}
                    {statusFilter === 'completed' && (
                      <button onClick={() => handleRevert(t.id)} className="px-3 py-1.5 text-xs bg-green-500/20 text-green-400 hover:bg-green-500/30 rounded-lg transition font-semibold">Revert to Live</button>
                    )}
                    <button onClick={() => handleDuplicate(t.id)} className="px-3 py-1.5 text-xs bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition font-semibold">Duplicate</button>
                    <button onClick={() => handleExport(t.id)} className="px-3 py-1.5 text-xs bg-upcoming-blue/20 text-upcoming-blue hover:bg-upcoming-blue/30 rounded-lg transition font-semibold">Export</button>
                    <button onClick={() => setPreviewId(previewId === t.id ? null : t.id)} className="px-3 py-1.5 text-xs bg-accent/20 text-accent hover:bg-accent/30 rounded-lg transition font-semibold">
                      {previewId === t.id ? 'Hide Preview' : 'Preview'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Inline Editor */}
              {editingId === t.id && editForm && (
                <div className="bg-dark-card border border-accent/30 rounded-xl p-5 mt-2 animate-slide-up">
                  {editErrors.length > 0 && (
                    <div className="bg-loss/10 border border-loss/30 rounded-lg p-3 mb-4">
                      {editErrors.map((e, i) => <p key={i} className="text-loss text-sm">{e}</p>)}
                    </div>
                  )}
                  {editSaved && (
                    <div className="bg-win/10 border border-win/30 rounded-lg p-3 mb-4">
                      <p className="text-win text-sm font-semibold">Saved!</p>
                    </div>
                  )}

                  {/* Basic Fields */}
                  <p className="text-grey text-xs uppercase tracking-wider mb-3 font-semibold">Basic Info</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <Input label="Name" value={editForm.name} onChange={e => ef('name', e.target.value)} />
                    <Input label="Organizer" value={editForm.organizer} onChange={e => ef('organizer', e.target.value)} />
                    <Select label="Game Mode" options={GAME_MODE_OPTIONS} value={editForm.gameMode} onChange={e => ef('gameMode', e.target.value)} />
                    <Input label="Region" value={editForm.region} onChange={e => ef('region', e.target.value)} />
                    <Select label="Tier" options={TIER_OPTIONS} value={editForm.tier} onChange={e => ef('tier', e.target.value)} />
                    <Input label="Start Date" type="date" value={editForm.startDate} onChange={e => ef('startDate', e.target.value)} />
                    <Input label="End Date" type="date" value={editForm.endDate} onChange={e => ef('endDate', e.target.value)} />
                    <Input label="Teams" type="number" value={editForm.teamsCount} onChange={e => ef('teamsCount', +e.target.value)} />
                    <Input label="Prize INR" type="number" value={editForm.prizePoolINR} onChange={e => ef('prizePoolINR', e.target.value === '' ? '' : +e.target.value)} />
                    <Input label="Prize USD" type="number" value={editForm.prizePoolUSD} onChange={e => ef('prizePoolUSD', e.target.value === '' ? '' : +e.target.value)} />
                    <Input label="GodLike Position" value={editForm.godlikeFinalPosition} onChange={e => ef('godlikeFinalPosition', e.target.value)} />
                    <Input label="Liquipedia URL" value={editForm.liquipediaURL || ''} onChange={e => ef('liquipediaURL', e.target.value)} />
                  </div>

                  {/* Playing 4 Selector */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-grey text-xs uppercase tracking-wider font-semibold">Playing 4</p>
                      <span className="text-accent text-[10px]">({(editForm.playingFour || []).length}/{(editForm.roster || []).length} selected)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editForm.roster || []).map(player => {
                        const isSelected = (editForm.playingFour || []).includes(player);
                        return (
                          <button
                            key={player}
                            onClick={() => {
                              if (isSelected) {
                                ef('playingFour', (editForm.playingFour || []).filter(p => p !== player));
                              } else {
                                ef('playingFour', [...(editForm.playingFour || []), player]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${isSelected ? 'bg-accent/20 border-accent/30 text-accent' : 'bg-dark border-dark-border text-grey hover:text-white'}`}
                          >
                            {player}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Stages */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-grey text-xs uppercase tracking-wider font-semibold">Stages</p>
                      <button onClick={addStage} className="px-3 py-1 text-xs bg-accent/20 text-accent hover:bg-accent/30 rounded transition">+ Add Stage</button>
                    </div>
                    {(editForm.stages || []).map((stage, si) => (
                      <div key={si} className="bg-dark border border-dark-border rounded-lg p-4 mb-3">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-accent text-xs font-bold uppercase">Stage {si + 1}</span>
                          <button onClick={() => removeStage(si)} className="text-xs text-loss hover:text-loss/80 transition">Remove</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                          <Input label="Name" value={stage.name} onChange={e => updateStage(si, 'name', e.target.value)} />
                          <Select label="Type" options={STAGE_TYPE_OPTIONS} value={stage.type || 'br_points'} onChange={e => updateStage(si, 'type', e.target.value)} />
                          <Input label="Teams" type="number" value={stage.teamsInStage || 0} onChange={e => updateStage(si, 'teamsInStage', +e.target.value)} />
                        </div>
                        <Input label="Qualification Rule" value={stage.qualificationRule || ''} onChange={e => updateStage(si, 'qualificationRule', e.target.value)} />

                        {/* BR Match Boxes */}
                        {stage.type === 'br_points' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-grey text-[10px] uppercase tracking-wider">BR Matches</span>
                              <button onClick={() => addBRMatch(si)} className="px-2 py-0.5 text-[10px] bg-accent/20 text-accent rounded transition">+ Match</button>
                            </div>
                            {(stage.matches || []).map((m, mi) => (
                              <div key={mi} className="bg-dark-card border border-dark-border/50 rounded-lg p-3 mb-2">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-accent text-[10px] font-bold">Match {m.matchNum || mi + 1}</span>
                                  <button onClick={() => removeBRMatch(si, mi)} className="text-[10px] text-loss">Remove</button>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-2">
                                  <Input label="Map" value={m.map || ''} onChange={e => updateBRMatch(si, mi, 'map', e.target.value)} />
                                  <Input label="Placement (1-18)" type="number" value={m.placement || 0} onChange={e => updateBRMatch(si, mi, 'placement', Math.min(18, Math.max(0, +e.target.value)))} error={m.placement && (m.placement < 1 || m.placement > 18) ? '1-18' : ''} />
                                  <Input label="Kills" type="number" value={m.kills || 0} onChange={e => updateBRMatch(si, mi, 'kills', Math.max(0, +e.target.value))} />
                                  <div className="flex items-end gap-2">
                                    <label className="text-grey text-xs">Booyah</label>
                                    <button
                                      onClick={() => updateBRMatch(si, mi, 'booyah', !m.booyah)}
                                      className={`w-10 h-5 rounded-full transition ${m.booyah ? 'bg-accent' : 'bg-dark-border'}`}
                                    >
                                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${m.booyah ? 'translate-x-5' : 'translate-x-0.5'}`} />
                                    </button>
                                  </div>
                                </div>
                                <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${(editForm.playingFour?.length > 0 ? editForm.playingFour : editForm.roster || []).length || 5}, minmax(0, 1fr))` }}>
                                  {(editForm.playingFour?.length > 0 ? editForm.playingFour : editForm.roster || []).map(p => (
                                    <Input key={p} label={p} type="number" value={(m.playerKills || {})[p] || 0} onChange={e => updatePlayerKill(si, mi, p, Math.max(0, +e.target.value))} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* CS Match Boxes */}
                        {stage.type === 'cs_bracket' && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-grey text-[10px] uppercase tracking-wider">CS Matches</span>
                              <button onClick={() => addCSMatch(si)} className="px-2 py-0.5 text-[10px] bg-accent/20 text-accent rounded transition">+ CS Match</button>
                            </div>
                            {(stage.csMatches || []).map((cm, cmi) => {
                              const glWins = (cm.games || []).filter(g => g.godlikeScore > g.opponentScore).length;
                              const opWins = (cm.games || []).filter(g => g.opponentScore > g.godlikeScore).length;
                              return (
                                <div key={cmi} className="bg-dark-card border border-dark-border/50 rounded-lg p-3 mb-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-accent text-[10px] font-bold">CS Match {cmi + 1}</span>
                                    <button onClick={() => removeCSMatch(si, cmi)} className="text-[10px] text-loss">Remove</button>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
                                    <Input label="Round Name" value={cm.roundName || ''} onChange={e => updateCSMatch(si, cmi, 'roundName', e.target.value)} />
                                    <Select label="Format" options={CS_FORMAT_OPTIONS} value={cm.format || 'Bo3'} onChange={e => updateCSMatch(si, cmi, 'format', e.target.value)} />
                                    <Input label="Opponent" value={cm.opponent || ''} onChange={e => updateCSMatch(si, cmi, 'opponent', e.target.value)} />
                                  </div>
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-grey text-[10px]">Games ({(cm.games || []).length})</span>
                                    <button onClick={() => addCSGame(si, cmi)} className="px-2 py-0.5 text-[10px] bg-accent/20 text-accent rounded transition">+ Game</button>
                                  </div>
                                  {(cm.games || []).map((g, gi) => (
                                    <div key={gi} className="flex items-center gap-2 mb-1">
                                      <span className="text-grey text-[10px] w-10">G{gi + 1}</span>
                                      <Input label="" type="number" value={g.godlikeScore} onChange={e => updateCSGame(si, cmi, gi, 'godlikeScore', +e.target.value)} />
                                      <span className="text-grey text-xs">vs</span>
                                      <Input label="" type="number" value={g.opponentScore} onChange={e => updateCSGame(si, cmi, gi, 'opponentScore', +e.target.value)} />
                                    </div>
                                  ))}
                                  {(cm.games || []).length > 0 && (
                                    <p className="text-accent text-[10px] font-bold mt-1">
                                      Series: GodLike {glWins} - {opWins} {cm.opponent || 'Opponent'}
                                    </p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Standings */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-grey text-xs uppercase tracking-wider font-semibold">Standings</p>
                      <button onClick={addStandingsRow} className="px-3 py-1 text-xs bg-accent/20 text-accent hover:bg-accent/30 rounded transition">+ Add Row</button>
                    </div>
                    {(editForm.standings || []).length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-grey border-b border-dark-border">
                              <th className="py-1 px-2 text-left">#</th>
                              <th className="py-1 px-2 text-left">Team</th>
                              <th className="py-1 px-2">BYH</th>
                              <th className="py-1 px-2">Kills</th>
                              <th className="py-1 px-2">Pos Pts</th>
                              <th className="py-1 px-2">Total</th>
                              <th className="py-1 px-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {(editForm.standings || []).map((r, i) => (
                              <tr key={i} className="border-b border-dark-border/30">
                                <td className="py-1 px-2"><input type="number" value={r.rank || ''} onChange={e => updateStandingsRow(i, 'rank', +e.target.value)} className="w-10 bg-transparent border-b border-dark-border text-white text-center" /></td>
                                <td className="py-1 px-2"><input value={r.team || ''} onChange={e => updateStandingsRow(i, 'team', e.target.value)} className="w-full bg-transparent border-b border-dark-border text-white" /></td>
                                <td className="py-1 px-2"><input type="number" value={r.booyahs || 0} onChange={e => updateStandingsRow(i, 'booyahs', +e.target.value)} className="w-12 bg-transparent border-b border-dark-border text-white text-center" /></td>
                                <td className="py-1 px-2"><input type="number" value={r.kills || 0} onChange={e => updateStandingsRow(i, 'kills', Math.max(0, +e.target.value))} className="w-12 bg-transparent border-b border-dark-border text-white text-center" /></td>
                                <td className="py-1 px-2"><input type="number" value={r.placementPts || 0} onChange={e => updateStandingsRow(i, 'placementPts', +e.target.value)} className="w-12 bg-transparent border-b border-dark-border text-white text-center" /></td>
                                <td className="py-1 px-2"><input type="number" value={r.points || 0} onChange={e => updateStandingsRow(i, 'points', +e.target.value)} className="w-14 bg-transparent border-b border-dark-border text-accent text-center font-bold" /></td>
                                <td className="py-1 px-2"><button onClick={() => removeStandingsRow(i)} className="text-loss text-[10px]">X</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* GodLike Journey */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-grey text-xs uppercase tracking-wider font-semibold">GodLike's Journey</p>
                      <button onClick={addJourneyStage} className="px-3 py-1 text-xs bg-accent/20 text-accent hover:bg-accent/30 rounded transition">+ Add Stage</button>
                    </div>
                    {(editForm.godlikeJourney || []).map((j, i) => (
                      <div key={i} className="bg-dark border border-dark-border rounded-lg p-3 mb-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-accent text-[10px] font-bold">Stage {i + 1}</span>
                          <button onClick={() => removeJourneyStage(i)} className="text-[10px] text-loss">Remove</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <Input label="Stage Name" value={j.stage || ''} onChange={e => updateJourneyStage(i, 'stage', e.target.value)} />
                          <Input label="Position" value={j.position || ''} onChange={e => updateJourneyStage(i, 'position', e.target.value)} />
                          <Input label="Points" type="number" value={j.points || 0} onChange={e => updateJourneyStage(i, 'points', +e.target.value)} />
                          <Select label="Outcome" options={['advanced', 'eliminated', 'champions', 'runner_up']} value={j.outcome || 'advanced'} onChange={e => updateJourneyStage(i, 'outcome', e.target.value)} />
                          <div className="sm:col-span-2">
                            <Input label="Notes" value={j.notes || ''} onChange={e => updateJourneyStage(i, 'notes', e.target.value)} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleEditSave} className="w-full py-3 bg-accent hover:bg-accent-dark text-white rounded-lg font-heading font-bold text-lg transition">
                    {editSaved ? '✓ Saved!' : 'Save Changes'}
                  </button>
                </div>
              )}

              {/* Preview Panel */}
              {previewId === t.id && !editingId && (
                <div className="bg-dark border border-accent/20 rounded-xl p-5 mt-2 animate-slide-up">
                  <p className="text-accent text-xs uppercase tracking-wider font-semibold mb-3">Preview</p>
                  <div className="space-y-2 text-sm">
                    <p className="text-white font-heading font-bold text-lg">{t.name}</p>
                    <p className="text-grey text-xs">{t.organizer} — {t.gameMode} — {t.tier}-Tier — {t.region}</p>
                    <p className="text-grey text-xs">{t.startDate || '—'} to {t.endDate || '—'} — {t.teamsCount} teams</p>
                    {(t.prizePoolINR > 0 || t.prizePoolUSD > 0) && (
                      <p className="text-accent text-xs">
                        {t.prizePoolINR > 0 && `₹${t.prizePoolINR.toLocaleString('en-IN')}`}
                        {t.prizePoolINR > 0 && t.prizePoolUSD > 0 && ' / '}
                        {t.prizePoolUSD > 0 && `$${t.prizePoolUSD.toLocaleString()}`}
                      </p>
                    )}
                    {t.godlikeFinalPosition && <p className="text-accent font-semibold text-xs">GodLike Position: {t.godlikeFinalPosition}</p>}
                    {t.standings && t.standings.length > 0 && (
                      <div className="mt-2">
                        <p className="text-grey text-[10px] uppercase tracking-wider mb-1">Top Standings</p>
                        {t.standings.slice(0, 5).map((r, i) => (
                          <p key={i} className={`text-xs ${r.isGodlike || (r.team && r.team.toLowerCase().includes('godl')) ? 'text-accent font-bold' : 'text-grey'}`}>
                            #{r.rank || i + 1} {r.team} — {r.points || 0} pts
                          </p>
                        ))}
                      </div>
                    )}
                    {t.stages && t.stages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-grey text-[10px] uppercase tracking-wider mb-1">Stages</p>
                        {t.stages.map((s, i) => (
                          <p key={i} className="text-grey text-xs">{s.name || `Stage ${i + 1}`} — {(s.matches || []).length} BR matches, {(s.csMatches || []).length} CS matches</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-win/90 text-white px-4 py-2 rounded-lg text-sm font-semibold animate-slide-up">
          {toast}
        </div>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}

// =================== SCHEDULE TAB ===================
const TIME_PRESETS = [
  { label: '12 PM', value: '12:00' },
  { label: '2 PM', value: '14:00' },
  { label: '4 PM', value: '16:00' },
  { label: '6 PM', value: '18:00' },
  { label: '8 PM', value: '20:00' },
  { label: '9 PM', value: '21:00' },
  { label: '10 PM', value: '22:00' },
  { label: '11 PM', value: '23:00' },
];

function formatTime12(t) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function ScheduleTab() {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [allTournaments, setAllTournaments] = useState([]);
  const [toast, setToast] = useState('');

  // Quick-add form state
  const [addTournamentId, setAddTournamentId] = useState('');
  const [addTime, setAddTime] = useState('20:00');
  const [addNotes, setAddNotes] = useState('');

  const refresh = useCallback(async () => {
    const data = await fetchScheduleEntries();
    setEntries(data);
    const upcoming = await fetchTournamentsByStatus('upcoming');
    const live = await fetchTournamentsByStatus('live');
    setAllTournaments([...upcoming, ...live]);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2000); };

  // Get or create entry for selected date
  const dateEntry = entries.find(e => e.date === selectedDate);
  const dateTournaments = dateEntry?.tournaments || [];

  // Sort scheduled tournaments by time for display
  const sortedDayTournaments = [...dateTournaments]
    .map((w, origIdx) => ({ ...w, _idx: origIdx }))
    .sort((a, b) => (a.time || '99:99').localeCompare(b.time || '99:99'));

  const handleQuickAdd = async () => {
    if (!addTournamentId) { showToast('Select a tournament first'); return; }
    if (!addTime) { showToast('Pick a time slot'); return; }
    const t = allTournaments.find(x => String(x.id) === String(addTournamentId));
    if (!t) return;
    const widget = { tournamentId: t.id, name: t.name, time: addTime, notes: addNotes };
    if (dateEntry) {
      await updateScheduleEntryInDB(dateEntry.id, { tournaments: [...dateTournaments, widget] });
    } else {
      await addScheduleEntryToDB({ date: selectedDate, tournaments: [widget] });
    }
    showToast(`Scheduled "${t.name}" at ${formatTime12(addTime)}`);
    setAddTournamentId('');
    setAddNotes('');
    refresh();
  };

  const handleUpdateWidget = async (idx, key, val) => {
    if (!dateEntry) return;
    const updated = dateTournaments.map((w, i) => i === idx ? { ...w, [key]: val } : w);
    await updateScheduleEntryInDB(dateEntry.id, { tournaments: updated });
    refresh();
  };

  const handleRemoveWidget = async (idx) => {
    if (!dateEntry) return;
    const updated = dateTournaments.filter((_, i) => i !== idx);
    if (updated.length === 0) {
      await deleteScheduleEntryFromDB(dateEntry.id);
    } else {
      await updateScheduleEntryInDB(dateEntry.id, { tournaments: updated });
    }
    showToast('Removed from schedule');
    refresh();
  };

  const handleDeleteDay = async () => {
    if (!dateEntry) return;
    await deleteScheduleEntryFromDB(dateEntry.id);
    showToast('Day schedule cleared');
    refresh();
  };

  // Get all dates that have entries, sorted
  const scheduledDates = [...new Set(entries.map(e => e.date))].sort();

  // Tournaments available to add (not already on this day)
  const availableToAdd = allTournaments.filter(t => !dateTournaments.some(w => w.tournamentId === t.id));

  // Next 7 days quick-pick
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <div>
      <h2 className="font-heading font-bold text-2xl text-white mb-2">Live Schedule Manager</h2>
      <p className="text-grey text-sm mb-6">Schedule live streams — pick a day, select tournament & time, and it appears in the Agenda.</p>

      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-win/90 text-white px-4 py-2 rounded-lg text-sm font-semibold animate-slide-up">
          {toast}
        </div>
      )}

      {/* ── Date Selection ── */}
      <div className="bg-dark border border-dark-border rounded-xl p-4 mb-6">
        <label className="block text-grey text-xs uppercase tracking-wider font-semibold mb-3">Select Date</label>
        <div className="flex items-center gap-3 flex-wrap">
          {next7Days.map(d => {
            const isToday = d === new Date().toISOString().slice(0, 10);
            const hasEntries = entries.some(e => e.date === d && e.tournaments?.length > 0);
            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${d === selectedDate
                  ? 'bg-accent text-dark ring-2 ring-accent/40 shadow-lg shadow-accent/20'
                  : 'bg-dark-card border border-dark-border text-grey hover:text-white hover:border-accent/30'
                  }`}
              >
                <span className="block text-[10px] uppercase tracking-wider opacity-70">
                  {isToday ? 'Today' : new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short' })}
                </span>
                <span className="block text-sm mt-0.5">
                  {new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
                {hasEntries && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-dark" />
                )}
              </button>
            );
          })}
          <div className="h-10 w-px bg-dark-border" />
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent focus:outline-none transition"
          />
        </div>
        {scheduledDates.filter(d => !next7Days.includes(d)).length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3 pt-3 border-t border-dark-border/50">
            <span className="text-grey text-[10px] uppercase tracking-wider self-center mr-1">Other days:</span>
            {scheduledDates.filter(d => !next7Days.includes(d)).slice(0, 10).map(d => (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-2.5 py-1 text-[10px] rounded-lg font-semibold transition ${d === selectedDate ? 'bg-accent text-dark' : 'bg-dark-card border border-dark-border text-grey hover:text-white'}`}
              >
                {new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── Left: Quick Add Panel ── */}
        <div className="lg:col-span-2">
          <div className="bg-dark border border-accent/20 rounded-xl p-5 sticky top-24">
            <p className="text-accent text-xs uppercase tracking-wider font-bold mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Quick Add to {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </p>

            {/* Tournament Select */}
            <div className="mb-4">
              <label className="block text-grey text-xs mb-1.5 font-semibold">Tournament</label>
              {availableToAdd.length === 0 ? (
                <p className="text-grey/60 text-xs py-2">All tournaments already scheduled for this day.</p>
              ) : (
                <select
                  value={addTournamentId}
                  onChange={e => setAddTournamentId(e.target.value)}
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2.5 text-white text-sm focus:border-accent focus:outline-none transition"
                >
                  <option value="">— Select tournament —</option>
                  {availableToAdd.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.tier}-Tier {t.gameMode})</option>
                  ))}
                </select>
              )}
            </div>

            {/* Time Preset Buttons */}
            <div className="mb-4">
              <label className="block text-grey text-xs mb-1.5 font-semibold">Stream Time</label>
              <div className="grid grid-cols-4 gap-2 mb-2">
                {TIME_PRESETS.map(tp => (
                  <button
                    key={tp.value}
                    onClick={() => setAddTime(tp.value)}
                    className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${addTime === tp.value
                      ? 'bg-accent text-dark ring-1 ring-accent/50 shadow-md shadow-accent/20'
                      : 'bg-dark-card border border-dark-border text-grey hover:text-white hover:border-accent/30'
                      }`}
                  >
                    {tp.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-grey text-[10px] uppercase">or custom:</span>
                <input
                  type="time"
                  value={addTime}
                  onChange={e => setAddTime(e.target.value)}
                  className="bg-dark-card border border-dark-border rounded-lg px-2 py-1.5 text-white text-sm focus:border-accent focus:outline-none transition flex-1"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="block text-grey text-xs mb-1.5 font-semibold">Notes <span className="text-grey/50">(optional)</span></label>
              <input
                value={addNotes}
                onChange={e => setAddNotes(e.target.value)}
                placeholder="e.g. Grand Finals Day 2"
                className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-white text-sm focus:border-accent focus:outline-none transition placeholder:text-grey/40"
              />
            </div>

            {/* Add Button */}
            <button
              onClick={handleQuickAdd}
              disabled={!addTournamentId || !addTime}
              className={`w-full py-3 rounded-xl font-heading font-bold text-sm uppercase tracking-wider transition-all ${addTournamentId && addTime
                ? 'bg-accent hover:bg-accent-dark text-dark shadow-lg shadow-accent/20 hover:shadow-accent/30'
                : 'bg-dark-card border border-dark-border text-grey/40 cursor-not-allowed'
                }`}
            >
              + Add to Schedule
            </button>
          </div>
        </div>

        {/* ── Right: Day Timeline ── */}
        <div className="lg:col-span-3">
          <div className="bg-dark-card border border-dark-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-heading font-bold text-lg">
                {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              {dateEntry && (
                <button onClick={handleDeleteDay} className="px-3 py-1 text-xs bg-loss/20 text-loss hover:bg-loss/30 rounded-lg transition font-semibold">
                  Clear Day
                </button>
              )}
            </div>

            {sortedDayTournaments.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-dark-border rounded-xl">
                <svg className="w-10 h-10 mx-auto mb-3 text-grey/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-grey text-sm">No streams scheduled</p>
                <p className="text-grey/50 text-xs mt-1">Use Quick Add to schedule a live stream</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[18px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />

                <div className="space-y-4">
                  {sortedDayTournaments.map((w) => {
                    const t = allTournaments.find(x => x.id === w.tournamentId);
                    return (
                      <div key={w._idx} className="relative flex gap-4 group">
                        {/* Timeline dot */}
                        <div className="flex-shrink-0 mt-3 z-10">
                          <div className="w-[10px] h-[10px] bg-accent rounded-full ring-4 ring-dark-card shadow-[0_0_8px_rgba(201,168,76,0.4)]" />
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-dark border border-dark-border rounded-xl p-4 group-hover:border-accent/30 transition-all">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              {/* Time badge + name */}
                              <div className="flex items-center gap-3 mb-2">
                                <span className="bg-accent/15 text-accent px-3 py-1 rounded-full text-xs font-bold tracking-wider whitespace-nowrap">
                                  {formatTime12(w.time) || 'No time'}
                                </span>
                                <h4 className="text-white font-heading font-semibold text-sm truncate">{w.name}</h4>
                              </div>

                              {/* Tier + Mode badges */}
                              {t && (
                                <div className="flex items-center gap-2 mb-2">
                                  <TierBadge tier={t.tier} />
                                  <span className="text-[10px] text-grey uppercase">{t.gameMode}</span>
                                  {t.region && <span className="text-[10px] text-grey">{t.region}</span>}
                                </div>
                              )}

                              {/* Inline edit: time + notes */}
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                  <label className="block text-grey text-[10px] uppercase tracking-wider mb-0.5">Time</label>
                                  <input
                                    type="time"
                                    value={w.time || ''}
                                    onChange={e => handleUpdateWidget(w._idx, 'time', e.target.value)}
                                    className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-white text-xs focus:border-accent focus:outline-none transition"
                                  />
                                </div>
                                <div>
                                  <label className="block text-grey text-[10px] uppercase tracking-wider mb-0.5">Notes</label>
                                  <input
                                    value={w.notes || ''}
                                    onChange={e => handleUpdateWidget(w._idx, 'notes', e.target.value)}
                                    placeholder="e.g. Semi Finals"
                                    className="w-full bg-dark-card border border-dark-border rounded px-2 py-1 text-white text-xs focus:border-accent focus:outline-none transition placeholder:text-grey/30"
                                  />
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => handleRemoveWidget(w._idx)}
                              className="px-2 py-1.5 text-[10px] bg-loss/15 text-loss hover:bg-loss/25 rounded-lg transition flex-shrink-0 uppercase tracking-wider font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Agenda Preview ── */}
          {sortedDayTournaments.length > 0 && (
            <div className="mt-4 bg-dark border border-accent/10 rounded-xl p-4">
              <p className="text-accent text-[10px] uppercase tracking-widest font-bold mb-2">Agenda Preview — How it appears on Schedule page</p>
              <div className="bg-[#0a0a0a] rounded-lg p-3 border border-dark-border/50">
                <p className="text-accent text-xs font-bold mb-2">
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                </p>
                {sortedDayTournaments.map((w) => (
                  <div key={w._idx} className="flex items-center gap-3 py-1.5 border-b border-dark-border/30 last:border-0">
                    <span className="text-accent font-bold text-xs w-16 text-right">{formatTime12(w.time)}</span>
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    <span className="text-white text-sm font-semibold">{w.name}</span>
                    {w.notes && <span className="text-grey text-[10px] ml-auto">{w.notes}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── All Scheduled Days Overview ── */}
      {entries.length > 0 && (
        <div className="mt-6 bg-dark border border-dark-border rounded-xl p-5">
          <p className="text-grey text-xs uppercase tracking-wider font-semibold mb-3">All Scheduled Days</p>
          <div className="space-y-2">
            {entries.sort((a, b) => (a.date || '').localeCompare(b.date || '')).map(entry => (
              <div
                key={entry.id}
                className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer transition ${entry.date === selectedDate ? 'bg-accent/10 border border-accent/30' : 'bg-dark-card border border-dark-border/50 hover:border-accent/20'}`}
                onClick={() => setSelectedDate(entry.date)}
              >
                <div>
                  <p className="text-white font-semibold text-sm">
                    {new Date(entry.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-grey text-xs mt-0.5">{(entry.tournaments || []).length} stream{(entry.tournaments || []).length !== 1 ? 's' : ''}</p>
                </div>
                <div className="text-right">
                  {[...(entry.tournaments || [])].sort((a, b) => (a.time || '').localeCompare(b.time || '')).map((w, i) => (
                    <p key={i} className="text-grey text-[10px]">
                      <span className="text-accent font-semibold">{formatTime12(w.time)}</span>
                      {w.time && ' — '}{w.name}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// =================== ADMIN PAGE ===================
const TABS = [
  { id: 'overview', label: 'Overview', group: 'tournaments' },
  { id: 'create-tournament', label: 'Create', group: 'tournaments' },
  { id: 'upcoming', label: 'Upcoming', group: 'tournaments' },
  { id: 'live-tournaments', label: 'Live', group: 'tournaments' },
  { id: 'live-control', label: 'Live Control', group: 'tournaments' },
  { id: 'completed', label: 'Completed', group: 'tournaments' },
  { id: 'schedule', label: 'Schedule', group: 'tournaments' },
  { id: 'analytics', label: 'Analytics', group: 'tournaments' },
  { id: 'matches', label: 'Matches', group: 'legacy' },
  { id: 'live', label: 'Live Updater', group: 'legacy' },
  { id: 'players', label: 'Players', group: 'legacy' },
  { id: 'settings', label: 'Settings', group: 'legacy' },
];

const ADMIN_PASSWORD = 'Hush$6969';

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('overview');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activityLog, setActivityLog] = useState([]);
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Poll activity log
  useEffect(() => {
    if (!authed) return;
    const poll = () => setActivityLog(getActivityLog().slice(0, 10));
    poll();
    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  }, [authed]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    if (!authed) return;
    const handler = (e) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo()) { undo(); setRefreshKey(k => k + 1); }
      }
      if (isMeta && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        if (canRedo()) { redo(); setRefreshKey(k => k + 1); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [authed]);

  const handleUndo = () => { if (canUndo()) { undo(); setRefreshKey(k => k + 1); } };
  const handleRedo = () => { if (canRedo()) { redo(); setRefreshKey(k => k + 1); } };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setError('Incorrect password');
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-dark-card border border-dark-border rounded-2xl p-8 animate-slide-up">
          <div className="text-center mb-6">
            <img src="/images/godlike-logo.png" alt="GodLike Esports" className="w-16 h-16 rounded-xl object-contain mx-auto mb-4" />
            <h1 className="font-heading font-bold text-2xl text-white">Admin Login</h1>
            <p className="text-grey text-sm mt-1">Enter password to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-dark border border-dark-border rounded-lg px-4 py-3 text-white focus:border-accent focus:outline-none transition text-center text-lg"
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

  const tournamentTabs = TABS.filter(t => t.group === 'tournaments');
  const legacyTabs = TABS.filter(t => t.group === 'legacy');

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header with Undo/Redo */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-white uppercase tracking-wider">
            Admin <span className="text-accent">Dashboard</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo()}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${canUndo() ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-grey/50 cursor-not-allowed'}`}
              title="Undo (Ctrl+Z)"
            >Undo</button>
            <button
              onClick={handleRedo}
              disabled={!canRedo()}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${canRedo() ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white/5 text-grey/50 cursor-not-allowed'}`}
              title="Redo (Ctrl+Shift+Z)"
            >Redo</button>
            <button
              onClick={() => setShowActivityLog(!showActivityLog)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${showActivityLog ? 'bg-accent text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >Activity</button>
            <button
              onClick={() => setAuthed(false)}
              className="px-3 py-2 rounded-lg text-sm font-semibold transition bg-loss/20 text-loss hover:bg-loss/30"
            >Logout</button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-56 flex-shrink-0">
            {/* Mobile dropdown */}
            <div className="lg:hidden mb-4">
              <select
                value={tab}
                onChange={e => setTab(e.target.value)}
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-white font-heading font-semibold focus:border-accent focus:outline-none"
              >
                <optgroup label="Tournaments">
                  {tournamentTabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </optgroup>
                <optgroup label="Management">
                  {legacyTabs.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </optgroup>
              </select>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block bg-dark-card border border-dark-border rounded-xl p-2 sticky top-28">
              <p className="text-grey text-[10px] uppercase tracking-wider font-bold px-3 py-2">Tournaments</p>
              {tournamentTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-heading font-semibold text-sm transition mb-0.5 ${tab === t.id ? 'bg-accent text-white' : 'text-grey hover:text-white hover:bg-white/5'
                    }`}
                >
                  {t.label}
                </button>
              ))}
              <hr className="border-dark-border my-2" />
              <p className="text-grey text-[10px] uppercase tracking-wider font-bold px-3 py-2">Management</p>
              {legacyTabs.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-heading font-semibold text-sm transition mb-0.5 ${tab === t.id ? 'bg-accent text-white' : 'text-grey hover:text-white hover:bg-white/5'
                    }`}
                >
                  {t.label}
                </button>
              ))}

              {/* Activity Log in Sidebar */}
              {showActivityLog && (
                <>
                  <hr className="border-dark-border my-2" />
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-grey text-[10px] uppercase tracking-wider font-bold">Activity</p>
                    <button onClick={() => { clearActivityLog(); setActivityLog([]); }} className="text-[10px] text-loss hover:text-loss/80 transition">Clear</button>
                  </div>
                  <div className="max-h-48 overflow-y-auto px-2">
                    {activityLog.length === 0 ? (
                      <p className="text-grey text-[10px] px-1 py-1">No activity yet.</p>
                    ) : (
                      activityLog.map((entry, i) => (
                        <div key={i} className="px-1 py-1.5 border-b border-dark-border/30 last:border-0">
                          <p className="text-white text-[10px] font-semibold truncate">{entry.action}</p>
                          {entry.details && <p className="text-grey text-[9px] truncate">{entry.details}</p>}
                          <p className="text-grey/50 text-[9px]">{relativeTime(entry.timestamp)}</p>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-dark-card border border-dark-border rounded-2xl p-5 sm:p-8 min-w-0" key={refreshKey}>
            {tab === 'overview' && <OverviewTab setTab={setTab} />}
            {tab === 'create-tournament' && <CreateTournamentTab onCreated={() => setTab('completed')} />}
            {tab === 'upcoming' && <TournamentListTab statusFilter="upcoming" setTab={setTab} />}
            {tab === 'live-tournaments' && <TournamentListTab statusFilter="live" setTab={setTab} />}
            {tab === 'live-control' && <LiveControlPanelTab />}
            {tab === 'completed' && <TournamentListTab statusFilter="completed" setTab={setTab} />}
            {tab === 'schedule' && <ScheduleTab />}
            {tab === 'analytics' && <AnalyticsTab />}
            {tab === 'matches' && <MatchesTab />}
            {tab === 'live' && <LiveUpdaterTab />}
            {tab === 'players' && <PlayersTab />}
            {tab === 'settings' && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}
