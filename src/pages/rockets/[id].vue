<script setup lang="ts">
/**
 * Rocket detail screen.
 * Deep links are fetched by id; coming from the list reuses the store cache.
 */

// Composables
import { computed, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

// Components
import AppState from '@/components/AppState.vue'
import RocketImage from '@/components/RocketImage.vue'
import RocketMeta from '@/components/RocketMeta.vue'

// Utilities
import { useRocketsStore } from '@/stores/rockets'
import { formatCountry, formatCurrency, formatDate, formatText } from '@/utils/formatters'

const route = useRoute('/rockets/[id]')
const store = useRocketsStore()
const { detail, detailStatus, detailError } = storeToRefs(store)

const rocketId = computed(() => Number(route.params.id))
const isValidId = computed(() => Number.isInteger(rocketId.value) && rocketId.value > 0)

const description = computed(() =>
  formatText(detail.value?.description, 'No description available for this rocket.')
)

const metaItems = computed(() => {
  if (!detail.value) {
    return []
  }

  return [
    {
      label: 'Cost per launch',
      value: formatCurrency(detail.value.launch_cost),
      icon: 'mdi-cash',
    },
    {
      label: 'Country',
      value: formatCountry(detail.value.manufacturer?.country_code),
      icon: 'mdi-earth',
    },
    {
      label: 'First flight',
      value: formatDate(detail.value.maiden_flight),
      icon: 'mdi-calendar',
    },
  ]
})

watch(rocketId, (id) => {
  if (isValidId.value) {
    store.fetchRocketById(id)
  }
}, { immediate: true })

onUnmounted(() => {
  store.clearDetail()
})
</script>

<template>
  <v-container
    class="py-6 py-md-8"
    max-width="1100"
  >
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <v-alert
      v-if="!isValidId"
      type="warning"
      variant="tonal"
    >
      <div class="font-weight-medium">
        Rocket not found
      </div>
      <div class="text-body-2">
        The rocket id in the URL is not valid. Go back to the list and pick a rocket.
      </div>
    </v-alert>

    <AppState
      v-else
      :error="detailError"
      :status="detailStatus"
      loading-text="Loading rocket details…"
      @retry="store.fetchRocketById(rocketId, true)"
    >
      <template #loading>
        <v-row>
          <v-col
            cols="12"
            md="5"
          >
            <v-skeleton-loader type="image" />
          </v-col>
          <v-col
            cols="12"
            md="7"
          >
            <v-skeleton-loader type="heading, subtitle, text@4" />
          </v-col>
        </v-row>
      </template>

      <v-row v-if="detail">
        <v-col
          cols="12"
          md="5"
        >
          <RocketImage
            class="rounded-lg"
            eager
            :alt="`${detail.full_name} rocket`"
            :height="340"
            :src="detail.image_url"
          />
        </v-col>

        <v-col
          cols="12"
          md="7"
        >
          <div class="d-flex flex-wrap align-center ga-2 mb-1">
            <h1 class="text-h4 font-weight-bold">
              {{ detail.full_name }}
            </h1>

            <v-chip
              v-if="detail.isLocal"
              color="primary"
              size="small"
              variant="tonal"
            >
              Added locally
            </v-chip>
          </div>

          <p class="text-subtitle-1 text-medium-emphasis mb-4">
            {{ formatText(detail.manufacturer?.name, 'Manufacturer unknown') }}
          </p>

          <p class="text-body-1 mb-6">
            {{ description }}
          </p>

          <v-divider class="mb-6" />

          <RocketMeta :items="metaItems" />
        </v-col>
      </v-row>
    </AppState>
  </v-container>
</template>
