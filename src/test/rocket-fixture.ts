import type { Rocket } from '@/types/rocket'

export function makeRocket (overrides: Partial<Rocket> = {}): Rocket {
  return {
    id: 1,
    full_name: 'Test Rocket',
    description: null,
    image_url: null,
    launch_cost: null,
    maiden_flight: null,
    active: true,
    reusable: null,
    family: null,
    variant: null,
    min_stage: null,
    max_stage: null,
    length: null,
    diameter: null,
    launch_mass: null,
    leo_capacity: null,
    gto_capacity: null,
    total_launch_count: null,
    successful_launches: null,
    failed_launches: null,
    successful_landings: null,
    failed_landings: null,
    wiki_url: null,
    manufacturer: null,
    ...overrides,
  }
}
