create table if not exists public.admin_report_audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_id text not null,
  action text not null check (action in ('generate','pdf_download','markdown_download','pdf_preview')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

grant select on public.admin_report_audit_logs to authenticated;
grant all on public.admin_report_audit_logs to service_role;

alter table public.admin_report_audit_logs enable row level security;

create policy "Admins can view admin report audit logs"
  on public.admin_report_audit_logs for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Service role can manage admin report audit logs"
  on public.admin_report_audit_logs for all
  to service_role
  using (true)
  with check (true);
