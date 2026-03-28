import { supabase } from './supabase';

/** Sign in with email + password. Throws on failure. */
export async function adminLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  return data.user;
}

/** Sign out the current session. */
export async function adminLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}

/**
 * Get the currently logged-in user (or null if not logged in).
 * Call this on mount to restore session across page refreshes.
 */
export async function getAdminUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
}

/**
 * Subscribe to auth state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null);
  });
  return () => subscription.unsubscribe();
}
