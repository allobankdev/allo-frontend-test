<template>
  <v-container class="py-8">
    <!-- Back button -->
    <v-btn
      to="/"
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
    >
      Back to rockets
    </v-btn>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="d-flex justify-center py-16"
    >
      <v-progress-circular
        indeterminate
        size="48"
      />
    </div>

    <!-- Error -->
    <v-alert
      v-else-if="errorMessage"
      type="error"
      variant="tonal"
    >
      <v-alert-title>
        Something went wrong
      </v-alert-title>

      {{ errorMessage }}

      <template #append>
        <v-btn
          variant="outlined"
          @click="loadRocket"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Rocket detail -->
    <v-card
      v-else-if="rocket"
      class="overflow-hidden"
    >
      <v-row no-gutters>
        <!-- Image -->
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            v-if="rocket.image_url"
            :src="rocket.image_url"
            height="100%"
            min-height="400"
            cover
          />

          <div
            v-else
            class="d-flex flex-column align-center justify-center"
            style="height: 400px"
          >
            <v-icon
              icon="mdi-rocket"
              size="80"
              class="mb-3"
            />

            <span class="text-medium-emphasis">
              No image available
            </span>
          </div>
        </v-col>

        <!-- Information -->
        <v-col
          cols="12"
          md="6"
        >
          <v-card-item class="pa-6">
            <v-card-title class="text-h4 font-weight-bold px-0">
              {{ rocket.full_name || 'Unknown Rocket' }}
            </v-card-title>

            <v-card-text class="px-0 pt-4">
              <p class="text-body-1">
                {{ rocket.description || 'No description available.' }}
              </p>

              <v-divider class="my-6" />

              <div class="rocket-info">
                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">
                    Cost per launch
                  </div>

                  <div class="text-body-1 font-weight-medium">
                    {{ formatCost(rocket.launch_cost) }}
                  </div>
                </div>

                <div class="mb-4">
                  <div class="text-caption text-medium-emphasis">
                    Country
                  </div>

                  <div class="text-body-1 font-weight-medium">
                    {{ rocket.manufacturer?.country_code || 'Not available' }}
                  </div>
                </div>

                <div>
                  <div class="text-caption text-medium-emphasis">
                    First flight
                  </div>

                  <div class="text-body-1 font-weight-medium">
                    {{ formatDate(rocket.maiden_flight) }}
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card-item>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const rocketStore = useRocketStore() 

const rocket = ref<Rocket | null>(null)
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

async function loadRocket() {
  const id = Number(route.params.id)

  if (Number.isNaN(id)) {
    errorMessage.value = 'Invalid rocket ID.'
    return
  }

  isLoading.value = true
  errorMessage.value = null

  try {
    rocket.value = await rocketStore.getRocket(id)
  } catch (error) {
    errorMessage.value = 'Unable to load this rocket. Please try again.'
  } finally {
    isLoading.value = false
  }
}

function formatCost(cost: number | null) {
  if (cost === null) {
    return 'Not available'
  }

  return `$${cost.toLocaleString()}`
}

function formatDate(date: string | null) {
  if (!date) {
    return 'Not available'
  }

  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  loadRocket()
})
</script>