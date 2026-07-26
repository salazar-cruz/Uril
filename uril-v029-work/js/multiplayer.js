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
  constructor({ url, anonKey, onLobbyChange, onPresenceChange, onInvitation, onSuggestionsChange }) {
    this.url = url;
    this.anonKey = anonKey;
    this.onLobbyChange = onLobbyChange;
    this.onPresenceChange = onPresenceChange;
    this.onInvitation = onInvitation;
    this.onSuggestionsChange = onSuggestionsChange;
    this.client = null;
    this.user = null;
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
  }

  get configured() {
    return Boolean(this.url && this.anonKey);
  }

  async init(profile) {
    if (!this.configured) return { configured: false };

    let createClient = window.supabase?.createClient;
    if (!createClient) {
      const module = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
      createClient = module.createClient;
    }

    this.client = createClient(this.url, this.anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });

    let { data } = await this.client.auth.getSession();
    if (!data.session) {
      const response = await this.client.auth.signInAnonymously();
      if (response.error) throw response.error;
      data = { session: response.data.session };
    }
    this.user = data.session.user;
    await this.connectLobby(profile);
    return { configured: true, user: this.user };
  }

  normalisePresence(profile = {}) {
    const fallback = this.user?.id ? `Convidado-${this.user.id.slice(0, 4)}` : 'Convidado';
    const status = PRESENCE_STATUSES.has(profile.status) ? profile.status : 'free';
    return {
      connection_id: this.connectionId,
      user_id: this.user?.id || null,
      nick: String(profile.nick || '').trim() || fallback,
      island: String(profile.island || 'santiago'),
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
    if (!this.client || !this.user) throw new Error('O serviço de sugestões ainda não está ligado.');
    const body = String(text || '').trim().slice(0, 1200);
    if (body.length < 4) throw new Error('Escreve uma sugestão com pelo menos quatro caracteres.');

    const payload = {
      author_id: this.user.id,
      nick: String(profile?.nick || '').trim().slice(0, 18),
      island: String(profile?.island || 'santiago'),
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
    if (!this.client || !this.user) throw new Error('O serviço de sugestões ainda não está ligado.');
    const body = String(text || '').trim().slice(0, 800);
    if (!body) throw new Error('Escreve uma resposta antes de enviar.');

    const payload = {
      suggestion_id: suggestionId,
      author_id: this.user.id,
      nick: String(profile?.nick || '').trim().slice(0, 18),
      island: String(profile?.island || 'santiago'),
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

  async listRooms() {
    if (!this.client) return [];
    const since = new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString();
    const { data, error } = await this.client
      .from('uril_rooms')
      .select('*')
      .in('status', ['waiting', 'playing'])
      .gte('updated_at', since)
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) throw error;
    return data || [];
  }

  async createRoom({ name, profile, session }) {
    const payload = {
      name: name || `Banco de ${profile.nick}`,
      host_id: this.user.id,
      host_nick: profile.nick,
      host_island: profile.island,
      status: 'waiting',
      allow_spectators: true,
      game_state: session,
      version: 1,
    };
    const { data, error } = await this.client
      .from('uril_rooms')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  async createComputerRoom({
    name,
    profile,
    session,
    computerNick,
    computerIsland = 'santa-luzia',
  }) {
    const payload = {
      name: name || `Banco de ${profile.nick} contra o PC`,
      host_id: this.user.id,
      host_nick: profile.nick,
      host_island: profile.island,
      guest_id: null,
      guest_nick: computerNick || 'PC',
      guest_island: computerIsland,
      status: 'playing',
      allow_spectators: true,
      game_state: session,
      version: 1,
    };
    const { data, error } = await this.client
      .from('uril_rooms')
      .insert(payload)
      .select('*')
      .single();
    if (error) throw error;
    return data;
  }

  async joinRoom(roomId, profile) {
    const current = await this.getRoom(roomId);
    const { data, error } = await this.client
      .from('uril_rooms')
      .update({
        guest_id: this.user.id,
        guest_nick: profile.nick,
        guest_island: profile.island,
        status: 'playing',
        version: Number(current.version || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', roomId)
      .eq('version', current.version)
      .is('guest_id', null)
      .select('*')
      .single();
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

  async subscribeRoom(roomId, onChange, onChatMessage) {
    if (this.roomChannel) await this.client.removeChannel(this.roomChannel);
    this.roomChannelReady = false;

    this.roomChannel = this.client
      .channel(`uril-room-${roomId}`, {
        config: { broadcast: { self: false, ack: false } },
      })
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
      );

    await new Promise((resolve, reject) => {
      const timer = window.setTimeout(
        () => reject(new Error('A ligação em tempo real ao banco excedeu o tempo previsto.')),
        8000,
      );

      this.roomChannel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          window.clearTimeout(timer);
          this.roomChannelReady = true;
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
      island: String(profile?.island || 'santiago'),
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
    if (!room || room.host_id !== this.user?.id) return;
    await this.client
      .from('uril_rooms')
      .update({ status: 'finished', updated_at: new Date().toISOString() })
      .eq('id', room.id);
  }

  async leaveRoomChannel() {
    if (this.roomChannel && this.client) {
      await this.client.removeChannel(this.roomChannel);
      this.roomChannel = null;
      this.roomChannelReady = false;
    }
  }
}
