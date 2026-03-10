<template>
  <div class="detail-shell">
    <v-container class="py-8 py-md-12">
      <v-btn
        class="mb-6"
        prepend-icon="mdi-arrow-left"
        to="/"
        variant="text"
      >
        Back to list
      </v-btn>

      <RocketState
        v-if="isLoading"
        message="Loading rocket detail from the centralized store."
        status="loading"
        title="Preparing rocket detail"
      />

      <RocketState
        v-else-if="showError"
        :message="state.errorMessage || 'The rocket detail could not be loaded.'"
        retry-label="Retry"
        status="error"
        title="Rocket detail unavailable"
        @retry="loadRockets(true)"
      />

      <RocketState
        v-else-if="!rocket"
        message="This rocket does not exist in the current data set."
        status="empty"
        title="Rocket not found"
      />

      <v-row
        v-else
        align="stretch"
      >
        <v-col
          cols="12"
          md="7"
        >
          <v-card
            rounded="xl"
            variant="flat"
            class="detail-card overflow-hidden"
          >
            <v-img
              :src="rocket.image"
              :alt="rocket.name"
              cover
              height="420"
            />
          </v-card>
        </v-col>

        <v-col
          cols="12"
          md="5"
        >
          <v-card
            rounded="xl"
            variant="flat"
            class="detail-card h-100"
          >
            <v-card-text class="pa-6 pa-md-8">
              <div class="d-flex flex-wrap ga-2 mb-4">
                <v-chip
                  :color="rocket.active ? 'success' : 'warning'"
                  label
                >
                  {{ rocket.active ? 'Active mission profile' : 'Inactive mission profile' }}
                </v-chip>

                <v-chip
                  color="primary"
                  label
                  variant="tonal"
                >
                  {{ rocket.source === 'local' ? 'Local draft' : 'SpaceX API' }}
                </v-chip>
              </div>

              <p class="text-overline text-medium-emphasis mb-2">
                {{ rocket.country }}
              </p>
              <h1 class="text-h3 font-weight-bold">
                {{ rocket.name }}
              </h1>
              <p class="text-body-1 text-medium-emphasis mt-4">
                {{ rocket.description }}
              </p>

              <v-divider class="my-6" />

              <div class="detail-metrics">
                <v-sheet
                  v-for="metric in metrics"
                  :key="metric.label"
                  rounded="lg"
                  class="metric-tile"
                >
                  <div class="text-overline text-medium-emphasis">
                    {{ metric.label }}
                  </div>
                  <div class="text-h6 font-weight-bold mt-2">
                    {{ metric.value }}
                  </div>
                </v-sheet>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useRoute } from 'vue-router'

  import RocketState from '@/components/rockets/RocketState.vue'
  import { useRocketsStore } from '@/stores/rockets'
  import { formatLongDate, formatUsd } from '@/utils/format'

  const route = useRoute()
  const { state, loadRockets, getRocketById } = useRocketsStore()

  const rocket = computed(() => getRocketById(String(route.params.id)))

  const isLoading = computed(() => state.status === 'loading' && !rocket.value)
  const showError = computed(() => state.status === 'error' && !rocket.value)

  const metrics = computed(() => {
    if (!rocket.value) {
      return []
    }

    return [
      {
        label: 'Cost Per Launch',
        value: formatUsd(rocket.value.costPerLaunch),
      },
      {
        label: 'First Flight',
        value: formatLongDate(rocket.value.firstFlight),
      },
      {
        label: 'Country',
        value: rocket.value.country,
      },
      {
        label: 'Source',
        value: rocket.value.source === 'local' ? 'Created locally' : 'Loaded from API',
      },
    ]
  })

  onMounted(() => {
    if (!rocket.value) {
      loadRockets()
    }
  })
</script>

<style scoped>
  .detail-shell {
    min-height: 100vh;
    background:
      radial-gradient(circle at top right, rgba(14, 165, 233, 0.16), transparent 28%),
      linear-gradient(180deg, #f8fbff 0%, #eef4ff 100%);
  }

  .detail-card {
    border: 1px solid rgba(15, 23, 42, 0.08);
    background: rgba(255, 255, 255, 0.84);
    backdrop-filter: blur(12px);
  }

  .detail-metrics {
    display: grid;
    grid-template-columns: repeat(1, minmax(0, 1fr));
    gap: 12px;
  }

  .metric-tile {
    border: 1px solid rgba(15, 23, 42, 0.08);
    padding: 18px;
  }

  @media (min-width: 700px) {
    .detail-metrics {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
</style>
