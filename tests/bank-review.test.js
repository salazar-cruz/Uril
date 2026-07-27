import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const multiplayer = await readFile(new URL('../js/multiplayer.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const sql = await readFile(new URL('../supabase-v1.0.0.sql', import.meta.url), 'utf8');

test('o arquivo é paginado e filtra estado, texto, datas, resultado e ocorrências', () => {
  assert.match(multiplayer, /async listRooms\(\{ status = 'playing',[\s\S]*pageSize = 20/);
  assert.match(multiplayer, /\.range\(from, to\)/);
  assert.match(multiplayer, /host_country\.ilike/);
  assert.match(multiplayer, /exclusiveEnd\.setUTCDate/);
  assert.match(multiplayer, /query = query\.lt\('created_at'/);
  assert.match(multiplayer, /result === 'capote'|event === 'capote'/);
  assert.match(html, /id="roomResultFilter"/);
  assert.match(html, /id="roomEventFilter"/);
});

test('os estados Live, interrompido e abandonado são derivados de batimentos', () => {
  assert.match(sql, /interval '90 seconds'/);
  assert.match(sql, /status = 'interrupted'/);
  assert.match(sql, /status = 'abandoned'/);
  assert.match(multiplayer, /startRoomHeartbeat/);
  assert.match(multiplayer, /uril_room_heartbeat/);
});

test('cada jogada oficial é guardada separadamente', () => {
  assert.match(sql, /create table if not exists public\.uril_moves/);
  assert.match(sql, /unique\(room_id, game_no, ply\)/);
  assert.match(multiplayer, /async listMoves\(roomId\)/);
  assert.match(app, /function buildReviewSession/);
});

test('a consulta reconstrói a partida sem alterar o estado oficial', () => {
  assert.match(app, /app\.mode = 'review'/);
  assert.match(app, /app\.reviewMode = true/);
  assert.match(app, /function displayedGame/);
  assert.match(app, /if \(app\.reviewMode\) return false/);
});

test('o controlador permite navegar, listar e analisar as jogadas', () => {
  assert.match(html, /id="reviewFirstButton"/);
  assert.match(html, /id="reviewPreviousButton"/);
  assert.match(html, /id="reviewNextButton"/);
  assert.match(html, /id="reviewLastButton"/);
  assert.match(html, /id="reviewMoveList"/);
  assert.match(html, /id="analyseMoveButton"/);
  assert.match(app, /async function analyseCurrentMove/);
});
