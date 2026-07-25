import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const multiplayer = await readFile(new URL('../js/multiplayer.js', import.meta.url), 'utf8');
const sql = await readFile(new URL('../supabase.sql', import.meta.url), 'utf8');
const migration = await readFile(new URL('../supabase-sugestoes-v0.0.15.sql', import.meta.url), 'utf8');
const i18n = await readFile(new URL('../js/i18n.js', import.meta.url), 'utf8');

 test('as sugestões aparecem na página e não num diálogo de email', () => {
  assert.match(html, /id="suggestionsSection"/);
  assert.match(html, /id="suggestionsList"/);
  assert.doesNotMatch(html, /id="suggestionsDialog"/);
  assert.doesNotMatch(app, /mailto:/);
});

test('cada sugestão e resposta mostra nick, ilha e data', () => {
  assert.match(app, /function createSuggestionMeta\(item\)/);
  assert.match(app, /item\.nick/);
  assert.match(app, /islandName\(item\.island\)/);
  assert.match(app, /suggestionDate\(item\.created_at\)/);
});

test('o serviço grava sugestões, respostas e actualiza em tempo real', () => {
  assert.match(multiplayer, /async listSuggestions/);
  assert.match(multiplayer, /async createSuggestion\(/);
  assert.match(multiplayer, /async createSuggestionReply\(/);
  assert.match(multiplayer, /table: 'uril_suggestions'/);
  assert.match(multiplayer, /table: 'uril_suggestion_replies'/);
});

test('o SQL cria tabelas e políticas RLS para sugestões e respostas', () => {
  for (const source of [sql, migration]) {
    assert.match(source, /create table if not exists public\.uril_suggestions/);
    assert.match(source, /create table if not exists public\.uril_suggestion_replies/);
    assert.match(source, /alter table public\.uril_suggestions enable row level security/);
    assert.match(source, /alter table public\.uril_suggestion_replies enable row level security/);
    assert.match(source, /supabase_realtime add table public\.uril_suggestions/);
  }
});

test('a ajuda explica o mural público nos três idiomas', () => {
  assert.match(i18n, /Sugestões públicas/);
  assert.match(i18n, /Suggestions publiques/);
  assert.match(i18n, /Public suggestions/);
});
