
<template>
  <v-container class="py-8">
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      color="primary"
      to="/"
      class="mb-6"
    >
      Back to Rockets
    </v-btn>

    <div
      v-if="loading"
      class="d-flex flex-column align-center py-12"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
        class="mb-4"
      />

      <p>Loading rocket details...</p>
    </div>

    <v-alert
      v-else-if="errorMessage"
      type="error"
      variant="tonal"
      class="mb-6"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-3">
        <span>{{ errorMessage }}</span>

        <v-btn
          color="error"
          variant="outlined"
          @click="loadRocket"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <v-row v-else-if="rocket">
      <v-col cols="12" md="5">
        <v-card rounded="xl" overflow="hidden">
          <v-img
            v-if="rocket.imageUrl && !imageError"
            :src="rocket.imageUrl"
            height="380"
            cover
            @error="imageError = true"
          />

          <div
            v-else
            class="d-flex flex-column align-center justify-center bg-grey-lighten-3"
            style="height: 380px"
          >
            <v-icon
              icon="mdi-image-off-outline"
              size="56"
              color="grey"
              class="mb-3"
            />

            <span class="text-medium-emphasis">
              No image available
            </span>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="7">
        <div class="d-flex align-center flex-wrap ga-3 mb-4">
          <h1 class="text-h4 font-weight-bold">
            {{ rocket.name }}
          </h1>

          <v-chip
            v-if="rocket.isCustom"
            color="primary"
            variant="tonal"
          >
            Custom Rocket
          </v-chip>
        </div>

        <v-chip
          v-if="rocket.active !== null"
          :color="rocket.active ? 'success' : 'grey'"
          variant="tonal"
          class="mb-5"
        >
          {{ rocket.active ? 'Active' : 'Inactive' }}
        </v-chip>

        <v-chip
          v-else
          variant="outlined"
          class="mb-5"
        >
          Status Unknown
        </v-chip>

        <h2 class="text-h6 mb-2">
          Description
        </h2>

        <p class="text-body-1 text-medium-emphasis mb-6">
          {{ rocket.description }}
        </p>

        <v-divider class="mb-6" />

        <h2 class="text-h6 mb-4">
          Rocket Specifications
        </h2>

        <v-list>
          <v-list-item
            title="Country"
            :subtitle="rocket.country"
            prepend-icon="mdi-earth"
          />

          <v-list-item
            title="Launch Cost"
            :subtitle="formattedLaunchCost"
            prepend-icon="mdi-currency-usd"
          />

          <v-list-item
            title="First Flight"
            :subtitle="formattedFirstFlight"
            prepend-icon="mdi-calendar"
          />
        </v-list>
      </v-col>
    </v-row>

    <v-alert
      v-else
      type="info"
      variant="tonal"
    >
      Rocket not found.
    </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchRocketById } from '@/services/rocketApi'
import { toRocket } from '@/services/rocketMapper'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const store = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const errorMessage = ref('')
const imageError = ref(false)

let controller: AbortController | null = null

const rocketId = computed(() => String(route.params.id ?? ''))

const formattedLaunchCost = computed(() => {
  const cost = rocket.value?.launchCost

  if (cost == null) {
    return 'Not available'
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cost)
})

const formattedFirstFlight = computed(() => {
  const date = rocket.value?.firstFlight

  if (!date) {
    return 'Not available'
  }

  const parsedDate = new Date(date)

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Not available'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
    timeZone: 'UTC',
  }).format(parsedDate)
})

async function loadRocket() {
  controller?.abort()

  const request = new AbortController()
  controller = request

  rocket.value = null
  loading.value = true
  errorMessage.value = ''
  imageError.value = false

  const customRocket = store.customRockets.find(
    (item) => item.id === rocketId.value,
  )

  if (customRocket) {
    rocket.value = customRocket
    loading.value = false
    controller = null
    return
  }

  if (!/^\d+$/.test(rocketId.value)) {
    errorMessage.value = 'Rocket not found.'
    loading.value = false
    controller = null
    return
  }

  try {
    const response = await fetchRocketById(
      rocketId.value,
      request.signal,
    )

    if (request.signal.aborted) {
      return
    }

    rocket.value = toRocket(response)
  } catch (error) {
    if (request.signal.aborted) {
      return
    }

    errorMessage.value = error instanceof Error
      ? error.message
      : 'Failed to load rocket details'
  } finally {
    if (controller === request) {
      loading.value = false
      controller = null
    }
  }
}

watch(
  rocketId,
  () => {
    loadRocket()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  controller?.abort()
})
</script>
