<template>
  <v-container
    class="py-6"
    max-width="900"
  >
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      variant="text"
      to="/"
    >
      Back to rockets
    </v-btn>

    <StateLoading
      v-if="isLoading"
      message="Loading rocket detail…"
    />
    <StateError
      v-else-if="isError"
      title="Failed to load rocket"
      :message="store.detailError ?? 'Something went wrong while fetching data. Please try again.'"
      @retry="onRetry"
    />
    <template v-else-if="rocket">
      <v-card>
        <v-img
          :src="src"
          :alt="rocket.full_name"
          cover
          max-height="420"
          @error="onError"
        />
        <v-card-title class="text-h5">
          {{ rocket.full_name }}
        </v-card-title>
        <v-card-subtitle v-if="rocket.family">
          {{ rocket.family }} · {{ activeLabel }}
        </v-card-subtitle>
        <v-card-text>
          <p>{{ formatDescription(rocket.description) }}</p>
          <v-divider class="my-4" />
          <v-row dense>
            <v-col
              cols="12"
              sm="4"
            >
              <div class="text-caption text-medium-emphasis">
                Cost per launch
              </div>
              <div class="text-body-1">
                {{ formatLaunchCost(rocket.launch_cost) }}
              </div>
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <div class="text-caption text-medium-emphasis">
                Country
              </div>
              <div class="text-body-1">
                {{ countryLabel(rocket.manufacturer?.country_code) }}
              </div>
            </v-col>
            <v-col
              cols="12"
              sm="4"
            >
              <div class="text-caption text-medium-emphasis">
                First flight
              </div>
              <div class="text-body-1">
                {{ formatMaidenFlight(rocket.maiden_flight) }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </template>
    <EmptyState
      v-else
      title="Rocket not found"
      message="This rocket does not exist in the store or the API."
    />
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '@/components/EmptyState.vue'
import StateError from '@/components/StateError.vue'
import StateLoading from '@/components/StateLoading.vue'
import { ROCKET_PLACEHOLDER_IMAGE, resolveRocketImage } from '@/composables/useRocketImage'
import { useRocketsStore } from '@/stores/rockets'
import { countryLabel, formatDescription, formatLaunchCost, formatMaidenFlight } from '@/utils/format'

const route = useRoute()
const store = useRocketsStore()

const routeId = computed(() => String(route.params.id ?? ''))

const rocket = computed(() => store.byId(routeId.value))

const isLoading = computed(
  () => store.detailStatus === 'loading' && !rocket.value,
)
const isError = computed(
  () => store.detailStatus === 'error' && !rocket.value,
)

const activeLabel = computed(() => {
  if (rocket.value?.active === true) return 'Active'
  if (rocket.value?.active === false) return 'Inactive'
  return 'Status unknown'
})

const imageFailed = ref(false)

const src = computed(() => {
  if (imageFailed.value) return ROCKET_PLACEHOLDER_IMAGE
  return resolveRocketImage(rocket.value?.image_url, routeId.value)
})

function onError () {
  imageFailed.value = true
}

function load () {
  if (routeId.value) {
    imageFailed.value = false
    void store.loadDetail(routeId.value)
  }
}

function onRetry () {
  if (routeId.value) void store.retryDetail(routeId.value)
}

onMounted(load)
watch(routeId, load)
</script>
