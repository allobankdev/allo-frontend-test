import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { mount } from '@vue/test-utils'
import RocketDetailPage from './[id].vue'
import { vuetify } from '@/test/vuetify'
import { useRocketsStore } from '@/stores/rockets'
import { makeRocket } from '@/test/rocket-fixture'

async function mountPage (id = '1', configureStore: (store: ReturnType<typeof useRocketsStore>) => void = store => { store.loaded = true }) {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { render: () => null } },
      { path: '/rockets/:id', component: RocketDetailPage },
    ],
  })
  router.push(`/rockets/${id}`)
  await router.isReady()

  const store = useRocketsStore()
  configureStore(store)

  const wrapper = mount(RocketDetailPage, {
    global: { plugins: [vuetify, router] },
  })
  await wrapper.vm.$nextTick()

  return { router, wrapper, store }
}

describe('RocketDetailPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('shows an empty state when the rocket is not in the store', async () => {
    const { wrapper } = await mountPage('999')

    expect(wrapper.text()).toContain('Rocket not found')
  })

  it('renders the matched rocket name, description and detail rows', async () => {
    const { wrapper } = await mountPage('1', store => {
      store.loaded = true
      store.rockets = [makeRocket({
        id: 1,
        full_name: 'Falcon 9',
        description: 'A reusable rocket.',
        family: 'Falcon',
        active: true,
      })]
    })

    expect(wrapper.text()).toContain('Falcon 9')
    expect(wrapper.text()).toContain('A reusable rocket.')
    expect(wrapper.text()).toContain('Family')
    expect(wrapper.text()).toContain('Active')
  })

  it('omits detail rows whose value is unavailable', async () => {
    const { wrapper } = await mountPage('1', store => {
      store.loaded = true
      store.rockets = [makeRocket({ id: 1, family: null })]
    })

    expect(wrapper.text()).not.toContain('Family')
  })
})
