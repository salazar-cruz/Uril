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
} from './engine.js?v=1.0.4';
import { analysePosition, chooseMove, shouldOfferResignation } from './ai.js?v=1.0.4';
import { analysePlayedMove, moveFacts } from './analysis.js?v=1.0.4';
import { CALIBRATION_LEVELS } from './rating.js?v=1.0.4';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js?v=1.0.4';
import { MultiplayerService } from './multiplayer.js?v=1.0.4';
import { boardRowsForPerspective, seatPlayers } from './perspective.js?v=1.0.4';
import { applyTranslations, getLanguage, localeForLanguage, setLanguage, t } from './i18n.js?v=1.0.4';

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
  level: $('#levelSelect'), signIn: $('#signInButton'), register: $('#registerButton'), signOut: $('#signOutButton'),
  playerChip: $('#playerChip'), playerChipNick: $('#playerChipNick'), playerChipElo: $('#playerChipElo'),
  identityName: $('#identityName'), identityDescription: $('#identityDescription'), identityRating: $('#identityRating'),
  identityElo: $('#identityElo'), identityRecord: $('#identityRecord'), identityRegister: $('#identityRegisterButton'),
  authDialog: $('#authDialog'), closeAuth: $('#closeAuthButton'), loginForm: $('#loginForm'), registerForm: $('#registerForm'),
  loginEmail: $('#loginEmail'), loginPassword: $('#loginPassword'), loginStatus: $('#loginStatus'),
  registerFullName: $('#registerFullName'), registerNick: $('#registerNick'), registerCountry: $('#registerCountry'),
  registerIslandGroup: $('#registerIslandGroup'), registerIsland: $('#registerIsland'), registerEmail: $('#registerEmail'),
  registerPassword: $('#registerPassword'), registerPasswordConfirm: $('#registerPasswordConfirm'), registerStatus: $('#registerStatus'),
  calibrationBox: $('#calibrationBox'), calibrationStatus: $('#calibrationStatus'), startCalibration: $('#startCalibrationButton'),
  localModeCard: $('#localModeCard'),
  roomsPanel: $('#roomsPanel'), roomList: $('#roomList'), roomName: $('#roomNameInput'),
  roomFilters: $('#roomFilters'), roomSearch: $('#roomSearchInput'), roomDateFrom: $('#roomDateFrom'), roomDateTo: $('#roomDateTo'), roomResult: $('#roomResultFilter'), roomEvent: $('#roomEventFilter'),
  searchRooms: $('#searchRoomsButton'), createRoomRow: $('#createRoomRow'), createRoom: $('#createRoomButton'), loginCreateBank: $('#loginCreateBank'),
  roomsPreviousPage: $('#roomsPreviousPage'), roomsNextPage: $('#roomsNextPage'), roomsPageLabel: $('#roomsPageLabel'),
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
  topCapturedPit: $('#topCapturedPit'), bottomCapturedPit: $('#bottomCapturedPit'),
  topCapturedPitLabel: $('#topCapturedPitLabel'), bottomCapturedPitLabel: $('#bottomCapturedPitLabel'),
  topCapturedPitCount: $('#topCapturedPitCount'), bottomCapturedPitCount: $('#bottomCapturedPitCount'),
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
  reviewController: $('#reviewController'), reviewPosition: $('#reviewPosition'), reviewTime: $('#reviewTime'),
  reviewSlider: $('#reviewSlider'), reviewFirst: $('#reviewFirstButton'), reviewPrevious: $('#reviewPreviousButton'),
  reviewNext: $('#reviewNextButton'), reviewLast: $('#reviewLastButton'), reviewMoveDetails: $('#reviewMoveDetails'),
  reviewAnalysisResult: $('#reviewAnalysisResult'), reviewMoveList: $('#reviewMoveList'), analyseMove: $('#analyseMoveButton'),
  aiStats: $('#aiStats'), roomViewersCard: $('#roomViewersCard'), roomViewersList: $('#roomViewersList'),
  leaderboardList: $('#leaderboardList'), refreshLeaderboard: $('#refreshLeaderboardButton'),
};

const app = {
  profile: anonymousProfile(),
  account: null,
  registered: false,
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
  roomFilter: 'playing',
  roomPage: 0,
  roomPageSize: 20,
  roomTotal: 0,
  roomSearch: '',
  roomDateFrom: null,
  roomDateTo: null,
  roomResult: 'all',
  roomEvent: 'all',
  reviewMode: false,
  reviewIndex: 0,
  reviewMoves: [],
  reviewAnalysis: null,
  roomViewers: [],
  lastAiStats: null,
  calibrationMode: false,
  calibrationLevel: null,
  calibrationProgress: [],
  calibrationRecordedRound: null,
  leaderboard: [],
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
  onAuthChange: (identity) => applyAuthenticatedIdentity(identity),
  onRoomPresenceChange: ({ viewers = [] } = {}) => { app.roomViewers = viewers; renderRoomViewers(); },
});

function createSession(firstPlayer = SOUTH, match = createMatch(), previousWinner = null) {
  const createdAt = new Date().toISOString();
  const session = {
    game: createGame({ firstPlayer }),
    match,
    firstPlayer,
    previousWinner,
    roundRegistered: false,
    aiResignationDeclined: false,
    createdAt,
    lastMoveAt: null,
    history: [],
  };
  session.history.push(createHistoryEntry(session, 'start', createdAt));
  return session;
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
  return false;
}

function hasSyncedBank() {
  return app.mode === 'online' && Boolean(app.room);
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
    'Colheita das seis casas; o jogador que deu fogo não consegue alimentar o adversário na jogada seguinte.': 'reasonSix',
    'Frouxo: deu fogo podendo alimentar o adversário na jogada seguinte.': 'reasonFrouxo',
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
  if (
    match.protectedBy === match.lastGameWinner &&
    match.runOwner === match.lastGameWinner &&
    match.runWins === 4
  ) {
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
  renderIdentity();
  renderLeaderboard();
  renderReviewAnalysis();
  renderAiStats();
  renderRoomViewers();
  updateSuggestionAuthorPreview();
}

function anonymousProfile() {
  return { nick: 'Anónimo', island: null, country: null, elo: null, registered: false };
}

function applyAuthenticatedIdentity({ profile, account, registered } = {}) {
  app.registered = Boolean(registered && profile);
  app.account = account || null;
  app.profile = app.registered
    ? { ...profile, registered: true }
    : anonymousProfile();
  document.body.dataset.island = app.profile.island || 'santiago';
  renderIdentity();
  updateSuggestionAuthorPreview();
  syncPresence();
  refreshLeaderboard().catch(() => {});
  refreshCalibrationProgress().catch(() => {});
  if (!elements.roomsPanel.hidden) refreshRooms().catch(() => {});
}

function requireRegistered(messageKey = 'registrationRequired') {
  if (app.registered) return true;
  toast(t(messageKey));
  openAuthDialog('login');
  return false;
}

function calibrationComplete() {
  return app.registered && Number(app.profile?.calibration_games || 0) >= CALIBRATION_LEVELS.length;
}

function requireCompetitiveReady() {
  if (!requireRegistered()) return false;
  if (calibrationComplete()) return true;
  toast(t('calibrationRequired'));
  elements.calibrationBox.hidden = false;
  elements.calibrationBox.scrollIntoView?.({ behavior: 'smooth', block: 'center' });
  return false;
}

function requireProfile() {
  return true;
}

function isCapeVerdeCountry(value) {
  const country = String(value || '').trim().toLocaleLowerCase();
  return ['cabo verde', 'cape verde', 'cap-vert', 'cv'].includes(country);
}

function renderIdentity() {
  const registered = app.registered;
  elements.signIn.hidden = registered;
  elements.register.hidden = registered;
  elements.signOut.hidden = !registered;
  elements.playerChip.hidden = !registered;
  elements.identityRegister.hidden = registered;
  elements.identityRating.hidden = !registered;
  const competitiveReady = calibrationComplete();
  elements.localModeCard?.classList.toggle('locked', !registered);
  elements.createRoomRow.hidden = !competitiveReady;
  elements.loginCreateBank.hidden = competitiveReady;
  elements.loginCreateBank.textContent = registered ? t('calibrationRequired') : t('loginCreateBank');
  elements.createRoom.disabled = !competitiveReady;
  elements.suggestionSubmit.disabled = !registered || app.suggestionsLoading;

  if (registered) {
    elements.playerChipNick.textContent = app.profile.nick;
    elements.playerChipElo.textContent = String(app.profile.elo || 1200);
    elements.identityName.textContent = app.profile.nick;
    elements.identityDescription.textContent = [app.profile.country, islandName(app.profile.island)].filter(Boolean).join(' · ');
    elements.identityElo.textContent = String(app.profile.elo || 1200);
    const provisional = app.profile.elo_provisional ? ` · ${t('eloProvisional')}` : '';
    elements.identityRecord.textContent = `${t('officialGamesCount', { count: Number(app.profile.rated_games || 0) })}${provisional}`;
  } else {
    elements.identityName.textContent = t('anonymousVisitor');
    elements.identityDescription.textContent = t('anonymousRights');
  }
}

function openAuthDialog(tab = 'login') {
  setAuthTab(tab);
  elements.authDialog.showModal();
}

function setAuthTab(tab) {
  document.querySelectorAll('[data-auth-tab]').forEach((button) => {
    button.classList.toggle('active', button.dataset.authTab === tab);
  });
  document.querySelectorAll('[data-auth-panel]').forEach((panel) => {
    panel.classList.toggle('active', panel.dataset.authPanel === tab);
  });
}

function updateRegistrationIslandVisibility() {
  const show = isCapeVerdeCountry(elements.registerCountry.value);
  elements.registerIslandGroup.hidden = !show;
  elements.registerIsland.required = show;
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
  return code && ISLANDS[code] ? ISLANDS[code] : '';
}

function playerLocation(player = {}) {
  return [player.country, islandName(player.island)].filter(Boolean).join(' · ') || '—';
}

function presencePayload() {
  let status = 'free';
  let bankId = null;
  let bankName = null;

  if (app.mode === 'pc' || app.mode === 'calibration') {
    status = 'pc';
  } else if (app.mode === 'local') {
    status = 'local';
  } else if (app.mode === 'review' && app.room) {
    bankId = app.room.id;
    bankName = app.room.name;
    status = 'watching';
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
    registered: app.registered,
    elo: app.profile.elo || null,
    country: app.profile.country || null,
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
    nick.textContent = player.registered ? (player.nick || t('guest')) : t('anonymousVisitor');
    const detail = document.createElement('small');
    detail.textContent = `${playerLocation(player)} · ${onlineStatus(player)}${player.elo ? ` · Elo ${player.elo}` : ''}`;
    info.append(nick, detail);

    const isSelf = player.user_id === currentUserId;
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'roster-action';
    if (isSelf) {
      action.textContent = t('you');
      action.disabled = true;
    } else if ((player.status || 'free') === 'free' && player.registered && app.registered) {
      const lockedInMatch = app.mode === 'online' && !app.spectator && app.room?.status === 'playing';
      action.textContent = lockedInMatch ? t('inGame') : t('invite');
      action.disabled = lockedInMatch;
      if (!lockedInMatch) action.addEventListener('click', () => inviteOnlinePlayer(player));
    } else {
      action.textContent = t('occupied');
      action.disabled = true;
    }

    item.append(avatar, info, action);
    elements.onlineRoster.append(item);
  }
}

async function watchPlayerBank(player) {
  if (!player?.bank_id) return;
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
  if (!app.room || app.mode !== 'online') {
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
  const enabled = !app.reviewMode && app.mode === 'online' && Boolean(app.room);
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
  if (!app.sharedInvite) return;
  if (app.sharedInvite.action === 'play' && !requireCompetitiveReady()) return;
  try {
    const room = await multiplayer.getRoom(app.sharedInvite.bankId);
    if (app.mode) await leaveGame();

    if (app.sharedInvite.action === 'play') {
      const isPlayer = [room.host_id, room.guest_id].includes(multiplayer.user?.id);
      if (isPlayer) {
        await enterOnlineRoom(room, false);
      } else if (room.status === 'waiting' && !room.guest_id) {
        await enterOnlineRoom(await multiplayer.joinRoom(room.id), false);
      } else if (room.status === 'playing') {
        toast(t('sharedBankStartedWatch'));
        await enterOnlineRoom(room, true);
      } else {
        throw new Error(t('sharedBankMissing'));
      }
    } else {
      if (room.status === 'finished') await consultRoom(room);
      else await enterOnlineRoom(room, true);
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
    island: message.island || null,
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
  const enabled = !app.reviewMode && app.mode === 'online' && Boolean(app.room);
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
  if (app.mode !== 'online' || !app.room) return;
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
  if (!invitation || !requireCompetitiveReady()) return;
  closeInvitation();

  try {
    if (app.mode) await leaveGame();
    const bank = await multiplayer.getRoom(invitation.bank_id);
    if (bank.status !== 'waiting' || bank.guest_id) {
      throw new Error(t('bankNotFree'));
    }
    const joined = await multiplayer.joinRoom(bank.id);
    await enterOnlineRoom(joined, false);
  } catch (error) {
    toast(t('acceptInviteError', { error: error.message }));
  }
}

async function inviteOnlinePlayer(player) {
  if (!requireCompetitiveReady()) return;
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

function createHistoryEntry(session, type = 'move', at = new Date().toISOString()) {
  return {
    type,
    at,
    game: cloneValue(session.game),
    match: cloneValue(session.match),
    firstPlayer: session.firstPlayer,
    previousWinner: session.previousWinner ?? null,
  };
}

function appendSessionHistory(session, type = 'move', at = new Date().toISOString()) {
  if (!Array.isArray(session.history)) session.history = [];
  if (type === 'move' || type === 'resignation') session.lastMoveAt = at;
  session.history.push(createHistoryEntry(session, type, at));
  if (session.history.length > 800) session.history.splice(0, session.history.length - 800);
  return session;
}

function reviewEntry() {
  if (!app.reviewMode || !Array.isArray(app.session.history) || !app.session.history.length) return null;
  const index = Math.min(Math.max(Number(app.reviewIndex) || 0, 0), app.session.history.length - 1);
  return app.session.history[index] || null;
}

function displayedGame() {
  return app.animationGame || reviewEntry()?.game || app.session.game;
}

function displayedMatch() {
  return reviewEntry()?.match || app.session.match;
}

function displayedFirstPlayer() {
  return reviewEntry()?.firstPlayer || app.session.firstPlayer || SOUTH;
}

function formatDateTime(value) {
  const date = new Date(value || '');
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(localeForLanguage(), {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

function roomLastMoveAt(room) {
  const session = room?.game_state || {};
  if (session.lastMoveAt) return session.lastMoveAt;
  const history = Array.isArray(session.history) ? session.history : [];
  for (let index = history.length - 1; index >= 0; index -= 1) {
    if (['move', 'resignation'].includes(history[index]?.type)) return history[index].at || null;
  }
  return null;
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
  if (app.spectator || app.mode === 'calibration') return false;
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
  if (app.mode === 'online' || app.mode === 'calibration') { clearRoundTransition(); return; }
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

async function startPcGame(options = {}) {
  const calibration = Boolean(options.calibration);
  if (calibration && !requireRegistered()) return;
  app.mode = calibration ? 'calibration' : 'pc';
  app.calibrationMode = calibration;
  app.calibrationLevel = calibration ? options.level : null;
  app.calibrationRecordedRound = null;
  app.reviewMode = false;
  app.reviewIndex = 0;
  app.reviewMoves = [];
  app.reviewAnalysis = null;
  app.roomViewers = [];
  app.lastAiStats = null;
  app.aiLevel = options.level || elements.level.value;
  app.side = SOUTH;
  app.spectator = false;
  app.room = null;
  app.lastAiStats = null;
  resetChat();

  const computerNick = `PC · ${translatedLevelLabel(app.aiLevel)}`;
  const human = app.registered ? { ...app.profile } : { nick: t('anonymousVisitor'), island: null, country: null };
  app.players = {
    [SOUTH]: human,
    [NORTH]: { nick: computerNick, island: 'santa-luzia', country: 'Cabo Verde' },
  };
  app.session = createPcSession(SOUTH, createMatch(), null, app.aiLevel);
  showScreen('game');
  renderGame();
  syncPresence();
  toast(calibration ? t('initialEloTest') : t('trainingOnly'));
}

async function startCalibrationGame() {
  if (!requireRegistered()) return;
  await refreshCalibrationProgress();
  const completed = new Set(app.calibrationProgress.map((entry) => entry.level));
  const level = CALIBRATION_LEVELS.find((candidate) => !completed.has(candidate));
  if (!level) {
    toast(t('calibrationComplete', { elo: app.profile.elo || 1200 }));
    return;
  }
  await startPcGame({ calibration: true, level });
}

async function maybeRecordCalibration() {
  if (!app.calibrationMode || !app.registered || app.session.game.status !== 'finished') return;
  const key = `${app.session.createdAt}:${app.session.game.turn}:${app.session.game.winner}`;
  if (app.calibrationRecordedRound === key) return;
  app.calibrationRecordedRound = key;
  const result = app.session.game.winner === SOUTH ? 'win' : app.session.game.winner === 'draw' ? 'draw' : 'loss';
  try {
    await multiplayer.recordCalibration(app.calibrationLevel, result);
    await refreshCalibrationProgress();
    toast(t('calibrationRecorded', { elo: app.profile.elo || 1200 }));
  } catch (error) {
    toast(error.message);
    app.calibrationRecordedRound = null;
  }
}

function startLocalGame() {
  if (!requireRegistered('localLoginRequired')) return;
  const guest = (window.prompt(t('localGuestPrompt'), t('guest')) || t('guest')).trim().slice(0, 18);
  app.mode = 'local';
  app.reviewMode = false;
  app.reviewIndex = 0;
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
  elements.roomsPanel.hidden = false;
  elements.roomsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  elements.setupNotice.hidden = multiplayer.configured;
  await refreshRooms();
}

async function refreshRooms() {
  if (!multiplayer.configured || !multiplayer.client) {
    app.rooms = [];
    app.roomTotal = 0;
    if (!elements.roomsPanel.hidden) renderRooms([]);
    return;
  }
  try {
    const result = await multiplayer.listRooms({
      status: app.roomFilter,
      search: app.roomSearch,
      page: app.roomPage,
      pageSize: app.roomPageSize,
      dateFrom: app.roomDateFrom,
      dateTo: app.roomDateTo,
      result: app.roomResult,
      event: app.roomEvent,
    });
    app.rooms = result.rooms;
    app.roomTotal = result.count;
    if (!elements.roomsPanel.hidden) renderRooms(app.rooms);
    renderOnlinePlayers();
  } catch (error) {
    toast(t('refreshBanksError', { error: error.message }));
  }
}

function roomEventBadge(label) {
  const badge = document.createElement('span');
  badge.className = `room-event-badge event-${label.toLowerCase()}`;
  badge.textContent = label;
  return badge;
}

function renderRooms(rooms) {
  elements.roomList.replaceChildren();
  if (!multiplayer.configured) {
    elements.roomList.append(emptyState(t('connectSupabaseBanks')));
    return;
  }

  for (const button of elements.roomFilters?.querySelectorAll('[data-room-filter]') || []) {
    const active = button.dataset.roomFilter === app.roomFilter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  }

  const pages = Math.max(1, Math.ceil(app.roomTotal / app.roomPageSize));
  elements.roomsPageLabel.textContent = t('pageLabel', { page: app.roomPage + 1, pages });
  elements.roomsPreviousPage.disabled = app.roomPage <= 0;
  elements.roomsNextPage.disabled = app.roomPage + 1 >= pages;

  if (!rooms.length) {
    const emptyKey = app.roomFilter === 'playing'
      ? 'noLiveBanks'
      : app.roomFilter === 'waiting'
        ? 'noOpenBanks'
        : 'noFinishedBanks';
    elements.roomList.append(emptyState(t(emptyKey)));
    return;
  }

  for (const room of rooms) {
    const item = document.createElement('article');
    item.className = `room-item room-${room.status}`;

    const info = document.createElement('div');
    info.className = 'room-info';
    const title = document.createElement('h3');
    title.textContent = room.name;
    const detail = document.createElement('p');
    const hostLocation = [room.host_country, room.host_island ? islandName(room.host_island) : null, room.host_elo_latest ? `Elo ${room.host_elo_latest}` : null].filter(Boolean).join(' · ');
    const guestLocation = [room.guest_country, room.guest_island ? islandName(room.guest_island) : null, room.guest_elo_latest ? `Elo ${room.guest_elo_latest}` : null].filter(Boolean).join(' · ');
    const host = `${room.host_nick}${hostLocation ? ` · ${hostLocation}` : ''}`;
    const guest = room.guest_nick ? ` vs ${room.guest_nick}${guestLocation ? ` · ${guestLocation}` : ''}` : '';
    detail.textContent = host + guest;

    const dates = document.createElement('div');
    dates.className = 'room-dates';
    const started = document.createElement('span');
    started.textContent = t('gameStartedAt', { date: formatDateTime(room.started_at || room.created_at) });
    const lastMove = document.createElement('span');
    lastMove.textContent = room.last_move_at
      ? t('lastMoveAt', { date: formatDateTime(room.last_move_at) })
      : t('noLastMove');
    dates.append(started, lastMove);
    const flags = document.createElement('div');
    flags.className = 'room-event-flags';
    if (room.has_capote) flags.append(roomEventBadge('CAPOTE'));
    if (room.has_frouxo) flags.append(roomEventBadge('FROUXO'));
    if (room.has_quatro) flags.append(roomEventBadge('QUATRO'));
    info.append(title, detail, dates);
    if (flags.childElementCount) info.append(flags);

    const state = document.createElement('span');
    state.className = `room-state ${room.status === 'playing' ? 'live' : ''}`;
    if (room.status === 'playing') {
      const dot = document.createElement('i');
      dot.className = 'live-dot';
      dot.setAttribute('aria-hidden', 'true');
      state.append(dot, document.createTextNode(t('playingUpper')));
    } else if (room.status === 'waiting') state.textContent = t('waitingUpper');
    else if (room.status === 'interrupted') state.textContent = t('interruptedUpper');
    else if (room.status === 'abandoned') state.textContent = t('abandonedUpper');
    else state.textContent = t('finishedUpper');

    const button = document.createElement('button');
    const isPlayer = app.registered && [room.host_id, room.guest_id].includes(multiplayer.user?.id);
    const isLive = room.status === 'playing';
    const canJoin = room.status === 'waiting' && !room.guest_id;

    if (isLive) {
      button.className = 'secondary-button compact';
      button.textContent = isPlayer ? t('resume') : t('watchPlay');
      button.addEventListener('click', () => enterRoomFromList(room, isPlayer));
    } else if (canJoin) {
      button.className = 'primary-button compact';
      button.textContent = !app.registered ? t('signIn') : calibrationComplete() ? t('play') : t('completeCalibration');
      button.addEventListener('click', () => {
        if (!app.registered) openAuthDialog('login');
        else if (!calibrationComplete()) requireCompetitiveReady();
        else enterRoomFromList(room, false);
      });
    } else if (room.status === 'interrupted' && isPlayer) {
      button.className = 'primary-button compact';
      button.textContent = t('resume');
      button.addEventListener('click', () => enterRoomFromList(room, true));
    } else {
      button.className = 'secondary-button compact';
      button.textContent = t('consultMoves');
      button.addEventListener('click', () => consultRoom(room));
    }

    item.append(info, state, button);
    elements.roomList.append(item);
  }
}

function setRoomFilter(filter) {
  if (!['playing', 'waiting', 'finished'].includes(filter)) return;
  app.roomFilter = filter;
  app.roomPage = 0;
  refreshRooms();
}

function emptyState(text) {
  const node = document.createElement('div');
  node.className = 'empty-state';
  node.textContent = text;
  return node;
}

async function createRoom() {
  if (!requireCompetitiveReady()) return;
  if (!multiplayer.configured || !multiplayer.client) {
    toast(t('supabaseRequired'));
    return;
  }
  try {
    const room = await multiplayer.createRoom({
      name: elements.roomName.value.trim(),
      session: createSession(SOUTH),
    });
    await enterOnlineRoom(room, false);
  } catch (error) {
    toast(t('createBankError', { error: error.message }));
  }
}

function gameFromMoveSnapshot(move, useAfter = true) {
  const board = useAfter ? move.board_after : move.board_before;
  const scores = useAfter ? move.scores_after : move.scores_before;
  const currentPlayer = useAfter
    ? (move.game_status === 'finished' ? move.player_side : otherPlayer(move.player_side))
    : move.player_side;
  return {
    board: Array.isArray(board) ? board.map(Number) : Array(12).fill(4),
    scores: scores || { [SOUTH]: 0, [NORTH]: 0 },
    currentPlayer,
    status: useAfter ? (move.game_status || 'playing') : 'playing',
    winner: useAfter ? move.winner : null,
    reason: '',
    turn: Number(move.ply || 0) + (useAfter ? 1 : 0),
    lastMove: useAfter ? {
      player: move.player_side,
      pitIndex: move.pit_index,
      capturedPits: move.captured_pits || [],
      capturedSeeds: move.captured_seeds || 0,
      grandSlam: move.grand_slam,
      frouxo: move.frouxo,
      fedOpponent: move.fed_opponent,
    } : null,
    repetitionCounts: {},
  };
}

function buildReviewSession(room, moves) {
  if (!moves.length) return normaliseSession(room.game_state);
  const session = normaliseSession(room.game_state);
  const first = moves.find((move) => move.move_type === 'move' && move.board_before);
  const history = [];
  if (first) history.push({ type: 'start', at: room.started_at || room.created_at, game: gameFromMoveSnapshot(first, false), match: createMatch(), firstPlayer: first.player_side });
  for (const move of moves) {
    if (!move.board_after) continue;
    history.push({ type: move.move_type, at: move.created_at, game: gameFromMoveSnapshot(move, true), match: session.match, firstPlayer: first?.player_side || SOUTH, moveId: move.id });
  }
  session.history = history.length ? history : session.history;
  return session;
}

async function consultRoom(room) {
  try {
    const current = await multiplayer.getRoom(room.id);
    const moves = await multiplayer.listMoves(room.id).catch(() => []);
    app.remoteUpdateQueue = Promise.resolve();
    app.mode = 'review';
    app.reviewMode = true;
    app.room = current;
    app.spectator = true;
    app.side = null;
    app.reviewMoves = moves;
    app.reviewAnalysis = null;
    resetChat();
    app.session = buildReviewSession(current, moves);
    app.reviewIndex = Math.max(0, app.session.history.length - 1);
    app.players = {
      [SOUTH]: { nick: current.host_nick, island: current.host_island, country: current.host_country, elo: current.host_elo_latest },
      [NORTH]: { nick: current.guest_nick || t('awaitingGuest'), island: current.guest_island, country: current.guest_country, elo: current.guest_elo_latest },
    };
    invalidateBoardView();
    showScreen('game');
    renderGame();
    renderReviewAnalysis();
    syncPresence();
  } catch (error) {
    toast(t('consultBankError', { error: error.message }));
  }
}

async function enterRoomFromList(room, isPlayer) {
  try {
    if (isPlayer) {
      if (!requireCompetitiveReady()) return;
      await enterOnlineRoom(await multiplayer.getRoom(room.id), false);
    } else if (room.status === 'waiting') {
      if (!requireCompetitiveReady()) return;
      await enterOnlineRoom(await multiplayer.joinRoom(room.id), false);
    } else if (room.status === 'playing') {
      await enterOnlineRoom(await multiplayer.getRoom(room.id), true);
    } else {
      await consultRoom(room);
    }
  } catch (error) {
    toast(t('enterBankError', { error: error.message }));
    await refreshRooms();
  }
}

async function enterOnlineRoom(room, spectator) {
  if (!spectator && !requireCompetitiveReady()) return;
  app.remoteUpdateQueue = Promise.resolve();
  app.mode = 'online';
  app.reviewMode = false;
  app.reviewIndex = 0;
  app.reviewMoves = [];
  app.reviewAnalysis = null;
  resetChat();
  app.room = room;
  app.spectator = spectator;
  app.session = normaliseSession(room.game_state);
  app.players = {
    [SOUTH]: { nick: room.host_nick, island: room.host_island, country: room.host_country, elo: room.host_elo_latest },
    [NORTH]: { nick: room.guest_nick || t('awaitingGuest'), island: room.guest_island, country: room.guest_country, elo: room.guest_elo_latest },
  };
  app.side = spectator ? null : room.host_id === multiplayer.user?.id ? SOUTH : NORTH;
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
    { role: spectator ? 'spectator' : 'player' },
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
  if (!session.createdAt) session.createdAt = new Date().toISOString();
  if (!Array.isArray(session.history) || !session.history.length) {
    session.history = [createHistoryEntry(session, 'legacy', session.createdAt)];
  }
  if (!('lastMoveAt' in session)) {
    session.lastMoveAt = null;
    for (let index = session.history.length - 1; index >= 0; index -= 1) {
      if (['move', 'resignation'].includes(session.history[index]?.type)) {
        session.lastMoveAt = session.history[index].at || null;
        break;
      }
    }
  }
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
    [SOUTH]: { nick: updated.host_nick, island: updated.host_island, country: updated.host_country, elo: updated.host_elo_latest },
    [NORTH]: { nick: updated.guest_nick || t('awaitingGuest'), island: updated.guest_island, country: updated.guest_country, elo: updated.guest_elo_latest },
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
  if (incoming.game.status === 'finished') {
    multiplayer.loadIdentity().then(() => applyAuthenticatedIdentity({ profile: multiplayer.profile, account: multiplayer.account, registered: multiplayer.registered })).catch(() => {});
    refreshLeaderboard().catch(() => {});
  }
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
  const loads = Array.from({ length: 16 }, (_, count) => new Promise((resolve) => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = `assets/realistic-seeds/sementes-${String(count).padStart(2, '0')}.png`;
  }));
  await Promise.all(loads);
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

  const spriteName = String(visibleTotal).padStart(2, '0');
  pile.classList.add('realistic-seed-photo');
  pile.style.setProperty(
    '--real-seed-image',
    `url("assets/realistic-seeds/sementes-${spriteName}.png")`,
  );
  pile.replaceChildren();
  button.dataset.seedLayout = String(visibleTotal);
}

function updateCapturedPit(pit, countElement, labelElement, player, seedTotal) {
  if (!pit || !countElement || !labelElement) return;
  const total = Math.max(Number(seedTotal) || 0, 0);
  updateSeedPile(pit, total);
  countElement.textContent = String(total);
  labelElement.textContent = playerName(player);
  const description = t('capturedSeedsPit', { player: playerName(player), count: total });
  pit.setAttribute('aria-label', description);
  pit.title = description;
  pit.dataset.player = player;
  pit.classList.toggle('has-many-seeds', total > 9);
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
  button.classList.toggle('overflow-count', seedTotal > 9);

  const count = button.querySelector('.seed-count');
  if (count) count.textContent = String(seedTotal);

  const active = app.animation?.activePit === index;
  button.classList.toggle('lifting', active && app.animation.phase === 'lifting');
  button.classList.toggle('sowing', active && app.animation.phase === 'sowing');
  button.classList.toggle('capturing', active && app.animation.phase === 'capture');
  button.classList.toggle('settling', active && app.animation.phase === 'settling');
}

function canLocalPlayerAct() {
  if (app.reviewMode) return false;
  const game = app.session.game;
  if (game.status !== 'playing' || app.busy) return false;
  if (app.mode === 'local') return true;
  if (['pc', 'calibration'].includes(app.mode)) return game.currentPlayer === SOUTH;
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
  if (app.reviewMode || app.spectator || app.session.game.status !== 'playing') return null;
  if (['pc', 'calibration'].includes(app.mode)) return SOUTH;
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
    let next;
    if (hasSyncedBank()) {
      const response = await multiplayer.submitOfficialAction(app.room.id, 'resign');
      app.room = response.room;
      app.lastRoomFingerprint = roomFingerprint(app.room);
      next = normaliseSession(app.room.game_state);
    } else {
      next = cloneValue(app.session);
      next.game = resignGame(next.game, player);
      next = settleRound(next);
      appendSessionHistory(next, 'resignation');
    }
    app.session = next;
    await maybeRecordCalibration();
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
  const match = displayedMatch();
  const display = matchDisplay(match);
  const seats = currentSeats();
  const top = seats.top;
  const bottom = seats.bottom;

  elements.northNick.textContent = playerName(top);
  elements.southNick.textContent = playerName(bottom);
  elements.northIsland.textContent = [playerLocation(app.players[top]), app.players[top].elo ? `Elo ${app.players[top].elo}` : null].filter(Boolean).join(' · ');
  elements.southIsland.textContent = [playerLocation(app.players[bottom]), app.players[bottom].elo ? `Elo ${app.players[bottom].elo}` : null].filter(Boolean).join(' · ');
  elements.northAvatar.textContent = initials(playerName(top));
  elements.southAvatar.textContent = initials(playerName(bottom));
  elements.northScore.textContent = String(game.scores[top]);
  elements.southScore.textContent = String(game.scores[bottom]);
  elements.topScoreLabel.textContent = t('collectedBy', { player: playerName(top) });
  elements.bottomScoreLabel.textContent = t('collectedBy', { player: playerName(bottom) });
  updateCapturedPit(elements.topCapturedPit, elements.topCapturedPitCount, elements.topCapturedPitLabel, top, game.scores[top]);
  updateCapturedPit(elements.bottomCapturedPit, elements.bottomCapturedPitCount, elements.bottomCapturedPitLabel, bottom, game.scores[bottom]);
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
  elements.gameModeLabel.textContent = app.reviewMode
    ? t('reviewMode')
    : ['pc', 'calibration'].includes(app.mode)
      ? `${app.mode === 'calibration' ? t('initialEloTest') : t('trainingOnly')} · ${translatedLevelLabel(app.aiLevel).toUpperCase()}`
      : app.mode === 'online'
        ? (app.spectator ? t('watchingMode') : t('onlineBankMode'))
        : t('twoPlayersMode');

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
  renderAiStats();
  renderRoomViewers();

  elements.newRound.hidden = app.reviewMode || game.status !== 'finished' || app.spectator || app.mode === 'calibration';

  if (app.reviewMode) {
    elements.roomStatus.textContent = t('reviewingBank');
  } else if (app.mode === 'online') {
    elements.roomStatus.textContent = app.room?.status === 'waiting'
      ? t('bankWaitingOpponent')
      : app.spectator
        ? t('watchingBank')
        : t('yourSideBelow', { player: playerName(app.side) });
  } else if (['pc', 'calibration'].includes(app.mode)) {
    elements.roomStatus.textContent = app.mode === 'calibration'
      ? t('initialEloTest')
      : t('computerLevel', { level: translatedLevelLabel(app.aiLevel) });
  } else {
    elements.roomStatus.textContent = t('localBank');
  }

  renderReviewController();
  if (!app.reviewMode) {
    scheduleRoundTransition();
    maybeRunAI();
    maybeRecordCalibration().catch(() => {});
  }
}

function setReviewIndex(index) {
  if (!app.reviewMode || !Array.isArray(app.session.history) || !app.session.history.length) return;
  app.reviewIndex = Math.min(Math.max(Number(index) || 0, 0), app.session.history.length - 1);
  app.reviewAnalysis = null;
  app.animation = null;
  app.animationGame = null;
  renderGame();
}

function renderReviewController() {
  if (!elements.reviewController) return;
  const history = Array.isArray(app.session.history) ? app.session.history : [];
  const enabled = app.reviewMode && history.length > 0;
  elements.reviewController.hidden = !enabled;
  if (!enabled) return;
  const max = history.length - 1;
  const index = Math.min(Math.max(app.reviewIndex, 0), max);
  app.reviewIndex = index;
  elements.reviewSlider.min = '0';
  elements.reviewSlider.max = String(max);
  elements.reviewSlider.value = String(index);
  elements.reviewPosition.textContent = t('reviewPosition', { current: index, total: max });
  elements.reviewTime.textContent = formatDateTime(history[index]?.at);
  elements.reviewFirst.disabled = index <= 0;
  elements.reviewPrevious.disabled = index <= 0;
  elements.reviewNext.disabled = index >= max;
  elements.reviewLast.disabled = index >= max;
  renderReviewAnalysis();
}

function classificationLabel(value) {
  const keys = {
    best: 'reviewClassificationBest',
    good: 'reviewClassificationGood',
    inaccuracy: 'reviewClassificationInaccuracy',
    mistake: 'reviewClassificationMistake',
    blunder: 'reviewClassificationBlunder',
  };
  return t(keys[value] || 'reviewClassificationGood');
}

function currentReviewMove() {
  const moveId = app.session.history?.[app.reviewIndex]?.moveId;
  return moveId ? app.reviewMoves.find((move) => Number(move.id) === Number(moveId)) : null;
}

function renderReviewAnalysis() {
  if (!elements.reviewMoveDetails || !app.reviewMode) return;
  const move = currentReviewMove();
  elements.reviewMoveDetails.replaceChildren();
  elements.reviewMoveList.replaceChildren();

  const history = app.session.history || [];
  history.forEach((entry, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'review-move-item';
    button.classList.toggle('active', index === app.reviewIndex);
    const row = entry.moveId ? app.reviewMoves.find((candidate) => Number(candidate.id) === Number(entry.moveId)) : null;
    button.textContent = index === 0
      ? t('reviewStartPosition')
      : `${index}. ${row?.player_side === SOUTH ? playerName(SOUTH) : playerName(NORTH)}${row?.pit_index !== null && row?.pit_index !== undefined ? ` — ${translatedPitLabel(row.pit_index)}` : ''}`;
    button.addEventListener('click', () => setReviewIndex(index));
    elements.reviewMoveList.append(button);
  });

  if (!move) {
    elements.reviewMoveDetails.textContent = t('reviewStartPosition');
    elements.analyseMove.disabled = true;
    elements.reviewAnalysisResult.textContent = t('analysisNotRun');
    return;
  }

  elements.analyseMove.disabled = move.move_type !== 'move' || move.pit_index === null;
  const facts = moveFacts(move);
  const lines = [
    `${facts.side === SOUTH ? playerName(SOUTH) : playerName(NORTH)} · ${translatedPitLabel(facts.pitIndex)}`,
    `${t('captureTitle', { player: '' }).replace(':', '').trim()} ${facts.capturedSeeds}`,
    facts.grandSlam ? 'Fogo' : null,
    facts.frouxo ? 'Frouxo' : null,
    facts.fedOpponent ? t('feeding') : null,
    formatDateTime(facts.createdAt),
  ].filter(Boolean);
  for (const line of lines) {
    const p = document.createElement('p');
    p.textContent = line;
    elements.reviewMoveDetails.append(p);
  }

  const analysis = app.reviewAnalysis || (move.classification ? {
    classification: move.classification,
    bestMove: move.engine_best_move,
    completedDepth: move.engine_depth,
    nodes: move.engine_nodes,
    timeMs: move.engine_time_ms,
  } : null);
  if (!analysis) {
    elements.reviewAnalysisResult.textContent = t('analysisNotRun');
  } else {
    elements.reviewAnalysisResult.textContent = t('analysisSummary', {
      classification: classificationLabel(analysis.classification),
      best: analysis.bestMove === null || analysis.bestMove === undefined ? '—' : translatedPitLabel(analysis.bestMove),
      depth: analysis.completedDepth || 0,
      nodes: Number(analysis.nodes || 0).toLocaleString(localeForLanguage()),
      time: analysis.timeMs || 0,
    });
  }
}

async function analyseCurrentMove() {
  const move = currentReviewMove();
  if (!move || move.pit_index === null || app.reviewIndex <= 0) return;
  const beforeGame = cloneValue(app.session.history[app.reviewIndex - 1].game);
  elements.analyseMove.disabled = true;
  elements.reviewAnalysisResult.textContent = t('suggestionsLoading');
  try {
    app.reviewAnalysis = analysePlayedMove(beforeGame, Number(move.pit_index), {
      level: 'master', maxDepth: 8, timeMs: 1500,
    });
    renderReviewAnalysis();
    if (app.registered && app.reviewAnalysis) {
      multiplayer.saveMoveAnalysis(move.id, app.reviewAnalysis).catch(() => {});
    }
  } catch (error) {
    elements.reviewAnalysisResult.textContent = error.message;
  } finally {
    elements.analyseMove.disabled = false;
  }
}

function renderAiStats() {
  if (!elements.aiStats) return;
  const stats = app.lastAiStats;
  if (!stats) {
    elements.aiStats.textContent = t('noEngineStats');
    return;
  }
  const pv = (stats.principalVariation || []).map((pit) => translatedPitLabel(pit)).join(' → ') || '—';
  elements.aiStats.textContent = t('engineStatsSummary', {
    depth: stats.completedDepth || 0,
    maxDepth: stats.maxDepth || 0,
    nodes: Number(stats.nodes || 0).toLocaleString(localeForLanguage()),
    time: stats.timeMs || 0,
    pv,
  });
}

function renderRoomViewers() {
  if (!elements.roomViewersCard || !elements.roomViewersList) return;
  const viewers = app.mode === 'online'
    ? app.roomViewers.filter((viewer) => viewer.role === 'spectator')
    : [];
  elements.roomViewersCard.hidden = viewers.length === 0;
  elements.roomViewersList.replaceChildren();
  for (const viewer of viewers) {
    const row = document.createElement('div');
    row.className = 'room-viewer';
    const name = document.createElement('strong');
    name.textContent = viewer.display_nick || viewer.nick || t('anonymousVisitor');
    const detail = document.createElement('small');
    detail.textContent = viewer.registered
      ? [viewer.country, islandName(viewer.island)].filter(Boolean).join(' · ')
      : t('anonymousVisitor');
    row.append(name, detail);
    elements.roomViewersList.append(row);
  }
}

async function refreshLeaderboard() {
  if (!multiplayer.client) return;
  try {
    app.leaderboard = await multiplayer.leaderboard(100);
    renderLeaderboard();
  } catch {}
}

function renderLeaderboard() {
  if (!elements.leaderboardList) return;
  elements.leaderboardList.replaceChildren();
  if (!app.leaderboard.length) {
    elements.leaderboardList.append(emptyState(t('leaderboardEmpty')));
    return;
  }
  app.leaderboard.forEach((player, index) => {
    const row = document.createElement('article');
    row.className = 'leaderboard-row';
    const rank = document.createElement('b');
    rank.textContent = String(index + 1);
    const identity = document.createElement('div');
    const nick = document.createElement('strong');
    nick.textContent = player.nick;
    const location = document.createElement('small');
    location.textContent = [player.country, islandName(player.island)].filter(Boolean).join(' · ');
    identity.append(nick, location);
    const record = document.createElement('span');
    record.textContent = `${player.wins}-${player.draws}-${player.losses}`;
    const elo = document.createElement('strong');
    elo.textContent = `${player.elo}${player.elo_provisional ? ` ${t('eloProvisional')}` : ''}`;
    row.append(rank, identity, record, elo);
    elements.leaderboardList.append(row);
  });
}

async function refreshCalibrationProgress() {
  if (!app.registered || !multiplayer.client) {
    app.calibrationProgress = [];
    elements.calibrationBox.hidden = true;
    return;
  }
  try {
    app.calibrationProgress = await multiplayer.calibrationProgress();
  } catch {
    app.calibrationProgress = [];
  }
  elements.calibrationBox.hidden = app.calibrationProgress.length >= 3;
  elements.calibrationStatus.textContent = app.calibrationProgress.length >= 3
    ? t('calibrationComplete', { elo: app.profile.elo || 1200 })
    : t('calibrationProgress', { current: app.calibrationProgress.length });
}

async function handleLogin(event) {
  event.preventDefault();
  elements.loginStatus.textContent = '';
  try {
    await multiplayer.signIn(elements.loginEmail.value, elements.loginPassword.value);
    elements.authDialog.close();
    toast(t('signedIn', { nick: multiplayer.profile?.nick || '' }));
  } catch (error) {
    elements.loginStatus.textContent = error.message;
  }
}

async function handleRegistration(event) {
  event.preventDefault();
  elements.registerStatus.textContent = '';
  if (elements.registerPassword.value !== elements.registerPasswordConfirm.value) {
    elements.registerStatus.textContent = t('passwordsDiffer');
    return;
  }
  const country = elements.registerCountry.value.trim();
  const island = isCapeVerdeCountry(country) ? elements.registerIsland.value : null;
  try {
    const result = await multiplayer.signUp({
      fullName: elements.registerFullName.value,
      nick: elements.registerNick.value,
      country,
      island,
      email: elements.registerEmail.value,
      password: elements.registerPassword.value,
    });
    elements.registerStatus.textContent = multiplayer.registered ? t('signedIn', { nick: elements.registerNick.value }) : t('accountCreatedCheckEmail');
    if (multiplayer.registered) elements.authDialog.close();
  } catch (error) {
    elements.registerStatus.textContent = error.message;
  }
}

async function handleSignOut() {
  if (app.mode) await leaveGame();
  await multiplayer.signOut();
  toast(t('signedOut'));
}

function renderRoundResult() {
  const game = displayedGame();
  if (game.status !== 'finished') {
    elements.roundResult.hidden = true;
    return;
  }

  const winner = game.winner;
  const isDraw = winner === 'draw';
  const starter = nextRoundStarter(game, displayedFirstPlayer());
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
  if (!app.reviewMode && app.mode === 'online' && app.room?.status === 'waiting') {
    elements.statusTitle.textContent = t('bankCreated');
    elements.statusMessage.textContent = t('waitingInvitation');
    return;
  }
  if (app.reviewMode) {
    const entry = reviewEntry();
    elements.statusTitle.textContent = entry?.type === 'round-start' || entry?.type === 'start'
      ? t('reviewStartPosition')
      : t('reviewMovePosition', { current: app.reviewIndex, total: Math.max(0, app.session.history.length - 1) });
    elements.statusMessage.textContent = entry?.at ? formatDateTime(entry.at) : t('reviewNoDate');
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
  if (['pc', 'calibration'].includes(app.mode) && game.currentPlayer === NORTH) {
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
  const move = displayedGame().lastMove;
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
    let next;

    if (hasSyncedBank()) {
      const response = await multiplayer.submitOfficialAction(app.room.id, 'move', index);
      app.room = response.room;
      app.lastRoomFingerprint = roomFingerprint(app.room);
      next = normaliseSession(app.room.game_state);
      if (response.rating?.rated) {
        await multiplayer.loadIdentity();
        applyAuthenticatedIdentity({ profile: multiplayer.profile, account: multiplayer.account, registered: multiplayer.registered });
        refreshLeaderboard().catch(() => {});
      }
    } else {
      next = cloneValue(app.session);
      next.game = applyMove(next.game, index);
      next = settleRound(next);
      appendSessionHistory(next, 'move');
    }

    await animateMove(previous.game, next.game);
    app.session = next;
    await maybeRecordCalibration();
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

function chooseMoveAsync(game, level, options = {}) {
  if (typeof Worker === 'undefined') {
    return Promise.resolve(analysePosition(game, level, options));
  }

  return new Promise((resolve, reject) => {
    const worker = new Worker(
      new URL('./ai-worker.js?v=1.0.4', import.meta.url),
      { type: 'module' },
    );
    const timeout = window.setTimeout(() => {
      worker.terminate();
      reject(new Error(t('aiTimeout')));
    }, level === 'grandmaster' ? 15000 : level === 'master' ? 5000 : 3500);

    const finish = () => {
      window.clearTimeout(timeout);
      worker.terminate();
    };

    worker.addEventListener('message', (event) => {
      finish();
      if (event.data?.ok) resolve(event.data.analysis);
      else reject(new Error(event.data?.error || t('aiFailed')));
    }, { once: true });

    worker.addEventListener('error', (event) => {
      finish();
      reject(new Error(event.message || t('aiStartFailed')));
    }, { once: true });

    worker.postMessage({ game: cloneValue(game), level, options });
  });
}

function maybeRunAI() {
  clearTimeout(app.aiTimer);
  if (
    !['pc', 'calibration'].includes(app.mode) || app.busy || app.session.game.status !== 'playing' ||
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
          appendSessionHistory(next, 'resignation');
          app.session = next;
          return;
        }
        app.session.aiResignationDeclined = true;
      }

      const analysis = await chooseMoveAsync(app.session.game, app.aiLevel);
      app.lastAiStats = analysis;
      const move = analysis?.move ?? null;
      if (move !== null) {
        const previous = cloneValue(app.session);
        let next = cloneValue(app.session);
        next.game = applyMove(next.game, move);
        next = settleRound(next);
        appendSessionHistory(next, 'move');
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
  next.createdAt = app.session.createdAt || next.createdAt;
  next.lastMoveAt = app.session.lastMoveAt || null;
  next.history = cloneValue(app.session.history || []);
  appendSessionHistory(next, 'round-start');

  window.clearTimeout(app.roundTimer);
  app.roundTimer = null;
  app.roundTransitionBusy = true;
  app.busy = true;

  try {
    if (hasSyncedBank()) {
      const response = await multiplayer.submitOfficialAction(app.room.id, 'new_round');
      app.room = response.room;
      app.lastRoomFingerprint = roomFingerprint(app.room);
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
  if (app.room && app.mode === 'online') {
    if (!app.spectator && app.room.host_id === multiplayer.user?.id && app.session.game.status === 'finished') {
      await multiplayer.closeRoom(app.room).catch(() => {});
    }
    await multiplayer.leaveRoomChannel();
  }
  app.mode = null;
  app.reviewMode = false;
  app.reviewIndex = 0;
  app.reviewMoves = [];
  app.reviewAnalysis = null;
  app.roomViewers = [];
  app.lastAiStats = null;
  app.calibrationMode = false;
  app.calibrationLevel = null;
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
  if (!app.registered) {
    elements.suggestionNickPreview.textContent = t('anonymousVisitor');
    elements.suggestionSubmit.disabled = true;
    return;
  }
  elements.suggestionNickPreview.textContent = [app.profile.nick, app.profile.country, islandName(app.profile.island)].filter(Boolean).join(' · ');
  elements.suggestionSubmit.disabled = app.suggestionsLoading;
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
    if (!requireRegistered()) return;
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
    elements.suggestionSubmit.disabled = !app.registered;
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
  if (!requireRegistered()) return;
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
    elements.suggestionSubmit.disabled = !app.suggestionsReady || !app.registered;
  }
}

function bindEvents() {
  document.body.dataset.island = app.profile.island || 'santiago';
  elements.language.addEventListener('change', () => applyLanguage(elements.language.value));
  $('#startPcButton').addEventListener('click', () => startPcGame());
  elements.startCalibration.addEventListener('click', startCalibrationGame);
  $('#startLocalButton').addEventListener('click', startLocalGame);
  $('#openRoomsButton').addEventListener('click', openRooms);
  $('#refreshRoomsButton').addEventListener('click', refreshRooms);
  elements.searchRooms.addEventListener('click', () => {
    app.roomSearch = elements.roomSearch.value.trim();
    app.roomDateFrom = elements.roomDateFrom.value ? new Date(`${elements.roomDateFrom.value}T00:00:00`).toISOString() : null;
    app.roomDateTo = elements.roomDateTo.value ? new Date(`${elements.roomDateTo.value}T23:59:59`).toISOString() : null;
    app.roomResult = elements.roomResult.value;
    app.roomEvent = elements.roomEvent.value;
    app.roomPage = 0;
    refreshRooms();
  });
  elements.roomsPreviousPage.addEventListener('click', () => { if (app.roomPage > 0) { app.roomPage -= 1; refreshRooms(); } });
  elements.roomsNextPage.addEventListener('click', () => { app.roomPage += 1; refreshRooms(); });
  elements.roomFilters?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-room-filter]');
    if (button) setRoomFilter(button.dataset.roomFilter);
  });
  $('#createRoomButton').addEventListener('click', createRoom);
  elements.acceptInvite.addEventListener('click', acceptInvitation);
  elements.declineInvite.addEventListener('click', closeInvitation);
  elements.chatForm.addEventListener('submit', sendChatMessage);
  elements.openSharedInvite.addEventListener('click', openSharedInvite);
  elements.sharePlay.addEventListener('click', () => shareBankViaWhatsApp('play'));
  elements.shareWatch.addEventListener('click', () => shareBankViaWhatsApp('watch'));
  $('#leaveGameButton').addEventListener('click', leaveGame);
  elements.newRound.addEventListener('click', newRound);
  elements.reviewFirst.addEventListener('click', () => setReviewIndex(0));
  elements.reviewPrevious.addEventListener('click', () => setReviewIndex(app.reviewIndex - 1));
  elements.reviewNext.addEventListener('click', () => setReviewIndex(app.reviewIndex + 1));
  elements.reviewLast.addEventListener('click', () => setReviewIndex((app.session.history?.length || 1) - 1));
  elements.reviewSlider.addEventListener('input', () => setReviewIndex(Number(elements.reviewSlider.value)));
  elements.analyseMove.addEventListener('click', analyseCurrentMove);
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
  elements.refreshLeaderboard.addEventListener('click', refreshLeaderboard);

  elements.signIn.addEventListener('click', () => openAuthDialog('login'));
  elements.register.addEventListener('click', () => openAuthDialog('register'));
  elements.identityRegister.addEventListener('click', () => openAuthDialog('register'));
  elements.playerChip.addEventListener('click', () => openAuthDialog('login'));
  elements.signOut.addEventListener('click', handleSignOut);
  elements.closeAuth.addEventListener('click', () => elements.authDialog.close());
  elements.authDialog.addEventListener('click', (event) => { if (event.target === elements.authDialog) elements.authDialog.close(); });
  document.querySelectorAll('[data-auth-tab]').forEach((button) => button.addEventListener('click', () => setAuthTab(button.dataset.authTab)));
  elements.loginForm.addEventListener('submit', handleLogin);
  elements.registerForm.addEventListener('submit', handleRegistration);
  elements.registerCountry.addEventListener('input', updateRegistrationIslandVisibility);
  updateRegistrationIslandVisibility();

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
  renderIdentity();
  await preloadClassicSprites();
  renderGame();
  renderOnlinePlayers();
  renderSuggestions();
  renderLeaderboard();
  updateSuggestionAuthorPreview();
  try {
    const result = await multiplayer.init(app.profile);
    elements.setupNotice.hidden = result.configured;
    if (result.configured) {
      applyAuthenticatedIdentity(result);
      await Promise.all([refreshRooms(), refreshSuggestions(), refreshLeaderboard(), refreshCalibrationProgress()]);
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
