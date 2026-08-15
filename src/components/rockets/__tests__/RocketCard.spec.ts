import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import RocketCard from '../RocketCard.vue'
import type { Rocket } from '@/types/rocket'

const vuetify = createVuetify({
  components,
  directives,
})

const sampleRocket: Rocket = {
  id: 101,
  name: 'Falcon 9',
  fullName: 'Falcon 9 Block 5',
  description: 'A two-stage reusable rocket designed and manufactured by SpaceX.',
  launchCost: 67000000,
  countryCode: 'USA',
  maidenFlight: '2010-06-04',
  imageUrl: 'https://example.com/rocket.jpg',
  family: 'Falcon',
  active: true,
  reusable: true,
  isCustom: false,
}

describe('RocketCard.vue', () => {
  it('renders rocket full name, family, and description correctly', () => {
    const wrapper = mount(RocketCard, {
      props: { rocket: sampleRocket },
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Falcon 9 Block 5')
    expect(wrapper.text()).toContain('Falcon')
    expect(wrapper.text()).toContain('A two-stage reusable rocket')
    expect(wrapper.text()).toContain('Active')
  })

  it('renders retired status badge when active is false', () => {
    const wrapper = mount(RocketCard, {
      props: {
        rocket: {
          ...sampleRocket,
          active: false,
        },
      },
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Retired')
  })

  it('renders Custom badge when isCustom is true', () => {
    const wrapper = mount(RocketCard, {
      props: {
        rocket: {
          ...sampleRocket,
          isCustom: true,
        },
      },
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('Custom')
  })

  it('renders fallback description when description is null', () => {
    const wrapper = mount(RocketCard, {
      props: {
        rocket: {
          ...sampleRocket,
          description: null,
        },
      },
      global: {
        plugins: [vuetify],
        stubs: {
          RouterLink: true,
        },
      },
    })

    expect(wrapper.text()).toContain('No description available for this rocket.')
  })
})
