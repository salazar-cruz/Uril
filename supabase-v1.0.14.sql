-- URIL DE CABO VERDE — ACTUALIZAÇÃO 1.0.14
-- Convites privados e partidas não classificadas entre jogadores anónimos.
-- Executar integralmente no SQL Editor do Supabase antes de publicar a versão 1.0.14.

create extension if not exists pgcrypto;

alter table public.uril_rooms
  add column if not exists room_kind text not null default 'official';
alter table public.uril_rooms
  add column if not exists private_room boolean not null default false;
alter table public.uril_rooms
  add column if not exists invited_user_id uuid references auth.users(id) on delete set null;
alter table public.uril_rooms
  add column if not exists invite_token uuid not null default gen_random_uuid();

alter table public.uril_rooms drop constraint if exists uril_rooms_room_kind_check;
alter table public.uril_rooms
  add constraint uril_rooms_room_kind_check
  check (room_kind in ('official', 'guest'));

create index if not exists uril_rooms_invited_user_idx
  on public.uril_rooms(invited_user_id, status, updated_at desc);

-- Os bancos privados só ficam visíveis para o anfitrião, para o convidado
-- indicado no convite e, depois da entrada, para os dois participantes.
drop policy if exists "rooms_select_authenticated" on public.uril_rooms;
create policy "rooms_select_authenticated"
on public.uril_rooms for select
to authenticated
using (
  not private_room
  or auth.uid() = host_id
  or auth.uid() = guest_id
  or auth.uid() = invited_user_id
);

create or replace function public.uril_create_guest_room(
  p_game_state jsonb,
  p_invited_user_id uuid
)
returns public.uril_rooms
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_room public.uril_rooms;
  v_host_nick text;
  v_target_is_anonymous boolean;
begin
  if auth.uid() is null or not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Este convite privado destina-se a jogadores anónimos.';
  end if;
  if p_invited_user_id is null or p_invited_user_id = auth.uid() then
    raise exception 'Selecciona outro jogador anónimo.';
  end if;

  select coalesce(u.is_anonymous, false)
    into v_target_is_anonymous
    from auth.users u
   where u.id = p_invited_user_id;
  if not coalesce(v_target_is_anonymous, false) then
    raise exception 'O jogador escolhido já não está disponível como anónimo.';
  end if;

  v_host_nick := 'Anónimo ' || upper(substr(replace(auth.uid()::text, '-', ''), 1, 4));

  update public.uril_rooms
     set status = 'abandoned',
         finished_at = coalesce(finished_at, now()),
         updated_at = now(),
         version = version + 1
   where host_id = auth.uid()
     and room_kind = 'guest'
     and status in ('waiting', 'interrupted');

  insert into public.uril_rooms(
    name, host_id, host_nick, host_island, host_country,
    guest_id, guest_nick, guest_island, guest_country,
    status, allow_spectators, rated, opponent_type, room_kind, private_room,
    invited_user_id, game_state, last_host_seen_at
  ) values (
    'Banco privado de ' || v_host_nick,
    auth.uid(), v_host_nick, null, null,
    null, null, null, null,
    'waiting', false, false, 'human', 'guest', true,
    p_invited_user_id, p_game_state, now()
  ) returning * into v_room;

  return v_room;
end;
$$;

grant execute on function public.uril_create_guest_room(jsonb,uuid) to authenticated;

create or replace function public.uril_join_guest_room(
  p_room_id uuid,
  p_invite_token uuid
)
returns public.uril_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.uril_rooms;
  v_guest_nick text;
begin
  if auth.uid() is null or not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Este banco privado destina-se a jogadores anónimos.';
  end if;

  v_guest_nick := 'Anónimo ' || upper(substr(replace(auth.uid()::text, '-', ''), 1, 4));

  update public.uril_rooms
     set guest_id = auth.uid(),
         guest_nick = v_guest_nick,
         guest_island = null,
         guest_country = null,
         status = 'playing',
         started_at = coalesce(started_at, now()),
         last_guest_seen_at = now(),
         updated_at = now(),
         version = version + 1
   where id = p_room_id
     and room_kind = 'guest'
     and private_room
     and rated = false
     and status = 'waiting'
     and guest_id is null
     and invited_user_id = auth.uid()
     and invite_token = p_invite_token
     and host_id <> auth.uid()
   returning * into v_room;

  if v_room.id is null then
    raise exception 'O convite expirou, foi recusado ou já foi utilizado.';
  end if;
  return v_room;
end;
$$;

grant execute on function public.uril_join_guest_room(uuid,uuid) to authenticated;

-- O histórico de jogadas dos bancos privados também fica restrito aos dois participantes.
drop policy if exists "moves_select_authenticated" on public.uril_moves;
create policy "moves_select_authenticated"
on public.uril_moves for select
to authenticated
using (
  exists (
    select 1
      from public.uril_rooms r
     where r.id = room_id
       and (
         not r.private_room
         or auth.uid() = r.host_id
         or auth.uid() = r.guest_id
         or auth.uid() = r.invited_user_id
       )
  )
);

-- Realtime deve continuar activo para os bancos; a política acima protege
-- os bancos privados de utilizadores que não participam no convite.
do $$
begin
  alter publication supabase_realtime add table public.uril_rooms;
exception when duplicate_object then null;
end $$;
