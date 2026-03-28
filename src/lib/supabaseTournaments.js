/**
 * supabaseTournaments.js
 *
 * All read + write operations for tournaments.
 * Primary keys are SERIAL integers, matching your existing
 * localStorage store shape exactly.
 */

import { supabase } from './supabase';

// --- Column mapping helpers ---

export function rowToTournament(row, stages = [], standings = [], journey = [], vodLinks = []) {
  return {
    id: row.id,
    name: row.name,
    organizer: row.organizer || '',
    gameMode: row.game_mode,
    region: row.region || '',
    tier: row.tier || 'C',
    status: row.status,
    startDate: row.start_date || '',
    endDate: row.end_date || '',
    prizePoolINR: row.prize_pool_inr || 0,
    prizePoolUSD: row.prize_pool_usd || 0,
    teamsCount: row.teams_count || 0,
    liquipediaURL: row.liquipedia_url || '',
    instagramURL: row.instagram_url || '',
    godlikeFinalPosition: row.godlike_final_position || '',
    godlikePrizeINR: row.godlike_prize_inr || 0,
    godlikePrizeUSD: row.godlike_prize_usd || 0,
    displayOrder: row.display_order || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    stages: stages.map(stageRowToStage),
    standings: standings.map(standingRowToStanding),
    godlikeJourney: journey.map(journeyRowToJourney),
    vodLinks: vodLinks.map(v => ({ stage: v.stage_name, url: v.url })),
    roster: row.roster || ['YOGI', 'MARCO', 'NOBITA', 'ECOECO', 'NANCY'],
    playingFour: row.playing_four || [],
  };
}

export function tournamentToRow(t) {
  return {
    name: t.name,
    organizer: t.organizer || null,
    game_mode: t.gameMode,
    region: t.region || null,
    tier: t.tier || 'C',
    status: t.status || 'upcoming',
    start_date: t.startDate || null,
    end_date: t.endDate || null,
    prize_pool_inr: t.prizePoolINR || 0,
    prize_pool_usd: t.prizePoolUSD || 0,
    teams_count: t.teamsCount || 0,
    liquipedia_url: t.liquipediaURL || null,
    instagram_url: t.instagramURL || null,
    godlike_final_position: t.godlikeFinalPosition || null,
    godlike_prize_inr: t.godlikePrizeINR || 0,
    godlike_prize_usd: t.godlikePrizeUSD || 0,
    roster: t.roster || ['YOGI', 'MARCO', 'NOBITA', 'ECOECO', 'NANCY'],
    playing_four: t.playingFour || [],
  };
}

// --- Stage mapping ---

export function stageRowToStage(row) {
  return {
    _id: row.id,
    name: row.name,
    type: row.stage_type,
    teamsInStage: row.teams_in_stage || 0,
    qualificationRule: row.qualification_rule || '',
    stageOrder: row.stage_order || 0,
    matches: (row.br_matches || []).map(brRowToMatch),
    csMatches: (row.cs_matches || []).map(csRowToMatch),
  };
}

export function stageToRow(s, tournamentId) {
  return {
    tournament_id: tournamentId,
    name: s.name,
    stage_type: s.type || 'br_points',
    teams_in_stage: s.teamsInStage || 0,
    qualification_rule: s.qualificationRule || null,
    stage_order: s.stageOrder || 0,
  };
}

// --- BR Match mapping ---

export function brRowToMatch(row) {
  return {
    _id: row.id,
    matchNum: row.match_number,
    placement: row.godlike_placement || 0,
    kills: row.godlike_kills || 0,
    booyah: row.booyah || false,
    map: row.map_name || '',
    playerKills: {
      YOGI:   row.kills_yogi   || 0,
      MARCO:  row.kills_marco  || 0,
      NOBITA: row.kills_nobita || 0,
      ECOECO: row.kills_ecoeco || 0,
      NANCY:  row.kills_nancy  || 0,
    },
  };
}

export function matchToBrRow(m, stageId) {
  return {
    stage_id: stageId,
    match_number: m.matchNum || 1,
    godlike_placement: m.placement || 0,
    godlike_kills: m.kills || 0,
    booyah: m.booyah || false,
    map_name: m.map || null,
    kills_yogi:   m.playerKills?.YOGI   || 0,
    kills_marco:  m.playerKills?.MARCO  || 0,
    kills_nobita: m.playerKills?.NOBITA || 0,
    kills_ecoeco: m.playerKills?.ECOECO || 0,
    kills_nancy:  m.playerKills?.NANCY  || 0,
  };
}

// --- CS Match mapping ---

export function csRowToMatch(row) {
  const games = [];
  for (let i = 1; i <= 5; i++) {
    const g = row[`game${i}_godlike`];
    if (g !== null && g !== undefined) {
      games.push({ godlikeScore: g, opponentScore: row[`game${i}_opponent`] || 0 });
    }
  }
  return {
    _id: row.id,
    roundName: row.round_name,
    format: row.series_format || 'Bo3',
    opponent: row.opponent,
    games,
    seriesResult: row.series_result || '',
  };
}

export function matchToCsRow(m, stageId) {
  const row = {
    stage_id: stageId,
    round_name: m.roundName || '',
    series_format: m.format || 'Bo3',
    opponent: m.opponent || '',
    series_result: m.seriesResult || null,
  };
  (m.games || []).forEach((g, i) => {
    row[`game${i + 1}_godlike`]  = g.godlikeScore  ?? null;
    row[`game${i + 1}_opponent`] = g.opponentScore ?? null;
  });
  return row;
}

// --- Standings mapping ---

export function standingRowToStanding(row) {
  return {
    _id: row.id,
    rank: row.rank,
    team: row.team_name,
    booyahs: row.booyahs || 0,
    kills: row.kills || 0,
    placementPts: row.placement_pts || 0,
    points: row.total_pts || 0,
    prizeINR: row.prize_inr || 0,
    prizeUSD: row.prize_usd || 0,
  };
}

export function standingToRow(s, tournamentId) {
  return {
    tournament_id: tournamentId,
    rank: s.rank || 0,
    team_name: s.team || '',
    booyahs: s.booyahs || 0,
    kills: s.kills || 0,
    placement_pts: s.placementPts || 0,
    total_pts: s.points || 0,
    prize_inr: s.prizeINR || 0,
    prize_usd: s.prizeUSD || 0,
  };
}

// --- Journey mapping ---

export function journeyRowToJourney(row) {
  return {
    _id: row.id,
    stage: row.stage_name,
    position: row.position || '',
    points: row.total_points || 0,
    outcome: row.outcome || 'advanced',
    notes: row.notes || '',
    stageOrder: row.stage_order || 0,
  };
}

export function journeyToRow(j, tournamentId) {
  return {
    tournament_id: tournamentId,
    stage_name: j.stage || '',
    position: j.position || null,
    total_points: j.points || 0,
    outcome: j.outcome || 'advanced',
    notes: j.notes || null,
    stage_order: j.stageOrder || 0,
  };
}

// =====================================================================
// READ FUNCTIONS
// =====================================================================

export async function fetchTournamentsByStatus(status) {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      standings (*),
      godlike_journey (*),
      vod_links (*),
      tournament_stages (
        *,
        br_matches (*),
        cs_matches (*)
      )
    `)
    .eq('status', status)
    .order('start_date', { ascending: status === 'upcoming' });

  if (error) { console.error('fetchTournamentsByStatus:', error); return []; }

  return (data || []).map(row =>
    rowToTournament(
      row,
      row.tournament_stages || [],
      row.standings || [],
      row.godlike_journey || [],
      row.vod_links || []
    )
  );
}

export async function fetchTournament(id) {
  const { data, error } = await supabase
    .from('tournaments')
    .select(`
      *,
      standings (*),
      godlike_journey (*),
      vod_links (*),
      tournament_stages (
        *,
        br_matches (*),
        cs_matches (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) { console.error('fetchTournament:', error); return null; }

  return rowToTournament(
    data,
    data.tournament_stages || [],
    data.standings || [],
    data.godlike_journey || [],
    data.vod_links || []
  );
}

// =====================================================================
// WRITE FUNCTIONS (admin only)
// =====================================================================

export async function createTournamentInDB(tournament) {
  const { data: tRow, error: tErr } = await supabase
    .from('tournaments')
    .insert(tournamentToRow(tournament))
    .select()
    .single();

  if (tErr) throw new Error('Create tournament failed: ' + tErr.message);
  const tId = tRow.id;

  for (const [si, stage] of (tournament.stages || []).entries()) {
    const { data: sRow, error: sErr } = await supabase
      .from('tournament_stages')
      .insert({ ...stageToRow(stage, tId), stage_order: si })
      .select()
      .single();

    if (sErr) throw new Error('Create stage failed: ' + sErr.message);
    const sId = sRow.id;

    if (stage.type === 'br_points' && stage.matches?.length) {
      const { error: mErr } = await supabase
        .from('br_matches')
        .insert(stage.matches.map(m => matchToBrRow(m, sId)));
      if (mErr) throw new Error('Insert BR matches failed: ' + mErr.message);
    }
    if (stage.type === 'cs_bracket' && stage.csMatches?.length) {
      const { error: cErr } = await supabase
        .from('cs_matches')
        .insert(stage.csMatches.map(m => matchToCsRow(m, sId)));
      if (cErr) throw new Error('Insert CS matches failed: ' + cErr.message);
    }
  }

  if (tournament.standings?.length) {
    await supabase.from('standings').insert(tournament.standings.map(s => standingToRow(s, tId)));
  }
  if (tournament.godlikeJourney?.length) {
    await supabase.from('godlike_journey').insert(
      tournament.godlikeJourney.map((j, i) => ({ ...journeyToRow(j, tId), stage_order: i }))
    );
  }
  if (tournament.vodLinks?.length) {
    await supabase.from('vod_links').insert(
      tournament.vodLinks.map(v => ({ tournament_id: tId, stage_name: v.stage, url: v.url }))
    );
  }

  return { ...tournament, id: tId };
}

export async function updateTournamentInDB(id, updates) {
  const { error: tErr } = await supabase
    .from('tournaments')
    .update(tournamentToRow(updates))
    .eq('id', id);
  if (tErr) throw new Error('Update tournament failed: ' + tErr.message);

  if (updates.stages !== undefined) {
    await supabase.from('tournament_stages').delete().eq('tournament_id', id);
    for (const [si, stage] of (updates.stages || []).entries()) {
      const { data: sRow, error: sErr } = await supabase
        .from('tournament_stages')
        .insert({ ...stageToRow(stage, id), stage_order: si })
        .select()
        .single();
      if (sErr) throw new Error('Update stage failed: ' + sErr.message);
      const sId = sRow.id;
      if (stage.type === 'br_points' && stage.matches?.length) {
        await supabase.from('br_matches').insert(stage.matches.map(m => matchToBrRow(m, sId)));
      }
      if (stage.type === 'cs_bracket' && stage.csMatches?.length) {
        await supabase.from('cs_matches').insert(stage.csMatches.map(m => matchToCsRow(m, sId)));
      }
    }
  }

  if (updates.standings !== undefined) {
    await supabase.from('standings').delete().eq('tournament_id', id);
    if (updates.standings.length) {
      await supabase.from('standings').insert(updates.standings.map(s => standingToRow(s, id)));
    }
  }

  if (updates.godlikeJourney !== undefined) {
    await supabase.from('godlike_journey').delete().eq('tournament_id', id);
    if (updates.godlikeJourney.length) {
      await supabase.from('godlike_journey').insert(
        updates.godlikeJourney.map((j, i) => ({ ...journeyToRow(j, id), stage_order: i }))
      );
    }
  }

  if (updates.vodLinks !== undefined) {
    await supabase.from('vod_links').delete().eq('tournament_id', id);
    if (updates.vodLinks.length) {
      await supabase.from('vod_links').insert(
        updates.vodLinks.map(v => ({ tournament_id: id, stage_name: v.stage, url: v.url }))
      );
    }
  }
}

export async function deleteTournamentFromDB(id) {
  const { error } = await supabase.from('tournaments').delete().eq('id', id);
  if (error) throw new Error('Delete tournament failed: ' + error.message);
}

export async function changeTournamentStatus(id, newStatus) {
  const { error } = await supabase
    .from('tournaments')
    .update({ status: newStatus })
    .eq('id', id);
  if (error) throw new Error('Status change failed: ' + error.message);
}

export async function appendBrMatchToLastStage(tournamentId, matchData) {
  const { data: stages, error: sErr } = await supabase
    .from('tournament_stages')
    .select('id')
    .eq('tournament_id', tournamentId)
    .order('stage_order', { ascending: false })
    .limit(1);

  if (sErr || !stages?.length) throw new Error('No stages found for this tournament');
  const stageId = stages[0].id;

  const { data, error } = await supabase
    .from('br_matches')
    .insert(matchToBrRow(matchData, stageId))
    .select()
    .single();

  if (error) throw new Error('Append BR match failed: ' + error.message);
  return data;
}
