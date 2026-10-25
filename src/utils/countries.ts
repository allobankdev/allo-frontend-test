/**
 * utils/countries.ts
 *
 * The Launch Library 2 API reports `manufacturer.country_code` as an
 * ISO 3166-1 **alpha-3** code (e.g. "USA"), which `Intl.DisplayNames`
 * can't resolve on its own (it expects alpha-2). This is a small,
 * hand-maintained lookup covering the launch-provider nations that
 * actually show up in Launch Library data, with a plain-code fallback
 * for anything not listed so unknown codes still render fine.
 */

interface CountryInfo {
  name: string
  flag: string
}

const COUNTRIES: Record<string, CountryInfo> = {
  USA: { name: 'United States', flag: '🇺🇸' },
  RUS: { name: 'Russia', flag: '🇷🇺' },
  CHN: { name: 'China', flag: '🇨🇳' },
  FRA: { name: 'France', flag: '🇫🇷' },
  JPN: { name: 'Japan', flag: '🇯🇵' },
  IND: { name: 'India', flag: '🇮🇳' },
  GBR: { name: 'United Kingdom', flag: '🇬🇧' },
  DEU: { name: 'Germany', flag: '🇩🇪' },
  ITA: { name: 'Italy', flag: '🇮🇹' },
  NZL: { name: 'New Zealand', flag: '🇳🇿' },
  KAZ: { name: 'Kazakhstan', flag: '🇰🇿' },
  KOR: { name: 'South Korea', flag: '🇰🇷' },
  ISR: { name: 'Israel', flag: '🇮🇱' },
  IRN: { name: 'Iran', flag: '🇮🇷' },
  PRK: { name: 'North Korea', flag: '🇰🇵' },
  BRA: { name: 'Brazil', flag: '🇧🇷' },
  UKR: { name: 'Ukraine', flag: '🇺🇦' },
  IDN: { name: 'Indonesia', flag: '🇮🇩' },
  ESA: { name: 'European Space Agency', flag: '🇪🇺' },
}

/** Returns a human-readable "Flag Name" label for an alpha-3 country
 *  code, falling back to the raw code (or "Not available") when the
 *  code is missing or unrecognized. */
export function formatCountry (code: string | null | undefined): string {
  if (!code) return 'Not available'
  const info = COUNTRIES[code.toUpperCase()]
  return info ? `${info.flag} ${info.name}` : code
}
