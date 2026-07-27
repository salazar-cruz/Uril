import { SOUTH, NORTH } from './engine.js?v=1.0.10';

/**
 * Devolve a disposição física dos índices do motor no tabuleiro.
 * Os arrays estão na ordem dos elementos DOM, cujas coordenadas clássicas
 * avançam da direita para a esquerda em cada fila.
 */
export function boardRowsForPerspective(perspective = SOUTH) {
  if (perspective === NORTH) {
    return {
      top: [0, 1, 2, 3, 4, 5],
      bottom: [11, 10, 9, 8, 7, 6],
    };
  }

  return {
    top: [6, 7, 8, 9, 10, 11],
    bottom: [5, 4, 3, 2, 1, 0],
  };
}

export function seatPlayers(perspective = SOUTH) {
  return perspective === NORTH
    ? { top: SOUTH, bottom: NORTH }
    : { top: NORTH, bottom: SOUTH };
}
