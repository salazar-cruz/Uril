const PRESENCE_STATUSES = new Set([
  'free',
  'pc',
  'local',
  'waiting',
  'playing',
  'watching',
]);

const PRESENCE_HEARTBEAT_MS = 12000;
const PRESENCE_STALE_MS = 45000;

function makeId(prefix = 'connection') {
  const random = globalThis.crypto?.randomUUID?.()
    || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${random}`;
}

function seenTime(value) {
  const parsed = Date.parse(value || '');
  return Number.isFinite(parsed) ? parsed : 0;
}

export class MultiplayerService {
  constructor({ url, anonKey, onLobbyChange, onPresenceChange, onInvitation, onSuggestionsChange, onAuthChange, onRoomPresenceChange }) {
    this.url = url;
    this.anonKey = anonKey;
    this.onLobbyChange = onLobbyChange;
    this.onPresenceChange = onPresenceChange;
    this.onInvitation = onInvitation;
    this.onSuggestionsChange = onSuggestionsChange;
    this.onAuthChange = onAuthChange;
    this.onRoomPresenceChange = onRoomPresenceChange;
    this.client = null;
    this.user = null;
    this.profile = null;
    this.account = null;
    this.authSubscription = null;
    this.lobbyChannel = null;
    this.roomChannel = null;
    this.roomChannelReady = false;
    this.suggestionsChannel = null;
    this.suggestionsChannelReady = false;
    this.connectionId = makeId('uril');
    this.currentPresence = null;
    this.announcedPresence = new Map();
    this.heartbeatTimer = null;
    this.lifecycleBound = false;
    this.roomHeartbeatTimer = null;
    this.roomPresenceProfile = null;
  }

  get configured() {
    return Boolean(this.url && this.anonKey);
  }

  async init(profile = {}) {
    if (!this.configured) return { configured: false };

    let createClient = window.supabase?.createClient;
    if (!createClient) {
      const module = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      createClient = module.createClient;
    }

    this.client = createClient(this.url, this.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });

    const { data: sessionData } = await this.client.auth.getSession();
    let session = sessionData.session;
    if (!session) {
      const response = await this.client.auth.signInAnonymously();
      if (response.error) throw response.error;
      session = response.data.session;
    }

    this.user = session?.user || null;
    await this.loadIdentity();
    this.bindAuthChanges(profile);
    await this.connectLobby(this.identityPresence(profile));
    this.emitAuthChange();
    return {
      configured: true,
      user: this.user,
      profile: this.profile,
      account: this.account,
      registered: this.registered,
    };
  }

  get registered() {
    return Boolean(this.user && !this.user.is_anonymous && this.profile?.id === this.user.id);
  }

  identityPresence(fallback = {}) {
    if (this.registered) {
      return {
        ...fallback,
        nick: this.profile.nick,
        island: this.profile.island || null,
        country: this.profile.country,
        elo: this.profile.elo,
        registered: true,
      };
    }
    return {
      ...fallback,
      nick: 'Anónimo',
      island: null,
      country: null,
      elo: null,
      registered: false,
    };
  }

  async loadIdentity() {
    this.profile = null;
    this.account = null;
    if (!this.client || !this.user || this.user.is_anonymous) return;

    let [{ data: profile }, { data: account }] = await Promise.all([
      this.client.from('uril_profiles').select('*').eq('id', this.user.id).maybeSingle(),
      this.client.from('uril_accounts').select('id,full_name,email,created_at,updated_at').eq('id', this.user.id).maybeSingle(),
    ]);

    if (!profile) {
      const metadata = this.user.user_metadata || {};
      if (metadata.full_name && metadata.nick && metadata.country) {
        const completed = await this.client.rpc('uril_complete_registration', {
          p_full_name: metadata.full_name,
          p_nick: metadata.nick,
          p_country: metadata.country,
          p_island: metadata.island || null,
        });
        if (!completed.error) {
          profile = completed.data;
          const accountQuery = await this.client
            .from('uril_accounts')
            .select('id,full_name,email,created_at,updated_at')
            .eq('id', this.user.id)
            .maybeSingle();
          account = accountQuery.data || null;
        }
      }
    }

    this.profile = profile || null;
    this.account = account || null;
  }

  emitAuthChange() {
    this.onAuthChange?.({
      user: this.user,
      profile: this.profile,
      account: this.account,
      registered: this.registered,
    });
  }

  bindAuthChanges(fallbackProfile = {}) {
    if (this.authSubscription) return;
    const { data } = this.client.auth.onAuthStateChange(async (_event, session) => {
      this.user = session?.user || null;
      if (!this.user) {
        const anonymous = await this.client.auth.signInAnonymously();
        this.user = anonymous.data.session?.user || null;
      }
      await this.loadIdentity();
      await this.connectLobby(this.identityPresence(fallbackProfile));
      this.emitAuthChange();
    });
    this.authSubscription = data.subscription;
  }

  async checkNickAvailable(nick) {
    if (!this.client) return false;
    const value = String(nick || '').trim();
    if (value.length < 2) return false;
    const { count, error } = await this.client
      .from('uril_profiles')
      .select('id', { count: 'exact', head: true })
      .ilike('nick', value);
    if (error) throw error;
    return Number(count || 0) === 0;
  }

  async signUp({ fullName, nick, country, island, email, password }) {
    if (!this.client) throw new Error('O serviço de registo não está ligado.');
    const available = await this.checkNickAvailable(nick);
    if (!available) throw new Error('Este nick já está registado.');
    const metadata = {
      full_name: String(fullName || '').trim(),
      nick: String(nick || '').trim(),
      country: String(country || '').trim(),
      island: island || null,
    };
    const response = this.user?.is_anonymous
      ? await this.client.auth.updateUser({
          email: String(email || '').trim(),
          password: String(password || ''),
          data: metadata,
        })
      : await this.client.auth.signUp({
          email: String(email || '').trim(),
          password: String(password || ''),
          options: { data: metadata },
        });
    const { data, error } = response;
    if (error) throw error;
    if (data.session || data.user) {
      this.user = data.session?.user || data.user;
      await this.loadIdentity();
      this.emitAuthChange();
    }
    return data;
  }

  async signIn(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email: String(email || '').trim(),
      password: String(password || ''),
    });
    if (error) throw error;
    this.user = data.user;
    await this.loadIdentity();
    this.emitAuthChange();
    return data;
  }

  async signOut() {
    if (!this.client) return;
    const { error } = await this.client.auth.signOut();
    if (error) throw error;
    this.profile = null;
    this.account = null;
  }

  async updateIdentity({ fullName, nick, country, island }) {
    const { data, error } = await this.client.rpc('uril_update_identity', {
      p_full_name: fullName,
      p_nick: nick,
      p_country: country,
      p_island: island || null,
    });
    if (error) throw error;
    await this.loadIdentity();
    this.emitAuthChange();
    return data;
  }

  normalisePresence(profile = {}) {
    const fallback = this.registered ? this.profile.nick : 'Anónimo';
    const status = PRESENCE_STATUSES.has(profile.status) ? profile.status : 'free';
    return {
      connection_id: this.connectionId,
      user_id: this.user?.id || null,
      nick: String(profile.nick || '').trim() || fallback,
      island: profile.island || null,
      country: profile.country || null,
      elo: Number(profile.elo || 0) || null,
      registered: Boolean(profile.registered ?? this.registered),
      status,
      bank_id: profile.bank_id || null,
      bank_name: profile.bank_name || null,
      seen_at: new Date().toISOString(),
    };
  }

  presencePlayers() {
    const byConnection = new Map();
    const state = this.lobbyChannel?.presenceState?.() || {};

    for (const [presenceKey, metas] of Object.entries(state)) {
      for (const meta of metas || []) {
        const player = {
          connection_id: meta.connection_id || presenceKey,
          user_id: meta.user_id || presenceKey,
          ...meta,
        };
        const key = player.connection_id || presenceKey;
        const existing = byConnection.get(key);
        if (!existing || seenTime(player.seen_at) >= seenTime(existing.seen_at)) {
          byConnection.set(key, player);
        }
      }
    }

    const now = Date.now();
    for (const [key, player] of this.announcedPresence) {
      if (now - seenTime(player.seen_at) > PRESENCE_STALE_MS) {
        this.announcedPresence.delete(key);
        continue;
      }
      const existing = byConnection.get(key);
      if (!existing || seenTime(player.seen_at) > seenTime(existing.seen_at)) {
        byConnection.set(key, player);
      }
    }

    return [...byConnection.values()];
  }

  emitPresence() {
    const players = this.presencePlayers();
    this.onPresenceChange?.({ players, count: players.length });
  }

  rememberAnnouncement(profile) {
    if (!profile?.connection_id) return;
    this.announcedPresence.set(profile.connection_id, profile);
  }

  async announcePresence() {
    if (!this.lobbyChannel || !this.currentPresence) return;
    this.currentPresence = this.normalisePresence(this.currentPresence);
    this.rememberAnnouncement(this.currentPresence);
    this.emitPresence();
    try {
      await this.lobbyChannel.send({
        type: 'broadcast',
        event: 'presence_announce',
        payload: { profile: this.currentPresence },
      });
    } catch {
      // A presença nativa do Supabase continua a funcionar como via principal.
    }
  }

  async requestPresence() {
    if (!this.lobbyChannel) return;
    try {
      await this.lobbyChannel.send({
        type: 'broadcast',
        event: 'presence_probe',
        payload: { requester_connection_id: this.connectionId },
      });
    } catch {
      // O evento sync da presença continua a entregar o estado existente.
    }
  }

  startHeartbeat() {
    window.clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = window.setInterval(async () => {
      if (!this.lobbyChannel || !this.currentPresence) return;
      try {
        this.currentPresence = this.normalisePresence(this.currentPresence);
        await this.lobbyChannel.track(this.currentPresence);
        await this.announcePresence();
      } catch {
        // A tentativa seguinte volta a anunciar o jogador.
      }
    }, PRESENCE_HEARTBEAT_MS);
  }

  bindLifecycle() {
    if (this.lifecycleBound) return;
    this.lifecycleBound = true;

    const refreshPresence = () => {
      if (document.visibilityState === 'visible') {
        this.updatePresence(this.currentPresence || {}).catch(() => {});
      }
    };

    window.addEventListener('focus', refreshPresence);
    document.addEventListener('visibilitychange', refreshPresence);
    window.addEventListener('pagehide', () => {
      window.clearInterval(this.heartbeatTimer);
      this.lobbyChannel?.send?.({
        type: 'broadcast',
        event: 'presence_goodbye',
        payload: { connection_id: this.connectionId },
      }).catch?.(() => {});
      this.lobbyChannel?.untrack?.().catch?.(() => {});
    });
  }

  async connectLobby(profile) {
    if (!this.client || !this.user) return;
    if (this.lobbyChannel) await this.client.removeChannel(this.lobbyChannel);

    this.currentPresence = this.normalisePresence(profile);
    this.announcedPresence.clear();

    this.lobbyChannel = this.client.channel('uril-lobby-v2', {
      config: {
        presence: { key: this.connectionId },
        broadcast: { self: false, ack: true },
      },
    });

    const refresh = () => this.emitPresence();

    this.lobbyChannel
      .on('presence', { event: 'sync' }, refresh)
      .on('presence', { event: 'join' }, refresh)
      .on('presence', { event: 'leave' }, refresh)
      .on('broadcast', { event: 'presence_announce' }, ({ payload }) => {
        if (!payload?.profile) return;
        this.rememberAnnouncement(payload.profile);
        this.emitPresence();
      })
      .on('broadcast', { event: 'presence_probe' }, ({ payload }) => {
        if (payload?.requester_connection_id !== this.connectionId) {
          this.announcePresence().catch(() => {});
        }
      })
      .on('broadcast', { event: 'presence_goodbye' }, ({ payload }) => {
        if (!payload?.connection_id) return;
        this.announcedPresence.delete(payload.connection_id);
        this.emitPresence();
      })
      .on('broadcast', { event: 'invite' }, ({ payload }) => {
        const addressedToConnection = payload?.target_connection_id === this.connectionId
          || payload?.target_id === this.connectionId;
        const addressedToUser = payload?.target_user_id && payload.target_user_id === this.user?.id;
        if (addressedToConnection || addressedToUser) this.onInvitation?.(payload);
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uril_rooms' },
        () => this.onLobbyChange?.(),
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.lobbyChannel.track(this.currentPresence);
          await this.announcePresence();
          await this.requestPresence();
          this.startHeartbeat();
          this.bindLifecycle();
        }
      });
  }

  async updatePresence(profile) {
    if (!this.lobbyChannel) return;
    this.currentPresence = this.normalisePresence(profile);
    await this.lobbyChannel.track(this.currentPresence);
    await this.announcePresence();
  }

  async sendInvitation(targetPlayer, room, profile) {
    const target = typeof targetPlayer === 'string'
      ? { connection_id: targetPlayer, user_id: null }
      : targetPlayer || {};
    const targetConnectionId = target.connection_id || target.user_id;

    if (!this.lobbyChannel || !targetConnectionId || !room) {
      throw new Error('O convite não encontrou o jogador ou o banco de Uril.');
    }

    const response = await this.lobbyChannel.send({
      type: 'broadcast',
      event: 'invite',
      payload: {
        invite_id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        target_id: targetConnectionId,
        target_connection_id: targetConnectionId,
        target_user_id: target.user_id || null,
        inviter_id: this.user?.id,
        inviter_connection_id: this.connectionId,
        inviter_nick: String(profile?.nick || room.host_nick || 'Jogador'),
        inviter_island: String(profile?.island || room.host_island || 'santiago'),
        bank_id: room.id,
        bank_name: room.name,
        sent_at: new Date().toISOString(),
      },
    });

    if (response !== 'ok') throw new Error('O serviço em tempo real não confirmou o convite.');
  }

  subscribeSuggestions() {
    if (!this.client || this.suggestionsChannel) return;
    this.suggestionsChannel = this.client
      .channel('uril-suggestions-v1')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uril_suggestions' },
        () => this.onSuggestionsChange?.(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uril_suggestion_replies' },
        () => this.onSuggestionsChange?.(),
      )
      .subscribe((status) => {
        this.suggestionsChannelReady = status === 'SUBSCRIBED';
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          this.client?.removeChannel(this.suggestionsChannel).catch(() => {});
          this.suggestionsChannel = null;
          this.suggestionsChannelReady = false;
        }
      });
  }

  async listSuggestions(limit = 80) {
    if (!this.client) return [];

    const { data: suggestions, error: suggestionsError } = await this.client
      .from('uril_suggestions')
      .select('id,nick,island,body,created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (suggestionsError) throw suggestionsError;

    const rows = suggestions || [];
    this.subscribeSuggestions();
    if (!rows.length) return [];

    const suggestionIds = rows.map((suggestion) => suggestion.id);
    const { data: replies, error: repliesError } = await this.client
      .from('uril_suggestion_replies')
      .select('id,suggestion_id,nick,island,body,created_at')
      .in('suggestion_id', suggestionIds)
      .order('created_at', { ascending: true });
    if (repliesError) throw repliesError;

    const repliesBySuggestion = new Map();
    for (const reply of replies || []) {
      const list = repliesBySuggestion.get(reply.suggestion_id) || [];
      list.push(reply);
      repliesBySuggestion.set(reply.suggestion_id, list);
    }

    return rows.map((suggestion) => ({
      ...suggestion,
      replies: repliesBySuggestion.get(suggestion.id) || [],
    }));
  }

  async createSuggestion(profile, text) {
    if (!this.client || !this.user || !this.registered) throw new Error('Só jogadores inscritos publicam sugestões.');
    const body = String(text || '').trim().slice(0, 1200);
    if (body.length < 4) throw new Error('Escreve uma sugestão com pelo menos quatro caracteres.');

    const payload = {
      author_id: this.user.id,
      nick: String(profile?.nick || '').trim().slice(0, 18),
      island: profile?.island || null,
      body,
    };

    const { data, error } = await this.client
      .from('uril_suggestions')
      .insert(payload)
      .select('id,nick,island,body,created_at')
      .single();
    if (error) throw error;
    return { ...data, replies: [] };
  }

  async createSuggestionReply(suggestionId, profile, text) {
    if (!this.client || !this.user || !this.registered) throw new Error('Só jogadores inscritos publicam respostas.');
    const body = String(text || '').trim().slice(0, 800);
    if (!body) throw new Error('Escreve uma resposta antes de enviar.');

    const payload = {
      suggestion_id: suggestionId,
      author_id: this.user.id,
      nick: String(profile?.nick || '').trim().slice(0, 18),
      island: profile?.island || null,
      body,
    };

    const { data, error } = await this.client
      .from('uril_suggestion_replies')
      .insert(payload)
      .select('id,suggestion_id,nick,island,body,created_at')
      .single();
    if (error) throw error;
    return data;
  }

  async refreshRoomStatuses() {
    if (!this.client) return 0;
    const { data, error } = await this.client.rpc('uril_refresh_room_statuses');
    if (error) return 0;
    return Number(data || 0);
  }

  async listRooms({ status = 'playing', search = '', page = 0, pageSize = 20, dateFrom = null, dateTo = null, result = 'all', event = 'all' } = {}) {
    if (!this.client) return { rooms: [], count: 0, page: 0, pageSize };
    await this.refreshRoomStatuses();
    const statuses = status === 'all'
      ? ['waiting', 'playing', 'interrupted', 'finished', 'abandoned']
      : ['live', 'playing'].includes(status)
        ? ['playing']
        : ['open', 'waiting'].includes(status)
          ? ['waiting', 'interrupted']
          : status === 'finished'
            ? ['finished', 'abandoned']
            : [status];

    let query = this.client
      .from('uril_rooms')
      .select('*', { count: 'exact' })
      .in('status', statuses)
      .order('updated_at', { ascending: false });

    const term = String(search || '').trim().replace(/[,%()]/g, '');
    if (term) query = query.or(`name.ilike.%${term}%,host_nick.ilike.%${term}%,guest_nick.ilike.%${term}%,host_country.ilike.%${term}%,guest_country.ilike.%${term}%,host_island.ilike.%${term}%,guest_island.ilike.%${term}%`);
    if (dateFrom) query = query.gte('created_at', `${dateFrom}T00:00:00.000Z`);
    if (dateTo) {
      const exclusiveEnd = new Date(`${dateTo}T00:00:00.000Z`);
      exclusiveEnd.setUTCDate(exclusiveEnd.getUTCDate() + 1);
      query = query.lt('created_at', exclusiveEnd.toISOString());
    }
    if (['south', 'north', 'draw'].includes(result)) query = query.eq('result', result);
    if (event === 'capote') query = query.eq('has_capote', true);
    if (event === 'frouxo') query = query.eq('has_frouxo', true);
    if (event === 'quatro') query = query.eq('has_quatro', true);

    const from = Math.max(0, Number(page) || 0) * pageSize;
    const to = from + pageSize - 1;
    const { data, count, error } = await query.range(from, to);
    if (error) throw error;
    return { rooms: data || [], count: Number(count || 0), page: Number(page) || 0, pageSize };
  }

  async createRoom({ name, session }) {
    if (!this.registered) throw new Error('Só jogadores inscritos criam bancos oficiais.');
    const { data, error } = await this.client.rpc('uril_create_room', {
      p_name: name || `Banco de ${this.profile.nick}`,
      p_game_state: session,
    });
    if (error) throw error;
    return data;
  }

  async joinRoom(roomId) {
    if (!this.registered) throw new Error('Só jogadores inscritos entram em partidas oficiais.');
    const { data, error } = await this.client.rpc('uril_join_room', { p_room_id: roomId });
    if (error) throw error;
    return data;
  }

  async getRoom(roomId) {
    const { data, error } = await this.client
      .from('uril_rooms')
      .select('*')
      .eq('id', roomId)
      .single();
    if (error) throw error;
    return data;
  }

  roomPresenceViewers() {
    const state = this.roomChannel?.presenceState?.() || {};
    const viewers = [];
    for (const [key, metas] of Object.entries(state)) {
      for (const meta of metas || []) viewers.push({ connection_id: meta.connection_id || key, ...meta });
    }
    const anonymous = viewers
      .filter((viewer) => !viewer.registered)
      .sort((a, b) => String(a.connection_id).localeCompare(String(b.connection_id)));
    const anonymousNumbers = new Map(anonymous.map((viewer, index) => [viewer.connection_id, index + 1]));
    return viewers.map((viewer) => ({
      ...viewer,
      display_nick: viewer.registered
        ? viewer.nick
        : `Anónimo ${String(anonymousNumbers.get(viewer.connection_id) || 1).padStart(2, '0')}`,
    }));
  }

  emitRoomPresence() {
    this.onRoomPresenceChange?.({ viewers: this.roomPresenceViewers() });
  }

  startRoomHeartbeat(roomId) {
    window.clearInterval(this.roomHeartbeatTimer);
    if (!this.registered) return;
    const beat = () => this.heartbeatRoom(roomId).catch(() => {});
    beat();
    this.roomHeartbeatTimer = window.setInterval(beat, 15000);
  }

  async heartbeatRoom(roomId) {
    if (!this.registered || !roomId) return null;
    const { data, error } = await this.client.rpc('uril_room_heartbeat', { p_room_id: roomId });
    if (error) throw error;
    return data;
  }

  async subscribeRoom(roomId, onChange, onChatMessage, viewerProfile = {}) {
    if (this.roomChannel) await this.client.removeChannel(this.roomChannel);
    window.clearInterval(this.roomHeartbeatTimer);
    this.roomChannelReady = false;
    this.roomPresenceProfile = {
      connection_id: this.connectionId,
      user_id: this.user?.id || null,
      nick: this.registered ? this.profile.nick : 'Anónimo',
      registered: this.registered,
      island: this.registered ? this.profile.island : null,
      country: this.registered ? this.profile.country : null,
      role: viewerProfile.role || 'spectator',
      seen_at: new Date().toISOString(),
    };

    this.roomChannel = this.client
      .channel(`uril-room-${roomId}`, {
        config: {
          broadcast: { self: false, ack: false },
          presence: { key: this.connectionId },
        },
      })
      .on('presence', { event: 'sync' }, () => this.emitRoomPresence())
      .on('presence', { event: 'join' }, () => this.emitRoomPresence())
      .on('presence', { event: 'leave' }, () => this.emitRoomPresence())
      .on(
        'broadcast',
        { event: 'room_state' },
        ({ payload }) => {
          if (payload?.room) onChange(payload.room);
        },
      )
      .on(
        'broadcast',
        { event: 'chat_message' },
        ({ payload }) => {
          if (payload?.message) onChatMessage?.(payload.message);
        },
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'uril_rooms',
          filter: `id=eq.${roomId}`,
        },
        (payload) => onChange(payload.new),
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'uril_moves',
          filter: `room_id=eq.${roomId}`,
        },
        () => this.onLobbyChange?.(),
      );

    await new Promise((resolve, reject) => {
      const timer = window.setTimeout(
        () => reject(new Error('A ligação em tempo real ao banco excedeu o tempo previsto.')),
        8000,
      );

      this.roomChannel.subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          window.clearTimeout(timer);
          this.roomChannelReady = true;
          await this.roomChannel.track(this.roomPresenceProfile);
          this.emitRoomPresence();
          if (viewerProfile.role === 'player') this.startRoomHeartbeat(roomId);
          resolve();
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          window.clearTimeout(timer);
          reject(new Error('Falhou a ligação em tempo real ao banco de Uril.'));
        }
      });
    });
  }

  async broadcastRoomState(room) {
    if (!this.roomChannel || !this.roomChannelReady || !room) return;
    try {
      await this.roomChannel.send({
        type: 'broadcast',
        event: 'room_state',
        payload: { room },
      });
    } catch {
      // O Postgres Realtime continua a servir de via de recuperação.
    }
  }

  async sendChatMessage(room, profile, text) {
    if (!this.roomChannel || !this.roomChannelReady || !room) {
      throw new Error('O chat ainda não está ligado a este banco de Uril.');
    }

    const content = String(text || '').trim().slice(0, 280);
    if (!content) throw new Error('Escreve uma mensagem antes de enviar.');

    const message = {
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      room_id: room.id,
      user_id: this.user?.id || null,
      nick: String(profile?.nick || 'Convidado').trim().slice(0, 18) || 'Convidado',
      island: profile?.island || null,
      text: content,
      sent_at: new Date().toISOString(),
    };

    const response = await this.roomChannel.send({
      type: 'broadcast',
      event: 'chat_message',
      payload: { message },
    });
    if (response !== 'ok') throw new Error('O serviço em tempo real não confirmou a mensagem.');
    return message;
  }

  async updateRoomState(room, session, status = room.status) {
    const { data, error } = await this.client
      .from('uril_rooms')
      .update({
        game_state: session,
        status,
        version: Number(room.version || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', room.id)
      .eq('version', room.version)
      .select('*')
      .single();
    if (error) throw error;

    await this.broadcastRoomState(data);
    return data;
  }

  async closeRoom(room) {
    if (!room || room.host_id !== this.user?.id || !this.registered) return null;
    const { data, error } = await this.client.rpc('uril_close_room', { p_room_id: room.id });
    if (error) throw error;
    return data;
  }

  async submitOfficialAction(roomId, action, pitIndex = null) {
    if (!this.registered) throw new Error('Só jogadores inscritos participam em partidas oficiais.');
    const { data, error } = await this.client.functions.invoke('uril-official-move', {
      body: { roomId, action, pitIndex },
    });
    if (error) throw error;
    if (data?.error) throw new Error(data.error);
    return data;
  }

  async listMoves(roomId) {
    if (!this.client || !roomId) return [];
    const { data, error } = await this.client
      .from('uril_moves')
      .select('*')
      .eq('room_id', roomId)
      .order('game_no', { ascending: true })
      .order('ply', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async saveMoveAnalysis(moveId, analysis) {
    if (!this.registered || !moveId || !analysis) return null;
    const { data, error } = await this.client.rpc('uril_save_move_analysis', {
      p_move_id: moveId,
      p_best_move: analysis.bestMove,
      p_value: analysis.bestValue,
      p_depth: analysis.completedDepth,
      p_nodes: analysis.nodes,
      p_time_ms: analysis.timeMs,
      p_classification: analysis.classification,
    });
    if (error) throw error;
    return data;
  }

  async leaderboard(limit = 100) {
    const { data, error } = await this.client
      .from('uril_profiles')
      .select('id,nick,country,island,elo,elo_provisional,rated_games,wins,draws,losses')
      .order('elo', { ascending: false })
      .order('rated_games', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async ratingHistory(playerId = this.user?.id, limit = 50) {
    if (!playerId) return [];
    const { data, error } = await this.client
      .from('uril_rating_history')
      .select('*')
      .eq('player_id', playerId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  }

  async calibrationProgress() {
    if (!this.registered) return [];
    const { data, error } = await this.client
      .from('uril_calibrations')
      .select('level,result,performance_elo,created_at')
      .eq('player_id', this.user.id)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return data || [];
  }

  async recordCalibration(level, result) {
    if (!this.registered) throw new Error('É necessário entrar numa conta de jogador.');
    const { data, error } = await this.client.rpc('uril_record_calibration', {
      p_level: level,
      p_result: result,
    });
    if (error) throw error;
    await this.loadIdentity();
    this.emitAuthChange();
    return data;
  }

  async leaveRoomChannel() {
    window.clearInterval(this.roomHeartbeatTimer);
    this.roomHeartbeatTimer = null;
    if (this.roomChannel && this.client) {
      await this.roomChannel.untrack?.().catch?.(() => {});
      await this.client.removeChannel(this.roomChannel);
      this.roomChannel = null;
      this.roomChannelReady = false;
    }
  }
}
