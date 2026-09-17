CREATE TABLE IF NOT EXISTS public.report_deliveries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id TEXT NOT NULL,
  report_title TEXT NOT NULL,
  report_markdown TEXT NOT NULL,
  chart_data JSONB,
  is_free BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, report_id)
);

GRANT SELECT ON public.report_deliveries TO authenticated;
GRANT ALL ON public.report_deliveries TO service_role;

ALTER TABLE public.report_deliveries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own deliveries" ON public.report_deliveries;
CREATE POLICY "Users can view their own deliveries"
  ON public.report_deliveries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all deliveries" ON public.report_deliveries;
CREATE POLICY "Admins can view all deliveries"
  ON public.report_deliveries FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));