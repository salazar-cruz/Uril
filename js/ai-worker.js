import { analysePosition } from './ai.js?v=1.0.0';

self.addEventListener('message', (event) => {
  const { game, level, options } = event.data || {};
  try {
    const analysis = analysePosition(game, level, options || {});
    self.postMessage({ ok: true, analysis });
  } catch (error) {
    self.postMessage({
      ok: false,
      error: error?.message || 'Erro desconhecido da inteligência artificial.',
    });
  }
});
