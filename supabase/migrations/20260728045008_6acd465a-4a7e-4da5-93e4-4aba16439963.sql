
INSERT INTO public.report_prices (report_id, price_cents, currency, is_active, is_default)
VALUES
  ('hidden-soul-contracts', 8900, 'USD', true, false),
  ('future-self-blueprint', 9900, 'USD', true, false),
  ('parallel-destiny-paths', 12900, 'USD', true, false),
  ('cosmic-decision-matrix', 7900, 'USD', true, false),
  ('luck-architecture', 8900, 'USD', true, false),
  ('shadow-pattern-decoder', 6900, 'USD', true, false),
  ('frequency-blueprint', 7900, 'USD', true, false),
  ('emotional-trigger-atlas', 6900, 'USD', true, false),
  ('timeline-probability-forecast', 14900, 'USD', true, false),
  ('personal-energy-calendar', 9900, 'USD', true, false),
  ('life-turning-point-predictor', 12900, 'USD', true, false),
  ('soul-evolution-timeline', 10900, 'USD', true, false),
  ('relationship-energy-maps', 8900, 'USD', true, false),
  ('legacy-purpose-blueprint', 9900, 'USD', true, false),
  ('destiny-accelerator', 11900, 'USD', true, false)
ON CONFLICT DO NOTHING;
