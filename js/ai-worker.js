import { chooseMove } from './ai.js?v=0.0.12';

self.addEventListener('message', (event) => {
  const { game, level } = event.data || {};
  try {
    const move = chooseMove(game, level);
    self.postMessage({ ok: true, move });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error?.message || 'Erro desconhecido da inteligência artificial.',
    });
  }
});
