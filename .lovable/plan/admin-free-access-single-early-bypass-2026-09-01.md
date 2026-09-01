# Admin free access: single early bypass

Admins already skip purchase checks in three places, but the logic is scattered and re-checked per gate, so it can drift. This consolidates it into one explicit early bypass and extends it to every gate.

## What changes

Report generation (`generateAstroReport`):
- Look up `has_role(userId, 'admin')` immediately after the report is loaded.
- If admin: skip purchase verification, the inactive-report block, the admin-only gate, and the 18+ adult-consent gate, and go straight to generation.
- If not admin: all existing gates apply unchanged.

Report email delivery (`/api/send-report`):
- Keep the existing admin check, restructured as the same early bypass so an admin never hits the purchase lookup.

PDF download path:
- Downloads run off an already-generated report, so once generation succeeds for an admin, PDF and bulk PDF download are free with no extra check.

UI (`ReportsPanel`):
- No behavior change needed; existing "Free for admin" labels stay correct and will now apply to inactive and 18+ reports too.

## Technical notes

- Single `isAdmin` resolution per request via `context.supabase.rpc("has_role", ...)`; errors still throw.
- The admin-only report mode remains admin-gated for non-admins.
- No database or schema changes.
