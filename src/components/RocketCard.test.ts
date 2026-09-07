import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import RocketCard from './RocketCard.vue'
import type { Rocket } from '@/types/rocket'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const rocket: Rocket = {
  id: 1,
  full_name: 'Falcon 9',
  description: 'Reusable orbital rocket',
  image_url: null,
  launch_cost: 67000000,
  maiden_flight: '2010-06-04',
  manufacturer: {
    country_code: 'US',
  },
}

function mountComponent(customRocket: Rocket = rocket) {
  return mount(RocketCard, {
    props: {
      rocket: customRocket,
    },
    global: {
      plugins: [vuetify],
      stubs: {
        RouterLink: true,
      },
    },
  })
}

describe('RocketCard', () => {
  it('renders rocket name and description', () => {
    const wrapper = mountComponent()

    expect(wrapper.text()).toContain('Falcon 9')
    expect(wrapper.text()).toContain('Reusable orbital rocket')
  })

  it('shows fallback description when description is missing', () => {
    const wrapper = mountComponent({
      ...rocket,
      description: null,
    })

    expect(wrapper.text()).toContain('No description available.')
  })
})