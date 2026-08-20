import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RocketFilter from '@/components/RocketFilter.vue'

describe('RocketFilter', () => {
  it('renders a labeled search input', () => {
    const wrapper = mount(RocketFilter)
    const input = wrapper.find('input[type="search"]')
    const label = wrapper.find('label')

    expect(input.exists()).toBe(true)
    expect(label.exists()).toBe(true)
    expect(label.attributes('for')).toBe('rocket-search')
    expect(input.attributes('id')).toBe('rocket-search')
  })

  it('emits an update event when the user types', async () => {
    const wrapper = mount(RocketFilter)
    const input = wrapper.find('input')

    await input.setValue('falcon')

    const emitted = wrapper.emitted('update')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual(['falcon'])
  })

  it('shows a clear button when text is entered', async () => {
    const wrapper = mount(RocketFilter)

    expect(wrapper.find('button').exists()).toBe(false)

    await wrapper.find('input').setValue('test')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('clears the query and emits empty string when clear is clicked', async () => {
    const wrapper = mount(RocketFilter)
    const input = wrapper.find('input')

    await input.setValue('dragon')
    await wrapper.find('button').trigger('click')

    const emitted = wrapper.emitted('update') as string[][]
    const lastEmit = emitted[emitted.length - 1]
    expect(lastEmit).toEqual([''])
  })
})
