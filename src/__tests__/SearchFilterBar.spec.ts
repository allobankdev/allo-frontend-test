import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import SearchFilterBar from '@/components/SearchFilterBar.vue'

const vuetify = createVuetify()

function mountBar (props: Record<string, unknown> = {}) {
  return mount(SearchFilterBar, {
    props: {
      search: '',
      family: 'all',
      status: 'all',
      families: ['Falcon', 'Starship'],
      ...props,
    },
    global: { plugins: [vuetify] },
  })
}

describe('SearchFilterBar', () => {
  it('emits update:search when typing', async () => {
    const wrapper = mountBar()
    const input = wrapper.findComponent({ name: 'VTextField' })
    await input.setValue('falcon')
    expect(wrapper.emitted('update:search')).toBeTruthy()
    expect(wrapper.emitted('update:search')?.[0]).toEqual(['falcon'])
  })

  it('offers dynamic family options plus All', () => {
    const wrapper = mountBar({ families: ['Falcon', 'Starship'] })
    const selects = wrapper.findAllComponents({ name: 'VSelect' })
    const familySelect = selects[0]
    const items = familySelect.props('items') as Array<{ title: string, value: string }>
    expect(items.map(item => item.value)).toEqual(['all', 'Falcon', 'Starship'])
  })

  it('offers status options', () => {
    const wrapper = mountBar()
    const selects = wrapper.findAllComponents({ name: 'VSelect' })
    const statusSelect = selects[1]
    const items = statusSelect.props('items') as Array<{ title: string, value: string }>
    expect(items.map(item => item.value)).toEqual(['all', 'active', 'inactive'])
  })

  it('emits open-add when the Add button is clicked', async () => {
    const wrapper = mountBar()
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('open-add')).toBeTruthy()
  })
})
