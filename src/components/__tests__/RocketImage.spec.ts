import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createVuetify } from 'vuetify'
import RocketImage from '../RocketImage.vue'

function mountImage (src: string | null) {
  return mount(RocketImage, {
    props: { src, alt: 'Falcon 9' },
    global: { plugins: [createVuetify()] },
  })
}

describe('RocketImage', () => {
  it('menampilkan placeholder jika URL gambar null', () => {
    const wrapper = mountImage(null)

    expect(wrapper.text()).toContain('Gambar tidak tersedia')
    expect(wrapper.find('[role="img"]').attributes('aria-label')).toBe(
      'Gambar Falcon 9 tidak tersedia',
    )
  })

  it('beralih ke placeholder saat gambar gagal dimuat, lalu reset saat URL berganti', async () => {
    const wrapper = mountImage('https://example.com/rusak.jpg')
    expect(wrapper.text()).not.toContain('Gambar tidak tersedia')

    wrapper.findComponent({ name: 'VImg' }).vm.$emit('error')
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Gambar tidak tersedia')

    await wrapper.setProps({ src: 'https://example.com/baru.jpg' })
    expect(wrapper.text()).not.toContain('Gambar tidak tersedia')
  })
})
