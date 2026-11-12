import type { LauncherConfigDto } from '@/types/launchLibrary'
import type { Rocket } from '@/types/rocket'

/** Mengubah string kosong atau berisi spasi saja menjadi `null`. */
function toNullableText (value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** Mengubah biaya berbentuk string angka menjadi number, atau `null` jika tidak valid. */
function toLaunchCost (value: string | null | undefined): number | null {
  const text = toNullableText(value)
  if (text === null) return null
  const cost = Number(text)
  return Number.isFinite(cost) && cost >= 0 ? cost : null
}

/**
 * Memetakan data launcher dari API ke model `Rocket`.
 * Field yang kosong atau tidak valid dinormalisasi menjadi `null`.
 *
 * @param dto - Objek launcher dari Launch Library 2 API v2.2.0.
 * @returns Rocket siap pakai untuk UI.
 */
export function mapLauncherToRocket (dto: LauncherConfigDto): Rocket {
  return {
    id: String(dto.id),
    name: dto.full_name,
    description: toNullableText(dto.description),
    imageUrl: toNullableText(dto.image_url),
    launchCost: toLaunchCost(dto.launch_cost),
    countryCode: toNullableText(dto.manufacturer?.country_code),
    maidenFlight: toNullableText(dto.maiden_flight),
  }
}
