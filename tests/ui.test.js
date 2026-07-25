import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('as filas transparentes não bloqueiam as casas de Norte no modo local', () => {
  assert.match(css, /\.board \.pit-row\s*\{[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.board \.pit\.classic-pit\s*\{[^}]*pointer-events:\s*auto/s);
});

test('a ajuda descreve bancos, chat e repetição tripla', () => {
  assert.match(html, /Jogadores e bancos de Uril/);
  assert.match(html, /Chat do banco/);
  assert.match(html, /Repetição tripla/);
});


test('a ajuda explica a presença em tempo real e os estados PC e local', () => {
  assert.match(html, /actualiza-se em tempo real/);
  assert.match(html, /a jogar contra o computador/);
  assert.match(html, /a jogar no modo local/);
});
