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
