import { supabase } from './supabase';

export async function fetchScheduleEntries() {
  const { data, error } = await supabase
    .from('schedule_entries')
    .select('*')
    .order('date', { ascending: true });

  if (error) { console.error('fetchScheduleEntries:', error); return []; }
  return data || [];
}

export async function addScheduleEntryToDB(entry) {
  const { data, error } = await supabase
    .from('schedule_entries')
    .insert({ date: entry.date, tournaments: entry.tournaments || [] })
    .select()
    .single();

  if (error) throw new Error('Add schedule entry failed: ' + error.message);
  return data;
}

export async function updateScheduleEntryInDB(id, updates) {
  const { error } = await supabase
    .from('schedule_entries')
    .update(updates)
    .eq('id', id);

  if (error) throw new Error('Update schedule entry failed: ' + error.message);
}

export async function deleteScheduleEntryFromDB(id) {
  const { error } = await supabase
    .from('schedule_entries')
    .delete()
    .eq('id', id);

  if (error) throw new Error('Delete schedule entry failed: ' + error.message);
}
