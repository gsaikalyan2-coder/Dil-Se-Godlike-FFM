-- ============================================================
-- ENABLE REALTIME: Ensure all tables are in the publication
-- ============================================================
-- Run this in Supabase SQL Editor.
-- If a table is already in the publication, the error is harmless.
-- ============================================================

-- First, check current publication members
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';

-- Remove and re-add to ensure clean state
BEGIN;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS tournaments;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS tournament_stages;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS br_matches;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS cs_matches;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS standings;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS godlike_journey;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS vod_links;
  ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS schedule_entries;

  ALTER PUBLICATION supabase_realtime ADD TABLE tournaments;
  ALTER PUBLICATION supabase_realtime ADD TABLE tournament_stages;
  ALTER PUBLICATION supabase_realtime ADD TABLE br_matches;
  ALTER PUBLICATION supabase_realtime ADD TABLE cs_matches;
  ALTER PUBLICATION supabase_realtime ADD TABLE standings;
  ALTER PUBLICATION supabase_realtime ADD TABLE godlike_journey;
  ALTER PUBLICATION supabase_realtime ADD TABLE vod_links;
  ALTER PUBLICATION supabase_realtime ADD TABLE schedule_entries;
COMMIT;

-- Verify they are now in the publication
SELECT schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime';
