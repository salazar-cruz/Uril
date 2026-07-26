import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const i18n = await readFile(new URL('../js/i18n.js', import.meta.url), 'utf8');
const app = await readFile(new URL('../js/app.js', import.meta.url), 'utf8');

test('as filas transparentes não bloqueiam as casas de Norte no modo local', () => {
  assert.match(css, /\.board \.pit-row\s*\{[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.board \.pit\.classic-pit\s*\{[^}]*pointer-events:\s*auto/s);
});

test('a ajuda descreve bancos, chat e repetição tripla nos três idiomas', () => {
  assert.match(i18n, /Jogadores, bancos e convites/);
  assert.match(i18n, /Chat do banco/);
  assert.match(i18n, /Repetição tripla/);
  assert.match(i18n, /Joueurs, banques et invitations/);
  assert.match(i18n, /Players, banks and invitations/);
});

test('a interface oferece Português, Francês e Inglês', () => {
  assert.match(html, /id="languageSelect"/);
  assert.match(html, /value="pt">PT/);
  assert.match(html, /value="fr">FR/);
  assert.match(html, /value="en">EN/);
});

test('a interface explica que Uril é a variante cabo-verdiana da família Ayo e Awalé', () => {
  assert.match(i18n, /variante praticada em Cabo Verde/);
  assert.match(i18n, /Ayo\/Awalé\/Oware/);
});

test('os bancos online têm convites WhatsApp para jogar e assistir', () => {
  assert.match(html, /id="sharePlayButton"/);
  assert.match(html, /id="shareWatchButton"/);
  assert.match(app, /https:\/\/wa\.me\/\?text=/);
  assert.match(app, /shareBankViaWhatsApp\('play'\)/);
  assert.match(app, /shareBankViaWhatsApp\('watch'\)/);
});

test('os links WhatsApp abrem directamente o banco indicado', () => {
  assert.match(app, /searchParams\.set\('bank', app\.room\.id\)/);
  assert.match(app, /function openSharedInvite/);
  assert.match(html, /id="sharedInvitePanel"/);
});


test('a interface inclui desistência, alerta da IA e rodapé do autor', () => {
  assert.match(html, /id="resignButton"/);
  assert.match(html, /id="resignDialog"/);
  assert.match(html, /id="aiResignDialog"/);
  assert.match(html, /© 2026 Salazar da Cruz/);
  assert.match(html, /Versão 0\.0\.30/);
});

test('o visual final usa um tabuleiro monobloco construído em CSS', () => {
  assert.doesNotMatch(css, /approved-v25\/board-monoblock-realistic\.png/);
  assert.match(css, /V0\.0\.30 — regra do Frouxo reflectida no visual final; tabuleiro menos alto e números discretos/);
  assert.match(css, /aspect-ratio:\s*1200 \/ 500/);
  assert.match(css, /inset 16px 16px 22px/);
});

test('a página inclui um mural público de sugestões e respostas', () => {
  assert.match(html, /id="suggestionsButton"/);
  assert.match(html, /id="suggestionsSection"/);
  assert.match(html, /id="suggestionsList"/);
  assert.match(html, /id="suggestionForm"/);
  assert.match(app, /function renderSuggestions\(\)/);
  assert.match(app, /createSuggestionReply/);
  assert.doesNotMatch(app, /mailto:sugestoes@devnexusdigital\.com/);
});


test('as partidas contra o computador podem abrir um banco público observável', () => {
  assert.match(app, /async function startPcGame\(\)/);
  assert.match(app, /multiplayer\.createComputerRoom/);
  assert.match(app, /pcBankPublished/);
  assert.match(app, /function watchPlayerBank/);
  assert.match(app, /player\.status === 'pc' && player\.bank_id/);
});

test('chat e WhatsApp para assistir funcionam também no banco contra o computador', () => {
  assert.match(app, /\['online', 'pc'\]\.includes\(app\.mode\).*Boolean\(app\.room\)/s);
  assert.match(app, /const canInvitePlayer = app\.mode === 'online'/);
  assert.match(app, /elements\.shareWatch\.disabled = false/);
});

test('a ajuda explica o banco público contra o computador nos três idiomas', () => {
  assert.match(i18n, /banco público que outros jogadores conseguem observar/);
  assert.match(i18n, /banque publique observable en temps réel/);
  assert.match(i18n, /public bank that can be watched live/);
});

test('as sementes são elementos limpos e não imagens de tigelas', () => {
  assert.match(app, /className = 'seed-pile'/);
  assert.match(app, /className = 'uril-seed'/);
  assert.match(css, /\.uril-seed\s*\{/);
  assert.doesNotMatch(app, /trou-bonduc/);
  assert.doesNotMatch(app, /--seed-image/);
});

test('as cavidades pertencem ao tabuleiro e os botões não desenham discos escuros', () => {
  assert.match(css, /pit\.classic-pit::before,[\s\S]*content:\s*none\s*!important/);
  assert.match(css, /north-row \.pit:nth-child\(1\)/);
  assert.match(css, /south-row \.pit:nth-child\(6\)/);
});


test('o tabuleiro fica mais estreito no ecrã', () => {
  assert.match(css, /V0\.0\.30 — regra do Frouxo reflectida no visual final; tabuleiro menos alto e números discretos/);
  assert.match(css, /width:\s*min\(92%,\s*980px\)/);
});

test('buracos com mais de 9 sementes mostram o número no centro', () => {
  assert.match(app, /overflow-count', seedTotal > 9/);
  assert.match(css, /overflow-count \.seed-count[\s\S]*top:\s*50%[\s\S]*left:\s*50%[\s\S]*translate\(-50%, -50%\)/);
});


test('a ajuda menciona a regra do Frouxo nos três idiomas', () => {
  assert.match(i18n, /Frouxo/);
  assert.match(i18n, /quem deu fogo/);
  assert.match(i18n, /a donné le feu/);
  assert.match(i18n, /cleared all six pits/);
});
