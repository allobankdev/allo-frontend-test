<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="router.push('/')"
    >
      Back to Rockets
    </v-btn>

    <div v-if="loading">
      <v-skeleton-loader
        type="image, heading, paragraph, paragraph"
      />
    </div>

    <div v-else-if="error">
      <v-alert
        type="error"
        variant="tonal"
      >
        {{ error }}
      </v-alert>

      <v-btn
        class="mt-4"
        color="primary"
        @click="loadRocket"
      >
        Retry
      </v-btn>
    </div>

    <div v-else-if="rocket">
      <v-row>
        <v-col
          cols="12"
          md="5"
        >
          <v-img
            v-if="rocket.image_url"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            height="420"
            cover
            rounded="lg"
          />

          <div
            v-else
            class="d-flex align-center justify-center bg-grey-lighten-3 rounded-lg"
            style="height: 420px;"
          >
            <span class="text-medium-emphasis">
              No image available
            </span>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="7"
        >
          <h1 class="text-h4 font-weight-bold mb-4">
            {{ rocket.full_name }}
          </h1>

          <p class="text-body-1 mb-8">
            {{ rocket.description || 'No description available.' }}
          </p>

          <v-list>
            <v-list-item>
              <v-list-item-title>
                Cost per Launch
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ formatLaunchCost(rocket.launch_cost) }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                Country
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ rocket.manufacturer?.country_code || 'Unknown' }}
              </v-list-item-subtitle>
            </v-list-item>

            <v-list-item>
              <v-list-item-title>
                First Flight
              </v-list-item-title>

              <v-list-item-subtitle>
                {{ rocket.maiden_flight || 'Not available' }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { getRocketById } from '@/services/rocketService'
  import { useRocketStore } from '@/stores/rocket'
  import type { Rocket } from '@/types/rocket'

  const route = useRoute()
  const router = useRouter()
  const rocketStore = useRocketStore()

  const rocket = ref<Rocket | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  function formatLaunchCost(value: Rocket['launch_cost']) {
    if (value === null || value === undefined || value === '') {
      return 'Not available'
    }

    const numericValue = Number(value)

    if (Number.isNaN(numericValue)) {
      return String(value)
    }

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(numericValue)
  }

  async function loadRocket() {
    const id = String(route.params.id)

    loading.value = true
    error.value = null

    try {
      if (id.startsWith('local-')) {
        const localRocket = rocketStore.getLocalRocketById(id)

        if (!localRocket) {
          throw new Error('Rocket not found.')
        }

        rocket.value = localRocket
        return
      }

      rocket.value = await getRocketById(id)
    } catch (err) {
      error.value = err instanceof Error
        ? err.message
        : 'Failed to load rocket.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadRocket)
</script>