<template>
  <div>
    <AppHeader />

    <v-container class="py-8 py-md-12">
      <v-btn
        prepend-icon="mdi-arrow-left"
        variant="text"
        class="mb-6"
        @click="goBack"
      >
        Back to Rockets
      </v-btn>

      <LoadingState v-if="loading" />

      <ErrorState
        v-else-if="error"
        :message="error"
        @retry="loadRocket"
      />

      <v-alert
        v-else-if="!rocket"
        type="warning"
        variant="tonal"
      >
        Rocket not found.
      </v-alert>

      <v-card
        v-else
        rounded="lg"
        elevation="2"
        overflow="hidden"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="5"
          >
            <div class="detail-image-wrapper">
              <v-img
                v-if="rocket.image_url"
                :src="rocket.image_url"
                :alt="rocket.full_name || 'Rocket'"
                height="100%"
                min-height="400"
                cover
              />

              <div
                v-else
                class="detail-image-placeholder"
              >
                <v-icon
                  icon="mdi-rocket-launch-outline"
                  size="96"
                />

                <span class="mt-4">
                  Image unavailable
                </span>
              </div>
            </div>
          </v-col>

          <v-col
            cols="12"
            md="7"
          >
            <div class="pa-6 pa-md-10">
              <div class="text-overline text-primary">
                SpaceX Rocket
              </div>

              <h1 class="text-h4 text-md-h3 font-weight-bold mt-2">
                {{ rocket.full_name || 'Unnamed Rocket' }}
              </h1>

              <p class="text-body-1 text-medium-emphasis mt-6">
                {{ rocket.description || 'No description available.' }}
              </p>

              <v-divider class="my-8" />

              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="detail-label">
                    Cost Per Launch
                  </div>

                  <div class="detail-value">
                    {{ formattedLaunchCost }}
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="detail-label">
                    Country
                  </div>

                  <div class="detail-value">
                    {{ rocket.manufacturer?.country_code || 'N/A' }}
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="detail-label">
                    First Flight
                  </div>

                  <div class="detail-value">
                    {{ rocket.maiden_flight || 'N/A' }}
                  </div>
                </v-col>

                <v-col
                  cols="12"
                  sm="6"
                >
                  <div class="detail-label">
                    Manufacturer
                  </div>

                  <div class="detail-value">
                    {{ rocket.manufacturer?.name || 'N/A' }}
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import type { Rocket } from '@/types/rocket'
import { useRocketStore } from '@/stores/rockets'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const formattedLaunchCost = computed(() => {
  if (
    rocket.value?.launch_cost === null ||
    rocket.value?.launch_cost === undefined ||
    rocket.value?.launch_cost === ''
  ) {
    return 'N/A'
  }

  const value = Number(rocket.value.launch_cost)

  if (Number.isNaN(value)) {
    return String(rocket.value.launch_cost)
  }

  return `$${value.toLocaleString('en-US')}`
})

async function loadRocket() {
  loading.value = true
  error.value = null

  try {
    const id = String(route.params.id)

    rocket.value = await store.getRocketById(id)

    if (!rocket.value) {
      error.value = 'Unable to find this rocket.'
    }
  } catch (err) {
    console.error(err)

    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to load rocket.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/')
}

onMounted(() => {
  loadRocket()
})
</script>

<style scoped>
.detail-image-wrapper {
  height: 100%;
  min-height: 400px;
  background: rgb(var(--v-theme-surface-variant));
}

.detail-image-placeholder {
  min-height: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: rgba(var(--v-theme-on-surface), 0.5);
}

.detail-label {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.detail-value {
  margin-top: 4px;
  font-size: 1.05rem;
  font-weight: 600;
}
</style>