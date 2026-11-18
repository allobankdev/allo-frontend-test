import { describe, expect, it } from 'vitest'
import { fromNewRocketInput, toRocket } from '@/types/mappers'
import type { ApiLauncherConfig } from '@/api/launchLibrary'

const complete: ApiLauncherConfig = {
  id: 133,
  full_name: 'Falcon 1',
  description: '  The Falcon 1 was the first launch vehicle  ',
  image_url: 'https://example.com/falcon1.jpg',
  launch_cost: 7000000,
  maiden_flight: '2006-03-24',
  manufacturer: { country_code: 'USA' },
}

describe('toRocket', () => {
  it('maps a complete API launcher', () => {
    expect(toRocket(complete)).toEqual({
      id: 'api-133',
      name: 'Falcon 1',
      description: 'The Falcon 1 was the first launch vehicle',
      imageUrl: 'https://example.com/falcon1.jpg',
      launchCost: 7000000,
      country: 'USA',
      firstFlight: '2006-03-24',
      source: 'api',
    })
  })

  it('turns missing optional values into null', () => {
    const rocket = toRocket({
      ...complete,
      description: null,
      image_url: null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: null,
    })

    expect(rocket.description).toBeNull()
    expect(rocket.imageUrl).toBeNull()
    expect(rocket.launchCost).toBeNull()
    expect(rocket.firstFlight).toBeNull()
    expect(rocket.country).toBeNull()
  })

  it('treats an empty image URL as missing', () => {
    expect(toRocket({ ...complete, image_url: '' }).imageUrl).toBeNull()
  })
})

describe('fromNewRocketInput', () => {
  it('creates a unique local rocket for each input', () => {
    const input = {
      name: 'Local',
      description: null,
      imageUrl: null,
      launchCost: null,
      country: null,
      firstFlight: null,
    }
    const a = fromNewRocketInput(input)
    const b = fromNewRocketInput(input)

    expect(a.source).toBe('local')
    expect(a.id.startsWith('local-')).toBe(true)
    expect(a.id).not.toBe(b.id)
  })
})
