import { describe, it, expect } from 'vitest'
import { mapApiRocket } from '@/mappers/rocket.mapper'
import type { LauncherConfigApi } from '@/types/rocket-api'

const fullRaw: LauncherConfigApi = {
  id: 101,
  full_name: 'Falcon 9 Block 5',
  description: 'A two-stage rocket designed for reliable reuse.',
  image_url: 'https://example.com/falcon9.jpg',
  launch_cost: '62000000',
  maiden_flight: '2018-05-11',
  manufacturer: {
    id: 1,
    name: 'SpaceX',
    country_code: 'USA',
  },
}

describe('mapApiRocket', () => {
  it('maps a complete API object to a normalized Rocket', () => {
    const rocket = mapApiRocket(fullRaw)

    expect(rocket.id).toBe(101)
    expect(rocket.name).toBe('Falcon 9 Block 5')
    expect(rocket.description).toBe('A two-stage rocket designed for reliable reuse.')
    expect(rocket.imageUrl).toBe('https://example.com/falcon9.jpg')
    expect(rocket.launchCost).toBe('62000000')
    expect(rocket.country).toBe('USA')
    expect(rocket.maidenFlight).toBe('2018-05-11')
    expect(rocket.isLocal).toBe(false)
  })

  it('coerces null full_name to "Unknown Rocket"', () => {
    const rocket = mapApiRocket({ ...fullRaw, full_name: null })
    expect(rocket.name).toBe('Unknown Rocket')
  })

  it('maps null image_url to null', () => {
    const rocket = mapApiRocket({ ...fullRaw, image_url: null })
    expect(rocket.imageUrl).toBeNull()
  })

  it('maps null description to null', () => {
    const rocket = mapApiRocket({ ...fullRaw, description: null })
    expect(rocket.description).toBeNull()
  })

  it('maps null launch_cost to null', () => {
    const rocket = mapApiRocket({ ...fullRaw, launch_cost: null })
    expect(rocket.launchCost).toBeNull()
  })

  it('maps null maiden_flight to null', () => {
    const rocket = mapApiRocket({ ...fullRaw, maiden_flight: null })
    expect(rocket.maidenFlight).toBeNull()
  })

  it('safely accesses country_code when manufacturer is null', () => {
    const rocket = mapApiRocket({ ...fullRaw, manufacturer: null })
    expect(rocket.country).toBeNull()
  })

  it('always sets isLocal to false for API rockets', () => {
    const rocket = mapApiRocket(fullRaw)
    expect(rocket.isLocal).toBe(false)
  })
})
