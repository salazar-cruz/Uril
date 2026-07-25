export class MultiplayerService {
  constructor({ url, anonKey, onLobbyChange, onPresenceChange, onInvitation }) {
    this.url = url;
    this.anonKey = anonKey;
    this.onLobbyChange = onLobbyChange;
    this.onPresenceChange = onPresenceChange;
    this.onInvitation = onInvitation;
    this.client = null;
    this.user = null;
    this.lobbyChannel = null;
    this.roomChannel = null;
    this.roomChannelReady = false;
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
    return {
      nick: String(profile.nick || '').trim() || fallback,
      island: String(profile.island || 'santiago'),
      status: ['free', 'waiting', 'playing', 'watching'].includes(profile.status)
        ? profile.status
        : 'free',
      bank_id: profile.bank_id || null,
      bank_name: profile.bank_name || null,
      seen_at: new Date().toISOString(),
    };
  }

  async connectLobby(profile) {
    if (!this.client || !this.user) return;
    if (this.lobbyChannel) await this.client.removeChannel(this.lobbyChannel);

    this.lobbyChannel = this.client.channel('uril-lobby-v1', {
      config: {
        presence: { key: this.user.id },
        broadcast: { self: false, ack: true },
      },
    });

    this.lobbyChannel
      .on('presence', { event: 'sync' }, () => {
        const state = this.lobbyChannel.presenceState();
        const players = Object.entries(state).map(([userId, metas]) => ({
          user_id: userId,
          ...(metas.at(-1) || {}),
        }));
        this.onPresenceChange?.({ players, count: players.length });
      })
      .on('broadcast', { event: 'invite' }, ({ payload }) => {
        if (payload?.target_id === this.user?.id) this.onInvitation?.(payload);
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uril_rooms' },
        () => this.onLobbyChange?.(),
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.lobbyChannel.track(this.normalisePresence(profile));
        }
      });
  }

  async updatePresence(profile) {
    if (!this.lobbyChannel) return;
    await this.lobbyChannel.track(this.normalisePresence(profile));
  }

  async sendInvitation(targetUserId, room, profile) {
    if (!this.lobbyChannel || !targetUserId || !room) {
      throw new Error('O convite não encontrou o jogador ou o banco de Uril.');
    }

    const response = await this.lobbyChannel.send({
      type: 'broadcast',
      event: 'invite',
      payload: {
        invite_id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
        target_id: targetUserId,
        inviter_id: this.user?.id,
        inviter_nick: String(profile?.nick || room.host_nick || 'Jogador'),
        inviter_island: String(profile?.island || room.host_island || 'santiago'),
        bank_id: room.id,
        bank_name: room.name,
        sent_at: new Date().toISOString(),
      },
    });

    if (response !== 'ok') throw new Error('O serviço em tempo real não confirmou o convite.');
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
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random()}`,
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
