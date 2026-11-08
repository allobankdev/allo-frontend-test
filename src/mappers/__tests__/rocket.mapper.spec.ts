import { describe, expect, it } from 'vitest'
import { createLocalRocket, isLocalRocketId, mapLauncherToRocket } from '@/mappers/rocket.mapper'
import type { LauncherConfigDto } from '@/types/api'

const falconHeavy: LauncherConfigDto = {
  id: 161,
  name: 'Falcon Heavy',
  full_name: 'Falcon Heavy',
  family: 'Falcon',
  description: 'Heavy-lift launch vehicle.',
  image_url: 'https://example.com/fh.jpg',
  launch_cost: '90000000',
  maiden_flight: '2018-02-06',
  manufacturer: { id: 121, name: 'SpaceX', country_code: 'USA' },
  active: true,
  reusable: true,
  length: 70,
  diameter: 12.2,
  launch_mass: 1420,
  leo_capacity: 63800,
  gto_capacity: 26700,
  to_thrust: 22819,
  total_launch_count: 11,
  successful_launches: 11,
  failed_launches: 0,
  wiki_url: 'https://en.wikipedia.org/wiki/Falcon_Heavy',
}

describe('mapLauncherToRocket', () => {
  it('maps every README field', () => {
    const rocket = mapLauncherToRocket(falconHeavy)

    expect(rocket).toMatchObject({
      id: '161',
      name: 'Falcon Heavy',
      description: 'Heavy-lift launch vehicle.',
      imageUrl: 'https://example.com/fh.jpg',
      launchCost: 90_000_000,
      countryCodes: ['USA'],
      firstFlight: '2018-02-06',
      isActive: true,
      isReusable: true,
      source: 'api',
    })
    expect(rocket.specs.heightMeters).toBe(70)
    expect(rocket.launches.successful).toBe(11)
  })

  it('normalizes missing values to null', () => {
    const rocket = mapLauncherToRocket({
      id: 528,
      name: 'Starship',
      full_name: null,
      description: '   ',
      image_url: null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: null,
    })

    expect(rocket.name).toBe('Starship')
    expect(rocket.description).toBeNull()
    expect(rocket.imageUrl).toBeNull()
    expect(rocket.launchCost).toBeNull()
    expect(rocket.firstFlight).toBeNull()
    expect(rocket.countryCodes).toEqual([])
    expect(rocket.manufacturer).toBeNull()
    expect(rocket.isActive).toBeNull()
    expect(rocket.specs.heightMeters).toBeNull()
  })

  it('rejects malformed cost, date, and URL values', () => {
    const rocket = mapLauncherToRocket({
      id: 1,
      name: 'Broken',
      launch_cost: 'n/a',
      maiden_flight: 'sometime',
      image_url: 'javascript:alert(1)',
    })

    expect(rocket.launchCost).toBeNull()
    expect(rocket.firstFlight).toBeNull()
    expect(rocket.imageUrl).toBeNull()
  })

  it('splits comma-separated country codes', () => {
    const rocket = mapLauncherToRocket({
      id: 2,
      name: 'Joint',
      manufacturer: { id: 9, name: 'ESA', country_code: 'fra, DEU' },
    })

    expect(rocket.countryCodes).toEqual(['FRA', 'DEU'])
  })
})

describe('createLocalRocket', () => {
  it('builds a local rocket with a unique local id', () => {
    const input = {
      name: '  Nova  ',
      description: null,
      imageUrl: null,
      launchCost: 1000,
      countryCode: 'IDN',
      firstFlight: '2030-01-01',
      isActive: true,
      isReusable: false,
    }
    const first = createLocalRocket(input)
    const second = createLocalRocket(input)

    expect(first.name).toBe('Nova')
    expect(first.source).toBe('local')
    expect(first.countryCodes).toEqual(['IDN'])
    expect(isLocalRocketId(first.id)).toBe(true)
    expect(first.id).not.toBe(second.id)
  })
})
