import { describe, expect, it } from 'vitest'
import type { RocketRaw } from '@/types/rocket'
import { toRocket } from '../rockets'

/** A complete payload, then each test overrides only the field it cares about. */
function makeRaw(overrides: Partial<RocketRaw> = {}): RocketRaw {
  return {
    id: 164,
    full_name: 'Falcon 9 Block 5',
    description: 'The workhorse of the SpaceX fleet.',
    image_url: 'https://example.com/falcon9.jpg',
    launch_cost: '52000000',
    maiden_flight: '2018-05-11',
    active: true,
    manufacturer: { country_code: 'USA' },
    ...overrides,
  }
}

describe('toRocket', () => {
  it('maps the API payload onto the UI model', () => {
    expect(toRocket(makeRaw())).toEqual({
      id: '164',
      name: 'Falcon 9 Block 5',
      description: 'The workhorse of the SpaceX fleet.',
      imageUrl: 'https://example.com/falcon9.jpg',
      costPerLaunch: 52000000,
      country: 'USA',
      firstFlight: '2018-05-11',
      active: true,
      isLocal: false,
    })
  })

  it('converts the numeric id to a string', () => {
    expect(toRocket(makeRaw({ id: 528 })).id).toBe('528')
  })

  it('parses launch_cost from string to number', () => {
    expect(toRocket(makeRaw({ launch_cost: '90000000' })).costPerLaunch).toBe(90000000)
  })

  it('keeps missing cost, flight and image as null', () => {
    const rocket = toRocket(makeRaw({ launch_cost: null, maiden_flight: null, image_url: null }))

    expect(rocket.costPerLaunch).toBeNull()
    expect(rocket.firstFlight).toBeNull()
    expect(rocket.imageUrl).toBeNull()
  })

  it('falls back to a readable name and empty description instead of null', () => {
    const rocket = toRocket(makeRaw({ full_name: '   ', description: null }))

    expect(rocket.name).toBe('Unnamed rocket')
    expect(rocket.description).toBe('')
  })

  it('treats blank strings as missing', () => {
    const rocket = toRocket(makeRaw({ image_url: '', launch_cost: '', manufacturer: null }))

    expect(rocket.imageUrl).toBeNull()
    expect(rocket.costPerLaunch).toBeNull()
    expect(rocket.country).toBeNull()
  })

  it('rejects a non-numeric cost instead of producing NaN', () => {
    expect(toRocket(makeRaw({ launch_cost: 'negotiable' })).costPerLaunch).toBeNull()
  })
})


