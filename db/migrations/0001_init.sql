-- Bravair Logistics quoting system — initial schema.
-- Ports the BLL_QUOTES_SYSTEM.xlsx workbook (RATE_ENGINE, SURCHARGES, SETTINGS, LISTS,
-- QUOTE/QUOTE_LOG sheets) to Postgres. See db/README.md for the full mapping and the
-- data-quality issues found in the source workbook.

begin;

create table origins (
  code text primary key,
  name text
);

create table destinations (
  code text primary key,
  name text
);

create table airlines (
  id serial primary key,
  name text not null unique
);

create table commodities (
  id serial primary key,
  name text not null unique
);

create table commodity_subtypes (
  id serial primary key,
  commodity_id integer not null references commodities (id) on delete restrict,
  name text not null,
  unique (commodity_id, name)
);

create table settings (
  key text primary key,
  value text not null,
  description text
);

-- Airline buying rates. One row per (origin, destination, commodity, airline,
-- effective_from) — a route can have successive rate periods over time.
create table rates (
  id serial primary key,
  origin_code text not null references origins (code) on delete restrict,
  destination_code text not null references destinations (code) on delete restrict,
  commodity_id integer not null references commodities (id) on delete restrict,
  airline_id integer not null references airlines (id) on delete restrict,
  buy_rate_usd_kg numeric(10, 4) not null,
  negotiated_buy_rate_usd_kg numeric(10, 4),
  minimum_charge_usd numeric(10, 2),
  minimum_margin_usd_kg numeric(10, 4),
  -- Nullable: 20 of the 23 seeded rows are Management placeholders with no
  -- effective dates or status yet set — see db/README.md issue 6. Such a row
  -- can never satisfy the "Active" + in-range match a real quote needs.
  effective_from date,
  effective_to date,
  status text,
  notes text,
  unique (origin_code, destination_code, commodity_id, airline_id, effective_from)
);

create index rates_lookup_idx
  on rates (origin_code, destination_code, commodity_id, airline_id, status);

-- Fuel/security/other surcharges + flat airline charges, keyed by
-- (origin, destination, commodity) — airline-independent in the source workbook.
create table surcharges (
  id serial primary key,
  origin_code text not null references origins (code) on delete restrict,
  destination_code text not null references destinations (code) on delete restrict,
  commodity_id integer not null references commodities (id) on delete restrict,
  fuel_surcharge_usd_kg numeric(10, 4) not null default 0,
  security_surcharge_usd_kg numeric(10, 4) not null default 0,
  other_surcharge_usd_kg numeric(10, 4) not null default 0,
  flat_airline_charges_usd numeric(10, 2) not null default 0,
  effective_from date not null,
  effective_to date not null,
  status text not null default 'Active',
  notes text,
  unique (origin_code, destination_code, commodity_id, effective_from)
);

create index surcharges_lookup_idx
  on surcharges (origin_code, destination_code, commodity_id, status);

-- One row per finalized quotation — the Postgres equivalent of a QUOTE_LOG row.
create table quotes (
  id serial primary key,
  quote_code text not null unique,
  quote_number text not null unique,
  quote_date date not null,
  customer text,
  salesperson text,
  origin_code text not null references origins (code) on delete restrict,
  destination_code text not null references destinations (code) on delete restrict,
  commodity_id integer not null references commodities (id) on delete restrict,
  commodity_subtype_id integer references commodity_subtypes (id) on delete restrict,
  airline_id integer not null references airlines (id) on delete restrict,
  ready_date date not null,
  gross_weight_kg numeric(10, 2) not null,
  dimensions jsonb not null,
  volumetric_weight_kg numeric(10, 2) not null,
  chargeable_weight_kg numeric(10, 2) not null,
  weight_basis text not null,
  approved_freight_rate_usd_kg numeric(10, 4) not null,
  freight_total_usd numeric(10, 2) not null,
  service_charges jsonb not null default '{}'::jsonb,
  total_customer_quote_usd numeric(10, 2) not null,
  notes text,
  created_at timestamptz not null default now()
);

-- Sequence numbers are derived from counts of existing rows for the same
-- year+month (quote code) or exact date (quote number); these indexes make
-- those counts cheap and let us take a row lock scoped to the same period.
create index quotes_quote_date_idx on quotes (quote_date);

commit;
