import { useState, useEffect, useCallback } from 'react';
import { getTournamentsByStatus, getAllTournaments } from '../data/tournamentStore';
import { getScheduleEntries } from '../data/store';

/**
 * Syncs with tournamentStore via storage events (cross-tab) + polling (same-tab).
 * @param {string} status - 'upcoming' | 'live' | 'completed'
 */
export function useTournamentStoreSync(status) {
  const fetch = useCallback(() => getTournamentsByStatus(status), [status]);
  const [tournaments, setTournaments] = useState(fetch);

  const refresh = useCallback(() => setTournaments(fetch()), [fetch]);

  useEffect(() => {
    // Cross-tab: storage event fires when another tab writes
    const onStorage = (e) => {
      if (e.key && (e.key.startsWith('tournament:') || e.key === 'tournaments-index')) {
        refresh();
      }
    };
    window.addEventListener('storage', onStorage);

    // Same-tab: poll every 5 seconds
    const interval = setInterval(refresh, 5000);

    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, [refresh]);

  return { tournaments, refresh };
}

/**
 * Returns the first live tournament, or null.
 */
export function useLiveTournament() {
  const { tournaments } = useTournamentStoreSync('live');
  return tournaments.length > 0 ? tournaments[0] : null;
}

/**
 * Returns all tournaments regardless of status.
 */
export function useAllTournaments() {
  const fetchAll = useCallback(() => getAllTournaments(), []);
  const [tournaments, setTournaments] = useState(fetchAll);

  const refresh = useCallback(() => setTournaments(fetchAll()), [fetchAll]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key && (e.key.startsWith('tournament:') || e.key === 'tournaments-index')) {
        refresh();
      }
    };
    window.addEventListener('storage', onStorage);
    const interval = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, [refresh]);

  return { tournaments, refresh };
}

/**
 * Syncs schedule entries from store.js via polling + storage events.
 */
export function useScheduleSync() {
  const fetchEntries = useCallback(() => getScheduleEntries(), []);
  const [entries, setEntries] = useState(fetchEntries);

  const refresh = useCallback(() => setEntries(fetchEntries()), [fetchEntries]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'glffm_schedule') refresh();
    };
    window.addEventListener('storage', onStorage);
    const interval = setInterval(refresh, 5000);
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(interval);
    };
  }, [refresh]);

  return { entries, refresh };
}
