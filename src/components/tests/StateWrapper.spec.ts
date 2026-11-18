// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import StateWrapper from '../StateWrapper.vue'

const stubs = {
    VRow: { template: '<div><slot /></div>' },
    VCol: { template: '<div><slot /></div>' },
    VSkeletonLoader: { template: '<div class="skeleton" />' },
    VAlert: { template: '<div class="alert"><slot /></div>' },
    VBtn: { template: '<button><slot /></button>' },
}

describe('StateWrapper', () => {
    it('shows skeletons while loading', () => {
        const wrapper = mount(StateWrapper, {
            props: { status: 'loading', skeletonCount: 2 },
            global: { stubs },
        })

        expect(wrapper.findAll('.skeleton')).toHaveLength(2)
        expect(wrapper.find('.alert').exists()).toBe(false)
    })

    it('shows skeletons before the first request runs', () => {
        const wrapper = mount(StateWrapper, {
            props: { status: 'idle' },
            global: { stubs },
        })

        expect(wrapper.findAll('.skeleton').length).toBeGreaterThan(0)
    })

    it('shows the error message with a working retry button', async () => {
        const wrapper = mount(StateWrapper, {
            props: { status: 'error', error: 'Launch Library is down.' },
            global: { stubs },
        })

        expect(wrapper.text()).toContain('Launch Library is down.')

        await wrapper.find('button').trigger('click')

        expect(wrapper.emitted('retry')).toHaveLength(1)
    })

    it('renders the default fallback error copy', () => {
        const wrapper = mount(StateWrapper, {
            props: { status: 'error' },
            global: { stubs },
        })

        expect(wrapper.text()).toContain('Something went wrong while loading data.')
    })

    it('renders the slot on success', () => {
        const wrapper = mount(StateWrapper, {
            props: { status: 'success' },
            slots: { default: '<p class="content">Ready</p>' },
            global: { stubs },
        })

        expect(wrapper.find('.content').text()).toBe('Ready')
        expect(wrapper.find('.alert').exists()).toBe(false)
    })
})
