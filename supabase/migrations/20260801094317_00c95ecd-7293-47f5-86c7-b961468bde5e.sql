CREATE TABLE public.report_catalog (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Core',
  description text,
  short_description text,
  cover_image_url text,
  features text[] NOT NULL DEFAULT '{}',
  price_cents integer NOT NULL DEFAULT 2900,
  sale_price_cents integer,
  currency text NOT NULL DEFAULT 'USD',
  estimated_delivery text NOT NULL DEFAULT 'Instant',
  is_active boolean NOT NULL DEFAULT true,
  stripe_product_id text,
  stripe_price_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  seo_title text,
  seo_description text,
  seo_keywords text[] NOT NULL DEFAULT '{}',
  sections text[] NOT NULL DEFAULT '{}',
  prompt_module text,
  system_framing text,
  target_words integer NOT NULL DEFAULT 1400,
  adult boolean NOT NULL DEFAULT false,
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.report_catalog TO anon;
GRANT SELECT ON public.report_catalog TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.report_catalog TO authenticated;
GRANT ALL ON public.report_catalog TO service_role;

ALTER TABLE public.report_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active catalog entries"
  ON public.report_catalog FOR SELECT
  TO anon, authenticated
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert catalog entries"
  ON public.report_catalog FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update catalog entries"
  ON public.report_catalog FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete catalog entries"
  ON public.report_catalog FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_report_catalog_updated_at
  BEFORE UPDATE ON public.report_catalog
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();