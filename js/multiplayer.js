export class MultiplayerService {
  constructor({ url, anonKey, onLobbyChange, onPresenceChange }) {
    this.url = url;
    this.anonKey = anonKey;
    this.onLobbyChange = onLobbyChange;
    this.onPresenceChange = onPresenceChange;
    this.client = null;
    this.user = null;
    this.lobbyChannel = null;
    this.roomChannel = null;
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

  async connectLobby(profile) {
    if (!this.client || !this.user) return;
    if (this.lobbyChannel) await this.client.removeChannel(this.lobbyChannel);

    this.lobbyChannel = this.client.channel('uril-lobby-v0', {
      config: { presence: { key: this.user.id } },
    });

    this.lobbyChannel
      .on('presence', { event: 'sync' }, () => {
        const state = this.lobbyChannel.presenceState();
        const players = Object.values(state).flat();
        this.onPresenceChange?.(players);
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'uril_rooms' },
        () => this.onLobbyChange?.(),
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await this.lobbyChannel.track({
            nick: profile.nick,
            island: profile.island,
            seen_at: new Date().toISOString(),
          });
        }
      });
  }

  async updatePresence(profile) {
    if (!this.lobbyChannel) return;
    await this.lobbyChannel.track({
      nick: profile.nick,
      island: profile.island,
      seen_at: new Date().toISOString(),
    });
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
      name: name || `Mesa de ${profile.nick}`,
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
    const { data, error } = await this.client
      .from('uril_rooms')
      .update({
        guest_id: this.user.id,
        guest_nick: profile.nick,
        guest_island: profile.island,
        status: 'playing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', roomId)
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

  async subscribeRoom(roomId, onChange) {
    if (this.roomChannel) await this.client.removeChannel(this.roomChannel);
    this.roomChannel = this.client
      .channel(`uril-room-${roomId}`)
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
      .subscribe();
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
    }
  }
}
