<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchRocketById } from '@/api/launchLibrary'
  import { useRocketStore } from '@/stores/rocket'
  import AsyncState from '@/components/AsyncState.vue'
  import type { Rocket, RequestStatus } from '@/types/rocket'

  const route = useRoute()
  const store = useRocketStore()

  const rocket = ref<Rocket | null>(null)
  const status = ref<RequestStatus>('idle')
  const errorMessage = ref('')

  async function load () {
    const id = String(route.params.id)

    // Reuse the already-loaded list when possible: locally added rockets don't
    // exist on the API, and LL2's free tier is capped at 15 requests/hour, so
    // we avoid a second network call whenever the rocket is already cached.
    const local = store.findRocket(id)
    if (local) {
      rocket.value = local
      status.value = 'success'
      return
    }

    status.value = 'loading'
    errorMessage.value = ''
    try {
      rocket.value = await fetchRocketById(id)
      status.value = 'success'
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'Something went wrong'
      status.value = 'error'
    }
  }

  onMounted(load)
</script>

<template>
  <v-container class="py-8">
    <v-btn
      class="mb-4"
      prepend-icon="mdi-arrow-left"
      to="/"
      variant="text"
    >
      Back to rockets
    </v-btn>

    <AsyncState
      :error-message="errorMessage"
      :status="status"
      @retry="load"
    >
      <v-card v-if="rocket">
        <v-img
          :aspect-ratio="21 / 9"
          cover
          :src="rocket.image"
        />
        <v-card-item>
          <v-card-title class="text-h5">
            {{ rocket.name }}
          </v-card-title>
        </v-card-item>
        <v-card-text>
          <p class="mb-4">
            {{ rocket.description }}
          </p>
          <v-row>
            <v-col
              cols="12"
              sm="4"
            >
              <div class="text-caption text-medium-emphasis">
                Cost per launch
              </div>
              <div class="text-body-1">
                {{ rocket.costPerLaunch != null ? `$${rocket.costPerLaunch.toLocaleString()}` : 'Not available' }}
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
                {{ rocket.country }}
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
                {{ rocket.firstFlight ?? 'Not available' }}
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </AsyncState>
  </v-container>
</template>
