import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import RocketCard from '@/components/RocketCard.vue'
import { ROCKET_PLACEHOLDER_IMAGE } from '@/composables/useRocketImage'
import { MISSING_DESCRIPTION_LABEL } from '@/utils/format'
import type { Rocket } from '@/types/rocket'

const vuetify = createVuetify()
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/rockets/:id', component: { template: '<div />' } },
  ],
})

function mountCard (rocket: Rocket) {
  return mount(RocketCard, {
    props: { rocket },
    global: { plugins: [vuetify, router] },
  })
}

const baseRocket: Rocket = {
  id: 164,
  full_name: 'Falcon 9 Block 5',
  description: 'Reusable two-stage rocket',
  family: 'Falcon',
  active: true,
  image_url: 'https://example.com/f9.jpg',
  launch_cost: '52000000',
  maiden_flight: '2018-05-11',
  manufacturer: { name: 'SpaceX', country_code: 'USA' },
}

function imageSrc (wrapper: ReturnType<typeof mountCard>): string | undefined {
  return wrapper.findComponent({ name: 'VImg' }).props('src') as string | undefined
}

describe('RocketCard', () => {
  it('renders image, name and description', () => {
    const wrapper = mountCard(baseRocket)
    expect(wrapper.text()).toContain('Falcon 9 Block 5')
    expect(wrapper.text()).toContain('Reusable two-stage rocket')
    expect(imageSrc(wrapper)).toBe('https://example.com/f9.jpg')
  })

  it('falls back to the placeholder when image_url is null (e.g. id 522)', () => {
    const wrapper = mountCard({ ...baseRocket, id: 522, image_url: null })
    expect(imageSrc(wrapper)).toBe(ROCKET_PLACEHOLDER_IMAGE)
  })

  it('falls back to the placeholder for known-broken id 522 even with a url', () => {
    const wrapper = mountCard({ ...baseRocket, id: 522 })
    expect(imageSrc(wrapper)).toBe(ROCKET_PLACEHOLDER_IMAGE)
  })

  it('shows a fallback description when missing', () => {
    const wrapper = mountCard({ ...baseRocket, description: null })
    expect(wrapper.text()).toContain(MISSING_DESCRIPTION_LABEL)
  })
})
