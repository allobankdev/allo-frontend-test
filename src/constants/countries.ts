/**
 * ISO 3166-1 alpha-3 → display name.
 * `Intl.DisplayNames` only understands alpha-2 regions, and the API returns alpha-3,
 * so we keep a small lookup of space-faring countries. Unknown codes show as-is.
 */
export const COUNTRY_NAMES: Readonly<Record<string, string>> = {
  ARE: 'United Arab Emirates',
  AUS: 'Australia',
  BRA: 'Brazil',
  CAN: 'Canada',
  CHN: 'China',
  DEU: 'Germany',
  ESP: 'Spain',
  FRA: 'France',
  GBR: 'United Kingdom',
  IND: 'India',
  IRN: 'Iran',
  ISR: 'Israel',
  ITA: 'Italy',
  JPN: 'Japan',
  KAZ: 'Kazakhstan',
  KOR: 'South Korea',
  LUX: 'Luxembourg',
  NLD: 'Netherlands',
  NOR: 'Norway',
  NZL: 'New Zealand',
  PRK: 'North Korea',
  RUS: 'Russia',
  SWE: 'Sweden',
  UKR: 'Ukraine',
  USA: 'United States',
}

export const COUNTRY_OPTIONS = Object.entries(COUNTRY_NAMES)
  .map(([value, title]) => ({ value, title }))
  .sort((a, b) => a.title.localeCompare(b.title))
