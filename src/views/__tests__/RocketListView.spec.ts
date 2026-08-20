import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import RocketListView from '@/views/RocketListView.vue'

vi.mock('@/components/RocketFormModal.vue', () => ({ default: { template: '<div />' } }))
vi.mock('@/components/LoadingSkeleton.vue', () => ({
  default: { template: '<div data-testid="loading-skeleton" />' },
}))
vi.mock('@/components/ErrorState.vue', () => ({
  default: {
    template:
      '<div data-testid="error-state"><button @click="$emit(\'retry\')">Retry</button></div>',
    emits: ['retry'],
  },
}))
vi.mock('@/components/EmptyState.vue', () => ({
  default: { template: '<div data-testid="empty-state" />' },
}))
vi.mock('@/components/RocketCard.vue', () => ({
  default: {
    props: ['rocket'],
    template: '<a data-testid="rocket-card">{{ rocket.name }}</a>',
  },
}))
vi.mock('@/components/RocketFilter.vue', () => ({
  default: {
    template:
      '<input data-testid="filter-input" @input="$emit(\'update\', $event.target.value)" />',
    emits: ['update'],
  },
}))

vi.mock('@/services/rocket.service', () => ({
  fetchRocketList: vi.fn(),
  fetchRocketById: vi.fn(),
}))

import { fetchRocketList } from '@/services/rocket.service'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/rockets', component: RocketListView }],
})

const mockRockets = [
  {
    id: 1,
    name: 'Falcon 9',
    description: 'A reusable rocket',
    imageUrl: null,
    launchCost: null,
    country: 'USA',
    maidenFlight: null,
    isLocal: false,
  },
  {
    id: 2,
    name: 'Falcon Heavy',
    description: 'Triple core rocket',
    imageUrl: null,
    launchCost: null,
    country: 'USA',
    maidenFlight: null,
    isLocal: false,
  },
]

describe('RocketListView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('shows loading skeleton while fetching', async () => {
    vi.mocked(fetchRocketList).mockReturnValue(new Promise(() => {}))
    const wrapper = mount(RocketListView, {
      global: { plugins: [router] },
    })
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="loading-skeleton"]').exists()).toBe(true)
  })

  it('shows rocket cards after successful fetch', async () => {
    vi.mocked(fetchRocketList).mockResolvedValueOnce(mockRockets)
    const wrapper = mount(RocketListView, {
      global: { plugins: [router] },
    })
    await flushPromises()

    const cards = wrapper.findAll('[data-testid="rocket-card"]')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toBe('Falcon 9')
  })

  it('shows error state on fetch failure', async () => {
    vi.mocked(fetchRocketList).mockRejectedValueOnce(new Error('Network error'))
    const wrapper = mount(RocketListView, {
      global: { plugins: [router] },
    })
    await flushPromises()

    expect(wrapper.find('[data-testid="error-state"]').exists()).toBe(true)
  })

  it('filters rockets by name without calling API', async () => {
    vi.mocked(fetchRocketList).mockResolvedValueOnce(mockRockets)
    const wrapper = mount(RocketListView, {
      global: { plugins: [router] },
    })
    await flushPromises()

    const filter = wrapper.find('[data-testid="filter-input"]')
    await filter.setValue('heavy')
    await filter.trigger('input')
    await wrapper.vm.$nextTick()

    const cards = wrapper.findAll('[data-testid="rocket-card"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].text()).toBe('Falcon Heavy')
    expect(fetchRocketList).toHaveBeenCalledTimes(1)
  })

  it('shows empty state when filter matches nothing', async () => {
    vi.mocked(fetchRocketList).mockResolvedValueOnce(mockRockets)
    const wrapper = mount(RocketListView, {
      global: { plugins: [router] },
    })
    await flushPromises()

    const filter = wrapper.find('[data-testid="filter-input"]')
    await filter.setValue('sputnik')
    await filter.trigger('input')
    await wrapper.vm.$nextTick()

    expect(wrapper.find('[data-testid="empty-state"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="rocket-card"]')).toHaveLength(0)
  })

  it('retries the fetch when Retry is triggered', async () => {
    vi.mocked(fetchRocketList)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockRockets)

    const wrapper = mount(RocketListView, {
      global: { plugins: [router] },
    })
    await flushPromises()

    await wrapper.find('[data-testid="error-state"] button').trigger('click')
    await flushPromises()

    expect(fetchRocketList).toHaveBeenCalledTimes(2)
    expect(wrapper.findAll('[data-testid="rocket-card"]')).toHaveLength(2)
  })
})
