import Stripe from "stripe";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { CATALOG_SELECT, type CatalogRow } from "@/lib/astrology/catalog";

const PaymentRequestSchema = z.object({
  reportId: z.string().min(1).max(80),
  customerEmail: z.string().email(),
});

function stripeClient() {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(secret);
}

async function assertAdmin(supabase: any, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

async function serviceClient() {
  const { createClient } = await import("@supabase/supabase-js");
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase admin credentials not configured");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function findOrCreateProduct(
  stripe: Stripe,
  row: CatalogRow,
): Promise<Stripe.Product> {
  let product: Stripe.Product | null = null;

  if (row.stripe_product_id) {
    try {
      const candidate = await stripe.products.retrieve(row.stripe_product_id);
      if (!candidate.deleted) product = candidate;
    } catch {
      product = null;
    }
  }

  if (!product) {
    const search = await stripe.products.search({
      query: `metadata[\"report_id\"]:\"${row.id.replace(/\\/g, "\\\\").replace(/\"/g, '\\\"')}\"`,
      limit: 1,
    });
    product = search.data[0] ?? null;
  }

  const metadata = {
    cosmic_blueprint: "true",
    report_id: row.id,
    category: row.category,
  };

  if (product) {
    return stripe.products.update(product.id, {
      name: row.title,
      description: row.description ?? row.short_description ?? undefined,
      active: row.is_active,
      metadata,
    });
  }

  return stripe.products.create({
    name: row.title,
    description: row.description ?? row.short_description ?? undefined,
    active: row.is_active,
    metadata,
  });
}

async function syncPrice(
  stripe: Stripe,
  product: Stripe.Product,
  row: CatalogRow,
): Promise<Stripe.Price> {
  const amount = row.sale_price_cents ?? row.price_cents;
  const currency = row.currency.toLowerCase();

  if (row.stripe_price_id) {
    try {
      const current = await stripe.prices.retrieve(row.stripe_price_id);
      if (
        current.active &&
        current.unit_amount === amount &&
        current.currency === currency &&
        current.product === product.id &&
        !current.recurring
      ) {
        return current;
      }
      if (current.active) await stripe.prices.update(current.id, { active: false });
    } catch {
      // The stored ID can be stale; create a fresh price below.
    }
  }

  const prices = await stripe.prices.list({ product: product.id, active: true, limit: 100 });
  const matching = prices.data.find(
    (p) => p.unit_amount === amount && p.currency === currency && !p.recurring,
  );
  if (matching) return matching;

  return stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency,
    metadata: {
      cosmic_blueprint: "true",
      report_id: row.id,
    },
  });
}

/**
 * Synchronizes the live Stripe catalog from the database-backed Cosmic Blueprint catalog.
 * It updates/creates products and one-time prices, then writes the Stripe IDs back to Supabase.
 */
export const syncStripeCatalog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = await serviceClient();
    const stripe = stripeClient();

    const { data, error } = await db
      .from("report_catalog")
      .select(CATALOG_SELECT)
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);

    const rows = (data ?? []) as unknown as CatalogRow[];
    const results: Array<{ id: string; productId: string; priceId: string; active: boolean }> = [];

    for (const row of rows) {
      const product = await findOrCreateProduct(stripe, row);
      const price = await syncPrice(stripe, product, row);

      const { error: updateError } = await db
        .from("report_catalog")
        .update({ stripe_product_id: product.id, stripe_price_id: price.id })
        .eq("id", row.id);
      if (updateError) throw new Error(`${row.id}: ${updateError.message}`);

      results.push({
        id: row.id,
        productId: product.id,
        priceId: price.id,
        active: row.is_active,
      });
    }

    return { count: results.length, results };
  });

/** Creates a Stripe-hosted Checkout payment request for exactly the selected report. */
export const createAdminPaymentRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => PaymentRequestSchema.parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const db = await serviceClient();
    const stripe = stripeClient();

    const { data: rowData, error } = await db
      .from("report_catalog")
      .select(CATALOG_SELECT)
      .eq("id", data.reportId)
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!rowData) throw new Error("Unknown report");

    const row = rowData as unknown as CatalogRow;
    if (!row.is_active) throw new Error("This report is inactive.");
    if ((row.sale_price_cents ?? row.price_cents) <= 0) {
      throw new Error("This report is free and does not need a payment request.");
    }

    const product = await findOrCreateProduct(stripe, row);
    const price = await syncPrice(stripe, product, row);

    const { data: usersData, error: usersError } = await stripeCustomerUserLookup(db, data.customerEmail);
    if (usersError) throw new Error(usersError);
    if (!usersData) {
      throw new Error("No Cosmic Blueprint account exists for that email. Have the customer create/sign into an account first.");
    }

    const appUrl = process.env.PUBLIC_APP_URL ?? process.env.VITE_PUBLIC_APP_URL ?? "https://cosmic-blueprint.space";
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: price.id, quantity: 1 }],
      customer_email: data.customerEmail,
      client_reference_id: usersData.id,
      metadata: {
        user_id: usersData.id,
        report_id: row.id,
        source: "admin_payment_request",
      },
      success_url: `${appUrl}/?payment=success&report_id=${encodeURIComponent(row.id)}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/?payment=cancelled&report_id=${encodeURIComponent(row.id)}`,
      submit_type: "pay",
    });

    return {
      reportId: row.id,
      reportTitle: row.title,
      amountCents: price.unit_amount ?? 0,
      currency: price.currency,
      checkoutUrl: session.url,
      sessionId: session.id,
      customerEmail: data.customerEmail,
    };
  });

async function stripeCustomerUserLookup(db: any, email: string) {
  const normalized = email.trim().toLowerCase();
  const { data, error } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) return { usersData: null, usersError: error.message };
  const user = data.users.find((u: { email?: string | null }) => u.email?.toLowerCase() === normalized);
  return { usersData: user ?? null, usersError: null };
}
