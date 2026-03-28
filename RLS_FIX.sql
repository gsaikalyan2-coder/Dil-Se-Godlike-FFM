-- ============================================================
-- RLS FIX: Allow full CRUD for anon role
-- ============================================================
-- Since Admin uses simple password auth (not Supabase Auth),
-- all DB requests come through as "anon". We need to allow
-- the anon role to INSERT, UPDATE, DELETE on all tables.
--
-- Paste this into Supabase SQL Editor and click "Run".
-- ============================================================

-- 1) tournaments
DROP POLICY IF EXISTS "Allow anon full access" ON tournaments;
CREATE POLICY "Allow anon full access" ON tournaments
  FOR ALL USING (true) WITH CHECK (true);

-- 2) tournament_stages
DROP POLICY IF EXISTS "Allow anon full access" ON tournament_stages;
CREATE POLICY "Allow anon full access" ON tournament_stages
  FOR ALL USING (true) WITH CHECK (true);

-- 3) br_matches
DROP POLICY IF EXISTS "Allow anon full access" ON br_matches;
CREATE POLICY "Allow anon full access" ON br_matches
  FOR ALL USING (true) WITH CHECK (true);

-- 4) cs_matches
DROP POLICY IF EXISTS "Allow anon full access" ON cs_matches;
CREATE POLICY "Allow anon full access" ON cs_matches
  FOR ALL USING (true) WITH CHECK (true);

-- 5) standings
DROP POLICY IF EXISTS "Allow anon full access" ON standings;
CREATE POLICY "Allow anon full access" ON standings
  FOR ALL USING (true) WITH CHECK (true);

-- 6) godlike_journey
DROP POLICY IF EXISTS "Allow anon full access" ON godlike_journey;
CREATE POLICY "Allow anon full access" ON godlike_journey
  FOR ALL USING (true) WITH CHECK (true);

-- 7) vod_links
DROP POLICY IF EXISTS "Allow anon full access" ON vod_links;
CREATE POLICY "Allow anon full access" ON vod_links
  FOR ALL USING (true) WITH CHECK (true);

-- 8) schedule_entries
DROP POLICY IF EXISTS "Allow anon full access" ON schedule_entries;
CREATE POLICY "Allow anon full access" ON schedule_entries
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- Also enable Realtime on all tables (if not already done)
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE tournaments;
ALTER PUBLICATION supabase_realtime ADD TABLE tournament_stages;
ALTER PUBLICATION supabase_realtime ADD TABLE br_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE cs_matches;
ALTER PUBLICATION supabase_realtime ADD TABLE standings;
ALTER PUBLICATION supabase_realtime ADD TABLE godlike_journey;
ALTER PUBLICATION supabase_realtime ADD TABLE vod_links;
ALTER PUBLICATION supabase_realtime ADD TABLE schedule_entries;
