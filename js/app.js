import {
  SOUTH,
  NORTH,
  applyMove,
  createGame,
  createMatch,
  legalMoves,
  matchDisplay,
  otherPlayer,
  pitLabel,
  registerGameResult,
} from './engine.js?v=0.0.4';
import { chooseMove, levelLabel } from './ai.js?v=0.0.4';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js?v=0.0.4';
import { MultiplayerService } from './multiplayer.js?v=0.0.4';

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
  northQuatros: $('#northQuatros'), southQuatros: $('#southQuatros'),
  northRun: $('#northRun'), southRun: $('#southRun'), cutStatus: $('#cutStatus'),
  turnBadge: $('#turnBadge'), roomTitle: $('#roomTitle'), gameModeLabel: $('#gameModeLabel'),
  statusTitle: $('#statusTitle'), statusMessage: $('#statusMessage'),
  matchMessage: $('#matchMessage'), lastMoveText: $('#lastMoveText'), roomStatus: $('#roomStatus'),
  newRound: $('#newRoundButton'), rules: $('#rulesDialog'), toast: $('#toast'),
};

const app = {
  profile: loadProfile(),
  mode: null,
  aiLevel: 'player',
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
  rooms: [],
  onlinePlayers: [],
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
  onPresenceChange: (players) => {
    app.onlinePlayers = players;
    elements.onlineCount.textContent = String(Math.max(1, players.length));
  },
});

function createSession(firstPlayer = SOUTH, match = createMatch()) {
  return {
    game: createGame({ firstPlayer }),
    match,
    firstPlayer,
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

function cloneValue(value) {
  return JSON.parse(JSON.stringify(value));
}

function displayedGame() {
  return app.animationGame || app.session.game;
}

function sleep(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
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
    boardsEqual(fromGame?.board, move.before) &&
    move.player === fromGame?.currentPlayer
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
  return JSON.parse(JSON.stringify(value));
}

async function applyRemoteRoomUpdate(updated) {
  if (app.mode !== 'online' || (app.room?.id && updated.id !== app.room.id)) return;
  const incoming = normaliseSession(updated.game_state);
  const previous = normaliseSession(app.session);

  app.room = updated;
  app.players = {
    [SOUTH]: { nick: updated.host_nick, island: updated.host_island },
    [NORTH]: { nick: updated.guest_nick || 'À espera…', island: updated.guest_island || 'santa-luzia' },
  };

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

function buildPit(index) {
  const button = document.createElement('button');
  const seedTotal = displayedGame().board[index];
  const spriteTotal = Math.min(seedTotal, 15);
  const spriteName = String(spriteTotal).padStart(2, '0');

  button.className = 'pit classic-pit';
  button.type = 'button';
  button.dataset.index = String(index);
  button.dataset.seeds = String(seedTotal);
  button.title = `${pitLabel(index)}: ${seedTotal} sementes`;
  button.setAttribute('aria-label', `${pitLabel(index)}: ${seedTotal} sementes`);
  button.style.backgroundImage = `url("assets/classic/trou-bonduc${spriteName}.png")`;

  const count = document.createElement('span');
  count.className = 'seed-count';
  count.textContent = String(seedTotal);
  if (seedTotal > 15) button.classList.add('overflow-count');

  if (app.animation?.activePit === index) {
    if (app.animation.phase === 'lifting') button.classList.add('lifting');
    if (app.animation.phase === 'sowing') button.classList.add('sowing');
    if (app.animation.phase === 'capture') button.classList.add('capturing');
    if (app.animation.phase === 'settling') button.classList.add('settling');
  }

  button.append(count);
  button.addEventListener('click', () => playMove(index));
  return button;
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
  elements.northRow.replaceChildren();
  elements.southRow.replaceChildren();
  const game = displayedGame();
  const moves = canLocalPlayerAct() ? legalMoves(app.session.game) : [];
  const lastPit = app.animation ? null : game.lastMove?.lastPit;

  for (let index = 6; index <= 11; index += 1) {
    const pit = buildPit(index);
    pit.disabled = !moves.includes(index);
    if (moves.includes(index)) pit.classList.add('legal');
    if (lastPit === index) pit.classList.add('last');
    elements.northRow.append(pit);
  }
  for (let index = 5; index >= 0; index -= 1) {
    const pit = buildPit(index);
    pit.disabled = !moves.includes(index);
    if (moves.includes(index)) pit.classList.add('legal');
    if (lastPit === index) pit.classList.add('last');
    elements.southRow.append(pit);
  }
}

function renderGame() {
  const game = displayedGame();
  const { match } = app.session;
  const display = matchDisplay(match);
  elements.northNick.textContent = playerName(NORTH);
  elements.southNick.textContent = playerName(SOUTH);
  elements.northIsland.textContent = islandName(app.players[NORTH].island);
  elements.southIsland.textContent = islandName(app.players[SOUTH].island);
  elements.northAvatar.textContent = initials(playerName(NORTH));
  elements.southAvatar.textContent = initials(playerName(SOUTH));
  elements.northScore.textContent = String(game.scores[NORTH]);
  elements.southScore.textContent = String(game.scores[SOUTH]);
  elements.northQuatros.textContent = String(display.quatros[NORTH]);
  elements.southQuatros.textContent = String(display.quatros[SOUTH]);
  elements.northRun.textContent = String(display.score[NORTH]);
  elements.southRun.textContent = String(display.score[SOUTH]);
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

  const hostCanStart = app.mode === 'online' && app.room?.host_id === multiplayer.user?.id;
  elements.newRound.hidden = game.status !== 'finished' || app.spectator || (app.mode === 'online' && !hostCanStart);

  if (app.mode === 'online') {
    elements.roomStatus.textContent = app.room?.status === 'waiting'
      ? 'À espera de adversário'
      : app.spectator ? 'Modo espectador' : `Estás a jogar como ${app.side === SOUTH ? 'Sul' : 'Norte'}`;
  } else if (app.mode === 'pc') {
    elements.roomStatus.textContent = `Computador no nível ${levelLabel(app.aiLevel)}`;
  } else {
    elements.roomStatus.textContent = 'Partida local no mesmo dispositivo';
  }

  maybeRunAI();
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

    await animateMove(previous.game, next.game);
    app.session = next;
    renderGame();

    if (app.mode === 'online') {
      app.room = await multiplayer.updateRoomState(app.room, next, app.room.status);
      app.session = normaliseSession(app.room.game_state);
    }
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

function maybeRunAI() {
  clearTimeout(app.aiTimer);
  if (
    app.mode !== 'pc' || app.busy || app.session.game.status !== 'playing' ||
    app.session.game.currentPlayer !== NORTH
  ) return;

  app.aiTimer = window.setTimeout(async () => {
    app.busy = true;
    try {
      const move = chooseMove(app.session.game, app.aiLevel);
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

async function newRound() {
  if (app.session.game.status !== 'finished') return;
  const nextFirst = otherPlayer(app.session.firstPlayer || SOUTH);
  const next = createSession(nextFirst, app.session.match);
  if (app.mode === 'online') {
    try {
      app.room = await multiplayer.updateRoomState(app.room, next, 'playing');
      app.session = normaliseSession(app.room.game_state);
    } catch (error) {
      toast(`Não foi possível iniciar: ${error.message}`);
      return;
    }
  } else {
    app.session = next;
  }
  renderGame();
}

async function leaveGame() {
  clearTimeout(app.aiTimer);
  app.remoteUpdateQueue = Promise.resolve();
  app.animationGame = null;
  app.animation = null;
  if (app.mode === 'online') await multiplayer.leaveRoomChannel();
  app.mode = null;
  app.room = null;
  app.spectator = false;
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
