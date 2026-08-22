<template>
  <v-container class="detail-container py-4 py-sm-8">
    <v-btn
      class="mb-5"
      prepend-icon="mdi-arrow-left"
      text="Back to rockets"
      to="/"
      variant="text"
    />

    <div
      v-if="isLoading"
      class="d-flex flex-column align-center justify-center py-16"
      role="status"
    >
      <v-progress-circular
        class="mb-4"
        color="primary"
        indeterminate
        size="48"
      />
      <span class="text-medium-emphasis">Loading rocket details…</span>
    </div>

    <v-alert
      v-else-if="request.status === 'error'"
      :text="request.error ?? 'Rocket details could not be loaded.'"
      title="Unable to load this rocket"
      type="error"
      variant="tonal"
    >
      <template #append>
        <v-btn
          text="Retry"
          variant="outlined"
          @click="store.fetchRocket(routeId, true)"
        />
      </template>
    </v-alert>

    <v-card
      v-else-if="rocket"
      overflow="hidden"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
        >
          <RocketImage
            :alt="rocket.fullName"
            :height="360"
            :src="rocket.imageUrl"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div class="pa-5 pa-sm-8">
            <div class="d-flex flex-wrap align-center ga-2 mb-3">
              <v-chip
                v-if="rocket.source === 'local'"
                color="primary"
                size="small"
                text="Added this session"
                variant="tonal"
              />
            </div>

            <h1 class="text-h4 text-sm-h3 font-weight-bold mb-4">
              {{ rocket.fullName }}
            </h1>

            <p class="text-body-1 text-medium-emphasis mb-8">
              {{ rocket.description ?? 'Description unavailable.' }}
            </p>

            <v-row>
              <v-col
                cols="12"
                sm="4"
                md="12"
                lg="4"
              >
                <v-sheet
                  border
                  class="detail-field pa-4"
                  rounded
                >
                  <v-icon
                    class="mb-2"
                    color="primary"
                    icon="mdi-currency-usd"
                  />
                  <p class="text-caption text-medium-emphasis">
                    Cost per launch
                  </p>
                  <p class="font-weight-medium">
                    {{ formatLaunchCost(rocket.launchCost) }}
                  </p>
                </v-sheet>
              </v-col>

              <v-col
                cols="12"
                sm="4"
                md="12"
                lg="4"
              >
                <v-sheet
                  border
                  class="detail-field pa-4"
                  rounded
                >
                  <v-icon
                    class="mb-2"
                    color="primary"
                    icon="mdi-earth"
                  />
                  <p class="text-caption text-medium-emphasis">
                    Country
                  </p>
                  <p class="font-weight-medium">
                    {{ rocket.country ?? 'Unavailable' }}
                  </p>
                </v-sheet>
              </v-col>

              <v-col
                cols="12"
                sm="4"
                md="12"
                lg="4"
              >
                <v-sheet
                  border
                  class="detail-field pa-4"
                  rounded
                >
                  <v-icon
                    class="mb-2"
                    color="primary"
                    icon="mdi-calendar"
                  />
                  <p class="text-caption text-medium-emphasis">
                    First flight
                  </p>
                  <p class="font-weight-medium">
                    {{ formatDate(rocket.maidenFlight) }}
                  </p>
                </v-sheet>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useRocketStore } from '@/stores/rocketStore'

  const route = useRoute()
  const store = useRocketStore()

  const routeId = computed(() => String(route.params.id))
  const rocket = computed(() => store.getDetail(routeId.value))
  const request = computed(() => store.getDetailRequest(routeId.value))
  const isLoading = computed(() => request.value.status === 'idle' || request.value.status === 'loading')

  function formatLaunchCost (value: string | null): string {
    if (!value) return 'Unavailable'

    const amount = Number(value)
    if (!Number.isFinite(amount)) return value

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function formatDate (value: string | null): string {
    if (!value) return 'Unavailable'

    const date = new Date(`${value}T00:00:00`)
    if (Number.isNaN(date.getTime())) return value

    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  watch(routeId, id => store.fetchRocket(id), { immediate: true })
</script>

<style scoped>
  .detail-container {
    max-width: 1120px;
  }

  .detail-field {
    height: 100%;
  }
</style>
