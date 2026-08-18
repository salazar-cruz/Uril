import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const multiplayer = await readFile(new URL('../js/multiplayer.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');
const sql = await readFile(new URL('../supabase-v1.0.0.sql', import.meta.url), 'utf8');

test('o treino contra o computador não cria banco público', () => {
  assert.doesNotMatch(multiplayer, /createComputerRoom/);
  assert.match(app, /app\.mode = calibration \? 'calibration' : 'pc'/);
  assert.match(app, /app\.room = null/);
  assert.match(app, /trainingOnly/);
});

test('partidas contra a IA não entram no Elo oficial', () => {
  assert.match(sql, /opponent_type text not null default 'human'/);
  assert.match(sql, /not v_room\.rated or v_room\.guest_id is null/);
  assert.doesNotMatch(app, /submitOfficialAction\([^\n]*pc/);
});

test('visitantes anónimos continuam autorizados a iniciar treino', () => {
  assert.match(app, /async function startPcGame\(options = \{\}\)/);
  assert.match(app, /const human = app\.registered[\s\S]*anonymousVisitor/);
  assert.doesNotMatch(app, /startPcGame[\s\S]{0,180}requireCompetitiveReady/);
});


test('o treino abre por defeito em Mestre e com mensagens da IA desligadas', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /levelMaster" selected="" value="master"/);
  assert.match(html, /aiChatOff" selected="" value="off"/);
  assert.match(app, /aiLevel: 'master'/);
  assert.match(app, /aiChatMode: 'off'/);
});

test('quando o computador começa existe uma janela de cinco segundos para escolher a casa', () => {
  assert.match(app, /app\.pcOpeningChoiceDeadline = Date\.now\(\) \+ 5000/);
  assert.match(app, /legalMoves\(app\.session\.game\)\.includes\(index\)/);
  assert.match(app, /await playPcOpeningMove\(index\)/);
  assert.match(app, /const preparedOpening = openingChoice \? app\.pcOpeningAnalysisPromise : null/);
  assert.match(app, /toast\(t\('pcOpeningAuto'\)\)/);
});
