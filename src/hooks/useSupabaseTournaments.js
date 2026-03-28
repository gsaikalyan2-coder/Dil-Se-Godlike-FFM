import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { fetchTournamentsByStatus } from '../lib/supabaseTournaments';
import { fetchScheduleEntries } from '../lib/supabaseSchedule';

/**
 * Replaces: useTournamentStoreSync(status)
 * Returns: { tournaments, loading }
 */
export function useTournamentsByStatus(status) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchTournamentsByStatus(status);
    setTournaments(data);
    setLoading(false);
  }, [status]);

  useEffect(() => {
    load();

    const channel = supabase
      .channel(`tournaments-status-${status}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tournaments' },
        () => load()
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'br_matches' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'standings' }, () => load())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [status]);

  return { tournaments, loading };
}

/**
 * Replaces: useLiveTournament()
 * Returns: the single live tournament object (or null)
 */
export function useLiveTournament() {
  const { tournaments } = useTournamentsByStatus('live');
  return tournaments[0] || null;
}

/**
 * Replaces: useScheduleSync()
 * Returns: { entries, loading }
 */
export function useScheduleEntries() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await fetchScheduleEntries();
    setEntries(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();

    const channel = supabase
      .channel('schedule-entries-rt')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedule_entries' },
        () => load()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [load]);

  return { entries, loading };
}

/**
 * Fetch a single tournament by id with real-time updates.
 */
export function useSingleTournament(id) {
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    const { fetchTournament } = await import('../lib/supabaseTournaments');
    const data = await fetchTournament(id);
    setTournament(data);
    setLoading(false);
  }, [id]);

  useEffect(() => {
    load();

    const channel = supabase
      .channel(`tournament-${id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments', filter: `id=eq.${id}` }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'br_matches' }, () => load())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'standings' }, () => load())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [load, id]);

  return { tournament, loading };
}
