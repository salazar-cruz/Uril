import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const i18n = await readFile(new URL('../js/i18n.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');

test('a interface está identificada como versão 1.0.2', () => {
  assert.match(html, /Versão 1\.0\.2/);
  assert.match(html, /AJUDA V1\.0\.2/);
  assert.match(html, /styles\.css\?v=1\.0\.2/);
  assert.match(html, /app\.js\?v=1\.0\.2/);
});

test('a página principal já não pede nick nem ilha', () => {
  assert.doesNotMatch(html, /id="nickInput"/);
  assert.doesNotMatch(html, /id="islandSelect"/);
  assert.match(html, /id="identityCard"/);
  assert.match(html, /id="registerButton"/);
});

test('o registo recolhe nome, nick, país, ilha condicional e email', () => {
  for (const id of ['registerFullName','registerNick','registerCountry','registerIslandGroup','registerIsland','registerEmail']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(app, /function updateRegistrationIslandVisibility/);
  assert.match(app, /isCapeVerdeCountry\(elements\.registerCountry\.value\)/);
  assert.match(app, /const island = isCapeVerdeCountry\(country\) \? elements\.registerIsland\.value : null/);
});

test('visitantes anónimos ficam limitados a treino e consulta', () => {
  assert.match(i18n, /Treino contra a IA e consulta de partidas/);
  assert.match(app, /function requireCompetitiveReady/);
  assert.match(app, /Só jogadores inscritos|registrationRequired/);
  assert.match(app, /app\.mode = calibration \? 'calibration' : 'pc'/);
});

test('a calibração é exigida antes das partidas oficiais', () => {
  assert.match(app, /Number\(app\.profile\?\.calibration_games \|\| 0\) >= CALIBRATION_LEVELS\.length/);
  assert.match(app, /calibrationRequired/);
  assert.match(html, /id="calibrationBox"/);
  assert.match(html, /id="startCalibrationButton"/);
});

test('a interface inclui classificação Elo e registo competitivo', () => {
  assert.match(html, /id="leaderboardList"/);
  assert.match(html, /id="identityElo"/);
  assert.match(app, /function renderLeaderboard/);
  assert.match(app, /elo_provisional/);
});

test('os bancos exibem estados, datas, filtros e ocorrências', () => {
  assert.match(html, /data-room-filter="playing"/);
  assert.match(html, /data-room-filter="waiting"/);
  assert.match(html, /data-room-filter="finished"/);
  assert.match(html, /id="roomResultFilter"/);
  assert.match(html, /id="roomEventFilter"/);
  assert.match(app, /gameStartedAt/);
  assert.match(app, /lastMoveAt/);
  assert.match(app, /roomEventBadge/);
});

test('Ver jogar surge apenas em jogos Live e o arquivo usa Consultar jogadas', () => {
  assert.match(app, /const isLive = room\.status === 'playing'/);
  assert.match(app, /if \(isLive\)[\s\S]*t\('watchPlay'\)/);
  assert.match(app, /button\.textContent = t\('consultMoves'\)/);
  assert.match(css, /\.room-state\.live/);
  assert.match(css, /\.live-dot/);
});

test('o tabuleiro mantém 12 casas e dois depósitos laterais', () => {
  assert.match(html, /id="topCapturedPit"/);
  assert.match(html, /id="bottomCapturedPit"/);
  assert.match(app, /app\.pitButtons\.size === 12/);
  assert.match(app, /function updateCapturedPit/);
});

test('o design mantém regras específicas para telemóveis', () => {
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /env\(safe-area-inset-left\)/);
  assert.match(css, /\.mode-grid \{ grid-template-columns:1fr; \}/);
  assert.match(css, /\.archive-toolbar \{ grid-template-columns:1fr; \}/);
});

test('a consulta inclui controlador, lista e análise do motor', () => {
  for (const id of ['reviewController','reviewPreviousButton','reviewNextButton','reviewSlider','reviewMoveList','analyseMoveButton','reviewAnalysisResult']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(app, /function renderReviewAnalysis/);
  assert.match(app, /async function analyseCurrentMove/);
});

test('as estatísticas mostram profundidade real, posições, tempo e linha principal', () => {
  assert.match(html, /id="aiStats"/);
  assert.match(app, /completedDepth/);
  assert.match(app, /principalVariation/);
  assert.match(i18n, /Profundidade \{depth\}\/\{maxDepth\}/);
});

test('a ajuda explica Minimax, Elo, anonimato e regras do Uril na primeira pessoa', () => {
  assert.match(i18n, /Eu construí o computador/);
  assert.match(i18n, /Minimax com poda Alpha-Beta/);
  assert.match(i18n, /sistema Elo inspirado no xadrez/);
  assert.match(i18n, /Anónimo 01/);
  assert.match(i18n, /Frouxo/);
});

test('a interface oferece Português, Francês e Inglês', () => {
  assert.match(html, /value="pt">PT/);
  assert.match(html, /value="fr">FR/);
  assert.match(html, /value="en">EN/);
  assert.match(i18n, /Comment j’ai construit/);
  assert.match(i18n, /How I built/);
});

test('as casas de jogo usam novamente as sementes clássicas do código inicial', () => {
  assert.match(app, /trou-bonduc\$\{spriteName\}\.png/);
  assert.match(app, /--classic-seed-image/);
  assert.match(css, /\.board \.pit\.classic-pit[\s\S]*background-image: var\(--classic-seed-image\) !important/);
  assert.match(css, /background-image: var\(--classic-seed-image\)/);
  assert.match(app, /overflow-count', seedTotal > 15/);
});
