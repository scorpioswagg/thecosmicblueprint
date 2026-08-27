import tzlookup from "tz-lookup";

/** Resolve IANA timezone from lat/lon. */
export function timezoneAt(lat: number, lon: number): string {
  return tzlookup(lat, lon);
}

/**
 * Return the UTC offset in hours for the given local civil date/time in the
 * given IANA timezone. Handles DST automatically.
 */
export function tzOffsetHoursFor(
  isoLocalDateTime: string,
  timeZone: string,
): number {
  // Treat the wall time as if it were UTC; then ask Intl how that instant
  // appears in the target tz, and compute the difference.
  const asUtc = new Date(`${isoLocalDateTime}:00Z`);
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const parts = Object.fromEntries(
    dtf.formatToParts(asUtc).map((p) => [p.type, p.value]),
  );
  const tzAsUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
  // tzAsUtc - asUtc.getTime() = offset (ms)
  return (tzAsUtc - asUtc.getTime()) / 3_600_000;
}
/** Thrown with a user-safe message when a birth timezone cannot be resolved. */
export class TimezoneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimezoneError";
  }
}

/**
 * Resolve the IANA timezone and the DST-correct UTC offset for a birth moment.
 * Falls back from the geocoder's timezone to a coordinate lookup, and reports a
 * clear, actionable message when neither works.
 */
export function resolveBirthTimezone(opts: {
  latitude: number;
  longitude: number;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
  hintTimezone?: string;
}): { timezone: string; offsetHours: number } {
  const { latitude, longitude, date, time, hintTimezone } = opts;

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new TimezoneError(
      "The birthplace coordinates are missing. Search for the city again and pick a result from the list.",
    );
  }

  let timezone = hintTimezone?.trim() || "";
  if (!timezone) {
    try {
      timezone = timezoneAt(latitude, longitude);
    } catch {
      throw new TimezoneError(
        "We couldn't determine the timezone for that location. Try selecting the nearest major city instead.",
      );
    }
  }

  try {
    const offsetHours = tzOffsetHoursFor(`${date}T${time}`, timezone);
    if (!Number.isFinite(offsetHours)) throw new Error("non-finite offset");
    return { timezone, offsetHours };
  } catch {
    throw new TimezoneError(
      `We couldn't calculate the UTC offset for ${timezone} on ${date}. Double-check the birth date, then try again.`,
    );
  }
}
