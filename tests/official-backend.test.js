import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sql = await readFile(new URL('../supabase-v1.0.0.sql', import.meta.url), 'utf8');
const edge = await readFile(new URL('../supabase/functions/uril-official-move/index.ts', import.meta.url), 'utf8');
const multiplayer = await readFile(new URL('../js/multiplayer.js', import.meta.url), 'utf8');

test('o backend separa conta privada de perfil público', () => {
  assert.match(sql, /create table if not exists public\.uril_accounts/);
  assert.match(sql, /create table if not exists public\.uril_profiles/);
  assert.match(sql, /account_select_own/);
  assert.match(sql, /profile_select_public/);
});

test('a ilha é obrigatória apenas para Cabo Verde', () => {
  assert.match(sql, /uril_is_cape_verde_country/);
  assert.match(sql, /uril_profiles_country_island_check/);
  assert.match(sql, /not public\.uril_is_cape_verde_country\(country\) and island is null/);
});

test('criar e entrar num banco exige conta e calibração', () => {
  assert.match(sql, /Só jogadores inscritos criam bancos oficiais/);
  assert.match(sql, /v_profile\.calibration_games < 3/);
  assert.match(sql, /uril_create_room/);
  assert.match(sql, /uril_join_room/);
});

test('as jogadas oficiais são validadas no servidor', () => {
  assert.match(edge, /applyMove\(nextSession\.game, pitIndex\)/);
  assert.match(edge, /nextSession\.game\.currentPlayer !== side/);
  assert.match(edge, /\.eq\('version', room\.version\)/);
  assert.match(multiplayer, /functions\.invoke\('uril-official-move'/);
});

test('o Elo é finalizado apenas em partidas oficiais entre dois perfis', () => {
  assert.match(sql, /uril_finalize_rating/);
  assert.match(sql, /not v_room\.rated or v_room\.guest_id is null/);
  assert.match(sql, /uril_rating_history/);
  assert.match(sql, /elo_provisional/);
});

test('o service role nunca aparece no JavaScript do navegador', () => {
  assert.doesNotMatch(multiplayer, /SERVICE_ROLE/);
  assert.match(edge, /SUPABASE_SERVICE_ROLE_KEY/);
});
