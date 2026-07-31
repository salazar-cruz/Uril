import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const i18n = await readFile(new URL('../js/i18n.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');

test('a interface está identificada como versão 1.0.12', () => {
  assert.match(html, /Versão 1\.0\.12/);
  assert.match(html, /AJUDA V1\.0\.12/);
  assert.match(html, /styles\.css\?v=1\.0\.12/);
  assert.match(html, /app\.js\?v=1\.0\.12/);
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

test('o tabuleiro e os grãos regressam exactamente ao desenho inicial', () => {
  assert.match(app, /className = 'uril-seed'/);
  assert.match(app, /seedLayout\(visibleTotal\)/);
  assert.doesNotMatch(app, /realistic-seeds/);
  assert.doesNotMatch(css, /realistic-seed-photo/);
  assert.match(css, /\.board \.pit\.classic-pit[\s\S]*radial-gradient/);
  assert.match(css, /\.uril-seed[\s\S]*radial-gradient/);
});

test('o número continua visível quando a casa tem mais de 9 sementes', () => {
  assert.match(app, /overflow-count', seedTotal > 9/);
  assert.match(css, /\.pit\.classic-pit\.overflow-count \.seed-count[\s\S]*display:\s*grid/);
});


test('os Drills Corri Oro são públicos, surgem na coluna esquerda e estão divididos por nível', () => {
  for (const id of ['drillMenu','drillList','drillCard','drillMeta','restartDrillButton','showDrillHintButton','nextDrillButton']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(app, /async function startEndgameDrill/);
  assert.match(app, /app\.mode = 'drill'/);
  assert.match(app, /DRILL_LEVELS\.forEach/);
  assert.match(app, /drill-level-group/);
  assert.match(css, /\.drill-level-heading/);
  assert.match(css, /\.drill-level-items/);
  assert.match(i18n, /Finais públicos para treinar a corrida ao ouro\. Não exigem conta\./);
  assert.match(i18n, /drillLevelBeginner: 'Iniciante'/);
  assert.match(i18n, /drillLevelMedium: 'Médio'/);
  assert.match(i18n, /drillLevelAdvanced: 'Avançado'/);
  assert.match(i18n, /Objectivo: correr o ouro e fechar a posição em 25–23/);
  for (const pattern of ['3–2', '4–3', '5–3', '5–4', '6–3', '6–4']) {
    assert.match(i18n, new RegExp(`Caso ${pattern}`));
  }
});

test('Banco é traduzido como Table em Francês e Inglês', () => {
  assert.match(i18n, /banksOnline: 'Tables d’Uril en ligne'/);
  assert.match(i18n, /bankStatus: 'ÉTAT DE LA TABLE'/);
  assert.match(i18n, /banksOnline: 'Online Uril tables'/);
  assert.match(i18n, /bankStatus: 'TABLE STATUS'/);
  assert.doesNotMatch(i18n, /banksOnline: 'Online Uril banks'/);
  assert.doesNotMatch(i18n, /bankStatus: 'BANK STATUS'/);
});


test('os Drills incluem explicação e reprodução da solução perfeita dos dois lados', () => {
  assert.match(html, /id="drillChallenge"/);
  assert.match(html, /id="showDrillSolutionButton"/);
  assert.match(app, /async function showPerfectDrillSolution\(\)/);
  assert.match(app, /drillSolutionPlaying/);
  assert.match(i18n, /showDrillSolution: 'Ver solução perfeita'/);
});


test('a solução automática dos Drills usa movimento duas vezes mais lento', () => {
  assert.match(app, /const DRILL_SOLUTION_TIMING = \{[\s\S]*lift: 170,[\s\S]*seed: 130,[\s\S]*capture: 210,[\s\S]*settle: 140/);
  assert.match(app, /DRILL_SOLUTION_START_DELAY = 520/);
  assert.match(app, /DRILL_SOLUTION_MOVE_PAUSE = 180/);
});

test('a interface explica o encerramento do final 1–1', () => {
  assert.match(i18n, /Restava uma semente em cada campo/);
  assert.match(i18n, /final 1–1/);
});

test('as explicações e os controlos dos Drills ficam imediatamente abaixo do tabuleiro', () => {
  const boardPosition = html.indexOf('class="board-wrap"');
  const drillPosition = html.indexOf('id="drillCard"');
  const sidebarPosition = html.indexOf('class="game-sidebar"');
  assert.ok(boardPosition >= 0);
  assert.ok(drillPosition > boardPosition);
  assert.ok(sidebarPosition > drillPosition);
  assert.match(html, /class="glass drill-card drill-board-panel"/);
  assert.doesNotMatch(html, /class="glass sidebar-card drill-card"/);
  assert.match(css, /\.drill-board-panel[\s\S]*grid-template-columns/);
});


test('os níveis dos Drills ficam recolhidos e abrem para baixo', () => {
  assert.match(app, /document\.createElement\('details'\)/);
  assert.match(app, /document\.createElement\('summary'\)/);
  assert.match(app, /openDrillLevels\.has\(level\.id\)/);
  assert.match(app, /openDrillLevels\.add\(drill\.level\)/);
  assert.match(css, /\.drill-level-group\[open\] \.drill-level-arrow/);
});

test('um treino contra o computador pode ser observado pela lista online', () => {
  assert.match(app, /player\.status === 'pc' && player\.pc_game_id/);
  assert.match(app, /watchPlayerPcGame\(player\)/);
  assert.match(app, /app\.mode = 'pc-watch'/);
  assert.match(app, /pc_state: pcPresenceSnapshot\(\)/);
  assert.match(i18n, /Estás a assistir ao treino de \{nick\}/);
});
