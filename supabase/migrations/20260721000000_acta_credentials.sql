-- ACTA: constancias verificables en Stellar
--
-- Dos tablas:
--   acta_issuer_identities  custodia el did:stellar de la organización
--   credentials             una fila por constancia emitida (o intentada)

-- ─────────────────────────────────────────────────────────────
-- Identidad del emisor
-- ─────────────────────────────────────────────────────────────
create table if not exists public.acta_issuer_identities (
  controller                      text        not null,
  network                         text        not null check (network in ('mainnet', 'testnet')),
  did                             text        not null,
  assertion_public_key_multibase  text        not null,
  assertion_public_key_hex        text        not null,
  -- AES-256-GCM bajo ACTA_IDENTITY_ENCRYPTION_KEY, formato iv.tag.ciphertext
  assertion_private_key_encrypted text        not null,
  created_at                      timestamptz not null default now(),
  primary key (controller, network)
);

comment on table public.acta_issuer_identities is
  'did:stellar de la organización. La llave privada de aserción va cifrada por la app; Postgres nunca ve el plaintext.';

-- Sin políticas a propósito: solo la service role entra acá.
alter table public.acta_issuer_identities enable row level security;

-- ─────────────────────────────────────────────────────────────
-- Constancias
-- ─────────────────────────────────────────────────────────────
create table if not exists public.credentials (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users (id) on delete cascade,
  event_id        uuid        not null references public.events (id) on delete cascade,
  inscripcion_id  uuid        references public.inscripciones (id) on delete set null,

  -- 'inscripcion' | 'finisher'
  kind            text        not null check (kind in ('inscripcion', 'finisher')),

  -- Identificador on-chain. Único: es la barrera contra emitir (y pagar) dos veces.
  vc_id           text        not null unique check (char_length(vc_id) <= 64),

  -- Owner del vault donde vive: la organización, o el corredor en modo sponsored.
  vault_owner     text        not null,
  holder_did      text        not null,
  issuer_did      text,
  network         text        not null check (network in ('mainnet', 'testnet')),

  tx_id           text,
  -- 'pending'   intención registrada, sin tocar la cadena
  -- 'issued'    anclada on-chain
  -- 'failed'    la emisión falló; `error` dice por qué
  -- 'simulated' ACTA_ISSUANCE_ENABLED=false
  status          text        not null default 'pending'
                              check (status in ('pending', 'issued', 'failed', 'simulated')),
  error           text,

  -- El VC completo tal como se emitió. Duplica lo que está cifrado en la cadena,
  -- para poder mostrar la constancia sin depender de get-vc en cada visita.
  payload         jsonb       not null default '{}'::jsonb,

  issued_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table public.credentials is
  'Constancias ACTA. `vc_id` único impide doble emisión: cada credencial cuesta tarifa on-chain.';

create index if not exists credentials_user_event_idx
  on public.credentials (user_id, event_id);

create index if not exists credentials_event_kind_idx
  on public.credentials (event_id, kind) where status = 'issued';

-- updated_at automático
create or replace function public.touch_credentials_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists credentials_touch_updated_at on public.credentials;
create trigger credentials_touch_updated_at
  before update on public.credentials
  for each row execute function public.touch_credentials_updated_at();

-- ─────────────────────────────────────────────────────────────
-- RLS
-- ─────────────────────────────────────────────────────────────
alter table public.credentials enable row level security;

-- El corredor ve sus propias constancias.
drop policy if exists credentials_select_own on public.credentials;
create policy credentials_select_own
  on public.credentials
  for select
  to authenticated
  using (user_id = auth.uid());

-- El admin las ve todas.
drop policy if exists credentials_select_admin on public.credentials;
create policy credentials_select_admin
  on public.credentials
  for select
  to authenticated
  using (public.is_admin(auth.uid()));

-- Nadie escribe desde el cliente: emitir cuesta plata y exige firmar con la
-- wallet de la organización. Los INSERT/UPDATE entran por la service role.
