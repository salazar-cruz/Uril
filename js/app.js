import {
  SOUTH,
  NORTH,
  applyMove,
  createGame,
  createMatch,
  gameResultValue,
  legalMoves,
  matchDisplay,
  nextRoundStarter,
  otherPlayer,
  positionKey,
  registerGameResult,
  resignGame,
  resignationValue,
} from './engine.js?v=0.0.27';
import { chooseMove, shouldOfferResignation } from './ai.js?v=0.0.27';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js?v=0.0.27';
import { MultiplayerService } from './multiplayer.js?v=0.0.27';
import { boardRowsForPerspective, seatPlayers } from './perspective.js?v=0.0.27';
import { applyTranslations, getLanguage, localeForLanguage, setLanguage, t } from './i18n.js?v=0.0.27';

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
  home: $('#homeScreen'), game: $('#gameScreen'), language: $('#languageSelect'),
  nick: $('#nickInput'), island: $('#islandSelect'), level: $('#levelSelect'),
  roomsPanel: $('#roomsPanel'), roomList: $('#roomList'), roomName: $('#roomNameInput'),
  setupNotice: $('#onlineSetupNotice'), onlineCount: $('#onlineCount'),
  onlineRoster: $('#onlineRosterList'), onlineRosterNote: $('#onlineRosterNote'),
  invitePopup: $('#invitePopup'), inviteText: $('#inviteText'),
  sharedInvitePanel: $('#sharedInvitePanel'), sharedInviteText: $('#sharedInviteText'),
  openSharedInvite: $('#openSharedInviteButton'), shareCard: $('#shareCard'),
  sharePlay: $('#sharePlayButton'), shareWatch: $('#shareWatchButton'),
  acceptInvite: $('#acceptInviteButton'), declineInvite: $('#declineInviteButton'),
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
  newRound: $('#newRoundButton'), resign: $('#resignButton'), rules: $('#rulesDialog'), toast: $('#toast'),
  resignDialog: $('#resignDialog'), resignPlayer: $('#resignPlayer'), resignWarning: $('#resignWarning'),
  resignCancel: $('#resignCancelButton'), resignConfirm: $('#resignConfirmButton'),
  aiResignDialog: $('#aiResignDialog'), aiResignWarning: $('#aiResignWarning'),
  aiResignReject: $('#aiResignRejectButton'), aiResignAccept: $('#aiResignAcceptButton'),
  suggestionsSection: $('#suggestionsSection'), suggestionsList: $('#suggestionsList'),
  suggestionsEmpty: $('#suggestionsEmpty'), suggestionsCount: $('#suggestionsCount'),
  suggestionsStatus: $('#suggestionsStatus'), suggestionNickPreview: $('#suggestionNickPreview'),
  suggestionText: $('#suggestionText'), suggestionForm: $('#suggestionForm'),
  suggestionSubmit: $('#publishSuggestionButton'), refreshSuggestions: $('#refreshSuggestionsButton'),
  roundResult: $('#roundResult'), roundResultTitle: $('#roundResultTitle'),
  roundResultScore: $('#roundResultScore'), roundResultNext: $('#roundResultNext'),
  chatCard: $('#chatCard'), chatMessages: $('#chatMessages'), chatEmpty: $('#chatEmpty'),
  chatForm: $('#chatForm'), chatInput: $('#chatInput'), chatSend: $('#chatSendButton'),
};

const app = {
  profile: loadProfile(),
  language: getLanguage(),
  sharedInvite: parseSharedInvite(),
  sharedInviteRoom: null,
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
  currentInvitation: null,
  chatMessages: [],
  chatIds: new Set(),
  pitButtons: new Map(),
  spriteCache: new Map(),
  boardPerspective: null,
  lastRoomFingerprint: null,
  pendingResignationPlayer: null,
  aiResignResolver: null,
  suggestions: [],
  suggestionsLoading: false,
  suggestionsReady: false,
  suggestionRefreshTimer: null,
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
      count === 1 ? t('playersConnectedOne') : t('playersConnectedMany', { count }),
    );
    renderOnlinePlayers();
  },
  onInvitation: (invitation) => receiveInvitation(invitation),
  onSuggestionsChange: () => scheduleSuggestionRefresh(),
});

function createSession(firstPlayer = SOUTH, match = createMatch(), previousWinner = null) {
  return {
    game: createGame({ firstPlayer }),
    match,
    firstPlayer,
    previousWinner,
    roundRegistered: false,
    aiResignationDeclined: false,
    createdAt: new Date().toISOString(),
  };
}

function createPcSession(firstPlayer = SOUTH, match = createMatch(), previousWinner = null, aiLevel = app.aiLevel) {
  return {
    ...createSession(firstPlayer, match, previousWinner),
    mode: 'pc',
    aiLevel,
  };
}

function isComputerRoom(room) {
  return room?.game_state?.mode === 'pc';
}

function hasPublicPcBank() {
  return app.mode === 'pc' && Boolean(app.room);
}

function hasSyncedBank() {
  return app.mode === 'online' || hasPublicPcBank();
}

function defaultPlayers() {
  return {
    [SOUTH]: { nick: t('south'), island: 'santiago' },
    [NORTH]: { nick: t('north'), island: 'sao-vicente' },
  };
}

function parseSharedInvite() {
  const params = new URLSearchParams(window.location.search);
  const bankId = params.get('bank');
  const action = params.get('invite');
  if (!bankId || !['play', 'watch'].includes(action)) return null;
  return {
    bankId,
    action,
    language: ['pt', 'fr', 'en'].includes(params.get('lang')) ? params.get('lang') : null,
  };
}

function translatedLevelLabel(level) {
  const keys = {
    apprentice: 'levelApprentice',
    amateur: 'levelAmateur',
    player: 'levelAmateur',
    master: 'levelMaster',
    grandmaster: 'levelGrandmaster',
  };
  return t(keys[level] || 'levelAmateur');
}

function translatedPitLabel(index) {
  const side = index < 6 ? t('south') : t('north');
  const number = index < 6 ? index + 1 : index - 5;
  return `${side} ${number}`;
}

function translatedGameReason(reason, game = app.session.game) {
  const keys = {
    'A mesma posição repetiu-se três vezes. Cada jogador fica com as sementes do seu campo.': 'reasonTriple',
    'Colheita das seis casas; o adversário ficou sem jogada.': 'reasonSix',
    'O adversário ficou sem sementes para jogar.': 'reasonEmpty',
    'Não existe jogada que consiga alimentar o adversário.': 'reasonNoFeed',
    'Desistência.': 'reasonResignation',
  };
  if (reason === 'Desistência.') {
    return t('reasonResignation', { player: playerName(game?.resignedBy) });
  }
  return keys[reason] ? t(keys[reason]) : reason;
}

function translatedMatchMessage(match) {
  if (!match?.gamesPlayed) return t('countStarts');
  if (match.lastGameWinner === 'draw') return t('matchDrawKeep');
  const winner = playerName(match.lastGameWinner);
  let message = '';
  if (match.protectedBy === match.lastGameWinner && !match.runOwner) {
    message = t('quatroRecorded', { player: winner });
  } else if (match.cutCandidate === match.lastGameWinner && match.cutWins === 1) {
    message = t('firstCutWin', { player: winner });
  } else if (match.runOwner) {
    message = t('currentLead', { player: playerName(match.runOwner), wins: match.runWins });
  } else {
    message = t('wonMatch', { player: winner });
  }
  return match.lastGameCapote ? `${t('capotePrefix', { player: winner })} ${message}` : message;
}

function applyLanguage(language = app.language) {
  app.language = setLanguage(language);
  elements.language.value = app.language;
  applyTranslations(document);
  document.body.dataset.language = app.language;
  const southSummary = document.querySelector('#southSummary');
  if (southSummary) southSummary.dataset.youLabel = t('you');
  renderOnlinePlayers();
  if (!elements.roomsPanel.hidden) renderRooms(app.rooms);
  renderGame();
  renderSharedInvitePanel();
  renderSuggestions();
  updateSuggestionAuthorPreview();
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
  updateSuggestionAuthorPreview();
  syncPresence();
}

function requireProfile() {
  saveProfile();
  if (app.profile.nick.length < 2) {
    elements.nick.focus();
    toast(t('profileTooShort'));
    return false;
  }
  return true;
}

function showScreen(name) {
  document.body.classList.toggle('game-active', name === 'game');
  elements.home.classList.toggle('active', name === 'home');
  elements.game.classList.toggle('active', name === 'game');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function initials(nick) {
  return (nick || '?').trim().slice(0, 1).toUpperCase();
}

function playerName(player) {
  return app.players[player]?.nick || (player === SOUTH ? t('south') : t('north'));
}

function islandName(code) {
  return ISLANDS[code] || t('capeVerde');
}

function presencePayload() {
  let status = 'free';
  let bankId = null;
  let bankName = null;

  if (app.mode === 'pc') {
    status = 'pc';
    bankId = app.room?.id || null;
    bankName = app.room?.name || null;
  } else if (app.mode === 'local') {
    status = 'local';
  } else if (app.mode === 'online' && app.room) {
    bankId = app.room.id;
    bankName = app.room.name;
    status = app.spectator
      ? 'watching'
      : app.room.status === 'waiting'
        ? 'waiting'
        : 'playing';
  }

  return {
    ...app.profile,
    status,
    bank_id: bankId,
    bank_name: bankName,
  };
}

function syncPresence() {
  multiplayer.updatePresence(presencePayload()).catch(() => {});
}

function onlineStatus(player) {
  const bank = player.bank_name ? ` · ${player.bank_name}` : '';
  switch (player.status) {
    case 'pc': return t('statusPc', { bank });
    case 'local': return t('statusLocal');
    case 'waiting': return t('statusWaiting', { bank });
    case 'playing': return t('statusPlaying', { bank });
    case 'watching': return t('statusWatching', { bank });
    default: return t('statusFree');
  }
}

function renderOnlinePlayers() {
  if (!elements.onlineRoster) return;
  elements.onlineRoster.replaceChildren();

  if (!multiplayer.configured) {
    elements.onlineRosterNote.textContent = t('connectSupabasePlayers');
    return;
  }

  const currentUserId = multiplayer.user?.id;
  const order = { free: 0, pc: 1, local: 2, waiting: 3, playing: 4, watching: 5 };
  const players = [...app.onlinePlayers].sort((left, right) => {
    if (left.user_id === currentUserId) return -1;
    if (right.user_id === currentUserId) return 1;
    const statusDiff = (order[left.status] ?? 9) - (order[right.status] ?? 9);
    return statusDiff || String(left.nick || '').localeCompare(String(right.nick || ''), localeForLanguage());
  });

  elements.onlineRosterNote.textContent = players.length
    ? players.length === 1 ? t('playersConnectedOne') : t('playersConnectedMany', { count: players.length })
    : t('noPlayersConnected');

  for (const player of players) {
    const item = document.createElement('article');
    item.className = `online-player status-${player.status || 'free'}`;

    const avatar = document.createElement('span');
    avatar.className = 'online-player-avatar';
    avatar.textContent = initials(player.nick);

    const info = document.createElement('div');
    const nick = document.createElement('strong');
    nick.textContent = player.nick || t('guest');
    const detail = document.createElement('small');
    detail.textContent = `${islandName(player.island)} · ${onlineStatus(player)}`;
    info.append(nick, detail);

    const isSelf = player.user_id === currentUserId;
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'roster-action';
    if (isSelf) {
      action.textContent = t('you');
      action.disabled = true;
    } else if ((player.status || 'free') === 'free') {
      const lockedInMatch = app.mode === 'online' && !app.spectator && app.room?.status === 'playing';
      action.textContent = lockedInMatch ? t('inGame') : t('invite');
      action.disabled = lockedInMatch;
      if (!lockedInMatch) action.addEventListener('click', () => inviteOnlinePlayer(player));
    } else if (player.status === 'pc' && player.bank_id) {
      action.textContent = t('watchPlay');
      action.disabled = false;
      action.addEventListener('click', () => watchPlayerBank(player));
    } else {
      action.textContent = t('occupied');
      action.disabled = true;
    }

    item.append(avatar, info, action);
    elements.onlineRoster.append(item);
  }
}

async function watchPlayerBank(player) {
  if (!player?.bank_id || !requireProfile()) return;
  try {
    if (app.mode) await leaveGame();
    const room = await multiplayer.getRoom(player.bank_id);
    await enterOnlineRoom(room, true);
  } catch (error) {
    toast(t('enterBankError', { error: error.message }));
    await refreshRooms();
  }
}

function receiveInvitation(invitation) {
  if (!invitation?.bank_id) return;
  app.currentInvitation = invitation;
  elements.inviteText.textContent = t('invitedToBank', { nick: invitation.inviter_nick, bank: invitation.bank_name });
  elements.invitePopup.hidden = false;
}

function closeInvitation() {
  app.currentInvitation = null;
  elements.invitePopup.hidden = true;
}

function bankInviteUrl(action) {
  const url = new URL(window.location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('bank', app.room.id);
  url.searchParams.set('invite', action);
  url.searchParams.set('lang', app.language);
  return url.toString();
}

function shareBankViaWhatsApp(action) {
  if (!app.room || !['online', 'pc'].includes(app.mode)) {
    toast(t('shareOnlyOnline'));
    return;
  }
  if (action === 'play' && (app.mode !== 'online' || app.room.status !== 'waiting' || app.room.guest_id)) {
    toast(t('sharePlayUnavailable'));
    return;
  }

  const url = bankInviteUrl(action);
  const message = action === 'play'
    ? t('whatsappPlayMessage', { bank: app.room.name, url })
    : t('whatsappWatchMessage', { bank: app.room.name, url });
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const popup = window.open(shareUrl, '_blank', 'noopener,noreferrer');
  if (popup) popup.opener = null;
}

function renderShareCard() {
  if (!elements.shareCard) return;
  const enabled = ['online', 'pc'].includes(app.mode) && Boolean(app.room);
  elements.shareCard.hidden = !enabled;
  if (!enabled) return;
  const canInvitePlayer = app.mode === 'online' && !app.spectator && app.room.status === 'waiting' && !app.room.guest_id;
  elements.sharePlay.hidden = !canInvitePlayer;
  elements.sharePlay.disabled = !canInvitePlayer;
  elements.shareWatch.disabled = false;
}

function renderSharedInvitePanel() {
  if (!elements.sharedInvitePanel) return;
  const invite = app.sharedInvite;
  elements.sharedInvitePanel.hidden = !invite;
  if (!invite) return;
  const bankName = app.sharedInviteRoom?.name || t('bankOfUril');
  elements.sharedInviteText.textContent = invite.action === 'play'
    ? t('sharedPlayTitle', { bank: bankName })
    : t('sharedWatchTitle', { bank: bankName });
}

async function prepareSharedInvite() {
  if (!app.sharedInvite || !multiplayer.configured) {
    renderSharedInvitePanel();
    return;
  }
  try {
    app.sharedInviteRoom = await multiplayer.getRoom(app.sharedInvite.bankId);
  } catch {
    app.sharedInviteRoom = null;
  }
  renderSharedInvitePanel();
}

function clearSharedInviteUrl() {
  app.sharedInvite = null;
  app.sharedInviteRoom = null;
  const clean = new URL(window.location.href);
  clean.search = '';
  clean.hash = '';
  window.history.replaceState({}, '', clean.toString());
  renderSharedInvitePanel();
}

async function openSharedInvite() {
  if (!app.sharedInvite || !requireProfile()) return;
  try {
    const room = await multiplayer.getRoom(app.sharedInvite.bankId);
    if (app.mode) await leaveGame();

    if (app.sharedInvite.action === 'play') {
      const isPlayer = [room.host_id, room.guest_id].includes(multiplayer.user?.id);
      if (isPlayer) {
        await enterOnlineRoom(room, false);
      } else if (room.status === 'waiting' && !room.guest_id) {
        await enterOnlineRoom(await multiplayer.joinRoom(room.id, app.profile), false);
      } else if (room.status === 'playing') {
        toast(t('sharedBankStartedWatch'));
        await enterOnlineRoom(room, true);
      } else {
        throw new Error(t('sharedBankMissing'));
      }
    } else {
      await enterOnlineRoom(room, true);
    }
    clearSharedInviteUrl();
  } catch (error) {
    toast(error.message || t('sharedBankMissing'));
  }
}

function resetChat() {
  app.chatMessages = [];
  app.chatIds = new Set();
  renderChat();
}

function normaliseChatMessage(message = {}) {
  return {
    id: String(message.id || `${message.user_id || 'anon'}-${message.sent_at || Date.now()}`),
    room_id: message.room_id || null,
    user_id: message.user_id || null,
    nick: String(message.nick || t('guest')).trim().slice(0, 18) || t('guest'),
    island: String(message.island || 'santiago'),
    text: String(message.text || '').trim().slice(0, 280),
    sent_at: message.sent_at || new Date().toISOString(),
  };
}

function appendChatMessage(rawMessage) {
  const message = normaliseChatMessage(rawMessage);
  if (!message.text || !app.room || message.room_id !== app.room.id || app.chatIds.has(message.id)) return;

  app.chatIds.add(message.id);
  app.chatMessages.push(message);
  if (app.chatMessages.length > 60) {
    const removed = app.chatMessages.splice(0, app.chatMessages.length - 60);
    for (const item of removed) app.chatIds.delete(item.id);
  }
  renderChat();
}

function renderChat() {
  if (!elements.chatCard) return;
  const enabled = ['online', 'pc'].includes(app.mode) && Boolean(app.room);
  elements.chatCard.hidden = !enabled;
  if (!enabled) return;

  const ready = Boolean(multiplayer.roomChannelReady);
  elements.chatInput.disabled = !ready;
  elements.chatSend.disabled = !ready;
  elements.chatInput.placeholder = ready ? t('chatReady') : t('chatConnecting');
  elements.chatMessages.replaceChildren();
  elements.chatEmpty.hidden = app.chatMessages.length > 0;

  for (const message of app.chatMessages) {
    const article = document.createElement('article');
    article.className = 'chat-message';
    article.classList.toggle('mine', message.user_id === multiplayer.user?.id);

    const head = document.createElement('div');
    head.className = 'chat-message-head';
    const nick = document.createElement('strong');
    nick.textContent = message.nick;
    const time = document.createElement('time');
    const date = new Date(message.sent_at);
    time.textContent = Number.isNaN(date.getTime())
      ? ''
      : date.toLocaleTimeString(localeForLanguage(), { hour: '2-digit', minute: '2-digit' });
    head.append(nick, time);

    const body = document.createElement('p');
    body.textContent = message.text;
    article.append(head, body);
    elements.chatMessages.append(article);
  }

  elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

async function sendChatMessage(event) {
  event?.preventDefault?.();
  if (!['online', 'pc'].includes(app.mode) || !app.room) return;
  const text = elements.chatInput.value.trim();
  if (!text) return;

  elements.chatInput.disabled = true;
  elements.chatSend.disabled = true;
  try {
    const message = await multiplayer.sendChatMessage(app.room, app.profile, text);
    appendChatMessage(message);
    elements.chatInput.value = '';
  } catch (error) {
    toast(t('chatError', { error: error.message }));
  } finally {
    renderChat();
    elements.chatInput.focus();
  }
}

async function acceptInvitation() {
  const invitation = app.currentInvitation;
  if (!invitation || !requireProfile()) return;
  closeInvitation();

  try {
    if (app.mode) await leaveGame();
    const bank = await multiplayer.getRoom(invitation.bank_id);
    if (bank.status !== 'waiting' || bank.guest_id) {
      throw new Error(t('bankNotFree'));
    }
    const joined = await multiplayer.joinRoom(bank.id, app.profile);
    await enterOnlineRoom(joined, false);
  } catch (error) {
    toast(t('acceptInviteError', { error: error.message }));
  }
}

async function inviteOnlinePlayer(player) {
  if (!requireProfile()) return;
  if (!multiplayer.client || !multiplayer.user) {
    toast(t('onlineNotReady'));
    return;
  }
  if ((player.status || 'free') !== 'free') {
    toast(t('playerAlreadyBusy', { nick: player.nick }));
    return;
  }

  try {
    let bank = app.mode === 'online' && !app.spectator && app.room?.host_id === multiplayer.user.id && app.room.status === 'waiting'
      ? app.room
      : app.rooms.find((candidate) => candidate.host_id === multiplayer.user.id && candidate.status === 'waiting');

    if (!bank) {
      bank = await multiplayer.createRoom({
        name: t('defaultBankName', { nick: app.profile.nick }),
        profile: app.profile,
        session: createSession(SOUTH),
      });
    } else {
      bank = await multiplayer.getRoom(bank.id);
    }

    if (app.room?.id !== bank.id || app.mode !== 'online') {
      if (app.mode) await leaveGame();
      await enterOnlineRoom(bank, false);
    }

    await multiplayer.sendInvitation(player, bank, app.profile);
    toast(t('invitationSent', { nick: player.nick }));
  } catch (error) {
    toast(t('sendInviteError', { error: error.message }));
    await refreshRooms();
  }
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
      toast(t('resetError', { error: error.message }));
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
    session.match = registerGameResult(session.match, session.game.winner, gameResultValue(session.game));
    session.roundRegistered = true;
  }
  return session;
}

async function startPcGame() {
  if (!requireProfile()) return;
  app.mode = 'pc';
  app.aiLevel = elements.level.value;
  app.side = SOUTH;
  app.spectator = false;
  app.room = null;
  resetChat();

  const computerNick = `PC · ${translatedLevelLabel(app.aiLevel)}`;
  app.players = {
    [SOUTH]: { ...app.profile },
    [NORTH]: { nick: computerNick, island: 'santa-luzia' },
  };
  app.session = createPcSession(SOUTH, createMatch(), null, app.aiLevel);
  showScreen('game');
  renderGame();
  syncPresence();

  if (!multiplayer.configured || !multiplayer.client || !multiplayer.user) {
    toast(t('pcBankPrivate'));
    return;
  }

  app.busy = true;
  renderGame();
  try {
    const room = await multiplayer.createComputerRoom({
      name: t('pcBankName', { nick: app.profile.nick }),
      profile: app.profile,
      session: app.session,
      computerNick,
      computerIsland: 'santa-luzia',
    });
    app.room = room;
    app.lastRoomFingerprint = roomFingerprint(room);
    await multiplayer.subscribeRoom(
      room.id,
      (updated) => {
        if (app.mode !== 'pc' || updated?.id !== app.room?.id) return;
        if (Number(updated.version || 0) >= Number(app.room?.version || 0)) {
          app.room = updated;
          app.lastRoomFingerprint = roomFingerprint(updated);
        }
      },
      (message) => appendChatMessage(message),
    );
    toast(t('pcBankPublished'));
    syncPresence();
    await refreshRooms();
  } catch (error) {
    app.room = null;
    await multiplayer.leaveRoomChannel().catch(() => {});
    toast(t('pcBankPublishError', { error: error.message }));
  } finally {
    app.busy = false;
    renderGame();
  }
}

function startLocalGame() {
  if (!requireProfile()) return;
  const guest = (window.prompt(t('localGuestPrompt'), t('guest')) || t('guest')).trim().slice(0, 18);
  app.mode = 'local';
  app.side = null;
  app.spectator = false;
  app.room = null;
  resetChat();
  app.players = {
    [SOUTH]: { ...app.profile },
    [NORTH]: { nick: guest || t('guest'), island: app.profile.island },
  };
  app.session = createSession(SOUTH);
  showScreen('game');
  renderGame();
  syncPresence();
}

async function openRooms() {
  if (!requireProfile()) return;
  elements.roomsPanel.hidden = false;
  elements.roomsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  elements.setupNotice.hidden = multiplayer.configured;
  await refreshRooms();
}

async function refreshRooms() {
  if (!multiplayer.configured || !multiplayer.client) {
    app.rooms = [];
    if (!elements.roomsPanel.hidden) renderRooms([]);
    return;
  }
  try {
    app.rooms = await multiplayer.listRooms();
    if (!elements.roomsPanel.hidden) renderRooms(app.rooms);
    renderOnlinePlayers();
  } catch (error) {
    toast(t('refreshBanksError', { error: error.message }));
  }
}

function renderRooms(rooms) {
  elements.roomList.replaceChildren();
  if (!multiplayer.configured) {
    elements.roomList.append(emptyState(t('connectSupabaseBanks')));
    return;
  }
  if (!rooms.length) {
    elements.roomList.append(emptyState(t('noBanks')));
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
    state.textContent = isComputerRoom(room)
      ? t('pcBankUpper')
      : room.status === 'waiting'
        ? t('waitingUpper')
        : t('playingUpper');

    const button = document.createElement('button');
    button.className = room.status === 'waiting' ? 'primary-button compact' : 'secondary-button compact';
    const isPlayer = multiplayer.user && [room.host_id, room.guest_id].includes(multiplayer.user.id);
    if (isPlayer) button.textContent = t('resume');
    else if (room.status === 'waiting') button.textContent = t('play');
    else button.textContent = t('watchPlay');
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
    toast(t('supabaseRequired'));
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
    toast(t('createBankError', { error: error.message }));
  }
}

async function enterRoomFromList(room, isPlayer) {
  if (!requireProfile()) return;
  try {
    if (isComputerRoom(room) && isPlayer && room.host_id === multiplayer.user?.id) {
      await resumeComputerRoom(await multiplayer.getRoom(room.id));
    } else if (isPlayer) {
      await enterOnlineRoom(await multiplayer.getRoom(room.id), false);
    } else if (room.status === 'waiting') {
      await enterOnlineRoom(await multiplayer.joinRoom(room.id, app.profile), false);
    } else {
      await enterOnlineRoom(await multiplayer.getRoom(room.id), true);
    }
  } catch (error) {
    toast(t('enterBankError', { error: error.message }));
    await refreshRooms();
  }
}

async function resumeComputerRoom(room) {
  app.remoteUpdateQueue = Promise.resolve();
  app.mode = 'pc';
  resetChat();
  app.room = room;
  app.spectator = false;
  app.session = normaliseSession(room.game_state);
  app.aiLevel = app.session.aiLevel || 'amateur';
  app.players = {
    [SOUTH]: { nick: room.host_nick, island: room.host_island },
    [NORTH]: { nick: room.guest_nick || `PC · ${translatedLevelLabel(app.aiLevel)}`, island: room.guest_island || 'santa-luzia' },
  };
  app.side = SOUTH;
  app.lastRoomFingerprint = roomFingerprint(room);
  invalidateBoardView();
  await multiplayer.subscribeRoom(
    room.id,
    (updated) => {
      if (app.mode !== 'pc' || updated?.id !== app.room?.id) return;
      if (Number(updated.version || 0) >= Number(app.room?.version || 0)) {
        app.room = updated;
        app.lastRoomFingerprint = roomFingerprint(updated);
      }
    },
    (message) => appendChatMessage(message),
  );
  showScreen('game');
  renderGame();
  syncPresence();
}

async function enterOnlineRoom(room, spectator) {
  app.remoteUpdateQueue = Promise.resolve();
  app.mode = 'online';
  resetChat();
  app.room = room;
  app.spectator = spectator;
  app.session = normaliseSession(room.game_state);
  app.players = {
    [SOUTH]: { nick: room.host_nick, island: room.host_island },
    [NORTH]: { nick: room.guest_nick || t('awaitingGuest'), island: room.guest_island || 'santa-luzia' },
  };
  app.side = spectator ? null : room.host_id === multiplayer.user.id ? SOUTH : NORTH;
  app.lastRoomFingerprint = roomFingerprint(room);
  invalidateBoardView();
  await multiplayer.subscribeRoom(
    room.id,
    (updated) => {
      app.remoteUpdateQueue = app.remoteUpdateQueue
        .then(() => applyRemoteRoomUpdate(updated))
        .catch((error) => toast(t('syncBankError', { error: error.message })));
    },
    (message) => appendChatMessage(message),
  );
  showScreen('game');
  renderGame();
  syncPresence();
}

function normaliseSession(value) {
  if (!value?.game || !value?.match) return createSession(SOUTH);
  const session = JSON.parse(JSON.stringify(value));
  if (!('previousWinner' in session)) session.previousWinner = null;
  if (!('aiResignationDeclined' in session)) session.aiResignationDeclined = false;
  if (session.mode === 'pc' && !session.aiLevel) session.aiLevel = 'amateur';
  if (!session.game.repetitionCounts || typeof session.game.repetitionCounts !== 'object') {
    session.game.repetitionCounts = { [positionKey(session.game)]: 1 };
    session.game.lastRepetitionCount = 1;
  }
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
    [NORTH]: { nick: updated.guest_nick || t('awaitingGuest'), island: updated.guest_island || 'santa-luzia' },
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
  syncPresence();
}

const SEED_LAYOUTS = Object.freeze({
  0: [],
  1: [[50, 50, -8, 1.10]],
  2: [[39, 49, -18, 1.02], [62, 49, 14, 1.02]],
  3: [[36, 40, -18, .98], [63, 40, 14, .98], [51, 62, 2, 1.03]],
  4: [[34, 39, -18, .94], [61, 37, 13, .95], [46, 57, 5, 1.00], [66, 59, -11, .94]],
  5: [[31, 38, -19, .89], [55, 34, 11, .92], [73, 45, -10, .88], [43, 59, 7, .94], [65, 63, -14, .91]],
  6: [[29, 37, -19, .83], [50, 31, 10, .86], [70, 38, -9, .83], [37, 57, 8, .88], [58, 55, -5, .90], [72, 65, 14, .83]],
});

const DENSE_SEED_POSITIONS = Object.freeze([
  [26, 34, -18], [47, 28, 11], [68, 34, -9],
  [34, 50, 7], [56, 47, -4], [76, 51, 15],
  [25, 67, 12], [47, 66, -13], [68, 68, 6],
  [39, 39, 18], [60, 36, -17], [44, 55, -2],
  [63, 57, 13], [38, 72, -10], [58, 74, 4],
]);

function seedLayout(seedTotal) {
  const total = Math.min(Math.max(Number(seedTotal) || 0, 0), 15);
  if (SEED_LAYOUTS[total]) return SEED_LAYOUTS[total];
  const scale = total <= 9 ? .76 : total <= 12 ? .68 : .60;
  return DENSE_SEED_POSITIONS.slice(0, total).map(([x, y, rotation], index) => [
    x,
    y,
    rotation,
    scale * (index % 4 === 0 ? 1.04 : 1),
  ]);
}

async function preloadClassicSprites() {
  // A versão aprovada desenha sementes limpas no DOM; não há sprites de tigelas.
}

function createPitElement(index) {
  const button = document.createElement('button');
  button.className = 'pit classic-pit';
  button.type = 'button';
  button.dataset.index = String(index);

  const pile = document.createElement('span');
  pile.className = 'seed-pile';
  pile.setAttribute('aria-hidden', 'true');
  button.append(pile);

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

function updateSeedPile(button, seedTotal) {
  const visibleTotal = Math.min(Math.max(Number(seedTotal) || 0, 0), 15);
  if (button.dataset.seedLayout === String(visibleTotal)) return;

  const pile = button.querySelector('.seed-pile');
  if (!pile) return;

  const seeds = seedLayout(visibleTotal).map(([x, y, rotation, scale], index) => {
    const seed = document.createElement('i');
    seed.className = 'uril-seed';
    seed.style.setProperty('--seed-x', `${x}%`);
    seed.style.setProperty('--seed-y', `${y}%`);
    seed.style.setProperty('--seed-r', `${rotation}deg`);
    seed.style.setProperty('--seed-s', String(scale));
    seed.dataset.variant = String((index % 3) + 1);
    return seed;
  });

  pile.replaceChildren(...seeds);
  button.dataset.seedLayout = String(visibleTotal);
}

function updatePitElement(index, game, moves, lastPit) {
  const button = app.pitButtons.get(index);
  if (!button) return;

  const seedTotal = game.board[index];
  updateSeedPile(button, seedTotal);

  button.dataset.seeds = String(seedTotal);
  const pitDescription = t('pitSeeds', { pit: translatedPitLabel(index), count: seedTotal });
  button.title = pitDescription;
  button.setAttribute('aria-label', pitDescription);
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

function resignationPlayer() {
  if (app.spectator || app.session.game.status !== 'playing') return null;
  if (app.mode === 'pc') return SOUTH;
  if (app.mode === 'local') return app.session.game.currentPlayer;
  if (app.mode === 'online' && app.room?.status === 'playing') return app.side;
  return null;
}

function renderResignButton() {
  const player = resignationPlayer();
  const visible = Boolean(player) && !app.busy;
  elements.resign.hidden = !visible;
  elements.resign.disabled = !visible;
  if (player) elements.resign.textContent = t('resignButton');
}

function openResignDialog() {
  const player = resignationPlayer();
  if (!player || app.busy) return;
  const seeds = Number(app.session.game.scores[player] || 0);
  const value = resignationValue(app.session.game, player);
  app.pendingResignationPlayer = player;
  elements.resignPlayer.textContent = t('resignDialogPlayer', { player: playerName(player) });
  elements.resignWarning.textContent = value === 2
    ? t('resignWarningTwo', { player: playerName(player), seeds })
    : t('resignWarningOne', { player: playerName(player), seeds });
  elements.resignDialog.showModal();
}

function closeResignDialog() {
  app.pendingResignationPlayer = null;
  if (elements.resignDialog.open) elements.resignDialog.close();
}

async function performResignation(player) {
  if (!player || app.session.game.status !== 'playing') return;
  app.busy = true;
  try {
    let next = cloneValue(app.session);
    next.game = resignGame(next.game, player);
    next = settleRound(next);
    if (hasSyncedBank()) {
      app.room = await multiplayer.updateRoomState(app.room, next, app.room.status);
      app.lastRoomFingerprint = roomFingerprint(app.room);
      next = normaliseSession(app.room.game_state);
    }
    app.session = next;
    clearRoundTransition();
    renderGame();
  } catch (error) {
    toast(error.message || t('resignError'));
  } finally {
    app.busy = false;
    renderGame();
  }
}

async function confirmResignation() {
  const player = app.pendingResignationPlayer;
  closeResignDialog();
  await performResignation(player);
}

function resolveAIResignation(accepted) {
  const resolver = app.aiResignResolver;
  app.aiResignResolver = null;
  if (elements.aiResignDialog.open) elements.aiResignDialog.close();
  resolver?.(Boolean(accepted));
}

function askAIResignation() {
  const seeds = Number(app.session.game.scores[NORTH] || 0);
  const value = resignationValue(app.session.game, NORTH);
  elements.aiResignWarning.textContent = value === 2
    ? t('aiResignWarningTwo', { player: playerName(NORTH), seeds })
    : t('aiResignWarningOne', { player: playerName(NORTH), seeds });
  elements.aiResignDialog.showModal();
  return new Promise((resolve) => { app.aiResignResolver = resolve; });
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
  elements.topScoreLabel.textContent = t('collectedBy', { player: playerName(top) });
  elements.bottomScoreLabel.textContent = t('collectedBy', { player: playerName(bottom) });
  elements.northQuatros.textContent = String(display.quatros[top]);
  elements.southQuatros.textContent = String(display.quatros[bottom]);
  elements.northRun.textContent = String(display.score[top]);
  elements.southRun.textContent = String(display.score[bottom]);
  elements.cutStatus.textContent = display.cutCandidate
    ? t('cut', { player: playerName(display.cutCandidate), wins: display.cutWins })
    : display.protectedBy
      ? t('protectedFour', { player: playerName(display.protectedBy) })
      : '';
  elements.matchMessage.textContent = translatedMatchMessage(match);

  elements.roomTitle.textContent = app.room?.name || (app.mode === 'online' ? t('bankOnline') : t('bankOfUril'));
  elements.gameModeLabel.textContent =
    app.mode === 'pc'
      ? (app.room
          ? t('versusPcLiveMode', { level: translatedLevelLabel(app.aiLevel).toUpperCase() })
          : t('versusPcMode', { level: translatedLevelLabel(app.aiLevel).toUpperCase() })) :
    app.mode === 'online' ? (app.spectator ? t('watchingMode') : t('onlineBankMode')) : t('twoPlayersMode');

  elements.turnBadge.textContent = game.status === 'finished'
    ? t('matchFinished')
    : t('turnOf', { player: playerName(game.currentPlayer) });

  renderStatus();
  renderLastMove();
  renderBoard();
  renderRoundResult();
  renderChat();
  renderShareCard();
  renderResignButton();

  elements.newRound.hidden = game.status !== 'finished' || app.spectator;

  if (app.mode === 'online') {
    elements.roomStatus.textContent = app.room?.status === 'waiting'
      ? t('bankWaitingOpponent')
      : app.spectator
        ? t('watchingBank')
        : t('yourSideBelow', { player: playerName(app.side) });
  } else if (app.mode === 'pc') {
    elements.roomStatus.textContent = app.room
      ? t('computerPublicBank', { level: translatedLevelLabel(app.aiLevel) })
      : t('computerLevel', { level: translatedLevelLabel(app.aiLevel) });
  } else {
    elements.roomStatus.textContent = t('localBank');
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
  elements.roundResultTitle.textContent = game.resignedBy
    ? t('roundResignation', { loser: playerName(game.resignedBy), winner: playerName(winner) })
    : isDraw
      ? t('roundDraw')
      : game.resultValue === 2
        ? t('roundCapote', { player: playerName(winner) })
        : t('roundWin', { player: playerName(winner) });
  elements.roundResultScore.textContent =
    `${playerName(NORTH)} ${game.scores[NORTH]} — ${game.scores[SOUTH]} ${playerName(SOUTH)}`;
  elements.roundResultNext.textContent = game.resignedBy
    ? game.resultValue === 2
      ? t('nextResignationTwo', { player: playerName(winner) })
      : t('nextResignationOne', { player: playerName(winner) })
    : isDraw
      ? t('nextDraw', { player: playerName(starter) })
      : game.resultValue === 2
        ? t('nextCapote', { player: playerName(winner) })
        : t('nextWin', { player: playerName(winner) });
}

function renderStatus() {
  const game = displayedGame();
  if (app.animation?.phase === 'lifting') {
    elements.statusTitle.textContent = t('liftingTitle', { player: playerName(app.animation.player) });
    elements.statusMessage.textContent = t('liftingText');
    return;
  }
  if (app.animation?.phase === 'sowing') {
    elements.statusTitle.textContent = t('sowingTitle', { player: playerName(app.animation.player) });
    elements.statusMessage.textContent = t('sowingText', { step: app.animation.step, total: app.animation.total });
    return;
  }
  if (app.animation?.phase === 'capture') {
    elements.statusTitle.textContent = t('captureTitle', { player: playerName(app.animation.player) });
    elements.statusMessage.textContent = t('captureText', { count: app.animation.captured });
    return;
  }
  if (app.animation?.phase === 'settling') {
    elements.statusTitle.textContent = t('moveDone');
    elements.statusMessage.textContent = t('passingTurn');
    return;
  }
  if (app.mode === 'online' && app.room?.status === 'waiting') {
    elements.statusTitle.textContent = t('bankCreated');
    elements.statusMessage.textContent = t('waitingInvitation');
    return;
  }
  if (game.status === 'finished') {
    elements.statusTitle.textContent = game.resignedBy
      ? t('resignationWin', { loser: playerName(game.resignedBy), winner: playerName(game.winner) })
      : game.winner === 'draw'
        ? t('draw')
        : game.resultValue === 2
          ? t('wonCapote', { player: playerName(game.winner) })
          : t('wonMatch', { player: playerName(game.winner) });
    elements.statusMessage.textContent = game.resignedBy
      ? game.resultValue === 2
        ? t('resignationResultTwo', { player: playerName(game.resignedBy) })
        : t('resignationResultOne')
      : `${game.scores[NORTH]}–${game.scores[SOUTH]}. ${translatedGameReason(game.reason, game)}`;
    return;
  }
  if (!game.lastMove && app.session.previousWinner) {
    elements.statusTitle.textContent = t('previousWin', { player: playerName(app.session.previousWinner) });
    elements.statusMessage.textContent = t('boardResetStarter', { player: playerName(game.currentPlayer) });
    return;
  }
  if (app.spectator) {
    elements.statusTitle.textContent = t('watchingTitle');
    elements.statusMessage.textContent = t('playerTurn', { player: playerName(game.currentPlayer) });
    return;
  }
  if (app.mode === 'online' && app.side !== game.currentPlayer) {
    elements.statusTitle.textContent = t('waitOpponent');
    elements.statusMessage.textContent = t('playerTurn', { player: playerName(game.currentPlayer) });
    return;
  }
  if (app.mode === 'pc' && game.currentPlayer === NORTH) {
    elements.statusTitle.textContent = t('computerThinking');
    elements.statusMessage.textContent = t('evaluatingMoves');
    return;
  }
  elements.statusTitle.textContent = t('choosePit', { player: playerName(game.currentPlayer) });
  elements.statusMessage.textContent = t('legalHighlighted');
}

function renderLastMove() {
  if (app.animation?.phase === 'sowing') {
    elements.lastMoveText.textContent = t('sowingLast', { player: playerName(app.animation.player) });
    return;
  }
  if (app.animation?.phase === 'capture') {
    elements.lastMoveText.textContent = t('capturingLast', { player: playerName(app.animation.player) });
    return;
  }
  const move = app.session.game.lastMove;
  if (!move) {
    elements.lastMoveText.textContent = t('noMoves');
    return;
  }
  const capture = move.capturedSeeds
    ? t('captureDescription', {
        count: move.capturedSeeds,
        grandSlam: move.grandSlam ? t('sixPits') : '',
      })
    : '';
  const repetition = move.repetitionTriggered ? t('repetitionDescription') : '';
  elements.lastMoveText.textContent = t('moveDescription', {
    player: playerName(move.player),
    pit: translatedPitLabel(move.pitIndex),
    capture,
    repetition,
  });
}

async function playMove(index) {
  if (!canLocalPlayerAct()) return;
  try {
    app.busy = true;
    const previous = cloneValue(app.session);
    let next = cloneValue(app.session);
    next.game = applyMove(next.game, index);
    next = settleRound(next);

    if (hasSyncedBank()) {
      // Grava e transmite primeiro. Assim os navegadores reproduzem a
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
    if (hasSyncedBank()) {
      try {
        app.room = await multiplayer.getRoom(app.room.id);
        app.session = normaliseSession(app.room.game_state);
      } catch {}
    }
    toast(error.message || t('moveRejected'));
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
      new URL('./ai-worker.js?v=0.0.27', import.meta.url),
      { type: 'module' },
    );
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new Error(t('aiTimeout')));
    }, level === 'grandmaster' ? 6000 : 3500);

    const finish = () => {
      window.clearTimeout(timeout);
      worker.terminate();
    };

    worker.addEventListener('message', (event) => {
      finish();
      if (event.data?.ok) resolve(event.data.move);
      else reject(new Error(event.data?.error || t('aiFailed')));
    }, { once: true });

    worker.addEventListener('error', (event) => {
      finish();
      reject(new Error(event.message || t('aiStartFailed')));
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
      if (!app.session.aiResignationDeclined && shouldOfferResignation(app.session.game, NORTH)) {
        const accepted = await askAIResignation();
        if (accepted) {
          let next = cloneValue(app.session);
          next.game = resignGame(next.game, NORTH);
          next = settleRound(next);
          if (hasPublicPcBank()) {
            app.room = await multiplayer.updateRoomState(app.room, next, app.room.status);
            app.lastRoomFingerprint = roomFingerprint(app.room);
            next = normaliseSession(app.room.game_state);
          }
          app.session = next;
          return;
        }
        app.session.aiResignationDeclined = true;
      }

      const move = await chooseMoveAsync(app.session.game, app.aiLevel);
      if (move !== null) {
        const previous = cloneValue(app.session);
        let next = cloneValue(app.session);
        next.game = applyMove(next.game, move);
        next = settleRound(next);
        if (hasPublicPcBank()) {
          app.room = await multiplayer.updateRoomState(app.room, next, app.room.status);
          app.lastRoomFingerprint = roomFingerprint(app.room);
          next = normaliseSession(app.room.game_state);
        }
        await animateMove(previous.game, next.game);
        app.session = next;
      }
    } catch (error) {
      toast(t('computerError', { error: error.message }));
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
  const next = app.mode === 'pc'
    ? createPcSession(nextFirst, app.session.match, previousWinner, app.aiLevel)
    : createSession(nextFirst, app.session.match, previousWinner);

  window.clearTimeout(app.roundTimer);
  app.roundTimer = null;
  app.roundTransitionBusy = true;
  app.busy = true;

  try {
    if (hasSyncedBank()) {
      app.room = await multiplayer.updateRoomState(app.room, next, 'playing');
      app.session = normaliseSession(app.room.game_state);
    } else {
      app.session = next;
    }
    clearRoundTransition();
  } catch (error) {
    if (hasSyncedBank()) {
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
  if (app.room && ['online', 'pc'].includes(app.mode)) {
    if (!app.spectator && app.room?.host_id === multiplayer.user?.id) {
      await multiplayer.closeRoom(app.room).catch(() => {});
    }
    await multiplayer.leaveRoomChannel();
  }
  app.mode = null;
  document.body.dataset.onlinePlayer = 'false';
  app.room = null;
  resetChat();
  app.spectator = false;
  app.lastRoomFingerprint = null;
  invalidateBoardView();
  showScreen('home');
  syncPresence();
  await refreshRooms();
}

function toast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add('show');
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => elements.toast.classList.remove('show'), 3200);
}

function updateSuggestionAuthorPreview() {
  if (!elements.suggestionNickPreview) return;
  const nick = elements.nick?.value?.trim() || app.profile.nick || t('guest');
  elements.suggestionNickPreview.textContent = `${nick} · ${islandName(elements.island?.value || app.profile.island)}`;
}

function suggestionDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat(localeForLanguage(), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function suggestionServiceMissing(error) {
  const message = String(error?.message || '');
  return error?.code === '42P01'
    || /uril_suggestions|uril_suggestion_replies|does not exist|schema cache/i.test(message);
}

function setSuggestionsStatus(message, isError = false) {
  if (!elements.suggestionsStatus) return;
  elements.suggestionsStatus.textContent = message;
  elements.suggestionsStatus.classList.toggle('error', isError);
}

function createSuggestionMeta(item) {
  const meta = document.createElement('div');
  meta.className = 'suggestion-meta';

  const avatar = document.createElement('span');
  avatar.className = 'suggestion-avatar';
  avatar.textContent = initials(item.nick);

  const identity = document.createElement('div');
  const nick = document.createElement('strong');
  nick.textContent = item.nick || t('guest');
  const detail = document.createElement('small');
  detail.textContent = `${islandName(item.island)} · ${suggestionDate(item.created_at)}`;
  identity.append(nick, detail);
  meta.append(avatar, identity);
  return meta;
}

function createReplyElement(reply) {
  const item = document.createElement('article');
  item.className = 'suggestion-reply';
  item.append(createSuggestionMeta(reply));
  const body = document.createElement('p');
  body.textContent = reply.body;
  item.append(body);
  return item;
}

function createReplyForm(suggestion) {
  const wrapper = document.createElement('div');
  wrapper.className = 'suggestion-reply-compose';
  wrapper.hidden = true;

  const form = document.createElement('form');
  form.className = 'suggestion-reply-form';
  const textarea = document.createElement('textarea');
  textarea.maxLength = 800;
  textarea.rows = 3;
  textarea.placeholder = t('replyPlaceholder');
  textarea.setAttribute('aria-label', t('replyAria', { nick: suggestion.nick }));

  const actions = document.createElement('div');
  actions.className = 'suggestion-reply-actions';
  const cancel = document.createElement('button');
  cancel.type = 'button';
  cancel.className = 'text-button';
  cancel.textContent = t('cancelReply');
  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'primary-button compact';
  submit.textContent = t('publishReply');
  actions.append(cancel, submit);
  form.append(textarea, actions);
  wrapper.append(form);

  cancel.addEventListener('click', () => {
    wrapper.hidden = true;
    textarea.value = '';
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!requireProfile()) return;
    const text = textarea.value.trim();
    if (!text) {
      toast(t('replyEmpty'));
      textarea.focus();
      return;
    }
    submit.disabled = true;
    try {
      await multiplayer.createSuggestionReply(suggestion.id, app.profile, text);
      textarea.value = '';
      wrapper.hidden = true;
      toast(t('replyPublished'));
      await refreshSuggestions({ silent: true });
    } catch (error) {
      toast(suggestionServiceMissing(error) ? t('suggestionsMigrationNeeded') : t('replyPublishError', { error: error.message }));
    } finally {
      submit.disabled = false;
    }
  });

  return { wrapper, textarea };
}

function renderSuggestions() {
  if (!elements.suggestionsList) return;
  elements.suggestionsList.replaceChildren();
  elements.suggestionsCount.textContent = String(app.suggestions.length);
  elements.suggestionsEmpty.hidden = app.suggestionsLoading || app.suggestions.length > 0;

  for (const suggestion of app.suggestions) {
    const card = document.createElement('article');
    card.className = 'suggestion-card';
    card.append(createSuggestionMeta(suggestion));

    const body = document.createElement('p');
    body.className = 'suggestion-body';
    body.textContent = suggestion.body;
    card.append(body);

    const replies = document.createElement('div');
    replies.className = 'suggestion-replies';
    const replyHead = document.createElement('div');
    replyHead.className = 'suggestion-replies-head';
    const replyCount = document.createElement('strong');
    replyCount.textContent = t('replyCount', { count: suggestion.replies?.length || 0 });
    const replyButton = document.createElement('button');
    replyButton.type = 'button';
    replyButton.className = 'text-button';
    replyButton.textContent = t('reply');
    replyHead.append(replyCount, replyButton);
    replies.append(replyHead);

    for (const reply of suggestion.replies || []) replies.append(createReplyElement(reply));

    const replyForm = createReplyForm(suggestion);
    replyButton.addEventListener('click', () => {
      replyForm.wrapper.hidden = !replyForm.wrapper.hidden;
      if (!replyForm.wrapper.hidden) window.setTimeout(() => replyForm.textarea.focus(), 20);
    });
    replies.append(replyForm.wrapper);
    card.append(replies);
    elements.suggestionsList.append(card);
  }
}

async function refreshSuggestions({ silent = false } = {}) {
  if (!multiplayer.configured || !multiplayer.client) {
    app.suggestionsReady = false;
    elements.suggestionSubmit.disabled = true;
    setSuggestionsStatus(t('suggestionsNeedSupabase'), true);
    renderSuggestions();
    return;
  }
  if (app.suggestionsLoading) return;
  app.suggestionsLoading = true;
  if (!silent) setSuggestionsStatus(t('suggestionsLoading'));
  try {
    app.suggestions = await multiplayer.listSuggestions();
    app.suggestionsReady = true;
    elements.suggestionSubmit.disabled = false;
    setSuggestionsStatus(t('suggestionsPublicNote'));
  } catch (error) {
    app.suggestionsReady = false;
    elements.suggestionSubmit.disabled = true;
    setSuggestionsStatus(
      suggestionServiceMissing(error) ? t('suggestionsMigrationNeeded') : t('suggestionsLoadError', { error: error.message }),
      true,
    );
  } finally {
    app.suggestionsLoading = false;
    renderSuggestions();
  }
}

function scheduleSuggestionRefresh() {
  window.clearTimeout(app.suggestionRefreshTimer);
  app.suggestionRefreshTimer = window.setTimeout(() => refreshSuggestions({ silent: true }), 220);
}

function openSuggestions() {
  elements.suggestionsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateSuggestionAuthorPreview();
  window.setTimeout(() => elements.suggestionText?.focus(), 420);
}

async function submitSuggestion(event) {
  event?.preventDefault?.();
  if (!requireProfile()) return;
  const text = elements.suggestionText.value.trim();
  if (text.length < 4) {
    toast(t('suggestionEmpty'));
    elements.suggestionText.focus();
    return;
  }
  elements.suggestionSubmit.disabled = true;
  try {
    await multiplayer.createSuggestion(app.profile, text);
    elements.suggestionText.value = '';
    toast(t('suggestionPublished'));
    await refreshSuggestions({ silent: true });
  } catch (error) {
    toast(suggestionServiceMissing(error) ? t('suggestionsMigrationNeeded') : t('suggestionPublishError', { error: error.message }));
  } finally {
    elements.suggestionSubmit.disabled = !app.suggestionsReady;
  }
}

function bindEvents() {
  elements.nick.value = app.profile.nick;
  elements.island.value = app.profile.island;
  document.body.dataset.island = app.profile.island;
  elements.language.addEventListener('change', () => applyLanguage(elements.language.value));
  elements.island.addEventListener('change', saveProfile);
  elements.nick.addEventListener('change', saveProfile);
  elements.nick.addEventListener('input', updateSuggestionAuthorPreview);
  $('#startPcButton').addEventListener('click', startPcGame);
  $('#startLocalButton').addEventListener('click', startLocalGame);
  $('#openRoomsButton').addEventListener('click', openRooms);
  $('#refreshRoomsButton').addEventListener('click', refreshRooms);
  $('#createRoomButton').addEventListener('click', createRoom);
  elements.acceptInvite.addEventListener('click', acceptInvitation);
  elements.declineInvite.addEventListener('click', closeInvitation);
  elements.chatForm.addEventListener('submit', sendChatMessage);
  elements.openSharedInvite.addEventListener('click', openSharedInvite);
  elements.sharePlay.addEventListener('click', () => shareBankViaWhatsApp('play'));
  elements.shareWatch.addEventListener('click', () => shareBankViaWhatsApp('watch'));
  $('#leaveGameButton').addEventListener('click', leaveGame);
  elements.newRound.addEventListener('click', newRound);
  elements.resign.addEventListener('click', openResignDialog);
  elements.resignCancel.addEventListener('click', closeResignDialog);
  elements.resignConfirm.addEventListener('click', confirmResignation);
  elements.resignDialog.addEventListener('cancel', (event) => { event.preventDefault(); closeResignDialog(); });
  elements.aiResignReject.addEventListener('click', () => resolveAIResignation(false));
  elements.aiResignAccept.addEventListener('click', () => resolveAIResignation(true));
  elements.aiResignDialog.addEventListener('cancel', (event) => { event.preventDefault(); resolveAIResignation(false); });
  $('#suggestionsButton').addEventListener('click', openSuggestions);
  elements.refreshSuggestions.addEventListener('click', () => refreshSuggestions());
  elements.suggestionForm.addEventListener('submit', submitSuggestion);
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
  if (app.sharedInvite?.language) app.language = app.sharedInvite.language;
  applyLanguage(app.language);
  await preloadClassicSprites();
  renderGame();
  renderOnlinePlayers();
  renderSuggestions();
  updateSuggestionAuthorPreview();
  try {
    const result = await multiplayer.init(app.profile);
    elements.setupNotice.hidden = result.configured;
    if (result.configured) {
      await Promise.all([refreshRooms(), refreshSuggestions()]);
      await prepareSharedInvite();
    } else {
      await refreshSuggestions();
    }
  } catch (error) {
    elements.setupNotice.hidden = false;
    toast(`Supabase: ${error.message}`);
  }
}

init();
