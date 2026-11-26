-- Monotonic counters for quote codes (per month) and quote numbers (per day).
--
-- 0001 derived each sequence from count(*) of existing quotes in the period, so
-- deleting a quote made the next one reuse an existing code and fail the unique
-- constraint. A counter row is only ever incremented, and is updated in the same
-- transaction as the quote insert, so a failed insert rolls its increment back
-- (no gaps) and a deleted quote's number is never handed out again. The row lock
-- taken by the increment also serializes concurrent quote creation per period,
-- replacing 0001's global advisory lock.

begin;

create table quote_sequences (
  scope text not null check (scope in ('code', 'number')),
  -- 'YYYY-MM' for scope 'code', 'YYYY-MM-DD' for scope 'number'
  period text not null,
  last_value integer not null check (last_value >= 0),
  primary key (scope, period)
);

-- Backfill from any quotes already logged, so new sequences continue after the
-- highest existing one. greatest(..., count) covers any code whose suffix
-- doesn't parse.
insert into quote_sequences (scope, period, last_value)
select 'code', to_char(quote_date, 'YYYY-MM'),
       greatest(coalesce(max(substring(quote_code from '-(\d+)$')::integer), 0), count(*))
from quotes
group by to_char(quote_date, 'YYYY-MM');

insert into quote_sequences (scope, period, last_value)
select 'number', to_char(quote_date, 'YYYY-MM-DD'),
       greatest(coalesce(max(substring(quote_number from '-(\d+)$')::integer), 0), count(*))
from quotes
group by to_char(quote_date, 'YYYY-MM-DD');

commit;
