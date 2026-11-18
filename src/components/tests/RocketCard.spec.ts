// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RocketCard from '../rocket/RocketCard.vue'
import type { Rocket } from '@/types/rocket'

const stubs = {
    VCard: { template: '<div><slot /></div>' },
    VCardItem: { template: '<div><slot /></div>' },
    VCardTitle: { template: '<div><slot /></div>' },
    VCardSubtitle: { template: '<div><slot /></div>' },
    VCardText: { template: '<div><slot /></div>' },
    VCardActions: { template: '<div><slot /></div>' },
    VChip: { template: '<span><slot /></span>' },
    VSpacer: { template: '<span />' },
    VBtn: { template: '<a><slot /></a>' },
    RocketImage: true,
}

function makeRocket(overrides: Partial<Rocket> = {}): Rocket {
    return {
        id: '164',
        name: 'Falcon 9 Block 5',
        description: 'The workhorse of the SpaceX fleet.',
        imageUrl: 'https://example.com/falcon9.jpg',
        costPerLaunch: 52_000_000,
        country: 'USA',
        firstFlight: '2018-05-11',
        active: true,
        isLocal: false,
        ...overrides,
    }
}

describe('RocketCard', () => {
    it('renders the name, description and status', () => {
        const wrapper = mount(RocketCard, {
            props: { rocket: makeRocket() },
            global: { stubs },
        })

        expect(wrapper.text()).toContain('Falcon 9 Block 5')
        expect(wrapper.text()).toContain('The workhorse of the SpaceX fleet.')
        expect(wrapper.text()).toContain('Active')
    })

    it('shows the fallbacks when optional data is missing', () => {
        const wrapper = mount(RocketCard, {
            props: {
                rocket: makeRocket({ description: '', country: null, active: false }),
            },
            global: { stubs },
        })

        expect(wrapper.text()).toContain('No description available.')
        expect(wrapper.text()).toContain('Unknown country')
        expect(wrapper.text()).toContain('Retired')
    })

    it('marks locally added rockets', () => {
        const wrapper = mount(RocketCard, {
            props: { rocket: makeRocket({ isLocal: true }) },
            global: { stubs },
        })

        expect(wrapper.text()).toContain('Added by you')
    })
})
