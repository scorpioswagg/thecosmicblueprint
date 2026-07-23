CREATE TABLE public.report_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id text UNIQUE,
  price_cents integer NOT NULL DEFAULT 2900,
  currency text NOT NULL DEFAULT 'USD',
  is_active boolean NOT NULL DEFAULT true,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.report_prices TO anon;
GRANT SELECT ON public.report_prices TO authenticated;
GRANT ALL ON public.report_prices TO service_role;

ALTER TABLE public.report_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active prices"
  ON public.report_prices
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can manage prices"
  ON public.report_prices
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  description text,
  discount_cents integer NOT NULL DEFAULT 0,
  max_uses integer,
  uses_count integer NOT NULL DEFAULT 0,
  expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.promo_codes TO authenticated;
GRANT ALL ON public.promo_codes TO service_role;

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage promo codes"
  ON public.promo_codes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can read promo codes for redemption"
  ON public.promo_codes
  FOR SELECT
  TO authenticated
  USING (is_active = true AND (expires_at IS NULL OR expires_at > now()) AND (max_uses IS NULL OR uses_count < max_uses));

CREATE TABLE public.report_purchases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id text NOT NULL,
  stripe_session_id text UNIQUE,
  stripe_payment_intent_id text,
  promo_code_id uuid REFERENCES public.promo_codes(id) ON DELETE SET NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  status text NOT NULL DEFAULT 'pending',
  is_free boolean NOT NULL DEFAULT false,
  paid_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.report_purchases TO authenticated;
GRANT ALL ON public.report_purchases TO service_role;

ALTER TABLE public.report_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchases"
  ON public.report_purchases
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage purchases"
  ON public.report_purchases
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE public.purchase_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id text NOT NULL,
  stripe_session_id text,
  event_type text NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'USD',
  is_free boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.purchase_events TO authenticated;
GRANT ALL ON public.purchase_events TO service_role;

ALTER TABLE public.purchase_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own purchase events"
  ON public.purchase_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage purchase events"
  ON public.purchase_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE public.price_change_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id text,
  old_price_cents integer,
  new_price_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'USD',
  changed_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT ON public.price_change_logs TO authenticated;
GRANT ALL ON public.price_change_logs TO service_role;

ALTER TABLE public.price_change_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view price change logs"
  ON public.price_change_logs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can manage price change logs"
  ON public.price_change_logs
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_report_prices_updated_at
  BEFORE UPDATE ON public.report_prices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_promo_codes_updated_at
  BEFORE UPDATE ON public.promo_codes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_purchases_updated_at
  BEFORE UPDATE ON public.report_purchases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed the default price and a tester free code.
INSERT INTO public.report_prices (report_id, price_cents, currency, is_active, is_default)
VALUES (NULL, 2900, 'USD', true, true)
ON CONFLICT (report_id) DO NOTHING;

INSERT INTO public.promo_codes (code, description, discount_cents, max_uses, is_active)
VALUES ('TEST4FREE', 'Tester complimentary code — unlocks any report for free.', 2900, NULL, true)
ON CONFLICT (code) DO NOTHING;