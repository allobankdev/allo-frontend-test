import { describe, expect, it } from 'vitest'
import {
  createEmptyRocketForm,
  rocketFormRules,
  toNewRocketInput,
  type RocketFormValues,
} from '../rocketForm'

/** Menjalankan semua aturan satu field dan mengembalikan error pertama, atau `true`. */
function validate (field: keyof RocketFormValues, value: string): true | string {
  for (const rule of rocketFormRules[field]) {
    const result = rule(value)
    if (result !== true) return result
  }
  return true
}

describe('rocketFormRules', () => {
  it('mewajibkan nama dan membatasi panjangnya', () => {
    expect(validate('name', '   ')).toBe('Nama rocket wajib diisi.')
    expect(validate('name', 'a'.repeat(101))).toContain('maksimal 100')
    expect(validate('name', 'Falcon X')).toBe(true)
  })

  it('menerima nama tepat 100 karakter dan menghitung panjang setelah trim', () => {
    expect(validate('name', 'a'.repeat(100))).toBe(true)
    expect(validate('name', `  ${'a'.repeat(100)}  `)).toBe(true)
    expect(validate('name', 'a')).toBe(true)
  })

  it('menolak URL dengan skema berbahaya atau tanpa host', () => {
    expect(validate('imageUrl', 'javascript:alert(1)')).not.toBe(true)
    expect(validate('imageUrl', 'http://')).not.toBe(true)
    expect(validate('imageUrl', ' http://example.com/a.png ')).toBe(true)
  })

  it('menolak biaya tak hingga dan menerima angka sangat besar yang masih terbatas', () => {
    expect(validate('launchCost', '1e400')).not.toBe(true)
    expect(validate('launchCost', 'Infinity')).not.toBe(true)
    expect(validate('launchCost', '1e20')).toBe(true)
  })

  it('menolak kode negara 1 huruf', () => {
    expect(validate('countryCode', 'U')).not.toBe(true)
    expect(validate('countryCode', '  id  ')).toBe(true)
  })

  it('menolak bulan di luar 01–12', () => {
    expect(validate('maidenFlight', '2024-13-01')).not.toBe(true)
    expect(validate('maidenFlight', '2024-00-10')).not.toBe(true)
  })

  it('menolak tanggal yang tidak ada di kalender', () => {
    expect(validate('maidenFlight', '2023-02-29')).not.toBe(true)
    expect(validate('maidenFlight', '2023-02-30')).not.toBe(true)
    expect(validate('maidenFlight', '2023-04-31')).not.toBe(true)
    expect(validate('maidenFlight', '2023-12-31')).toBe(true)
  })

  it('membolehkan field opsional dikosongkan', () => {
    for (const field of ['description', 'imageUrl', 'launchCost', 'countryCode', 'maidenFlight'] as const) {
      expect(validate(field, '')).toBe(true)
    }
  })

  it('hanya menerima URL http atau https', () => {
    expect(validate('imageUrl', 'https://example.com/a.jpg')).toBe(true)
    expect(validate('imageUrl', 'ftp://example.com/a.jpg')).not.toBe(true)
    expect(validate('imageUrl', 'bukan url')).not.toBe(true)
  })

  it('menolak biaya negatif atau bukan angka', () => {
    expect(validate('launchCost', '1500000')).toBe(true)
    expect(validate('launchCost', '0')).toBe(true)
    expect(validate('launchCost', '-1')).not.toBe(true)
    expect(validate('launchCost', 'mahal')).not.toBe(true)
  })

  it('menerima kode negara 2–3 huruf saja', () => {
    expect(validate('countryCode', 'idn')).toBe(true)
    expect(validate('countryCode', 'US')).toBe(true)
    expect(validate('countryCode', 'INDO')).not.toBe(true)
    expect(validate('countryCode', 'U1')).not.toBe(true)
  })

  it('menolak tanggal yang tidak valid', () => {
    expect(validate('maidenFlight', '2024-02-29')).toBe(true)
    expect(validate('maidenFlight', '29-02-2024')).not.toBe(true)
  })
})

describe('toNewRocketInput', () => {
  it('merapikan nilai dan mengubah tipe data', () => {
    expect(toNewRocketInput({
      name: '  Garuda I  ',
      description: 'Rocket uji coba',
      imageUrl: ' https://example.com/garuda.jpg ',
      launchCost: '2500000',
      countryCode: 'idn',
      maidenFlight: '2024-08-17',
    })).toEqual({
      name: 'Garuda I',
      description: 'Rocket uji coba',
      imageUrl: 'https://example.com/garuda.jpg',
      launchCost: 2500000,
      countryCode: 'IDN',
      maidenFlight: '2024-08-17',
    })
  })

  it('mengubah field opsional yang kosong menjadi null', () => {
    expect(toNewRocketInput({ ...createEmptyRocketForm(), name: 'Garuda I' })).toEqual({
      name: 'Garuda I',
      description: null,
      imageUrl: null,
      launchCost: null,
      countryCode: null,
      maidenFlight: null,
    })
  })
})
