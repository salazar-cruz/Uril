-- URIL DE CABO VERDE — ACTUALIZAÇÃO 1.0.0
-- Executar integralmente no SQL Editor do Supabase.
-- Esta migração preserva os bancos e sugestões existentes.

create extension if not exists pgcrypto;
create extension if not exists citext;

create or replace function public.uril_is_cape_verde_country(p_country text)
returns boolean
language sql
immutable
as $$
  select lower(trim(coalesce(p_country, ''))) in ('cabo verde', 'cape verde', 'cap-vert', 'cv');
$$;

-- ---------------------------------------------------------------------------
-- CONTA PRIVADA E PERFIL PÚBLICO DO JOGADOR
-- ---------------------------------------------------------------------------

create table if not exists public.uril_accounts (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 2 and 100),
  email citext not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uril_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nick citext not null unique check (char_length(nick::text) between 2 and 18),
  country text not null check (char_length(country) between 2 and 80),
  island text,
  elo integer not null default 1200 check (elo between 100 and 4000),
  elo_provisional boolean not null default true,
  calibration_games integer not null default 0,
  rated_games integer not null default 0,
  wins integer not null default 0,
  draws integer not null default 0,
  losses integer not null default 0,
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.uril_profiles drop constraint if exists uril_profiles_country_island_check;
alter table public.uril_profiles
  add constraint uril_profiles_country_island_check
  check (
    (public.uril_is_cape_verde_country(country) and island is not null and char_length(trim(island)) > 0)
    or
    (not public.uril_is_cape_verde_country(country) and island is null)
  ) not valid;

create index if not exists uril_profiles_elo_idx
  on public.uril_profiles(elo desc, rated_games desc, nick);

alter table public.uril_accounts enable row level security;
alter table public.uril_profiles enable row level security;

drop policy if exists "account_select_own" on public.uril_accounts;
create policy "account_select_own"
on public.uril_accounts for select
to authenticated
using (auth.uid() = id);

drop policy if exists "profile_select_public" on public.uril_profiles;
create policy "profile_select_public"
on public.uril_profiles for select
to authenticated
using (true);

-- As identidades são criadas pelo trigger e alteradas por RPC. Elo e estatísticas
-- nunca ficam disponíveis para actualização directa pelo navegador.
revoke insert, update, delete on public.uril_accounts from authenticated;
revoke insert, update, delete on public.uril_profiles from authenticated;
grant select on public.uril_accounts to authenticated;
grant select on public.uril_profiles to authenticated;

create or replace function public.uril_handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_full_name text;
  v_nick text;
  v_country text;
  v_island text;
begin
  if coalesce(new.is_anonymous, false) then
    return new;
  end if;

  v_full_name := trim(coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  v_nick := trim(coalesce(new.raw_user_meta_data ->> 'nick', ''));
  v_country := trim(coalesce(new.raw_user_meta_data ->> 'country', ''));
  v_island := nullif(trim(coalesce(new.raw_user_meta_data ->> 'island', '')), '');

  if char_length(v_full_name) < 2 or char_length(v_nick) < 2 or char_length(v_country) < 2 then
    raise exception 'Nome, nick e país são obrigatórios.';
  end if;
  if public.uril_is_cape_verde_country(v_country) and v_island is null then
    raise exception 'A ilha é obrigatória para jogadores de Cabo Verde.';
  end if;
  if not public.uril_is_cape_verde_country(v_country) then
    v_island := null;
  end if;

  insert into public.uril_accounts(id, full_name, email)
  values (new.id, v_full_name, coalesce(new.email, ''))
  on conflict (id) do update
    set full_name = excluded.full_name,
        email = excluded.email,
        updated_at = now();

  insert into public.uril_profiles(id, nick, country, island)
  values (new.id, v_nick, v_country, v_island)
  on conflict (id) do update
    set nick = excluded.nick,
        country = excluded.country,
        island = excluded.island,
        updated_at = now();

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_uril on auth.users;
create trigger on_auth_user_created_uril
after insert or update of raw_user_meta_data, email on auth.users
for each row execute procedure public.uril_handle_new_user();

create or replace function public.uril_update_identity(
  p_full_name text,
  p_nick text,
  p_country text,
  p_island text default null
)
returns public.uril_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.uril_profiles;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'É necessário entrar numa conta de jogador.';
  end if;
  if char_length(trim(p_full_name)) < 2 or char_length(trim(p_nick)) < 2 or char_length(trim(p_country)) < 2 then
    raise exception 'Nome, nick e país são obrigatórios.';
  end if;
  if public.uril_is_cape_verde_country(p_country) and nullif(trim(coalesce(p_island, '')), '') is null then
    raise exception 'A ilha é obrigatória para jogadores de Cabo Verde.';
  end if;

  update public.uril_accounts
     set full_name = trim(p_full_name), updated_at = now()
   where id = auth.uid();

  update public.uril_profiles
     set nick = trim(p_nick),
         country = trim(p_country),
         island = case when public.uril_is_cape_verde_country(p_country) then nullif(trim(coalesce(p_island, '')), '') else null end,
         updated_at = now()
   where id = auth.uid()
   returning * into v_profile;

  return v_profile;
end;
$$;

grant execute on function public.uril_update_identity(text,text,text,text) to authenticated;

create or replace function public.uril_complete_registration(
  p_full_name text,
  p_nick text,
  p_country text,
  p_island text default null
)
returns public.uril_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_island text;
  v_profile public.uril_profiles;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'A conta permanente ainda não está confirmada.';
  end if;
  if char_length(trim(p_full_name)) < 2 or char_length(trim(p_nick)) < 2 or char_length(trim(p_country)) < 2 then
    raise exception 'Nome, nick e país são obrigatórios.';
  end if;
  v_island := nullif(trim(coalesce(p_island, '')), '');
  if public.uril_is_cape_verde_country(p_country) and v_island is null then
    raise exception 'A ilha é obrigatória para jogadores de Cabo Verde.';
  end if;
  if not public.uril_is_cape_verde_country(p_country) then v_island := null; end if;

  select email into v_email from auth.users where id = auth.uid();
  insert into public.uril_accounts(id, full_name, email)
  values(auth.uid(), trim(p_full_name), coalesce(v_email, ''))
  on conflict(id) do update set full_name = excluded.full_name, email = excluded.email, updated_at = now();

  insert into public.uril_profiles(id, nick, country, island)
  values(auth.uid(), trim(p_nick), trim(p_country), v_island)
  on conflict(id) do update set nick = excluded.nick, country = excluded.country, island = excluded.island, updated_at = now()
  returning * into v_profile;
  return v_profile;
end;
$$;

grant execute on function public.uril_complete_registration(text,text,text,text) to authenticated;

-- ---------------------------------------------------------------------------
-- BANCOS OFICIAIS, ESTADOS LIVE E ARQUIVO
-- ---------------------------------------------------------------------------

create table if not exists public.uril_rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 40),
  host_id uuid not null references auth.users(id) on delete cascade,
  host_nick text not null check (char_length(host_nick) between 2 and 18),
  host_island text,
  guest_id uuid references auth.users(id) on delete set null,
  guest_nick text,
  guest_island text,
  status text not null default 'waiting',
  allow_spectators boolean not null default true,
  game_state jsonb not null,
  version bigint not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.uril_rooms add column if not exists rated boolean not null default true;
alter table public.uril_rooms add column if not exists opponent_type text not null default 'human';
alter table public.uril_rooms add column if not exists started_at timestamptz;
alter table public.uril_rooms add column if not exists last_move_at timestamptz;
alter table public.uril_rooms add column if not exists finished_at timestamptz;
alter table public.uril_rooms add column if not exists last_host_seen_at timestamptz;
alter table public.uril_rooms add column if not exists last_guest_seen_at timestamptz;
alter table public.uril_rooms add column if not exists result text;
alter table public.uril_rooms add column if not exists winner_id uuid references auth.users(id) on delete set null;
alter table public.uril_rooms add column if not exists host_elo_start integer;
alter table public.uril_rooms add column if not exists guest_elo_start integer;
alter table public.uril_rooms add column if not exists host_elo_latest integer;
alter table public.uril_rooms add column if not exists guest_elo_latest integer;
alter table public.uril_rooms add column if not exists host_country text;
alter table public.uril_rooms add column if not exists guest_country text;
alter table public.uril_rooms add column if not exists last_finish_reason text;
alter table public.uril_rooms add column if not exists last_result_value integer;
alter table public.uril_rooms add column if not exists has_capote boolean not null default false;
alter table public.uril_rooms add column if not exists has_frouxo boolean not null default false;
alter table public.uril_rooms add column if not exists has_quatro boolean not null default false;
alter table public.uril_rooms alter column host_island drop not null;

-- Os bancos anteriores à versão 1.0.0 foram criados por sessões anónimas e
-- ficam no arquivo, mas nunca entram no Elo oficial.
update public.uril_rooms r
   set rated = false,
       opponent_type = case when coalesce(r.game_state ->> 'mode', '') = 'pc' then 'computer' else 'human' end
 where not exists(select 1 from public.uril_profiles p where p.id = r.host_id)
    or (r.guest_id is not null and not exists(select 1 from public.uril_profiles p where p.id = r.guest_id));

alter table public.uril_rooms drop constraint if exists uril_rooms_status_check;
alter table public.uril_rooms
  add constraint uril_rooms_status_check
  check (status in ('waiting', 'playing', 'interrupted', 'finished', 'abandoned'));

alter table public.uril_rooms drop constraint if exists uril_rooms_opponent_type_check;
alter table public.uril_rooms
  add constraint uril_rooms_opponent_type_check
  check (opponent_type in ('human', 'computer'));

create index if not exists uril_rooms_status_updated_idx
  on public.uril_rooms(status, updated_at desc);
create index if not exists uril_rooms_archive_idx
  on public.uril_rooms(created_at desc, host_nick, guest_nick);

alter table public.uril_rooms enable row level security;

drop policy if exists "rooms_select_authenticated" on public.uril_rooms;
create policy "rooms_select_authenticated"
on public.uril_rooms for select
to authenticated
using (true);

-- Bloqueia alterações directas. A criação, entrada, jogadas, batimentos e fecho
-- passam por RPC/Edge Function, que validam a identidade e a versão da partida.
drop policy if exists "rooms_insert_host" on public.uril_rooms;
drop policy if exists "rooms_update_players_or_join" on public.uril_rooms;
drop policy if exists "rooms_delete_host" on public.uril_rooms;
revoke insert, update, delete on public.uril_rooms from authenticated;
grant select on public.uril_rooms to authenticated;

create or replace function public.uril_create_room(p_name text, p_game_state jsonb)
returns public.uril_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.uril_profiles;
  v_room public.uril_rooms;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Só jogadores inscritos criam bancos oficiais.';
  end if;
  select * into v_profile from public.uril_profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'Perfil de jogador inexistente.'; end if;
  if v_profile.calibration_games < 3 then
    raise exception 'Conclui os três testes de calibração antes de criares um banco oficial.';
  end if;

  insert into public.uril_rooms(
    name, host_id, host_nick, host_island, host_country, status, rated, opponent_type,
    game_state, host_elo_start, host_elo_latest, last_host_seen_at
  ) values (
    coalesce(nullif(trim(p_name), ''), 'Banco de ' || v_profile.nick::text),
    v_profile.id, v_profile.nick::text, v_profile.island, v_profile.country, 'waiting', true, 'human',
    p_game_state, v_profile.elo, v_profile.elo, now()
  ) returning * into v_room;
  return v_room;
end;
$$;

grant execute on function public.uril_create_room(text,jsonb) to authenticated;

create or replace function public.uril_join_room(p_room_id uuid)
returns public.uril_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  v_profile public.uril_profiles;
  v_room public.uril_rooms;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'Só jogadores inscritos entram numa partida oficial.';
  end if;
  select * into v_profile from public.uril_profiles where id = auth.uid();
  if v_profile.id is null then raise exception 'Perfil de jogador inexistente.'; end if;
  if v_profile.calibration_games < 3 then
    raise exception 'Conclui os três testes de calibração antes de entrares numa partida oficial.';
  end if;

  update public.uril_rooms
     set guest_id = v_profile.id,
         guest_nick = v_profile.nick::text,
         guest_island = v_profile.island,
         guest_country = v_profile.country,
         guest_elo_start = v_profile.elo,
         guest_elo_latest = v_profile.elo,
         status = 'playing',
         started_at = coalesce(started_at, now()),
         last_guest_seen_at = now(),
         updated_at = now(),
         version = version + 1
   where id = p_room_id
     and status in ('waiting', 'interrupted')
     and guest_id is null
     and host_id <> auth.uid()
   returning * into v_room;

  if v_room.id is null then raise exception 'O banco já não está disponível.'; end if;
  return v_room;
end;
$$;

grant execute on function public.uril_join_room(uuid) to authenticated;

create or replace function public.uril_room_heartbeat(p_room_id uuid)
returns public.uril_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.uril_rooms;
begin
  update public.uril_rooms
     set last_host_seen_at = case when host_id = auth.uid() then now() else last_host_seen_at end,
         last_guest_seen_at = case when guest_id = auth.uid() then now() else last_guest_seen_at end,
         status = case
           when status = 'interrupted'
             and coalesce(case when host_id = auth.uid() then now() else last_host_seen_at end, updated_at) > now() - interval '90 seconds'
             and coalesce(case when guest_id = auth.uid() then now() else last_guest_seen_at end, updated_at) > now() - interval '90 seconds'
           then 'playing'
           else status
         end,
         updated_at = case when auth.uid() in (host_id, guest_id) then now() else updated_at end
   where id = p_room_id and auth.uid() in (host_id, guest_id)
   returning * into v_room;
  return v_room;
end;
$$;

grant execute on function public.uril_room_heartbeat(uuid) to authenticated;

create or replace function public.uril_refresh_room_statuses()
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer := 0;
  v_step integer := 0;
begin
  update public.uril_rooms
     set status = 'interrupted', updated_at = now()
   where status = 'playing'
     and (
       coalesce(last_host_seen_at, updated_at) < now() - interval '90 seconds'
       or coalesce(last_guest_seen_at, updated_at) < now() - interval '90 seconds'
     );
  get diagnostics v_step = row_count;
  v_count := v_count + v_step;

  update public.uril_rooms
     set status = 'abandoned', finished_at = coalesce(finished_at, now()), updated_at = now()
   where (
     status = 'interrupted' and updated_at < now() - interval '24 hours'
   ) or (
     status = 'waiting' and coalesce(last_host_seen_at, updated_at) < now() - interval '30 minutes'
   );
  get diagnostics v_step = row_count;
  v_count := v_count + v_step;
  return v_count;
end;
$$;

grant execute on function public.uril_refresh_room_statuses() to authenticated;

create or replace function public.uril_close_room(p_room_id uuid)
returns public.uril_rooms
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.uril_rooms;
begin
  update public.uril_rooms
     set status = case
           when coalesce(game_state #>> '{game,status}', '') = 'finished' then 'finished'
           else 'abandoned'
         end,
         finished_at = now(), updated_at = now(), version = version + 1
   where id = p_room_id and host_id = auth.uid()
   returning * into v_room;
  return v_room;
end;
$$;

grant execute on function public.uril_close_room(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- JOGADAS INDIVIDUAIS E ANÁLISE
-- ---------------------------------------------------------------------------

create table if not exists public.uril_moves (
  id bigint generated by default as identity primary key,
  room_id uuid not null references public.uril_rooms(id) on delete cascade,
  game_no integer not null default 1,
  ply integer not null,
  actor_id uuid references auth.users(id) on delete set null,
  player_side text not null check (player_side in ('south', 'north')),
  pit_index integer check (pit_index between 0 and 11),
  move_type text not null default 'move' check (move_type in ('start', 'move', 'resignation', 'round-start')),
  board_before jsonb,
  board_after jsonb,
  scores_before jsonb,
  scores_after jsonb,
  captured_pits jsonb not null default '[]'::jsonb,
  captured_seeds integer not null default 0,
  fed_opponent boolean not null default false,
  grand_slam boolean not null default false,
  frouxo boolean not null default false,
  game_status text,
  winner text,
  engine_best_move integer,
  engine_value numeric,
  engine_depth integer,
  engine_nodes bigint,
  engine_time_ms integer,
  classification text,
  created_at timestamptz not null default now(),
  unique(room_id, game_no, ply)
);

create index if not exists uril_moves_room_order_idx
  on public.uril_moves(room_id, game_no, ply);

alter table public.uril_moves enable row level security;

drop policy if exists "moves_select_authenticated" on public.uril_moves;
create policy "moves_select_authenticated"
on public.uril_moves for select
to authenticated
using (true);

revoke insert, update, delete on public.uril_moves from authenticated;
grant select on public.uril_moves to authenticated;

create or replace function public.uril_save_move_analysis(
  p_move_id bigint,
  p_best_move integer,
  p_value numeric,
  p_depth integer,
  p_nodes bigint,
  p_time_ms integer,
  p_classification text
)
returns public.uril_moves
language plpgsql
security definer
set search_path = public
as $$
declare
  v_move public.uril_moves;
begin
  update public.uril_moves m
     set engine_best_move = p_best_move,
         engine_value = p_value,
         engine_depth = p_depth,
         engine_nodes = p_nodes,
         engine_time_ms = p_time_ms,
         classification = p_classification
    from public.uril_rooms r
   where m.id = p_move_id
     and r.id = m.room_id
     and auth.uid() in (r.host_id, r.guest_id)
   returning m.* into v_move;
  return v_move;
end;
$$;

grant execute on function public.uril_save_move_analysis(bigint,integer,numeric,integer,bigint,integer,text) to authenticated;

-- ---------------------------------------------------------------------------
-- ELO E HISTÓRICO DE CLASSIFICAÇÃO
-- ---------------------------------------------------------------------------

create table if not exists public.uril_rating_history (
  id bigint generated by default as identity primary key,
  room_id uuid not null references public.uril_rooms(id) on delete cascade,
  game_no integer not null,
  player_id uuid not null references public.uril_profiles(id) on delete cascade,
  opponent_id uuid not null references public.uril_profiles(id) on delete cascade,
  elo_before integer not null,
  elo_after integer not null,
  delta integer not null,
  score numeric(2,1) not null,
  k_factor integer not null,
  created_at timestamptz not null default now(),
  unique(room_id, game_no, player_id)
);

create index if not exists uril_rating_history_player_idx
  on public.uril_rating_history(player_id, created_at desc);

alter table public.uril_rating_history enable row level security;

drop policy if exists "rating_history_select" on public.uril_rating_history;
create policy "rating_history_select"
on public.uril_rating_history for select
to authenticated
using (true);

grant select on public.uril_rating_history to authenticated;
revoke insert, update, delete on public.uril_rating_history from authenticated;

create or replace function public.uril_finalize_rating(
  p_room_id uuid,
  p_game_no integer,
  p_winner_side text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.uril_rooms;
  v_host public.uril_profiles;
  v_guest public.uril_profiles;
  v_host_score numeric;
  v_guest_score numeric;
  v_host_expected numeric;
  v_guest_expected numeric;
  v_host_k integer;
  v_guest_k integer;
  v_host_delta integer;
  v_guest_delta integer;
  v_host_after integer;
  v_guest_after integer;
begin
  select * into v_room from public.uril_rooms where id = p_room_id for update;
  if v_room.id is null or not v_room.rated or v_room.guest_id is null then
    return jsonb_build_object('rated', false);
  end if;
  if exists(select 1 from public.uril_rating_history where room_id = p_room_id and game_no = p_game_no) then
    return jsonb_build_object('rated', false, 'duplicate', true);
  end if;

  select * into v_host from public.uril_profiles where id = v_room.host_id for update;
  select * into v_guest from public.uril_profiles where id = v_room.guest_id for update;
  if v_host.id is null or v_guest.id is null then return jsonb_build_object('rated', false); end if;
  if v_host.calibration_games < 3 or v_guest.calibration_games < 3 then
    return jsonb_build_object('rated', false, 'reason', 'calibration');
  end if;

  v_host_score := case p_winner_side when 'south' then 1 when 'north' then 0 else 0.5 end;
  v_guest_score := 1 - v_host_score;
  v_host_expected := 1 / (1 + power(10, (v_guest.elo - v_host.elo)::numeric / 400));
  v_guest_expected := 1 - v_host_expected;
  v_host_k := case when v_host.elo_provisional or v_host.rated_games < 10 then 64 when v_host.elo >= 2100 then 16 else 32 end;
  v_guest_k := case when v_guest.elo_provisional or v_guest.rated_games < 10 then 64 when v_guest.elo >= 2100 then 16 else 32 end;
  v_host_delta := round(v_host_k * (v_host_score - v_host_expected));
  v_guest_delta := round(v_guest_k * (v_guest_score - v_guest_expected));
  v_host_after := greatest(100, v_host.elo + v_host_delta);
  v_guest_after := greatest(100, v_guest.elo + v_guest_delta);

  update public.uril_profiles
     set elo = v_host_after,
         rated_games = rated_games + 1,
         wins = wins + case when v_host_score = 1 then 1 else 0 end,
         draws = draws + case when v_host_score = 0.5 then 1 else 0 end,
         losses = losses + case when v_host_score = 0 then 1 else 0 end,
         elo_provisional = (rated_games + 1) < 10,
         updated_at = now()
   where id = v_host.id;

  update public.uril_profiles
     set elo = v_guest_after,
         rated_games = rated_games + 1,
         wins = wins + case when v_guest_score = 1 then 1 else 0 end,
         draws = draws + case when v_guest_score = 0.5 then 1 else 0 end,
         losses = losses + case when v_guest_score = 0 then 1 else 0 end,
         elo_provisional = (rated_games + 1) < 10,
         updated_at = now()
   where id = v_guest.id;

  insert into public.uril_rating_history(room_id, game_no, player_id, opponent_id, elo_before, elo_after, delta, score, k_factor)
  values
    (p_room_id, p_game_no, v_host.id, v_guest.id, v_host.elo, v_host_after, v_host_delta, v_host_score, v_host_k),
    (p_room_id, p_game_no, v_guest.id, v_host.id, v_guest.elo, v_guest_after, v_guest_delta, v_guest_score, v_guest_k);

  update public.uril_rooms
     set host_elo_latest = v_host_after,
         guest_elo_latest = v_guest_after,
         winner_id = case p_winner_side when 'south' then v_host.id when 'north' then v_guest.id else null end,
         result = p_winner_side,
         updated_at = now()
   where id = p_room_id;

  return jsonb_build_object(
    'rated', true,
    'host_before', v_host.elo, 'host_after', v_host_after, 'host_delta', v_host_delta,
    'guest_before', v_guest.elo, 'guest_after', v_guest_after, 'guest_delta', v_guest_delta
  );
end;
$$;

-- A função é chamada pela Edge Function através da service role.
revoke all on function public.uril_finalize_rating(uuid,integer,text) from public, anon, authenticated;
grant execute on function public.uril_finalize_rating(uuid,integer,text) to service_role;

-- ---------------------------------------------------------------------------
-- AVALIAÇÃO INICIAL PELO COMPUTADOR
-- ---------------------------------------------------------------------------

create table if not exists public.uril_calibrations (
  id bigint generated by default as identity primary key,
  player_id uuid not null references public.uril_profiles(id) on delete cascade,
  level text not null check (level in ('apprentice', 'amateur', 'master')),
  result text not null check (result in ('win', 'draw', 'loss')),
  performance_elo integer not null,
  created_at timestamptz not null default now(),
  unique(player_id, level)
);

alter table public.uril_calibrations enable row level security;

drop policy if exists "calibration_select_own" on public.uril_calibrations;
create policy "calibration_select_own"
on public.uril_calibrations for select
to authenticated
using (player_id = auth.uid());

grant select on public.uril_calibrations to authenticated;
revoke insert, update, delete on public.uril_calibrations from authenticated;

create or replace function public.uril_record_calibration(p_level text, p_result text)
returns public.uril_profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reference integer;
  v_score numeric;
  v_performance integer;
  v_count integer;
  v_initial integer;
  v_profile public.uril_profiles;
begin
  if auth.uid() is null or coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) then
    raise exception 'É necessário entrar numa conta de jogador.';
  end if;
  v_reference := case p_level when 'apprentice' then 900 when 'amateur' then 1200 when 'master' then 1500 else null end;
  if v_reference is null or p_result not in ('win','draw','loss') then raise exception 'Teste de calibração inválido.'; end if;
  v_score := case p_result when 'win' then 1 when 'draw' then 0.5 else 0 end;
  v_performance := round(v_reference + 400 * (v_score - 0.5));

  insert into public.uril_calibrations(player_id, level, result, performance_elo)
  values (auth.uid(), p_level, p_result, v_performance)
  on conflict (player_id, level) do update
    set result = excluded.result, performance_elo = excluded.performance_elo, created_at = now();

  select count(*), round(avg(performance_elo) / 10) * 10
    into v_count, v_initial
    from public.uril_calibrations where player_id = auth.uid();

  update public.uril_profiles
     set calibration_games = v_count,
         elo = case when v_count >= 3 then greatest(700, least(2200, v_initial)) else elo end,
         elo_provisional = true,
         updated_at = now()
   where id = auth.uid()
   returning * into v_profile;
  return v_profile;
end;
$$;

grant execute on function public.uril_record_calibration(text,text) to authenticated;

-- ---------------------------------------------------------------------------
-- SUGESTÕES: LEITURA PÚBLICA, PUBLICAÇÃO APENAS POR JOGADORES INSCRITOS
-- ---------------------------------------------------------------------------

create table if not exists public.uril_suggestions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  nick text not null check (char_length(nick) between 2 and 18),
  island text,
  body text not null check (char_length(body) between 4 and 1200),
  created_at timestamptz not null default now()
);

create table if not exists public.uril_suggestion_replies (
  id uuid primary key default gen_random_uuid(),
  suggestion_id uuid not null references public.uril_suggestions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  nick text not null check (char_length(nick) between 2 and 18),
  island text,
  body text not null check (char_length(body) between 1 and 800),
  created_at timestamptz not null default now()
);

alter table public.uril_suggestions alter column island drop not null;
alter table public.uril_suggestion_replies alter column island drop not null;
alter table public.uril_suggestions enable row level security;
alter table public.uril_suggestion_replies enable row level security;

drop policy if exists "suggestions_select_authenticated" on public.uril_suggestions;
create policy "suggestions_select_authenticated" on public.uril_suggestions for select to authenticated using (true);
drop policy if exists "suggestion_replies_select_authenticated" on public.uril_suggestion_replies;
create policy "suggestion_replies_select_authenticated" on public.uril_suggestion_replies for select to authenticated using (true);

drop policy if exists "suggestions_insert_own" on public.uril_suggestions;
create policy "suggestions_insert_own"
on public.uril_suggestions for insert to authenticated
with check (
  auth.uid() = author_id
  and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false)
  and exists(select 1 from public.uril_profiles where id = auth.uid())
);

drop policy if exists "suggestion_replies_insert_own" on public.uril_suggestion_replies;
create policy "suggestion_replies_insert_own"
on public.uril_suggestion_replies for insert to authenticated
with check (
  auth.uid() = author_id
  and not coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false)
  and exists(select 1 from public.uril_profiles where id = auth.uid())
);

grant select, insert on public.uril_suggestions to authenticated;
grant select, insert on public.uril_suggestion_replies to authenticated;

-- ---------------------------------------------------------------------------
-- REALTIME
-- ---------------------------------------------------------------------------

do $$ begin alter publication supabase_realtime add table public.uril_rooms; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.uril_moves; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.uril_profiles; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.uril_rating_history; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.uril_suggestions; exception when duplicate_object then null; end $$;
do $$ begin alter publication supabase_realtime add table public.uril_suggestion_replies; exception when duplicate_object then null; end $$;
