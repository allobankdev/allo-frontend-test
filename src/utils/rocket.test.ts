import { describe, expect, it } from 'vitest'
import type { Rocket } from '@/types/rocket'
import {
  filterRockets,
  formatCountry,
  formatFirstFlight,
  formatLaunchCost,
  getRequestErrorMessage,
  getRocketDescription,
  getRocketFamily,
  getRocketName,
} from '@/utils/rocket'

const rockets: Rocket[] = [
  {
    id: 1,
    full_name: 'Falcon 9 Block 5',
    description: 'Reusable orbital launch vehicle',
    image_url: 'https://example.com/falcon.jpg',
    launch_cost: '67000000',
    maiden_flight: '2018-05-11',
    manufacturer: { country_code: 'USA' },
  },
  {
    id: 2,
    full_name: 'Super Heavy Prototype',
    description: 'Starship booster test vehicle',
    image_url: null,
    launch_cost: null,
    maiden_flight: null,
    manufacturer: null,
  },
  {
    id: 3,
    full_name: null,
    description: null,
    image_url: null,
    launch_cost: 'invalid',
    maiden_flight: 'invalid',
    manufacturer: { country_code: null },
  },
]

describe('rocket catalog helpers', () => {
  it('filters by text across name and description', () => {
    expect(filterRockets(rockets, 'reusable', 'all')).toEqual([rockets[0]])
    expect(filterRockets(rockets, 'booster', 'all')).toEqual([rockets[1]])
  })

  it('groups Super Heavy with the Starship family', () => {
    expect(getRocketFamily(rockets[1])).toBe('starship')
    expect(filterRockets(rockets, '', 'starship')).toEqual([rockets[1]])
  })

  it('formats known launch values for display', () => {
    expect(formatLaunchCost('67000000')).toBe('$67,000,000')
    expect(formatFirstFlight('2018-05-11')).toBe('11 May 2018')
    expect(formatCountry(rockets[0])).toBe('USA')
  })

  it('provides stable labels for missing or invalid values', () => {
    expect(getRocketName(rockets[2])).toBe('Unnamed rocket')
    expect(getRocketDescription(rockets[2])).toBe('No description is available for this rocket.')
    expect(formatLaunchCost(rockets[2].launch_cost)).toBe('Not available')
    expect(formatFirstFlight(rockets[2].maiden_flight)).toBe('Not available')
    expect(formatCountry(rockets[2])).toBe('Not available')
  })

  it('turns browser network failures into an actionable message', () => {
    expect(getRequestErrorMessage(new TypeError('Failed to fetch')))
      .toBe('Check your connection and try again.')
  })
})
