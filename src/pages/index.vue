<!--
  Route: /
  Fungsi: Halaman 1 (List Roket). Ngambil data roket SpaceX pas halaman dibuka, ada fitur
          search & filter (All / With Cost / Custom), handle loading/error/retry, sama
          tombol buat buka modal tambah roket.
  Dipakai di:
    - Otomatis kebaca oleh vue-router lewat unplugin-vue-router
-->

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AddRocketDialog from '@/components/AddRocketDialog.vue'
import RocketCard from '@/components/RocketCard.vue'
import StatusView from '@/components/StatusView.vue'
import { useRocketStore } from '@/stores/rocketStore'

const { rockets, status, error, loadRockets, addRocket } = useRocketStore()

const search = ref('')
const filterMode = ref<'all' | 'with-cost' | 'custom'>('all')
const isAddOpen = ref(false)
let abortController: AbortController | null = null

const filterTabs = [
  { label: 'ALL', value: 'all' },
  { label: 'WITH COST', value: 'with-cost' },
  { label: 'CUSTOM', value: 'custom' },
] as const

const filteredRockets = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  return rockets.value.filter((rocket) => {
    if (filterMode.value === 'with-cost' && rocket.launchCost === null) return false
    if (filterMode.value === 'custom' && !rocket.isLocal) return false
    if (!keyword) return true

    return (
      rocket.name.toLowerCase().includes(keyword) ||
      (rocket.description?.toLowerCase().includes(keyword) ?? false)
    )
  })
})

onMounted(() => {
  if (status.value !== 'idle') return
  abortController = new AbortController()
  loadRockets(abortController.signal)
})

onUnmounted(() => {
  abortController?.abort()
})
</script>

<template>
  <div>
    <!-- Mission Control Topbar -->
    <nav class="hud-nav">
      <v-container
        max-width="1160"
        class="py-3 d-flex align-center justify-space-between"
      >
        <div class="d-flex align-center ga-3">
          <div class="brand-badge">
            <v-icon
              icon="mdi-rocket-launch"
              size="16"
              color="primary"
            />
          </div>
          <div class="d-flex align-center ga-2">
            <span class="font-mono nav-brand">SPACEX // ORBITAL FLEET</span>
          </div>
        </div>

        <div class="d-flex align-center ga-4">
          <v-btn
            color="primary"
            variant="flat"
            size="small"
            prepend-icon="mdi-plus"
            class="px-4"
            @click="isAddOpen = true"
          >
            Add Vehicle
          </v-btn>
        </div>
      </v-container>
    </nav>

    <v-container
      max-width="1160"
      class="py-8 py-md-12"
    >
      <!-- Hero Banner -->
      <header class="hero-panel pb-7 mb-7">
        <div class="d-flex flex-wrap align-end justify-space-between ga-4">
          <div>
            <h1 class="font-display hero-title mb-2">
              Orbital Launch Vehicles
            </h1>
            <p class="hero-subtitle mb-0">
              Technical manifest of SpaceX boosters, prototypes, and heavy-lift launch systems.
            </p>
          </div>

          <div
            v-if="status === 'success'"
            class="hero-counter d-none d-sm-flex flex-column align-end"
          >
            <span class="font-mono counter-label">VEHICLES TRACKED</span>
            <span class="font-mono counter-value">
              {{ String(filteredRockets.length).padStart(2, '0') }}
            </span>
          </div>
        </div>
      </header>

      <!-- Telemetry Filter Console -->
      <div class="control-deck pa-3 mb-8 d-flex flex-wrap align-center justify-space-between ga-3">
        <div class="search-wrap">
          <v-text-field
            v-model="search"
            placeholder="Search vehicle designation or mission description..."
            prepend-inner-icon="mdi-magnify"
            bg-color="#0E0F11"
            density="compact"
            hide-details
            clearable
          />
        </div>

        <div
          class="filter-group"
          role="tablist"
          aria-label="Filter rockets"
        >
          <button
            v-for="tab in filterTabs"
            :key="tab.value"
            type="button"
            role="tab"
            :aria-selected="filterMode === tab.value"
            class="filter-tab font-mono"
            :class="{ 'is-active': filterMode === tab.value }"
            @click="filterMode = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- UI States -->
      <StatusView
        v-if="status === 'loading'"
        type="loading"
        variant="grid"
      />

      <StatusView
        v-else-if="status === 'error'"
        type="error"
        :message="error ?? undefined"
        show-retry
        @retry="loadRockets()"
      />

      <template v-else-if="status === 'success'">
        <v-sheet
          v-if="filteredRockets.length === 0"
          rounded="lg"
          class="pa-12 text-center empty-sheet"
        >
          <v-icon
            icon="mdi-radar"
            size="34"
            class="mb-3"
            style="color: var(--cyan)"
          />
          <p class="font-display text-subtitle-1 font-weight-bold mb-1">
            No Vehicles on Radar
          </p>
          <p
            class="text-body-2 mb-5"
            style="color: var(--ink-secondary)"
          >
            No rockets match your current query or filter selection.
          </p>
          <v-btn
            variant="outlined"
            color="primary"
            size="small"
            @click="search = ''; filterMode = 'all'"
          >
            Reset Console
          </v-btn>
        </v-sheet>

        <v-row v-else>
          <v-col
            v-for="rocket in filteredRockets"
            :key="rocket.id"
            cols="12"
            sm="6"
            md="4"
          >
            <RocketCard :rocket="rocket" />
          </v-col>
        </v-row>
      </template>

      <AddRocketDialog
        v-model="isAddOpen"
        @submit="addRocket"
      />
    </v-container>
  </div>
</template>

<style scoped>
.hud-nav {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(14, 15, 17, 0.86);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--line);
}

.brand-badge {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background: var(--accent-soft);
  border: 1px solid rgba(234, 88, 12, 0.3);
  display: grid;
  place-items: center;
}

.nav-brand {
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--ink);
}

.status-pulse {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--accent);
}

.nav-telemetry,
.counter-label {
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--ink-muted);
}

.hero-panel {
  border-bottom: 1px solid var(--line);
}

.mission-tag {
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  color: var(--ink-secondary);
  background: var(--hull);
  border: 1px solid var(--line);
  padding: 4px 10px;
  border-radius: 4px;
}

.hero-title {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.06;
  color: var(--ink);
}

.hero-subtitle {
  font-size: 0.96rem;
  color: var(--ink-secondary);
  max-width: 56ch;
}

.counter-value {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.1;
  color: var(--ink);
}

.control-deck {
  background-color: var(--hull);
  border: 1px solid var(--line);
  border-radius: 10px;
}

.search-wrap {
  flex: 1 1 280px;
  max-width: 480px;
}

.filter-group {
  display: inline-flex;
  background-color: var(--void);
  border: 1px solid var(--line);
  padding: 3px;
  border-radius: 7px;
  gap: 3px;
}

.filter-tab {
  border: 0;
  background: transparent;
  color: var(--ink-muted);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  padding: 7px 14px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.16s ease, color 0.16s ease;
}

.filter-tab:hover {
  color: var(--ink);
}

.filter-tab.is-active {
  background-color: var(--console);
  color: var(--ink);
  box-shadow: inset 0 0 0 1px var(--line-active);
}

.empty-sheet {
  background-color: var(--hull);
  border: 1px solid var(--line);
}
</style>