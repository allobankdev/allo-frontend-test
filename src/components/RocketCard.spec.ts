import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import RocketCard from './RocketCard.vue'
import { vuetify } from '@/test/vuetify'
import { makeRocket } from '@/test/rocket-fixture'

function mountCard (overrides: Parameters<typeof makeRocket>[0] = {}) {
  return mount(RocketCard, {
    props: { rocket: makeRocket(overrides) },
    global: { plugins: [vuetify] },
  })
}

describe('RocketCard', () => {
  it('renders the rocket name and description', () => {
    const wrapper = mountCard({ full_name: 'Falcon 9', description: 'A reusable rocket.' })

    expect(wrapper.text()).toContain('Falcon 9')
    expect(wrapper.text()).toContain('A reusable rocket.')
  })

  it('falls back to a placeholder when there is no description', () => {
    const wrapper = mountCard({ description: null })

    expect(wrapper.text()).toContain('No description available.')
  })

  it('shows Active or Retired based on the active flag', () => {
    expect(mountCard({ active: true }).text()).toContain('Active')
    expect(mountCard({ active: false }).text()).toContain('Retired')
  })

  it('omits optional metadata that is not available', () => {
    const wrapper = mountCard({ manufacturer: null, launch_cost: null, maiden_flight: null })

    expect(wrapper.find('.mdi-earth').exists()).toBe(false)
    expect(wrapper.find('.mdi-currency-usd').exists()).toBe(false)
    expect(wrapper.find('.mdi-calendar').exists()).toBe(false)
  })

  it('emits click when the card is clicked', async () => {
    const wrapper = mountCard()

    await wrapper.trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })
})
