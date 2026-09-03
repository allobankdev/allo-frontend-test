interface CountryInfo {
  code: string
  name: string
  flag: string
}

export const COUNTRIES: CountryInfo[] = [
  { code: 'USA', name: 'United States', flag: '🇺🇸' },
  { code: 'RUS', name: 'Russia', flag: '🇷🇺' },
  { code: 'CHN', name: 'China', flag: '🇨🇳' },
  { code: 'FRA', name: 'France', flag: '🇫🇷' },
  { code: 'JPN', name: 'Japan', flag: '🇯🇵' },
  { code: 'IND', name: 'India', flag: '🇮🇳' },
  { code: 'GBR', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'DEU', name: 'Germany', flag: '🇩🇪' },
  { code: 'ITA', name: 'Italy', flag: '🇮🇹' },
  { code: 'NZL', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'KOR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ISR', name: 'Israel', flag: '🇮🇱' },
  { code: 'BRA', name: 'Brazil', flag: '🇧🇷' },
  { code: 'UKR', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'IDN', name: 'Indonesia', flag: '🇮🇩' },
]

export function formatCountry(code: string | null): string {
  if (!code) return 'Not available'
  const country = COUNTRIES.find((c) => c.code === code.toUpperCase())
  return country ? `${country.flag} ${country.name}` : code
}