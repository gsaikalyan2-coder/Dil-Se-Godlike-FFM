import { supabase } from './supabase';

const VISITOR_KEY = 'glffm_candle_visitor';

/** Get or create a stable visitor ID for this browser */
export function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

/** Check if this visitor already lit a candle (local check) */
export function hasLitLocally() {
  return localStorage.getItem('glffm_candle_lit') === '1';
}

/** Mark this visitor as having lit a candle */
function markLitLocally() {
  localStorage.setItem('glffm_candle_lit', '1');
}

/** Fetch total candle count */
export async function fetchCandleCount() {
  const { count, error } = await supabase
    .from('candles')
    .select('*', { count: 'exact', head: true });
  if (error) { console.error('fetchCandleCount:', error); return 0; }
  return count || 0;
}

/** Light a candle (insert row for this visitor). Returns new total count or null on failure. */
export async function lightCandle() {
  const visitorId = getVisitorId();
  const { error } = await supabase
    .from('candles')
    .insert({ visitor_id: visitorId });

  if (error) {
    // 23505 = unique violation → already lit
    if (error.code === '23505') {
      markLitLocally();
      return await fetchCandleCount();
    }
    console.error('lightCandle:', error);
    return null;
  }

  markLitLocally();
  return await fetchCandleCount();
}
