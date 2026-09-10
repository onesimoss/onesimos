/**
 * Onesimos — Geo-Adaptive Names Engine
 * =====================================
 * Cultural protection shield for African & Diaspora proper names.
 * Prevents names of people, places, and culturally rooted nouns
 * from being misclassified as reading stumbles or spelling errors.
 *
 * Coverage (v1 — expandable spine):
 *   NG  — Nigeria (Igbo, Yoruba, Hausa, Edo, Efik, Urhobo, …)
 *   GH  — Ghana (Akan, Ewe, Ga)
 *   KE  — Kenya / East Africa (Swahili, Kikuyu, Luo, Kamba)
 *   TZ  — Tanzania / Swahili coast
 *   UG  — Uganda
 *   ZA  — South Africa (Zulu, Xhosa, Sotho, Tswana, Venda)
 *   ZW  — Zimbabwe (Shona, Ndebele)
 *   ET  — Ethiopia / Horn
 *   SN  — Senegal / Francophone West Africa
 *   CM  — Cameroon
 *   CD  — Congo / Central Africa
 *   EG  — Egypt / North Africa (common given names)
 *   GLOBAL — Diaspora (African-American, Caribbean, UK/EU) +
 *            cross-border names common in children's literature
 *
 * Design rule: African-first, diaspora-strong, globally extensible.
 * Adding a country later = data drop into the right array, not a rewrite.
 *
 * @module lib/geoNames
 */

// ─── TYPES ──────────────────────────────────────────────────────────────────

export type GeoRegion =
  | "NG"
  | "GH"
  | "KE"
  | "TZ"
  | "UG"
  | "ZA"
  | "ZW"
  | "ET"
  | "SN"
  | "CM"
  | "CD"
  | "EG"
  | "GLOBAL";

export type NameKind = "person" | "place" | "thing";

export interface GeoNameEntry {
  /** Canonical lowercase key for O(1) lookup */
  name: string;
  /** Title-case display for UI */
  display: string;
  /** Primary region of origin */
  region: GeoRegion;
  /** person | place | culturally rooted thing (e.g. Iroko, Oba) */
  kind: NameKind;
  /** Optional short meaning — parent/kid learning tooltip later */
  meaning?: string;
}

// ─── NIGERIA (Igbo-first, then Yoruba, Hausa, others) ───────────────────────

const NIGERIAN_NAMES: GeoNameEntry[] = [
  // Igbo — people
  { name: "chinedu", display: "Chinedu", region: "NG", kind: "person", meaning: "God leads" },
  { name: "chioma", display: "Chioma", region: "NG", kind: "person", meaning: "Good God" },
  { name: "amaka", display: "Amaka", region: "NG", kind: "person", meaning: "Beautiful" },
  { name: "eze", display: "Eze", region: "NG", kind: "person", meaning: "King" },
  { name: "obi", display: "Obi", region: "NG", kind: "person", meaning: "Heart / palace" },
  { name: "nnamdi", display: "Nnamdi", region: "NG", kind: "person", meaning: "My father lives" },
  { name: "uche", display: "Uche", region: "NG", kind: "person", meaning: "God's will" },
  { name: "ngozi", display: "Ngozi", region: "NG", kind: "person", meaning: "Blessing" },
  { name: "onyeka", display: "Onyeka", region: "NG", kind: "person", meaning: "Who is greater than God?" },
  { name: "chidi", display: "Chidi", region: "NG", kind: "person", meaning: "God exists" },
  { name: "adaeze", display: "Adaeze", region: "NG", kind: "person", meaning: "Princess" },
  { name: "chiamaka", display: "Chiamaka", region: "NG", kind: "person", meaning: "God is beautiful" },
  { name: "ikenna", display: "Ikenna", region: "NG", kind: "person", meaning: "Father's power" },
  { name: "obinna", display: "Obinna", region: "NG", kind: "person", meaning: "Father's heart" },
  { name: "nneka", display: "Nneka", region: "NG", kind: "person", meaning: "Mother is supreme" },
  { name: "chinonso", display: "Chinonso", region: "NG", kind: "person", meaning: "God is near" },
  { name: "ekene", display: "Ekene", region: "NG", kind: "person", meaning: "Praise" },
  { name: "ifeanyi", display: "Ifeanyi", region: "NG", kind: "person", meaning: "Nothing is impossible with God" },
  { name: "chukwuemeka", display: "Chukwuemeka", region: "NG", kind: "person", meaning: "God has done great" },
  { name: "nkechi", display: "Nkechi", region: "NG", kind: "person", meaning: "God's own" },
  { name: "somto", display: "Somto", region: "NG", kind: "person", meaning: "Join me in praise" },
  { name: "kosisochukwu", display: "Kosisochukwu", region: "NG", kind: "person", meaning: "As it pleases God" },
  { name: "oluchi", display: "Oluchi", region: "NG", kind: "person", meaning: "God's work" },
  { name: "chizoba", display: "Chizoba", region: "NG", kind: "person", meaning: "God protect" },
  // Yoruba — people
  { name: "tayo", display: "Tayo", region: "NG", kind: "person", meaning: "Worth of joy" },
  { name: "funke", display: "Funke", region: "NG", kind: "person", meaning: "Given to care for" },
  { name: "yetunde", display: "Yetunde", region: "NG", kind: "person", meaning: "Mother returns" },
  { name: "segun", display: "Segun", region: "NG", kind: "person", meaning: "Victorious" },
  { name: "kemi", display: "Kemi", region: "NG", kind: "person", meaning: "Care for me" },
  { name: "damilola", display: "Damilola", region: "NG", kind: "person", meaning: "Prosper me" },
  { name: "ade", display: "Ade", region: "NG", kind: "person", meaning: "Crown" },
  { name: "bola", display: "Bola", region: "NG", kind: "person", meaning: "Wealth meets honour" },
  { name: "tunde", display: "Tunde", region: "NG", kind: "person", meaning: "Return again" },
  { name: "yemi", display: "Yemi", region: "NG", kind: "person", meaning: "Befits me" },
  { name: "bukola", display: "Bukola", region: "NG", kind: "person", meaning: "Add to wealth" },
  { name: "folake", display: "Folake", region: "NG", kind: "person", meaning: "Cared for with wealth" },
  { name: "kayode", display: "Kayode", region: "NG", kind: "person", meaning: "He brings joy" },
  { name: "temitope", display: "Temitope", region: "NG", kind: "person", meaning: "Mine is gratitude" },
  // Hausa / Northern
  { name: "zainab", display: "Zainab", region: "NG", kind: "person", meaning: "Fragrant flower" },
  { name: "aminu", display: "Aminu", region: "NG", kind: "person", meaning: "Trustworthy" },
  { name: "aisha", display: "Aisha", region: "NG", kind: "person", meaning: "Living / prosperous" },
  { name: "ibrahim", display: "Ibrahim", region: "NG", kind: "person", meaning: "Father of nations" },
  { name: "fatima", display: "Fatima", region: "NG", kind: "person", meaning: "One who abstains" },
  { name: "musa", display: "Musa", region: "NG", kind: "person", meaning: "Drawn from water" },
  { name: "halima", display: "Halima", region: "NG", kind: "person", meaning: "Gentle" },
  { name: "usman", display: "Usman", region: "NG", kind: "person", meaning: "Wise" },
  // Titles & cultural things / places
  { name: "oba", display: "Oba", region: "NG", kind: "thing", meaning: "King / ruler" },
  { name: "iroko", display: "Iroko", region: "NG", kind: "thing", meaning: "Sacred hardwood tree" },
  { name: "lagos", display: "Lagos", region: "NG", kind: "place" },
  { name: "abuja", display: "Abuja", region: "NG", kind: "place" },
  { name: "enugu", display: "Enugu", region: "NG", kind: "place" },
  { name: "kano", display: "Kano", region: "NG", kind: "place" },
  { name: "ibadan", display: "Ibadan", region: "NG", kind: "place" },
  { name: "calabar", display: "Calabar", region: "NG", kind: "place" },
];

// ─── GHANA ──────────────────────────────────────────────────────────────────

const GHANAIAN_NAMES: GeoNameEntry[] = [
  { name: "kwame", display: "Kwame", region: "GH", kind: "person", meaning: "Born on Saturday" },
  { name: "kofi", display: "Kofi", region: "GH", kind: "person", meaning: "Born on Friday" },
  { name: "kwesi", display: "Kwesi", region: "GH", kind: "person", meaning: "Born on Sunday" },
  { name: "kwaku", display: "Kwaku", region: "GH", kind: "person", meaning: "Born on Wednesday" },
  { name: "yaw", display: "Yaw", region: "GH", kind: "person", meaning: "Born on Thursday" },
  { name: "ama", display: "Ama", region: "GH", kind: "person", meaning: "Born on Saturday" },
  { name: "akua", display: "Akua", region: "GH", kind: "person", meaning: "Born on Wednesday" },
  { name: "abena", display: "Abena", region: "GH", kind: "person", meaning: "Born on Tuesday" },
  { name: "afua", display: "Afua", region: "GH", kind: "person", meaning: "Born on Friday" },
  { name: "adwoa", display: "Adwoa", region: "GH", kind: "person", meaning: "Born on Monday" },
  { name: "efua", display: "Efua", region: "GH", kind: "person", meaning: "Born on Friday" },
  { name: "yaa", display: "Yaa", region: "GH", kind: "person", meaning: "Born on Thursday" },
  { name: "akosua", display: "Akosua", region: "GH", kind: "person", meaning: "Born on Sunday" },
  { name: "nkrumah", display: "Nkrumah", region: "GH", kind: "person" },
  { name: "accra", display: "Accra", region: "GH", kind: "place" },
  { name: "kumasi", display: "Kumasi", region: "GH", kind: "place" },
];

// ─── EAST AFRICA (KE, TZ, UG) ───────────────────────────────────────────────

const KENYAN_NAMES: GeoNameEntry[] = [
  { name: "jabari", display: "Jabari", region: "KE", kind: "person", meaning: "Brave" },
  { name: "zuri", display: "Zuri", region: "KE", kind: "person", meaning: "Beautiful" },
  { name: "amani", display: "Amani", region: "KE", kind: "person", meaning: "Peace" },
  { name: "nia", display: "Nia", region: "KE", kind: "person", meaning: "Purpose" },
  { name: "wairimu", display: "Wairimu", region: "KE", kind: "person" },
  { name: "otieno", display: "Otieno", region: "KE", kind: "person", meaning: "Born at night" },
  { name: "awan", display: "Awan", region: "KE", kind: "person" },
  { name: "njeri", display: "Njeri", region: "KE", kind: "person" },
  { name: "kamau", display: "Kamau", region: "KE", kind: "person" },
  { name: "wanjiku", display: "Wanjiku", region: "KE", kind: "person" },
  { name: "nairobi", display: "Nairobi", region: "KE", kind: "place" },
  { name: "mombasa", display: "Mombasa", region: "KE", kind: "place" },
];

const TANZANIAN_NAMES: GeoNameEntry[] = [
  { name: "baraka", display: "Baraka", region: "TZ", kind: "person", meaning: "Blessing" },
  { name: "neema", display: "Neema", region: "TZ", kind: "person", meaning: "Grace" },
  { name: "juma", display: "Juma", region: "TZ", kind: "person", meaning: "Born on Friday" },
  { name: "amina", display: "Amina", region: "TZ", kind: "person", meaning: "Trustworthy" },
  { name: "hassan", display: "Hassan", region: "TZ", kind: "person" },
  { name: "dar", display: "Dar", region: "TZ", kind: "place" },
  { name: "dodoma", display: "Dodoma", region: "TZ", kind: "place" },
];

const UGANDAN_NAMES: GeoNameEntry[] = [
  { name: "kato", display: "Kato", region: "UG", kind: "person" },
  { name: "nakato", display: "Nakato", region: "UG", kind: "person" },
  { name: "wasswa", display: "Wasswa", region: "UG", kind: "person" },
  { name: "babirye", display: "Babirye", region: "UG", kind: "person" },
  { name: "kampala", display: "Kampala", region: "UG", kind: "place" },
];

// ─── SOUTHERN AFRICA (ZA, ZW) ───────────────────────────────────────────────

const SOUTH_AFRICAN_NAMES: GeoNameEntry[] = [
  { name: "thabo", display: "Thabo", region: "ZA", kind: "person", meaning: "Joy" },
  { name: "sipho", display: "Sipho", region: "ZA", kind: "person", meaning: "Gift" },
  { name: "lesedi", display: "Lesedi", region: "ZA", kind: "person", meaning: "Light" },
  { name: "bongani", display: "Bongani", region: "ZA", kind: "person", meaning: "Be grateful" },
  { name: "nomvula", display: "Nomvula", region: "ZA", kind: "person", meaning: "Mother of rain" },
  { name: "themba", display: "Themba", region: "ZA", kind: "person", meaning: "Hope" },
  { name: "ayanda", display: "Ayanda", region: "ZA", kind: "person", meaning: "They are increasing" },
  { name: "lindiwe", display: "Lindiwe", region: "ZA", kind: "person", meaning: "We have waited" },
  { name: "mandla", display: "Mandla", region: "ZA", kind: "person", meaning: "Strength" },
  { name: "nomsa", display: "Nomsa", region: "ZA", kind: "person", meaning: "Mother of kindness" },
  { name: "johannesburg", display: "Johannesburg", region: "ZA", kind: "place" },
  { name: "cape", display: "Cape", region: "ZA", kind: "place" },
];

const ZIMBABWEAN_NAMES: GeoNameEntry[] = [
  { name: "tendai", display: "Tendai", region: "ZW", kind: "person", meaning: "Be thankful" },
  { name: "tinashe", display: "Tinashe", region: "ZW", kind: "person", meaning: "God is with us" },
  { name: "rufaro", display: "Rufaro", region: "ZW", kind: "person", meaning: "Happiness" },
  { name: "nyasha", display: "Nyasha", region: "ZW", kind: "person", meaning: "Grace" },
  { name: "tatenda", display: "Tatenda", region: "ZW", kind: "person", meaning: "Thank you" },
  { name: "harare", display: "Harare", region: "ZW", kind: "place" },
];

// ─── HORN, FRANCOPHONE, CENTRAL, NORTH ──────────────────────────────────────

const ETHIOPIAN_NAMES: GeoNameEntry[] = [
  { name: "abebe", display: "Abebe", region: "ET", kind: "person" },
  { name: "hana", display: "Hana", region: "ET", kind: "person", meaning: "Flower" },
  { name: "yared", display: "Yared", region: "ET", kind: "person" },
  { name: "selam", display: "Selam", region: "ET", kind: "person", meaning: "Peace" },
  { name: "addis", display: "Addis", region: "ET", kind: "place" },
];

const SENEGALESE_NAMES: GeoNameEntry[] = [
  { name: "fatou", display: "Fatou", region: "SN", kind: "person" },
  { name: "mamadou", display: "Mamadou", region: "SN", kind: "person" },
  { name: "aminata", display: "Aminata", region: "SN", kind: "person" },
  { name: "cheikh", display: "Cheikh", region: "SN", kind: "person" },
  { name: "dakar", display: "Dakar", region: "SN", kind: "place" },
];

const CAMEROONIAN_NAMES: GeoNameEntry[] = [
  { name: "ngono", display: "Ngono", region: "CM", kind: "person" },
  { name: "etienne", display: "Etienne", region: "CM", kind: "person" },
  { name: "yaounde", display: "Yaoundé", region: "CM", kind: "place" },
];

const CONGOLESE_NAMES: GeoNameEntry[] = [
  { name: "kabila", display: "Kabila", region: "CD", kind: "person" },
  { name: "mbote", display: "Mbote", region: "CD", kind: "person", meaning: "Hello (Lingala)" },
  { name: "kinshasa", display: "Kinshasa", region: "CD", kind: "place" },
];

const NORTH_AFRICAN_NAMES: GeoNameEntry[] = [
  { name: "youssef", display: "Youssef", region: "EG", kind: "person" },
  { name: "mariam", display: "Mariam", region: "EG", kind: "person" },
  { name: "omar", display: "Omar", region: "EG", kind: "person" },
  { name: "layla", display: "Layla", region: "EG", kind: "person", meaning: "Night" },
  { name: "cairo", display: "Cairo", region: "EG", kind: "place" },
];

// ─── DIASPORA + GLOBAL (AA, Caribbean, UK/EU, pan-African lit) ─────────────

const DIASPORA_AND_GLOBAL: GeoNameEntry[] = [
  // African-American / pan-African given names common in diaspora
  { name: "malik", display: "Malik", region: "GLOBAL", kind: "person", meaning: "King" },
  { name: "tariq", display: "Tariq", region: "GLOBAL", kind: "person", meaning: "Morning star" },
  { name: "imani", display: "Imani", region: "GLOBAL", kind: "person", meaning: "Faith" },
  { name: "jamal", display: "Jamal", region: "GLOBAL", kind: "person", meaning: "Beauty" },
  { name: "aaliyah", display: "Aaliyah", region: "GLOBAL", kind: "person" },
  { name: "keisha", display: "Keisha", region: "GLOBAL", kind: "person" },
  { name: "deshawn", display: "DeShawn", region: "GLOBAL", kind: "person" },
  { name: "latoya", display: "LaToya", region: "GLOBAL", kind: "person" },
  { name: "andre", display: "Andre", region: "GLOBAL", kind: "person" },
  { name: "maya", display: "Maya", region: "GLOBAL", kind: "person" },
  { name: "zora", display: "Zora", region: "GLOBAL", kind: "person", meaning: "Dawn" },
  { name: "marcus", display: "Marcus", region: "GLOBAL", kind: "person" },
  { name: "carmen", display: "Carmen", region: "GLOBAL", kind: "person" },
  // Caribbean
  { name: "anansi", display: "Anansi", region: "GLOBAL", kind: "thing", meaning: "Spider storyteller" },
  { name: "makeda", display: "Makeda", region: "GLOBAL", kind: "person" },
  { name: "shango", display: "Shango", region: "GLOBAL", kind: "thing" },
  // Cross-border / storybook African names often used globally
  { name: "asante", display: "Asante", region: "GLOBAL", kind: "person", meaning: "Thank you" },
  { name: "sade", display: "Sade", region: "GLOBAL", kind: "person" },
  { name: "kendra", display: "Kendra", region: "GLOBAL", kind: "person" },
  { name: "nyla", display: "Nyla", region: "GLOBAL", kind: "person" },
  { name: "zion", display: "Zion", region: "GLOBAL", kind: "place" },
];

// ─── MASTER REGISTRY ────────────────────────────────────────────────────────

const ALL_GEO_NAMES: GeoNameEntry[] = [
  ...NIGERIAN_NAMES,
  ...GHANAIAN_NAMES,
  ...KENYAN_NAMES,
  ...TANZANIAN_NAMES,
  ...UGANDAN_NAMES,
  ...SOUTH_AFRICAN_NAMES,
  ...ZIMBABWEAN_NAMES,
  ...ETHIOPIAN_NAMES,
  ...SENEGALESE_NAMES,
  ...CAMEROONIAN_NAMES,
  ...CONGOLESE_NAMES,
  ...NORTH_AFRICAN_NAMES,
  ...DIASPORA_AND_GLOBAL,
];

const GEO_NAMES_SET: Set<string> = new Set(
  ALL_GEO_NAMES.map((item) => item.name)
);

const GEO_NAMES_MAP: Map<string, GeoNameEntry> = new Map(
  ALL_GEO_NAMES.map((item) => [item.name, item])
);

// ─── PUBLIC API ─────────────────────────────────────────────────────────────

function cleanToken(token: string): string {
  return token.trim().toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
}

/**
 * True if token is a protected African / diaspora name, place, or cultural thing.
 */
export function isGeoName(token: string): boolean {
  if (!token) return false;
  return GEO_NAMES_SET.has(cleanToken(token));
}

/**
 * Full entry or null.
 */
export function getGeoNameDetails(token: string): GeoNameEntry | null {
  if (!token) return null;
  return GEO_NAMES_MAP.get(cleanToken(token)) ?? null;
}

/**
 * Title-case display; falls back to simple capitalisation.
 */
export function formatGeoNameDisplay(token: string): string {
  const details = getGeoNameDetails(token);
  if (details) return details.display;
  const clean = token.trim().replace(/^[^\w]+|[^\w]+$/g, "");
  if (!clean) return token;
  return clean.charAt(0).toUpperCase() + clean.slice(1).toLowerCase();
}

/**
 * All names for one region (for admin / future geo-adaptive story packs).
 */
export function getNamesByRegion(region: GeoRegion): GeoNameEntry[] {
  return ALL_GEO_NAMES.filter((item) => item.region === region);
}

/**
 * Filter by kind: person | place | thing.
 */
export function getNamesByKind(kind: NameKind): GeoNameEntry[] {
  return ALL_GEO_NAMES.filter((item) => item.kind === kind);
}

/**
 * Classify a token for Word Pocket UI:
 * - "name" if geo-protected person/place/thing OR capitalised proper pattern
 * - "word" otherwise
 */
export function classifyNameOrWord(
  token: string,
  startsWithCapital = false
): "name" | "word" {
  const details = getGeoNameDetails(token);
  if (details) return "name";
  if (startsWithCapital && cleanToken(token).length >= 2) return "name";
  return "word";
}

/**
 * Snapshot count — useful in tests / admin.
 */
export function getGeoNameRegistrySize(): number {
  return ALL_GEO_NAMES.length;
}