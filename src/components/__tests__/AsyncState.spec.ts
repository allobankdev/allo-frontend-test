import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import AsyncState from '../AsyncState.vue'
import type { LoadStatus } from '@/stores/rocket'

function mountState (status: LoadStatus, error: string | null = null) {
  return mount(AsyncState, {
    props: { status, error },
    slots: { default: '<p class="konten">Data siap</p>' },
    global: { plugins: [createVuetify()] },
  })
}

describe('AsyncState', () => {
  it.each<LoadStatus>(['idle', 'loading'])('menampilkan loading saat status %s', status => {
    const wrapper = mountState(status)

    expect(wrapper.find('[role="status"]').exists()).toBe(true)
    expect(wrapper.find('.konten').exists()).toBe(false)
  })

  it('menampilkan pesan error dan memicu retry saat tombol ditekan', async () => {
    const wrapper = mountState('error', 'Server sedang bermasalah.')

    expect(wrapper.text()).toContain('Server sedang bermasalah.')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('retry')).toHaveLength(1)
    expect(wrapper.find('.konten').exists()).toBe(false)
  })

  it('merender slot saat status success', () => {
    const wrapper = mountState('success')

    expect(wrapper.find('.konten').text()).toBe('Data siap')
  })
})
