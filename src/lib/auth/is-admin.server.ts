import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Resolves administrator status permissively and never throws.
 *
 * Admins must always get every report free — now and for any report added in
 * the future — so a failing RPC must never silently downgrade an admin into a
 * paying customer. We check `has_role` first, then fall back to reading the
 * `user_roles` row directly. Truthiness matches the client's `!!data` check so
 * the UI and the server can never disagree.
 */
export async function resolveIsAdmin(
  supabase: SupabaseClient<any, any, any>,
  userId: string,
  tag = "resolveIsAdmin",
): Promise<boolean> {
  let rpcAdmin = false;
  try {
    const { data, error } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    if (error) console.error(`[${tag}] has_role failed`, error);
    rpcAdmin = !!data;
  } catch (e) {
    console.error(`[${tag}] has_role threw`, e);
  }
  if (rpcAdmin) return true;

  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();
    if (error) console.error(`[${tag}] user_roles lookup failed`, error);
    return !!data;
  } catch (e) {
    console.error(`[${tag}] user_roles lookup threw`, e);
    return false;
  }
}
