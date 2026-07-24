import {
  SOUTH,
  NORTH,
  applyMove,
  createGame,
  createMatch,
  legalMoves,
  matchDisplay,
  nextRoundStarter,
  otherPlayer,
  pitLabel,
  registerGameResult,
} from './engine.js?v=0.0.7';
import { chooseMove, levelLabel } from './ai.js?v=0.0.7';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js?v=0.0.7';
import { MultiplayerService } from './multiplayer.js?v=0.0.7';
import { boardRowsForPerspective, seatPlayers } from './perspective.js?v=0.0.7';

const ISLANDS = {
  'santiago': 'Santiago',
  'santo-antao': 'Santo Antão',
  'sao-vicente': 'São Vicente',
  'sao-nicolau': 'São Nicolau',
  'sal': 'Sal',
  'boa-vista': 'Boa Vista',
  'maio': 'Maio',
  'fogo': 'Fogo',
  'brava': 'Brava',
  'santa-luzia': 'Santa Luzia',
};

const $ = (selector) => document.querySelector(selector);
const elements = {
  home: $('#homeScreen'), game: $('#gameScreen'),
  nick: $('#nickInput'), island: $('#islandSelect'), level: $('#levelSelect'),
  roomsPanel: $('#roomsPanel'), roomList: $('#roomList'), roomName: $('#roomNameInput'),
  setupNotice: $('#onlineSetupNotice'), onlineCount: $('#onlineCount'),
  northRow: $('#northRow'), southRow: $('#southRow'),
  northNick: $('#northNick'), southNick: $('#southNick'),
  northIsland: $('#northIsland'), southIsland: $('#southIsland'),
  northAvatar: $('#northAvatar'), southAvatar: $('#southAvatar'),
  northScore: $('#northScore'), southScore: $('#southScore'),
  topScoreLabel: $('#topScoreLabel'), bottomScoreLabel: $('#bottomScoreLabel'),
  northQuatros: $('#northQuatros'), southQuatros: $('#southQuatros'),
  northRun: $('#northRun'), southRun: $('#southRun'), cutStatus: $('#cutStatus'),
  turnBadge: $('#turnBadge'), roomTitle: $('#roomTitle'), gameModeLabel: $('#gameModeLabel'),
  statusTitle: $('#statusTitle'), statusMessage: $('#statusMessage'),
  matchMessage: $('#matchMessage'), lastMoveText: $('#lastMoveText'), roomStatus: $('#roomStatus'),
  newRound: $('#newRoundButton'), rules: $('#rulesDialog'), toast: $('#toast'),
  roundResult: $('#roundResult'), roundResultTitle: $('#roundResultTitle'),
  roundResultScore: $('#roundResultScore'), roundResultNext: $('#roundResultNext'),
};

const app = {
  profile: loadProfile(),
  mode: null,
  aiLevel: 'amateur',
  session: createSession(),
  players: defaultPlayers(),
  room: null,
  side: SOUTH,
  spectator: false,
  busy: false,
  animationGame: null,
  animation: null,
  remoteUpdateQueue: Promise.resolve(),
  aiTimer: null,
  roundTimer: null,
  roundKey: null,
  roundTransitionBusy: false,
  rooms: [],
  onlinePlayers: [],
  pitButtons: new Map(),
  spriteCache: new Map(),
  boardPerspective: null,
  lastRoomFingerprint: null,
};

const ROUND_TRANSITION_TIMING = {
  local: 2800,
  onlineHost: 2800,
  onlineGuestFallback: 4600,
};

const ANIMATION_TIMING = {
  lift: 180,
  seed: 150,
  capture: 220,
  settle: 120,
};

const multiplayer = new MultiplayerService({
  url: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  onLobbyChange: () => refreshRooms(),
  onPresenceChange: ({ players = [], count = 0 } = {}) => {
    app.onlinePlayers = players;
    elements.onlineCount.textContent = String(count);
    elements.onlineCount.closest('.online-pill')?.setAttribute(
      'title',
      `${count} jogador${count === 1 ? '' : 'es'} ligado${count === 1 ? '' : 's'}`,
    );
  },
});

function createSession(firstPlayer = SOUTH, match = createMatch(), previousWinner = null) {
  return {
    game: createGame({ firstPlayer }),
    match,
    firstPlayer,
    previousWinner,
    roundRegistered: false,
    createdAt: new Date().toISOString(),
  };
}

function defaultPlayers() {
  return {
    [SOUTH]: { nick: 'Sul', island: 'santiago' },
    [NORTH]: { nick: 'Norte', island: 'sao-vicente' },
  };
}

function loadProfile() {
  try {
    const stored = JSON.parse(localStorage.getItem('uril-profile-v0') || '{}');
    return {
      nick: String(stored.nick || ''),
      island: ISLANDS[stored.island] ? stored.island : 'santiago',
    };
  } catch {
    return { nick: '', island: 'santiago' };
  }
}

function saveProfile() {
  app.profile.nick = elements.nick.value.trim();
  app.profile.island = elements.island.value;
  localStorage.setItem('uril-profile-v0', JSON.stringify(app.profile));
  document.body.dataset.island = app.profile.island;
  multiplayer.updatePresence(app.profile).catch(() => {});
}

function requireProfile() {
  saveProfile();
  if (app.profile.nick.length < 2) {
    elements.nick.focus();
    toast('Escreve primeiro um nick com pelo menos dois caracteres.');
    return false;
  }
  return true;
}

function showScreen(name) {
  elements.home.classList.toggle('active', name === 'home');
  elements.game.classList.toggle('active', name === 'game');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initials(nick) {
  return (nick || '?').trim().slice(0, 1).toUpperCase();
}

function playerName(player) {
  return app.players[player]?.nick || (player === SOUTH ? 'Sul' : 'Norte');
}

function islandName(code) {
  return ISLANDS[code] || 'Cabo Verde';
}

function currentPerspective() {
  return app.mode === 'online' && !app.spectator && app.side === NORTH
    ? NORTH
    : SOUTH;
}

function currentSeats() {
  return seatPlayers(currentPerspective());
}

function invalidateBoardView() {
  app.pitButtons.clear();
  app.boardPerspective = null;
  elements.northRow.replaceChildren();
  elements.southRow.replaceChildren();
}

function roomFingerprint(room) {
  const game = room?.game_state?.game || {};
  return JSON.stringify({
    id: room?.id || null,
    version: Number(room?.version || 0),
    status: room?.status || null,
    guest: room?.guest_id || null,
    turn: Number(game.turn || 0),
    currentPlayer: game.currentPlayer || null,
    winner: game.winner || null,
    board: Array.isArray(game.board) ? game.board : [],
    scores: game.scores || {},
  });
}

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function displayedGame() {
  return app.animationGame || app.session.game;
}

function sleep(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

function clearRoundTransition() {
  window.clearTimeout(app.roundTimer);
  app.roundTimer = null;
  app.roundKey = null;
}

function roundKey(session = app.session) {
  const game = session?.game;
  if (!game || game.status !== 'finished') return null;
  return [session.createdAt, game.turn, game.winner, session.match?.gamesPlayed].join(':');
}

function canArrangeNextRound() {
  if (app.spectator) return false;
  if (app.mode !== 'online') return true;
  return Boolean(app.side && multiplayer.user);
}

function roundTransitionDelay() {
  if (app.mode !== 'online') return ROUND_TRANSITION_TIMING.local;
  const isHost = app.room?.host_id === multiplayer.user?.id;
  return isHost
    ? ROUND_TRANSITION_TIMING.onlineHost
    : ROUND_TRANSITION_TIMING.onlineGuestFallback;
}

function scheduleRoundTransition() {
  const key = roundKey();
  if (!key) {
    clearRoundTransition();
    return;
  }
  if (!canArrangeNextRound() || app.roundKey === key || app.roundTransitionBusy) return;

  app.roundKey = key;
  app.roundTimer = window.setTimeout(() => {
    newRound({ automatic: true, scheduledKey: key }).catch((error) => {
      toast(`Não foi possível arrumar o tabuleiro: ${error.message}`);
    });
  }, roundTransitionDelay());
}

function boardsEqual(left, right) {
  return Array.isArray(left) && Array.isArray(right) &&
    left.length === right.length && left.every((value, index) => value === right[index]);
}

function movePath(beforeBoard, pitIndex) {
  const path = [];
  let seeds = beforeBoard[pitIndex];
  let cursor = pitIndex;
  while (seeds > 0) {
    cursor = (cursor + 1) % 12;
    if (cursor === pitIndex) cursor = (cursor + 1) % 12;
    path.push(cursor);
    seeds -= 1;
  }
  return path;
}

function canAnimateTransition(fromGame, toGame) {
  const move = toGame?.lastMove;
  return Boolean(
    move &&
    boardsEqual(fromGame?.board, move.before)
  );
}

async function animateMove(fromGame, toGame) {
  if (!canAnimateTransition(fromGame, toGame)) return;

  const move = toGame.lastMove;
  app.animationGame = cloneValue(fromGame);
  app.animationGame.lastMove = null;
  app.animationGame.board[move.pitIndex] = 0;
  app.animation = {
    phase: 'lifting',
    activePit: move.pitIndex,
    step: 0,
    total: move.before[move.pitIndex],
    player: move.player,
  };
  renderGame();
  await sleep(ANIMATION_TIMING.lift);

  const path = movePath(move.before, move.pitIndex);
  for (let step = 0; step < path.length; step += 1) {
    const pitIndex = path[step];
    app.animationGame.board[pitIndex] += 1;
    app.animation = {
      phase: 'sowing',
      activePit: pitIndex,
      step: step + 1,
      total: path.length,
      player: move.player,
    };
    renderGame();
    await sleep(ANIMATION_TIMING.seed);
  }

  for (const pitIndex of move.capturedPits || []) {
    const captured = app.animationGame.board[pitIndex];
    app.animationGame.board[pitIndex] = 0;
    app.animationGame.scores[move.player] += captured;
    app.animation = {
      phase: 'capture',
      activePit: pitIndex,
      step: 0,
      total: move.capturedPits.length,
      player: move.player,
      captured,
    };
    renderGame();
    await sleep(ANIMATION_TIMING.capture);
  }

  app.animationGame = cloneValue(toGame);
  app.animation = {
    phase: 'settling',
    activePit: move.lastPit,
    step: path.length,
    total: path.length,
    player: move.player,
  };
  renderGame();
  await sleep(ANIMATION_TIMING.settle);
  app.animationGame = null;
  app.animation = null;
}

function settleRound(session) {
  if (session.game.status === 'finished' && !session.roundRegistered) {
    session.match = registerGameResult(session.match, session.game.winner);
    session.roundRegistered = true;
  }
  return session;
}

function startPcGame() {
  if (!requireProfile()) return;
  app.mode = 'pc';
  app.aiLevel = elements.level.value;
  app.side = SOUTH;
  app.spectator = false;
  app.room = null;
  app.players = {
    [SOUTH]: { ...app.profile },
    [NORTH]: { nick: `PC · ${levelLabel(app.aiLevel)}`, island: 'santa-luzia' },
  };
  app.session = createSession(SOUTH);
  showScreen('game');
  renderGame();
}

function startLocalGame() {
  if (!requireProfile()) return;
  const guest = (window.prompt('Nick do jogador Norte:', 'Convidado') || 'Convidado').trim().slice(0, 18);
  app.mode = 'local';
  app.side = null;
  app.spectator = false;
  app.room = null;
  app.players = {
    [SOUTH]: { ...app.profile },
    [NORTH]: { nick: guest || 'Convidado', island: app.profile.island },
  };
  app.session = createSession(SOUTH);
  showScreen('game');
  renderGame();
}

async function openRooms() {
  if (!requireProfile()) return;
  elements.roomsPanel.hidden = false;
  elements.roomsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  elements.setupNotice.hidden = multiplayer.configured;
  await refreshRooms();
}

async function refreshRooms() {
  if (elements.roomsPanel.hidden) return;
  if (!multiplayer.configured || !multiplayer.client) {
    renderRooms([]);
    return;
  }
  try {
    app.rooms = await multiplayer.listRooms();
    renderRooms(app.rooms);
  } catch (error) {
    toast(`Não foi possível actualizar as salas: ${error.message}`);
  }
}

function renderRooms(rooms) {
  elements.roomList.replaceChildren();
  if (!multiplayer.configured) {
    elements.roomList.append(emptyState('Liga o Supabase para abrir as mesas online.'));
    return;
  }
  if (!rooms.length) {
    elements.roomList.append(emptyState('Ainda não há salas. Cria a primeira mesa.'));
    return;
  }

  for (const room of rooms) {
    const item = document.createElement('article');
    item.className = 'room-item';
    const info = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = room.name;
    const detail = document.createElement('p');
    const host = `${room.host_nick} · ${islandName(room.host_island)}`;
    const guest = room.guest_nick ? ` vs ${room.guest_nick} · ${islandName(room.guest_island)}` : '';
    detail.textContent = host + guest;
    info.append(title, detail);

    const state = document.createElement('span');
    state.className = 'room-state';
    state.textContent = room.status === 'waiting' ? 'À ESPERA' : 'EM JOGO';

    const button = document.createElement('button');
    button.className = room.status === 'waiting' ? 'primary-button compact' : 'secondary-button compact';
    const isPlayer = multiplayer.user && [room.host_id, room.guest_id].includes(multiplayer.user.id);
    if (isPlayer) button.textContent = 'Retomar';
    else if (room.status === 'waiting') button.textContent = 'Jogar';
    else button.textContent = 'Ver jogar';
    button.addEventListener('click', () => enterRoomFromList(room, isPlayer));
    item.append(info, state, button);
    elements.roomList.append(item);
  }
}

function emptyState(text) {
  const node = document.createElement('div');
  node.className = 'empty-state';
  node.textContent = text;
  return node;
}

async function createRoom() {
  if (!requireProfile()) return;
  if (!multiplayer.configured || !multiplayer.client) {
    toast('As salas online precisam da configuração Supabase incluída no pacote.');
    return;
  }
  try {
    const room = await multiplayer.createRoom({
      name: elements.roomName.value.trim(),
      profile: app.profile,
      session: createSession(SOUTH),
    });
    await enterOnlineRoom(room, false);
  } catch (error) {
    toast(`Erro ao criar sala: ${error.message}`);
  }
}

async function enterRoomFromList(room, isPlayer) {
  if (!requireProfile()) return;
  try {
    if (isPlayer) {
      await enterOnlineRoom(await multiplayer.getRoom(room.id), false);
    } else if (room.status === 'waiting') {
      await enterOnlineRoom(await multiplayer.joinRoom(room.id, app.profile), false);
    } else {
      await enterOnlineRoom(await multiplayer.getRoom(room.id), true);
    }
  } catch (error) {
    toast(`Não foi possível entrar na sala: ${error.message}`);
    await refreshRooms();
  }
}

async function enterOnlineRoom(room, spectator) {
  app.remoteUpdateQueue = Promise.resolve();
  app.mode = 'online';
  app.room = room;
  app.spectator = spectator;
  app.session = normaliseSession(room.game_state);
  app.players = {
    [SOUTH]: { nick: room.host_nick, island: room.host_island },
    [NORTH]: { nick: room.guest_nick || 'À espera…', island: room.guest_island || 'santa-luzia' },
  };
  app.side = spectator ? null : room.host_id === multiplayer.user.id ? SOUTH : NORTH;
  app.lastRoomFingerprint = roomFingerprint(room);
  invalidateBoardView();
  await multiplayer.subscribeRoom(room.id, (updated) => {
    app.remoteUpdateQueue = app.remoteUpdateQueue
      .then(() => applyRemoteRoomUpdate(updated))
      .catch((error) => toast(`Erro ao sincronizar a sala: ${error.message}`));
  });
  showScreen('game');
  renderGame();
}

function normaliseSession(value) {
  if (!value?.game || !value?.match) return createSession(SOUTH);
  const session = JSON.parse(JSON.stringify(value));
  if (!('previousWinner' in session)) session.previousWinner = null;
  return session;
}

async function applyRemoteRoomUpdate(updated) {
  if (app.mode !== 'online' || !updated || (app.room?.id && updated.id !== app.room.id)) return;

  const fingerprint = roomFingerprint(updated);
  if (fingerprint === app.lastRoomFingerprint) return;

  const incomingVersion = Number(updated.version || 0);
  const currentVersion = Number(app.room?.version || 0);
  if (incomingVersion < currentVersion) return;

  const incoming = normaliseSession(updated.game_state);
  const previous = normaliseSession(app.session);
  app.lastRoomFingerprint = fingerprint;
  app.room = updated;
  app.players = {
    [SOUTH]: { nick: updated.host_nick, island: updated.host_island },
    [NORTH]: { nick: updated.guest_nick || 'À espera…', island: updated.guest_island || 'santa-luzia' },
  };

  // A actualização chega por Broadcast e também pelo Postgres Realtime. O
  // fingerprint elimina o duplicado; a primeira chegada reproduz a jogada.
  if (!app.busy && canAnimateTransition(previous.game, incoming.game)) {
    app.busy = true;
    try {
      await animateMove(previous.game, incoming.game);
    } finally {
      app.busy = false;
    }
  }

  app.session = incoming;
  renderGame();
}

function classicSpriteUrl(seedTotal) {
  const spriteTotal = Math.min(Math.max(Number(seedTotal) || 0, 0), 15);
  const spriteName = String(spriteTotal).padStart(2, '0');
  return new URL(`../assets/classic/trou-bonduc${spriteName}.png`, import.meta.url).href;
}

async function preloadClassicSprites() {
  const loads = [];
  for (let total = 0; total <= 15; total += 1) {
    const image = new Image();
    app.spriteCache.set(total, image);
    loads.push(new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
      image.src = classicSpriteUrl(total);
    }));
  }
  await Promise.all(loads);
}

function createPitElement(index) {
  const button = document.createElement('button');
  button.className = 'pit classic-pit';
  button.type = 'button';
  button.dataset.index = String(index);

  const count = document.createElement('span');
  count.className = 'seed-count';
  button.append(count);
  button.addEventListener('click', () => playMove(index));

  app.pitButtons.set(index, button);
  return button;
}

function ensurePitElements() {
  const perspective = currentPerspective();
  if (app.pitButtons.size === 12 && app.boardPerspective === perspective) return;

  const rows = boardRowsForPerspective(perspective);
  app.pitButtons.clear();
  elements.northRow.replaceChildren(...rows.top.map(createPitElement));
  elements.southRow.replaceChildren(...rows.bottom.map(createPitElement));
  app.boardPerspective = perspective;
  document.body.dataset.boardPerspective = perspective;
  document.body.dataset.onlinePlayer = app.mode === 'online' && !app.spectator ? 'true' : 'false';
}

function updatePitElement(index, game, moves, lastPit) {
  const button = app.pitButtons.get(index);
  if (!button) return;

  const seedTotal = game.board[index];
  const spriteTotal = Math.min(seedTotal, 15);
  const spriteName = String(spriteTotal).padStart(2, '0');

  // O elemento permanece no DOM. A imagem só muda quando muda o número de
  // sementes, evitando o clarão de uma casa vazia a cada refrescamento.
  if (button.dataset.sprite !== spriteName) {
    button.style.backgroundImage = `url("${classicSpriteUrl(spriteTotal)}")`;
    button.dataset.sprite = spriteName;
  }

  button.dataset.seeds = String(seedTotal);
  button.title = `${pitLabel(index)}: ${seedTotal} sementes`;
  button.setAttribute('aria-label', `${pitLabel(index)}: ${seedTotal} sementes`);
  button.disabled = !moves.includes(index);
  button.classList.toggle('legal', moves.includes(index));
  button.classList.toggle('last', lastPit === index);
  button.classList.toggle('overflow-count', seedTotal > 15);

  const count = button.querySelector('.seed-count');
  if (count) count.textContent = String(seedTotal);

  const active = app.animation?.activePit === index;
  button.classList.toggle('lifting', active && app.animation.phase === 'lifting');
  button.classList.toggle('sowing', active && app.animation.phase === 'sowing');
  button.classList.toggle('capturing', active && app.animation.phase === 'capture');
  button.classList.toggle('settling', active && app.animation.phase === 'settling');
}

function canLocalPlayerAct() {
  const game = app.session.game;
  if (game.status !== 'playing' || app.busy) return false;
  if (app.mode === 'local') return true;
  if (app.mode === 'pc') return game.currentPlayer === SOUTH;
  if (app.mode === 'online') {
    return app.room?.status === 'playing' && !app.spectator && app.side === game.currentPlayer;
  }
  return false;
}

function renderBoard() {
  ensurePitElements();
  const game = displayedGame();
  const moves = canLocalPlayerAct() ? legalMoves(app.session.game) : [];
  const lastPit = app.animation ? null : game.lastMove?.lastPit;

  for (let index = 0; index < 12; index += 1) {
    updatePitElement(index, game, moves, lastPit);
  }
}

function renderGame() {
  const game = displayedGame();
  const { match } = app.session;
  const display = matchDisplay(match);
  const seats = currentSeats();
  const top = seats.top;
  const bottom = seats.bottom;

  elements.northNick.textContent = playerName(top);
  elements.southNick.textContent = playerName(bottom);
  elements.northIsland.textContent = islandName(app.players[top].island);
  elements.southIsland.textContent = islandName(app.players[bottom].island);
  elements.northAvatar.textContent = initials(playerName(top));
  elements.southAvatar.textContent = initials(playerName(bottom));
  elements.northScore.textContent = String(game.scores[top]);
  elements.southScore.textContent = String(game.scores[bottom]);
  elements.topScoreLabel.textContent = `Colhidas por ${playerName(top)}`;
  elements.bottomScoreLabel.textContent = `Colhidas por ${playerName(bottom)}`;
  elements.northQuatros.textContent = String(display.quatros[top]);
  elements.southQuatros.textContent = String(display.quatros[bottom]);
  elements.northRun.textContent = String(display.score[top]);
  elements.southRun.textContent = String(display.score[bottom]);
  elements.cutStatus.textContent = display.cutCandidate
    ? `Corte: ${playerName(display.cutCandidate)} ${display.cutWins}/2`
    : display.protectedBy
      ? `Quatro protegido por ${playerName(display.protectedBy)}`
      : '';
  elements.matchMessage.textContent = display.message;

  elements.roomTitle.textContent = app.mode === 'online' ? app.room?.name || 'Sala online' : 'Mesa de Uril';
  elements.gameModeLabel.textContent =
    app.mode === 'pc' ? `CONTRA O PC · ${levelLabel(app.aiLevel).toUpperCase()}` :
    app.mode === 'online' ? (app.spectator ? 'A ASSISTIR' : 'SALA ONLINE') : 'DOIS JOGADORES';

  elements.turnBadge.textContent = game.status === 'finished'
    ? 'Partida terminada'
    : `Vez de ${playerName(game.currentPlayer)}`;

  renderStatus();
  renderLastMove();
  renderBoard();
  renderRoundResult();

  elements.newRound.hidden = game.status !== 'finished' || app.spectator;

  if (app.mode === 'online') {
    elements.roomStatus.textContent = app.room?.status === 'waiting'
      ? 'À espera de adversário'
      : app.spectator
        ? 'Modo espectador · Sul em baixo'
        : `O teu lado está em baixo · ${playerName(app.side)}`;
  } else if (app.mode === 'pc') {
    elements.roomStatus.textContent = `Computador no nível ${levelLabel(app.aiLevel)}`;
  } else {
    elements.roomStatus.textContent = 'Partida local no mesmo dispositivo';
  }

  scheduleRoundTransition();
  maybeRunAI();
}

function renderRoundResult() {
  const game = app.session.game;
  if (game.status !== 'finished') {
    elements.roundResult.hidden = true;
    return;
  }

  const winner = game.winner;
  const isDraw = winner === 'draw';
  const starter = nextRoundStarter(game, app.session.firstPlayer || SOUTH);
  elements.roundResult.hidden = false;
  elements.roundResultTitle.textContent = isDraw
    ? 'A partida terminou empatada.'
    : `${playerName(winner)} venceu a partida.`;
  elements.roundResultScore.textContent =
    `${playerName(NORTH)} ${game.scores[NORTH]} — ${game.scores[SOUTH]} ${playerName(SOUTH)}`;
  elements.roundResultNext.textContent = isDraw
    ? `O tabuleiro será arrumado. ${playerName(starter)} começa a próxima partida.`
    : `O tabuleiro será arrumado. ${playerName(winner)} começa a próxima partida.`;
}

function renderStatus() {
  const game = displayedGame();
  if (app.animation?.phase === 'lifting') {
    elements.statusTitle.textContent = `${playerName(app.animation.player)} levantou as sementes.`;
    elements.statusMessage.textContent = 'A casa de origem fica vazia antes da distribuição.';
    return;
  }
  if (app.animation?.phase === 'sowing') {
    elements.statusTitle.textContent = `${playerName(app.animation.player)} está a semear.`;
    elements.statusMessage.textContent = `Semente ${app.animation.step} de ${app.animation.total}.`;
    return;
  }
  if (app.animation?.phase === 'capture') {
    elements.statusTitle.textContent = `${playerName(app.animation.player)} está a colher.`;
    elements.statusMessage.textContent = `${app.animation.captured} sementes recolhidas desta casa.`;
    return;
  }
  if (app.animation?.phase === 'settling') {
    elements.statusTitle.textContent = 'Jogada concluída.';
    elements.statusMessage.textContent = 'O tabuleiro está a passar a vez.';
    return;
  }
  if (app.mode === 'online' && app.room?.status === 'waiting') {
    elements.statusTitle.textContent = 'Mesa criada.';
    elements.statusMessage.textContent = 'À espera que outro jogador entre.';
    return;
  }
  if (game.status === 'finished') {
    elements.statusTitle.textContent = game.winner === 'draw'
      ? 'Empate.'
      : `${playerName(game.winner)} venceu a partida.`;
    elements.statusMessage.textContent = `${game.scores[NORTH]}–${game.scores[SOUTH]}. ${game.reason}`;
    return;
  }
  if (!game.lastMove && app.session.previousWinner) {
    elements.statusTitle.textContent = `${playerName(app.session.previousWinner)} venceu a partida anterior.`;
    elements.statusMessage.textContent = `Tabuleiro arrumado. ${playerName(game.currentPlayer)} joga primeiro.`;
    return;
  }
  if (app.spectator) {
    elements.statusTitle.textContent = 'Estás a assistir.';
    elements.statusMessage.textContent = `${playerName(game.currentPlayer)} tem a vez.`;
    return;
  }
  if (app.mode === 'online' && app.side !== game.currentPlayer) {
    elements.statusTitle.textContent = 'Aguarda a jogada adversária.';
    elements.statusMessage.textContent = `${playerName(game.currentPlayer)} tem a vez.`;
    return;
  }
  if (app.mode === 'pc' && game.currentPlayer === NORTH) {
    elements.statusTitle.textContent = 'O computador está a pensar.';
    elements.statusMessage.textContent = 'A avaliar as casas disponíveis.';
    return;
  }
  elements.statusTitle.textContent = `${playerName(game.currentPlayer)}, escolhe uma casa.`;
  elements.statusMessage.textContent = 'As casas válidas ficam realçadas.';
}

function renderLastMove() {
  if (app.animation?.phase === 'sowing') {
    elements.lastMoveText.textContent = `${playerName(app.animation.player)} distribui as sementes uma a uma.`;
    return;
  }
  if (app.animation?.phase === 'capture') {
    elements.lastMoveText.textContent = `${playerName(app.animation.player)} recolhe as casas válidas.`;
    return;
  }
  const move = app.session.game.lastMove;
  if (!move) {
    elements.lastMoveText.textContent = 'Ainda não houve jogadas.';
    return;
  }
  const capture = move.capturedSeeds
    ? ` e colheu ${move.capturedSeeds} sementes${move.grandSlam ? ' nas seis casas' : ''}`
    : '';
  elements.lastMoveText.textContent = `${playerName(move.player)} jogou ${pitLabel(move.pitIndex)}${capture}.`;
}

async function playMove(index) {
  if (!canLocalPlayerAct()) return;
  try {
    app.busy = true;
    const previous = cloneValue(app.session);
    let next = cloneValue(app.session);
    next.game = applyMove(next.game, index);
    next = settleRound(next);

    if (app.mode === 'online') {
      // Grava e transmite primeiro. Assim os dois navegadores reproduzem a
      // sementeira praticamente ao mesmo tempo, sem esperar pelo fim da
      // animação de quem jogou.
      app.room = await multiplayer.updateRoomState(app.room, next, app.room.status);
      app.lastRoomFingerprint = roomFingerprint(app.room);
      next = normaliseSession(app.room.game_state);
    }

    await animateMove(previous.game, next.game);
    app.session = next;
    renderGame();
  } catch (error) {
    if (app.mode === 'online') {
      try {
        app.room = await multiplayer.getRoom(app.room.id);
        app.session = normaliseSession(app.room.game_state);
      } catch {}
    }
    toast(error.message || 'A jogada não foi aceite.');
  } finally {
    app.busy = false;
    renderGame();
  }
}

function chooseMoveAsync(game, level) {
  if (typeof Worker === 'undefined') {
    return Promise.resolve(chooseMove(game, level));
  }

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('./ai-worker.js?v=0.0.7', import.meta.url),
      { type: 'module' },
    );
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new Error('A análise da jogada excedeu o tempo previsto.'));
    }, level === 'grandmaster' ? 6000 : 3500);

    const finish = () => {
      window.clearTimeout(timeout);
      worker.terminate();
    };

    worker.addEventListener('message', (event) => {
      finish();
      if (event.data?.ok) resolve(event.data.move);
      else reject(new Error(event.data?.error || 'A inteligência artificial falhou.'));
    }, { once: true });

    worker.addEventListener('error', (event) => {
      finish();
      reject(new Error(event.message || 'Não foi possível iniciar a inteligência artificial.'));
    }, { once: true });

    worker.postMessage({ game: cloneValue(game), level });
  });
}

function maybeRunAI() {
  clearTimeout(app.aiTimer);
  if (
    app.mode !== 'pc' || app.busy || app.session.game.status !== 'playing' ||
    app.session.game.currentPlayer !== NORTH
  ) return;

  app.aiTimer = window.setTimeout(async () => {
    app.busy = true;
    try {
      const move = await chooseMoveAsync(app.session.game, app.aiLevel);
      if (move !== null) {
        const previous = cloneValue(app.session);
        let next = cloneValue(app.session);
        next.game = applyMove(next.game, move);
        next = settleRound(next);
        await animateMove(previous.game, next.game);
        app.session = next;
      }
    } catch (error) {
      toast(`Erro do computador: ${error.message}`);
    } finally {
      app.busy = false;
      renderGame();
    }
  }, 520);
}

async function newRound(options = {}) {
  const { automatic = false, scheduledKey = null } = options || {};
  if (app.session.game.status !== 'finished' || app.roundTransitionBusy) return;
  if (scheduledKey && scheduledKey !== roundKey()) return;
  if (app.mode === 'online' && (app.spectator || !app.side)) return;

  const finishedGame = cloneValue(app.session.game);
  const winner = finishedGame.winner;
  const nextFirst = nextRoundStarter(finishedGame, app.session.firstPlayer || SOUTH);
  const previousWinner = [SOUTH, NORTH].includes(winner) ? winner : null;
  const next = createSession(nextFirst, app.session.match, previousWinner);

  window.clearTimeout(app.roundTimer);
  app.roundTimer = null;
  app.roundTransitionBusy = true;
  app.busy = true;

  try {
    if (app.mode === 'online') {
      app.room = await multiplayer.updateRoomState(app.room, next, 'playing');
      app.session = normaliseSession(app.room.game_state);
    } else {
      app.session = next;
    }
    clearRoundTransition();
  } catch (error) {
    if (app.mode === 'online') {
      try {
        app.room = await multiplayer.getRoom(app.room.id);
        app.session = normaliseSession(app.room.game_state);
        if (automatic && app.session.game.status === 'playing') return;
      } catch {}
    }
    throw error;
  } finally {
    app.roundTransitionBusy = false;
    app.busy = false;
    renderGame();
  }
}

async function leaveGame() {
  clearTimeout(app.aiTimer);
  clearRoundTransition();
  app.remoteUpdateQueue = Promise.resolve();
  app.animationGame = null;
  app.animation = null;
  if (app.mode === 'online') await multiplayer.leaveRoomChannel();
  app.mode = null;
  document.body.dataset.onlinePlayer = 'false';
  app.room = null;
  app.spectator = false;
  app.lastRoomFingerprint = null;
  invalidateBoardView();
  showScreen('home');
  await refreshRooms();
}

function toast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => elements.toast.classList.remove('show'), 3200);
}

function bindEvents() {
  elements.nick.value = app.profile.nick;
  elements.island.value = app.profile.island;
  document.body.dataset.island = app.profile.island;
  elements.island.addEventListener('change', saveProfile);
  elements.nick.addEventListener('change', saveProfile);
  $('#startPcButton').addEventListener('click', startPcGame);
  $('#startLocalButton').addEventListener('click', startLocalGame);
  $('#openRoomsButton').addEventListener('click', openRooms);
  $('#refreshRoomsButton').addEventListener('click', refreshRooms);
  $('#createRoomButton').addEventListener('click', createRoom);
  $('#leaveGameButton').addEventListener('click', leaveGame);
  elements.newRound.addEventListener('click', newRound);
  $('#brandHome').addEventListener('click', () => app.mode ? leaveGame() : showScreen('home'));
  for (const selector of ['#rulesButton', '#sidebarRulesButton']) {
    $(selector).addEventListener('click', () => elements.rules.showModal());
  }
  $('#closeRulesButton').addEventListener('click', () => elements.rules.close());
  elements.rules.addEventListener('click', (event) => {
    if (event.target === elements.rules) elements.rules.close();
  });
}

async function init() {
  bindEvents();
  await preloadClassicSprites();
  renderGame();
  try {
    const result = await multiplayer.init(app.profile);
    elements.setupNotice.hidden = result.configured;
    if (result.configured) await refreshRooms();
  } catch (error) {
    elements.setupNotice.hidden = false;
    toast(`As salas online não arrancaram: ${error.message}`);
  }
}

init();
