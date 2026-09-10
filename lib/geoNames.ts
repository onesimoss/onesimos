/**
 * Onesimos — Geo-Adaptive Names Engine (Step J)
 * ===============================================
 * Cultural protection shield for African & Diaspora proper names.
 * Prevents culturally rich names from being misclassified as reading
 * stumbles or spelling errors.
 *
 * Supported Regions:
 *   - Nigeria (NG): Yoruba, Igbo, Hausa, Edo, Efik names
 *   - Ghana (GH): Akan, Ewe, Ga names
 *   - Kenya / East Africa (KE): Swahili, Kikuyu, Luo names
 *   - South Africa / Southern Africa (ZA): Zulu, Xhosa, Sotho, Shona names
 *   - Diaspora / Global (GLOBAL): African-American, Afro-Caribbean, Pan-African names
 *
 * @module lib/geoNames
 */

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type GeoRegion = "NG" | "GH" | "KE" | "ZA" | "GLOBAL";

export interface GeoNameEntry {
  name: string; // Canonical lowercase string (e.g. "chinedu")
  display: string; // Formatted title-case string (e.g. "Chinedu")
  region: GeoRegion; // Primary origin region
  meaning?: string; // Optional short meaning for learning tooltips
}

// ─── REGIONAL NAME DICTIONARY ──────────────────────────────────────────────

const NIGERIAN_NAMES: GeoNameEntry[] = [
  { name: "chinedu", display: "Chinedu", region: "NG", meaning: "God leads" },
  { name: "chioma", display: "Chioma", region: "NG", meaning: "Good God" },
  { name: "amaka", display: "Amaka", region: "NG", meaning: "Queen of beauty" },
  { name: "tayo", display: "Tayo", region: "NG", meaning: "Joyful child" },
  { name: "zainab", display: "Zainab", region: "NG", meaning: "Fragrant flower" },
  { name: "emeka", display: "Emeka", region: "NG", meaning: "Great deeds" },
  { name: "funke", display: "Funke", region: "NG", meaning: "Given to be loved" },
  { name: "aminu", display: "Aminu", region: "NG", meaning: "Trustworthy" },
  { name: "iroko", display: "Iroko", region: "NG", meaning: "Sacred hardwood tree" },
  { name: "yetunde", display: "Yetunde", region: "NG", meaning: "Mother has returned" },
  { name: "obinna", display: "Obinna", region: "NG", meaning: "Father's heart" },
  { name: "damilola", display: "Damilola", region: "NG", meaning: "Blessed with wealth" },
  { name: "kemi", display: "Kemi", region: "NG", meaning: "God pampers me" },
  { name: "segun", display: "Segun", region: "NG", meaning: "Conqueror" },
];

const GHANAIAN_NAMES: GeoNameEntry[] = [
  { name: "kwame", display: "Kwame", region: "GH", meaning: "Born on Saturday" },
  { name: "kofi", display: "Kofi", region: "GH", meaning: "Born on Friday" },
  { name: "kwesi", display: "Kwesi", region: "GH", meaning: "Born on Sunday" },
  { name: "ama", display: "Ama", region: "GH", meaning: "Born on Saturday" },
  { name: "akua", display: "Akua", region: "GH", meaning: "Born on Wednesday" },
  { name: "abena", display: "Abena", region: "GH", meaning: "Born on Tuesday" },
  { name: "yaasika", display: "Yaa", region: "GH", meaning: "Born on Thursday" },
  { name: "efua", display: "Efua", region: "GH", meaning: "Born on Friday" },
];

const KENYAN_NAMES: GeoNameEntry[] = [
  { name: "jabari", display: "Jabari", region: "KE", meaning: "Brave one" },
  { name: "zuri", display: "Zuri", region: "KE", meaning: "Beautiful" },
  { name: "amani", display: "Amani", region: "KE", meaning: "Peace" },
  { name: "nia", display: "Nia", region: "KE", meaning: "Purpose" },
  { name: "khalid", display: "Khalid", region: "KE", meaning: "Eternal" },
  { name: "wairimu", display: "Wairimu", region: "KE", meaning: "Gikuyu mother" },
  { name: "otieno", display: "Otieno", region: "KE", meaning: "Born at night" },
];

const SOUTHERN_AFRICAN_NAMES: GeoNameEntry[] = [
  { name: "thabo", display: "Thabo", region: "ZA", meaning: "Joy" },
  { name: "sipho", display: "Sipho", region: "ZA", meaning: "Gift" },
  { name: "lesedi", display: "Lesedi", region: "ZA", meaning: "Light" },
  { name: "tendai", display: "Tendai", region: "ZA", meaning: "Be thankful" },
  { name: "bongani", display: "Bongani", region: "ZA", meaning: "Be grateful" },
  { name: "nomvula", display: "Nomvula", region: "ZA", meaning: "Mother of rain" },
];

const DIASPORA_NAMES: GeoNameEntry[] = [
  { name: "malik", display: "Malik", region: "GLOBAL", meaning: "King" },
  { name: "tariq", display: "Tariq", region: "GLOBAL", meaning: "Morning star" },
  { name: "maya", display: "Maya", region: "GLOBAL", meaning: "Water" },
  { name: "zora", display: "Zora", region: "GLOBAL", meaning: "Dawn" },
  { name: "keisha", display: "Keisha", region: "GLOBAL", meaning: "Favorite" },
];

// ─── MASTER REGISTRY & LOOKUP MAPS ──────────────────────────────────────────

const ALL_GEO_NAMES: GeoNameEntry[] = [
  ...NIGERIAN_NAMES,
  ...GHANAIAN_NAMES,
  ...KENYAN_NAMES,
  ...SOUTHERN_AFRICAN_NAMES,
  ...DIASPORA_NAMES,
];

/** Fast O(1) lookup set of lowercase name strings */
const GEO_NAMES_SET: Set<string> = new Set(
  ALL_GEO_NAMES.map((item) => item.name)
);

/** Fast map for retrieving entry details by lowercase string */
const GEO_NAMES_MAP: Map<string, GeoNameEntry> = new Map(
  ALL_GEO_NAMES.map((item) => [item.name, item])
);

// ─── PUBLIC ENGINE FUNCTIONS ────────────────────────────────────────────────

/**
 * Checks if a word token is a recognized African or Diaspora proper name.
 *
 * @param token Raw or cleaned word string
 * @returns true if token matches any geo-adaptive name entry
 */
export function isGeoName(token: string): boolean {
  if (!token) return false;
  const clean = token.trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
  return GEO_NAMES_SET.has(clean);
}

/**
 * Gets the detailed GeoNameEntry for a token if recognized.
 *
 * @param token Raw or cleaned word string
 * @returns GeoNameEntry object or null if not found
 */
export function getGeoNameDetails(token: string): GeoNameEntry | null {
  if (!token) return null;
  const clean = token.trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
  return GEO_NAMES_MAP.get(clean) ?? null;
}

/**
 * Formats a word into proper title-case if it is a recognized African name.
 *
 * @param token Word to format
 * @returns Formatted display string
 */
export function formatGeoNameDisplay(token: string): string {
  const details = getGeoNameDetails(token);
  if (details) return details.display;
  
  const clean = token.trim().replace(/^[^\w]+|[^\w]+$/g, "");
  if (!clean) return token;
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

/**
 * Retrieves all registered names for a given geo-region.
 *
 * @param region GeoRegion code ("NG" | "GH" | "KE" | "ZA" | "GLOBAL")
 * @returns Array of GeoNameEntry objects
 */
export function getNamesByRegion(region: GeoRegion): GeoNameEntry[] {
  return ALL_GEO_NAMES.filter((item) => item.region === region);
}