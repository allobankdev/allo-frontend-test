import { describe, expect, it } from 'vitest'
import { mapLauncherToRocket } from '../rocketMapper'
import type { LauncherConfigDto } from '@/types/launchLibrary'

function makeDto (overrides: Partial<LauncherConfigDto> = {}): LauncherConfigDto {
  return {
    id: 164,
    full_name: 'Falcon 9 Block 5',
    description: 'Roket dua tahap yang dapat digunakan ulang.',
    image_url: 'https://example.com/falcon9.jpg',
    launch_cost: '52000000',
    maiden_flight: '2018-05-11',
    manufacturer: { country_code: 'USA' },
    ...overrides,
  }
}

describe('mapLauncherToRocket', () => {
  it('memetakan semua field sesuai tabel requirement', () => {
    expect(mapLauncherToRocket(makeDto())).toEqual({
      id: '164',
      name: 'Falcon 9 Block 5',
      description: 'Roket dua tahap yang dapat digunakan ulang.',
      imageUrl: 'https://example.com/falcon9.jpg',
      launchCost: 52000000,
      countryCode: 'USA',
      maidenFlight: '2018-05-11',
    })
  })

  it('mempertahankan null untuk launch_cost, maiden_flight, dan image_url', () => {
    const rocket = mapLauncherToRocket(
      makeDto({ launch_cost: null, maiden_flight: null, image_url: null }),
    )

    expect(rocket.launchCost).toBeNull()
    expect(rocket.maidenFlight).toBeNull()
    expect(rocket.imageUrl).toBeNull()
  })

  it('mengubah string kosong menjadi null', () => {
    const rocket = mapLauncherToRocket(
      makeDto({ description: '  ', image_url: '', launch_cost: '', maiden_flight: '' }),
    )

    expect(rocket.description).toBeNull()
    expect(rocket.imageUrl).toBeNull()
    expect(rocket.launchCost).toBeNull()
    expect(rocket.maidenFlight).toBeNull()
  })

  it.each(['bukan-angka', '-5'])('menganggap launch_cost "%s" tidak valid', cost => {
    expect(mapLauncherToRocket(makeDto({ launch_cost: cost })).launchCost).toBeNull()
  })

  it('memberi countryCode null jika manufacturer kosong', () => {
    expect(mapLauncherToRocket(makeDto({ manufacturer: null })).countryCode).toBeNull()
    expect(
      mapLauncherToRocket(makeDto({ manufacturer: { country_code: null } })).countryCode,
    ).toBeNull()
  })
})
