import type { NewRocketInput } from '@/stores/rocket'

/** Nilai mentah form tambah rocket. Semua berupa string karena berasal dari input teks. */
export interface RocketFormValues {
  name: string
  description: string
  imageUrl: string
  launchCost: string
  countryCode: string
  maidenFlight: string
}

/** Aturan validasi gaya Vuetify: `true` jika valid, atau pesan error. */
export type ValidationRule = (value: string) => true | string

const NAME_MAX_LENGTH = 100

/**
 * Membuat nilai awal form yang kosong.
 *
 * @returns Objek form baru dengan semua field kosong.
 */
export function createEmptyRocketForm (): RocketFormValues {
  return {
    name: '',
    description: '',
    imageUrl: '',
    launchCost: '',
    countryCode: '',
    maidenFlight: '',
  }
}

function isBlank (value: string): boolean {
  return value.trim() === ''
}

function isHttpUrl (value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isValidDate (value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime())
}

/** Aturan validasi per field form tambah rocket. Field selain nama boleh dikosongkan. */
export const rocketFormRules: Record<keyof RocketFormValues, ValidationRule[]> = {
  name: [
    value => !isBlank(value) || 'Nama rocket wajib diisi.',
    value => value.trim().length <= NAME_MAX_LENGTH || `Nama maksimal ${NAME_MAX_LENGTH} karakter.`,
  ],
  description: [],
  imageUrl: [
    value => isBlank(value) || isHttpUrl(value.trim()) || 'URL harus diawali http:// atau https://.',
  ],
  launchCost: [
    value => isBlank(value) || (Number.isFinite(Number(value)) && Number(value) >= 0)
      || 'Biaya harus berupa angka 0 atau lebih.',
  ],
  countryCode: [
    value => isBlank(value) || /^[A-Za-z]{2,3}$/.test(value.trim())
      || 'Kode negara terdiri dari 2–3 huruf, misalnya USA.',
  ],
  maidenFlight: [
    value => isBlank(value) || isValidDate(value) || 'Tanggal tidak valid.',
  ],
}

/**
 * Mengubah nilai form yang sudah valid menjadi data rocket baru.
 * Field kosong menjadi `null` agar tampil dengan fallback yang sama seperti data API.
 *
 * @param values - Nilai form tambah rocket.
 * @returns Data siap disimpan lewat `addRocket`.
 */
export function toNewRocketInput (values: RocketFormValues): NewRocketInput {
  const optional = (value: string) => (isBlank(value) ? null : value.trim())
  const launchCost = optional(values.launchCost)

  return {
    name: values.name.trim(),
    description: optional(values.description),
    imageUrl: optional(values.imageUrl),
    launchCost: launchCost === null ? null : Number(launchCost),
    countryCode: optional(values.countryCode)?.toUpperCase() ?? null,
    maidenFlight: optional(values.maidenFlight),
  }
}
