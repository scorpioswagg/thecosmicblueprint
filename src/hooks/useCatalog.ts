import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mergeCatalog, CATALOG_SELECT, type CatalogRow, type CatalogEntry } from "@/lib/astrology/catalog";

/**
 * Live report catalog: built-in definitions merged with admin-managed
 * database rows (pricing, copy, SEO, activation, custom reports).
 */
export function useCatalog(opts?: { includeInactive?: boolean }) {
  const includeInactive = opts?.includeInactive ?? false;
  const [rows, setRows] = useState<CatalogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("report_catalog").select(CATALOG_SELECT);
    if (error) console.warn("[catalog] load failed", error.message);
    setRows((data as unknown as CatalogRow[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const catalog: CatalogEntry[] = mergeCatalog(rows, { includeInactive });
  return { catalog, rows, loading, reload: load };
}
