
-- 1. Lock down SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user_profile() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- authenticated retains EXECUTE on has_role because RLS policies evaluate it as the querying role.

-- 2. Explicit deny policies for email_send_log client writes.
-- service_role bypasses RLS, so backend writes continue to work.
DROP POLICY IF EXISTS "No client inserts on email_send_log" ON public.email_send_log;
DROP POLICY IF EXISTS "No client updates on email_send_log" ON public.email_send_log;
DROP POLICY IF EXISTS "No client deletes on email_send_log" ON public.email_send_log;

CREATE POLICY "No client inserts on email_send_log"
  ON public.email_send_log
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (false);

CREATE POLICY "No client updates on email_send_log"
  ON public.email_send_log
  FOR UPDATE
  TO anon, authenticated
  USING (false)
  WITH CHECK (false);

CREATE POLICY "No client deletes on email_send_log"
  ON public.email_send_log
  FOR DELETE
  TO anon, authenticated
  USING (false);
