<template>
  <v-container class="py-8 py-md-12">
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
    >
      All rockets
    </v-btn>
    <div
      v-if="status === 'loading'"
      class="d-flex justify-center py-16"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
    </div>
    <v-alert
      v-else-if="status === 'error'"
      type="error"
      variant="tonal"
      max-width="640"
    >
      <template #title>
        Unable to load rocket
      </template>{{ error }}<div class="mt-4">
        <v-btn
          color="error"
          @click="loadRocket"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>
    <v-row
      v-else-if="rocket"
      class="ga-0"
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-img
          v-if="rocket.image_url"
          :src="rocket.image_url"
          min-height="300"
          max-height="520"
          cover
          rounded="lg"
        >
          <template #error>
            <RocketImageFallback height="360" />
          </template>
        </v-img><RocketImageFallback
          v-else
          height="360"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="d-flex align-center"
      >
        <div class="pa-md-10 py-8">
          <p class="text-overline text-primary mb-2">
            Rocket details
          </p><h1 class="text-h3 font-weight-bold mb-5">
            {{ rocket.full_name }}
          </h1><p class="text-body-1 text-medium-emphasis mb-8">
            {{ rocket.description || 'No description available.' }}
          </p><v-list
            lines="two"
            class="bg-transparent pa-0"
          >
            <v-list-item prepend-icon="mdi-cash">
              <v-list-item-title>Cost per launch</v-list-item-title><v-list-item-subtitle>{{ formattedCost }}</v-list-item-subtitle>
            </v-list-item><v-list-item prepend-icon="mdi-earth">
              <v-list-item-title>Country</v-list-item-title><v-list-item-subtitle>{{ rocket.manufacturer?.country_code || 'Not available' }}</v-list-item-subtitle>
            </v-list-item><v-list-item prepend-icon="mdi-calendar">
              <v-list-item-title>First flight</v-list-item-title><v-list-item-subtitle>{{ formattedDate }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchRocket, useRocketStore } from '@/stores/rockets'
  import type { AsyncStatus, Rocket } from '@/types/rocket'

  const route = useRoute()
  const store = useRocketStore()
  const rocket = ref<Rocket | null>(null)
  const status = ref<AsyncStatus>('idle')
  const error = ref<string | null>(null)
  const routeId = computed(() => String(route.params.id))
  const formattedCost = computed(() => rocket.value?.launch_cost ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(Number(rocket.value.launch_cost)) : 'Not available')
  const formattedDate = computed(() => rocket.value?.maiden_flight ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(`${rocket.value.maiden_flight}T00:00:00`)) : 'Not available')
  const loadRocket = async () => {
    const cachedRocket = store.findRocket(routeId.value)
    if (cachedRocket) { rocket.value = cachedRocket; status.value = 'success'; return }
    status.value = 'loading'; error.value = null
    try { rocket.value = await fetchRocket(routeId.value); status.value = 'success' } catch (caught) { status.value = 'error'; error.value = caught instanceof Error ? caught.message : 'An unexpected error occurred.' }
  }
  onMounted(loadRocket)
  watch(routeId, loadRocket)
</script>
