/**
 * Geocode a place name to latitude/longitude using OpenStreetMap Nominatim.
 * Use sparingly; Nominatim asks for max 1 request per second and a proper User-Agent.
 */

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'AnantAstro/1.0 (kundli app)';

export interface GeocodeResult {
  lat: number;
  lon: number;
}

/**
 * Returns the first result's lat/lon, or null if not found or request failed.
 */
export async function geocodePlace(place: string): Promise<GeocodeResult | null> {
  const trimmed = place?.trim();
  if (!trimmed) return null;

  const params = new URLSearchParams({
    q: trimmed,
    format: 'json',
    limit: '1',
  });

  try {
    const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Array<{ lat?: string; lon?: string }>;
    const first = data?.[0];
    if (!first?.lat || !first?.lon) return null;
    const lat = parseFloat(first.lat);
    const lon = parseFloat(first.lon);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return { lat, lon };
  } catch {
    return null;
  }
}
