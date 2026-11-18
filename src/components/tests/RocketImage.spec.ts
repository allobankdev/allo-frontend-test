// @vitest-environment jsdom
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import RocketImage from '../rocket/RocketImage.vue'
import { nextTick } from 'vue'

const stubs = {
    VImg: { name: 'VImg', template: '<div class="image" />' },
    VIcon: { template: '<i />' },
}

describe('RocketImage', () => {
    it('renders the image when a source is provided', () => {
        const wrapper = mount(RocketImage, {
            props: { src: 'https://example.com/falcon9.jpg', alt: 'Falcon 9' },
            global: { stubs },
        })

        expect(wrapper.find('.image').exists()).toBe(true)
        expect(wrapper.text()).not.toContain('No image available')
    })

    it('shows the fallback when the rocket has no image', () => {
        const wrapper = mount(RocketImage, {
            props: { src: null, alt: 'Falcon 9' },
            global: { stubs },
        })

        expect(wrapper.find('.image').exists()).toBe(false)
        expect(wrapper.text()).toContain('No image available')
    })

    it('falls back when the remote image fails to load', async () => {
        const wrapper = mount(RocketImage, {
            props: { src: 'https://example.com/broken.jpg', alt: 'Falcon 9' },
            global: { stubs },
        })

        wrapper.findComponent({ name: 'VImg' }).vm.$emit('error')
        await nextTick()

        expect(wrapper.find('.image').exists()).toBe(false)
        expect(wrapper.text()).toContain('No image available')
    })

    it('retries the image when the source changes', async () => {
        const wrapper = mount(RocketImage, {
            props: { src: 'https://example.com/broken.jpg', alt: 'Falcon 9' },
            global: { stubs },
        })

        wrapper.findComponent({ name: 'VImg' }).vm.$emit('error')
        await nextTick()
        await wrapper.setProps({ src: 'https://example.com/working.jpg' })

        expect(wrapper.find('.image').exists()).toBe(true)
    })
})
