export interface GeocodeResult {
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

/** Thrown with a message that is safe (and useful) to show directly to a user. */
export class GeocodeError extends Error {
  readonly kind: "network" | "server" | "empty" | "invalid";
  constructor(kind: GeocodeError["kind"], message: string) {
    super(message);
    this.name = "GeocodeError";
    this.kind = kind;
  }
}

/**
 * Open-Meteo geocoding API — no key required.
 * https://open-meteo.com/en/docs/geocoding-api
 *
 * Every failure mode is converted into a GeocodeError carrying a plain-English
 * message so the birth forms can tell the user exactly what to do next.
 */
export async function geocodePlace(query: string): Promise<GeocodeResult[]> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    throw new GeocodeError("invalid", "Enter at least two characters of the city name.");
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  let res: Response;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    res = await fetch(url.toString(), { signal: controller.signal });
    clearTimeout(timer);
  } catch {
    throw new GeocodeError(
      "network",
      "We couldn't reach the location service. Check your internet connection and press Search again.",
    );
  }

  if (!res.ok) {
    throw new GeocodeError(
      "server",
      `The location service is temporarily unavailable (error ${res.status}). Please try again in a moment.`,
    );
  }

  let json: {
    results?: Array<{
      name: string; country: string; admin1?: string;
      latitude: number; longitude: number; timezone: string;
    }>;
  };
  try {
    json = await res.json();
  } catch {
    throw new GeocodeError("server", "The location service returned an unreadable response. Please try again.");
  }

  const results = (json.results ?? [])
    .filter((r) => Number.isFinite(r.latitude) && Number.isFinite(r.longitude))
    .map((r) => ({
      name: r.name, country: r.country, admin1: r.admin1,
      latitude: r.latitude, longitude: r.longitude, timezone: r.timezone,
    }));

  if (results.length === 0) {
    throw new GeocodeError(
      "empty",
      `No place matched "${trimmed}". Try the nearest larger city, or add the country — e.g. "Cincinnati, United States".`,
    );
  }

  return results;
}
