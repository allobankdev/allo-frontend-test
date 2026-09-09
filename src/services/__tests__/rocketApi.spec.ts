import { describe, expect, it } from 'vitest'
import { toRocket } from '../rocketApi'
import type { LauncherDto } from '@/types/rocket'

function makeDto (overrides: Partial<LauncherDto> = {}): LauncherDto {
  return {
    id: 133,
    full_name: 'Falcon 1',
    description: 'The Falcon 1 was the first launch vehicle developed by SpaceX.',
    launch_cost: '7000000',
    maiden_flight: '2006-03-24',
    image_url: 'https://example.com/falcon1.jpg',
    manufacturer: { country_code: 'USA' },
    ...overrides,
  }
}

describe('toRocket', () => {
  it('maps a fully-populated DTO to the domain model', () => {
    const rocket = toRocket(makeDto())

    expect(rocket).toEqual({
      id: '133',
      name: 'Falcon 1',
      description: 'The Falcon 1 was the first launch vehicle developed by SpaceX.',
      imageUrl: 'https://example.com/falcon1.jpg',
      costPerLaunch: 7_000_000,
      country: 'USA',
      firstFlight: '2006-03-24',
    })
  })

  it('stringifies a numeric id', () => {
    const rocket = toRocket(makeDto({ id: 522 }))
    expect(rocket.id).toBe('522')
    expect(typeof rocket.id).toBe('string')
  })

  it('converts launch_cost to a number, not a string', () => {
    const rocket = toRocket(makeDto({ launch_cost: '90000000' }))
    expect(rocket.costPerLaunch).toBe(90_000_000)
    expect(typeof rocket.costPerLaunch).toBe('number')
  })

  it('maps a null launch_cost to null, never NaN', () => {
    const rocket = toRocket(makeDto({ launch_cost: null }))
    expect(rocket.costPerLaunch).toBeNull()
    expect(Number.isNaN(rocket.costPerLaunch)).toBe(false)
  })

  it('maps a null maiden_flight to null', () => {
    const rocket = toRocket(makeDto({ maiden_flight: null }))
    expect(rocket.firstFlight).toBeNull()
  })

  it('maps a null image_url to null', () => {
    const rocket = toRocket(makeDto({ image_url: null }))
    expect(rocket.imageUrl).toBeNull()
  })

  it('falls back to null country when manufacturer is missing', () => {
    const rocket = toRocket(makeDto({ manufacturer: null }))
    expect(rocket.country).toBeNull()
  })

  it('falls back to null country when country_code itself is missing', () => {
    const rocket = toRocket(makeDto({ manufacturer: { country_code: null } }))
    expect(rocket.country).toBeNull()
  })
})
