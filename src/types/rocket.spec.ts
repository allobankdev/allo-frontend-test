import { describe, expect, it } from 'vitest'
import { mapRawRocket, type RawRocket } from '@/types/rocket'

describe('mapRawRocket', () => {
  it('maps a fully populated raw rocket correctly', () => {
    const raw: RawRocket = {
      id: 1,
      full_name: 'Falcon 9',
      description: 'A reusable rocket.',
      image_url: 'https://example.com/falcon9.jpg',
      launch_cost: 50000000,
      maiden_flight: '2010-06-04',
      manufacturer: {
        country_code: 'USA',
      },
    }

    const result = mapRawRocket(raw)

    expect(result).toEqual({
      id: 1,
      fullName: 'Falcon 9',
      description: 'A reusable rocket.',
      imageUrl: 'https://example.com/falcon9.jpg',
      launchCost: 50000000,
      countryCode: 'USA',
      maidenFlight: '2010-06-04',
      isLocal: false,
    })
  })

  it('falls back to null for missing optional fields', () => {
    const raw: RawRocket = {
      id: 2,
      full_name: 'Starship',
      description: null,
      image_url: null,
      launch_cost: null,
      maiden_flight: null,
      manufacturer: null,
    }

    const result = mapRawRocket(raw)

    expect(result.description).toBeNull()
    expect(result.imageUrl).toBeNull()
    expect(result.launchCost).toBeNull()
    expect(result.countryCode).toBeNull()
    expect(result.maidenFlight).toBeNull()
    expect(result.isLocal).toBe(false)
  })

  it('handles launch_cost given as a numeric string', () => {
    const raw: RawRocket = {
      id: 3,
      full_name: 'Falcon Heavy',
      description: null,
      image_url: null,
      launch_cost: '90000000',
      maiden_flight: null,
      manufacturer: null,
    }

    const result = mapRawRocket(raw)

    expect(result.launchCost).toBe(90000000)
  })

  it('falls back to null when launch_cost is not a valid number', () => {
    const raw: RawRocket = {
      id: 4,
      full_name: 'Unknown Rocket',
      description: null,
      image_url: null,
      launch_cost: 'n/a',
      maiden_flight: null,
      manufacturer: null,
    }

    const result = mapRawRocket(raw)

    expect(result.launchCost).toBeNull()
  })

  it('handles a missing manufacturer object entirely (undefined)', () => {
    const raw: RawRocket = {
      id: 5,
      full_name: 'No Manufacturer',
      description: null,
      image_url: null,
      launch_cost: null,
      maiden_flight: null,
    }

    const result = mapRawRocket(raw)

    expect(result.countryCode).toBeNull()
  })
})