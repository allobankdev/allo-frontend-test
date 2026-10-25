import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { flushPromises, mount } from '@vue/test-utils'
import IndexPage from './index.vue'
import RocketCard from '@/components/RocketCard.vue'
import { vuetify } from '@/test/vuetify'
import { useRocketsStore } from '@/stores/rockets'
import { makeRocket } from '@/test/rocket-fixture'

async function mountPage (configureStore: (store: ReturnType<typeof useRocketsStore>) => void = () => {}) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: IndexPage },
      { path: '/rockets/:id', component: { render: () => null } },
    ],
  })
  router.push('/')
  await router.isReady()

  const store = useRocketsStore()
  store.loaded = true
  configureStore(store)

  const wrapper = mount(IndexPage, {
    global: { plugins: [vuetify, router] },
  })
  await wrapper.vm.$nextTick()

  return { router, wrapper, store }
}

describe('IndexPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows a loading spinner while rockets are loading', async () => {
    const { wrapper } = await mountPage(store => {
      store.loaded = true
      store.loading = true
    })

    expect(wrapper.find('.v-progress-circular').exists()).toBe(true)
  })

  it('shows an error alert with a retry action when loading fails', async () => {
    const { wrapper } = await mountPage(store => { store.error = true })

    expect(wrapper.text()).toContain('Failed to load rockets.')
  })

  it('renders a card per rocket once loaded', async () => {
    const { wrapper } = await mountPage(store => {
      store.loaded = true
      store.rockets = [makeRocket({ id: 1, full_name: 'Falcon 1' }), makeRocket({ id: 2, full_name: 'Falcon 9' })]
    })

    expect(wrapper.text()).toContain('Falcon 1')
    expect(wrapper.text()).toContain('Falcon 9')
  })

  it('shows an empty state when no rockets match the filters', async () => {
    const { wrapper } = await mountPage(store => {
      store.loaded = true
      store.rockets = []
    })

    expect(wrapper.text()).toContain('No rockets found')
  })

  it('navigates to the rocket detail page when a card is clicked', async () => {
    const { router, wrapper } = await mountPage(store => {
      store.loaded = true
      store.rockets = [makeRocket({ id: 42, full_name: 'Falcon Heavy' })]
    })

    const pushSpy = vi.spyOn(router, 'push')
    const card = wrapper.findComponent(RocketCard)
    card.vm.$emit('click')
    await pushSpy.mock.results[0].value
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/rockets/42')
  })
})
