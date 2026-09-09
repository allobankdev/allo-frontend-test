<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useRockets } from '@/composable/useRockets'

const route = useRoute()
const router = useRouter()

const {
  loading,
  error,
  fetchRockets,
  getRocketById,
} = useRockets()

const rocket = computed(() => {
  return getRocketById(String(route.params.id))
})

const formatCurrency = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A'
  }

  const number = Number(value)

  if (Number.isNaN(number)) {
    return value
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(number)
}

const formatDate = (value: string | null | undefined) => {
  if (!value) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long',
  }).format(new Date(value))
}

onMounted(async () => {
  await fetchRockets()
})
</script>

<template>
  <v-container class="py-8">
    <!-- BACK -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="router.back()"
    >
      Back
    </v-btn>

    <!-- LOADING -->
    <div
      v-if="loading"
      class="d-flex justify-center py-16"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="48"
      />
    </div>

    <!-- ERROR -->
    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
    >
      <v-alert-title>
        Failed to load rocket
      </v-alert-title>

      {{ error }}

      <template #append>
        <v-btn
          variant="outlined"
          @click="fetchRockets(true)"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- NOT FOUND -->
    <v-alert
      v-else-if="!rocket"
      type="warning"
      variant="tonal"
    >
      Rocket not found.
    </v-alert>

    <!-- SUCCESS -->
    <v-card
      v-else
      elevation="2"
      class="overflow-hidden"
    >
      <v-row no-gutters>
        <!-- IMAGE -->
        <v-col
          cols="12"
          md="6"
        >
          <v-img
            :src="rocket.image_url || undefined"
            height="100%"
            min-height="400"
            cover
          >
            <template #placeholder>
              <div
                class="d-flex align-center justify-center fill-height"
              >
                <v-icon
                  size="96"
                  color="grey"
                >
                  mdi-rocket
                </v-icon>
              </div>
            </template>
          </v-img>
        </v-col>

        <!-- INFORMATION -->
        <v-col
          cols="12"
          md="6"
        >
          <v-card-item>
            <v-card-title class="text-h4">
              {{ rocket.full_name || rocket.name }}
            </v-card-title>

            <v-card-subtitle>
              {{ rocket.name }}
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <!-- DESCRIPTION -->
            <div class="mb-6">
              <h3 class="text-h6 mb-2">
                Description
              </h3>

              <p class="text-body-1">
                {{
                  rocket.description ||
                    'No description available.'
                }}
              </p>
            </div>

            <!-- DETAILS -->
            <v-list>
              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-cash</v-icon>
                </template>

                <v-list-item-title>
                  Launch Cost
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ formatCurrency(rocket.launch_cost) }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-flag</v-icon>
                </template>

                <v-list-item-title>
                  Manufacturer Country
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    rocket.manufacturer?.country_code ||
                      'N/A'
                  }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-calendar</v-icon>
                </template>

                <v-list-item-title>
                  Maiden Flight
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{ formatDate(rocket.maiden_flight) }}
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template #prepend>
                  <v-icon>mdi-factory</v-icon>
                </template>

                <v-list-item-title>
                  Manufacturer
                </v-list-item-title>

                <v-list-item-subtitle>
                  {{
                    rocket.manufacturer?.name ||
                      'N/A'
                  }}
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>