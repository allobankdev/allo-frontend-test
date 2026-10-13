<template>
  <div class="app-shell">
    <SiteHeader />

    <main class="page-wrap">
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">
            <span>✦</span> A universe of launchers
          </p>
          <h1>Reach for<br>the <em>next frontier.</em></h1>
          <p class="hero-subtitle">
            Explore the SpaceX launchers built to carry big ideas beyond our world.
          </p>
          <a
            class="hero-link"
            href="#launchers"
          >Explore the fleet <span aria-hidden="true">↓</span></a>
        </div>
        <div
          class="hero-art"
          aria-hidden="true"
        >
          <div class="hero-planet-ring" />
          <div class="hero-planet" />
          <div class="hero-moon moon-one" />
          <div class="hero-moon moon-two" />
          <div class="hero-star star-one">
            ✦
          </div>
          <div class="hero-star star-two">
            ✧
          </div>
          <img
            class="hero-rocket-art"
            :src="heroRocket"
            alt=""
          >
          <span class="hero-art-label">SPACEX · EXPLORATION SERIES</span>
        </div>
        <div class="hero-index">
          <span>SPACE X · LAUNCHER ARCHIVE</span><span>01 / 13</span>
        </div>
      </section>

      <section
        id="launchers"
        class="catalog"
        aria-labelledby="catalog-title"
      >
        <div class="section-head">
          <div>
            <p class="eyebrow muted">
              The collection
            </p>
            <h2 id="catalog-title">
              Launchers <span class="count">{{ filteredRockets.length.toString().padStart(2, '0') }}</span>
            </h2>
          </div>
          <button
            class="action-button"
            type="button"
            @click="showAddDialog = true"
          >
            ＋ Add a rocket
          </button>
        </div>

        <div class="toolbar">
          <label class="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              v-model="query"
              type="search"
              placeholder="Search rockets..."
              aria-label="Search rockets"
            >
          </label>
          <div
            class="filters"
            aria-label="Filter launchers by country"
          >
            <button
              v-for="filter in filters"
              :key="filter.value"
              type="button"
              :class="{ active: activeFilter === filter.value }"
              :aria-pressed="activeFilter === filter.value"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <StateMessage
          v-if="state.loading"
          loading
          title="Loading the collection"
          message="Reaching for the stars..."
        />
        <StateMessage
          v-else-if="state.error"
          title="We lost the signal"
          :message="state.error"
          @retry="fetchRockets"
        />
        <section
          v-else-if="!filteredRockets.length"
          class="state-message"
        >
          <span
            class="state-icon"
            aria-hidden="true"
          >⌕</span>
          <h2>No rockets found</h2>
          <p>Try another search or add a new rocket to the collection.</p>
        </section>
        <div
          v-else
          class="rocket-grid"
          aria-live="polite"
        >
          <RocketCard
            v-for="(rocket, index) in filteredRockets"
            :key="rocket.id"
            :rocket="rocket"
            :index="index"
          />
        </div>
      </section>
    </main>

    <SiteFooter back-to-top />

    <AddRocketDialog
      v-if="showAddDialog"
      @close="showAddDialog = false"
      @add="addLocalRocket"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import RocketCard from '@/components/RocketCard.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import SiteHeader from '@/components/SiteHeader.vue'
import StateMessage from '@/components/StateMessage.vue'
import heroRocket from '@/assets/hero-rocket.svg'
import { useRockets } from '@/composables/useRockets'
import type { Rocket } from '@/types/rocket'
import { filterRockets, type RocketCountryFilter } from '@/utils/rocket'

const { rockets, state, fetchRockets, addRocket } = useRockets()
const query = ref('')
const activeFilter = ref<RocketCountryFilter>('all')
const showAddDialog = ref(false)
const filters: { label: string; value: RocketCountryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'United States', value: 'USA' },
  { label: 'Other', value: 'other' },
]

const filteredRockets = computed(() => filterRockets(
  rockets.value,
  query.value,
  activeFilter.value,
))

function addLocalRocket(details: { name: string; description: string; image: string }) {
  const rocket: Rocket = {
    id: `local-${globalThis.crypto?.randomUUID?.() ?? Date.now().toString(36)}`,
    full_name: details.name,
    description: details.description || null,
    image_url: details.image || null,
    isLocal: true,
  }

  addRocket(rocket)
  showAddDialog.value = false
}

onMounted(() => {
  if (!state.loaded) void fetchRockets()
})
</script>
