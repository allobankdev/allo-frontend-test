<template>
  <div class="fleet-page">
    <section class="hero">
      <div class="u-container hero__grid">
        <div class="hero__copy fleet-rise">
          <p class="u-label">
            Launch archive / Falcon &amp; Starship
          </p>
          <h1>Every SpaceX vehicle, indexed.</h1>
          <p class="hero__sub">
            Configurations, launch costs, and flight records from Falcon 1 to
            Starship. Data via Launch Library 2.
          </p>
        </div>

        <dl class="telemetry fleet-rise">
          <div>
            <dt class="u-label">
              Configurations
            </dt>
            <dd class="u-mono">
              {{ pad(totalCount) }}
            </dd>
          </div>
          <div>
            <dt class="u-label">
              Active
            </dt>
            <dd class="u-mono">
              {{ pad(activeCount) }}
            </dd>
          </div>
          <div>
            <dt class="u-label">
              Retired
            </dt>
            <dd class="u-mono">
              {{ pad(retiredCount) }}
            </dd>
          </div>
          <div>
            <dt class="u-label">
              Earliest flight
            </dt>
            <dd class="u-mono">
              {{ earliestFlight }}
            </dd>
          </div>
        </dl>
      </div>
    </section>

    <RocketFilter
      :initial-search="store.searchQuery"
      :initial-status="store.filterStatus"
      :initial-sort="store.sortBy"
      @update:search="store.setSearchQuery"
      @update:status="store.setFilterStatus"
      @update:sort="store.setSortBy"
      @open-add-dialog="isAddDialogOpen = true"
    />

    <div class="u-container results">
      <LoadingState v-if="store.loading" />

      <ErrorState
        v-else-if="store.error"
        :message="store.error"
        @retry="handleRetry"
      />

      <template v-else>
        <div class="results__meta">
          <span class="u-mono">
            {{ pad(store.filteredRockets.length) }} / {{ pad(totalCount) }}
            VEHICLES
          </span>
          <button
            v-if="isFiltered"
            type="button"
            class="text-action"
            @click="resetFilters"
          >
            Clear filters
          </button>
        </div>

        <div
          v-if="store.filteredRockets.length > 0"
          class="grid"
        >
          <RocketCard
            v-for="(rocket, i) in store.filteredRockets"
            :key="rocket.id"
            :rocket="rocket"
            :index="i + 1"
            class="fleet-rise"
            :style="{ animationDelay: `${Math.min(i * 45, 270)}ms` }"
          />
        </div>

        <div
          v-else
          class="empty"
        >
          <p class="u-label">
            No match
          </p>
          <h2>No vehicles match this filter.</h2>
          <p class="empty__body">
            Try a different name, or reset the configuration status.
          </p>
          <v-btn
            color="primary"
            variant="outlined"
            @click="resetFilters"
          >
            Clear filters
          </v-btn>
        </div>
      </template>
    </div>

    <AddRocketDialog
      v-model="isAddDialogOpen"
      @submit="handleSaveCustomRocket"
    />

    <v-snackbar
      v-model="showSnackbar"
      :timeout="3500"
      class="fleet-snackbar"
      color="surface"
      location="bottom right"
      variant="flat"
    >
      <span class="u-mono snackbar-text">{{ snackbarText }}</span>
      <template #actions>
        <v-btn
          size="small"
          variant="text"
          @click="showSnackbar = false"
        >
          Dismiss
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRocketStore } from '@/stores/rocketStore';
import type { Rocket } from '@/types/rocket';

const store = useRocketStore();
const isAddDialogOpen = ref(false);
const showSnackbar = ref(false);
const snackbarText = ref('');

const totalCount = computed(() => store.allRockets.length);
const activeCount = computed(
  () => store.allRockets.filter((rocket) => rocket.active === true).length
);
const retiredCount = computed(
  () => store.allRockets.filter((rocket) => rocket.active === false).length
);

const earliestFlight = computed(() => {
  const years = store.allRockets
    .map((rocket) => {
      if (!rocket.maiden_flight) return Number.NaN;
      return new Date(rocket.maiden_flight).getFullYear();
    })
    .filter((year) => !Number.isNaN(year));

  return years.length > 0 ? String(Math.min(...years)) : '—';
});

const isFiltered = computed(
  () => Boolean(store.searchQuery.trim()) || store.filterStatus !== 'all'
);

function pad(value: number): string {
  return String(value).padStart(3, '0');
}

onMounted(() => {
  document.title = 'SpaceX Fleet — Launch Archive';
  store.fetchRockets();
});

function handleRetry() {
  store.fetchRockets(true);
}

function resetFilters() {
  store.setSearchQuery('');
  store.setFilterStatus('all');
  store.setSortBy('name');
}

function handleSaveCustomRocket(rocket: Omit<Rocket, 'id'>) {
  store.addRocket(rocket);
  snackbarText.value = `${rocket.full_name} added to this session.`;
  showSnackbar.value = true;
}
</script>

<style scoped>
.fleet-page {
  padding-bottom: clamp(32px, 6vw, 72px);
}

.hero {
  padding-block: clamp(32px, 6vw, 76px) clamp(28px, 4vw, 52px);
  border-bottom: 1px solid var(--fleet-hairline);
}

.hero__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(280px, 1fr);
  gap: clamp(24px, 5vw, 72px);
  align-items: end;
}

.hero h1 {
  margin: 14px 0 18px;
  font-size: clamp(34px, 5.4vw, 62px);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.035em;
  max-width: 18ch;
}

.hero__sub {
  margin: 0;
  max-width: 46ch;
  font-size: clamp(14px, 1.2vw, 16px);
  line-height: 1.65;
  color: rgba(var(--v-theme-on-surface), 0.68);
}

.telemetry {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin: 0;
  border-top: 1px solid var(--fleet-hairline);
  border-left: 1px solid var(--fleet-hairline);
}

.telemetry > div {
  padding: 16px 18px;
  border-right: 1px solid var(--fleet-hairline);
  border-bottom: 1px solid var(--fleet-hairline);
}

.telemetry dt {
  font-size: 9.5px;
  letter-spacing: 0.12em;
}

.telemetry dd {
  margin: 8px 0 0;
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 600;
  line-height: 1;
}

.results {
  padding-top: 22px;
}

.results__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  font-size: 10.5px;
  letter-spacing: 0.12em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.empty {
  padding: clamp(40px, 8vw, 96px) 0;
  text-align: center;
  border-top: 1px solid var(--fleet-hairline);
}

.empty h2 {
  margin: 12px 0 8px;
  font-size: clamp(22px, 3vw, 30px);
  font-weight: 600;
  letter-spacing: -0.025em;
}

.empty__body {
  margin: 0 auto 24px;
  max-width: 42ch;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.65);
}

.snackbar-text {
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.fleet-snackbar :deep(.v-snackbar__content) {
  border: 1px solid var(--fleet-hairline);
}

@media (max-width: 1100px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hero__grid {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .telemetry {
    max-width: 480px;
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .results__meta {
    align-items: flex-start;
    flex-direction: column;
    gap: 8px;
  }
}
</style>
