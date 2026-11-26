-- Quote requests submitted through the website's contact form (QuoteForm).
--
-- These are sales leads, not priced quotations: a request becomes a row in
-- `quotes` only when staff price and log it through POST /api/quotes. The
-- optional instant-estimate inputs are kept as JSON alongside the server's own
-- re-priced estimate at submission time, so Sales can see what the customer saw.

begin;

create table quote_requests (
  id serial primary key,
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  product_type text,
  estimated_volume text,
  destination text not null,
  message text,
  -- The estimate panel's inputs (origin, destination, commodity, airline,
  -- readyDate, grossWeightKg, dimensions), or null if the customer skipped it.
  lane jsonb,
  -- Public pricing for that lane at submission time (airline, rate, chargeable
  -- weight, freight total), or null if not filled in or no rate was found.
  estimate jsonb,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'closed'))
);

create index quote_requests_created_at_idx on quote_requests (created_at desc);
create index quote_requests_status_idx on quote_requests (status);

commit;
