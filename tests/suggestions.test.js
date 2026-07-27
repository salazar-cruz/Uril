import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const multiplayer = await readFile(new URL('../js/multiplayer.js', import.meta.url), 'utf8');
const sql = await readFile(new URL('../supabase-v1.0.0.sql', import.meta.url), 'utf8');
const i18n = await readFile(new URL('../js/i18n.js', import.meta.url), 'utf8');

test('as sugestões permanecem na página', () => {
  assert.match(html, /id="suggestionsSection"/);
  assert.match(html, /id="suggestionsList"/);
  assert.doesNotMatch(app, /mailto:/);
});

test('só jogadores inscritos publicam sugestões e respostas', () => {
  assert.match(multiplayer, /!this\.registered\) throw new Error\('Só jogadores inscritos publicam sugestões/);
  assert.match(multiplayer, /!this\.registered\) throw new Error\('Só jogadores inscritos publicam respostas/);
  assert.match(sql, /not coalesce\(\(auth\.jwt\(\) ->> 'is_anonymous'\)::boolean, false\)/);
});

test('o SQL mantém RLS e actualização em tempo real', () => {
  assert.match(sql, /create table if not exists public\.uril_suggestions/);
  assert.match(sql, /create table if not exists public\.uril_suggestion_replies/);
  assert.match(sql, /enable row level security/);
  assert.match(sql, /supabase_realtime add table public\.uril_suggestions/);
});

test('a ajuda esclarece leitura pública e publicação registada', () => {
  assert.match(i18n, /Todos conseguem ler; (?:só|apenas) jogadores inscritos publicam e respondem/);
  assert.match(i18n, /seuls les joueurs inscrits/);
  assert.match(i18n, /only registered players/);
});
