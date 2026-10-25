<template>
  <div>
    <!-- Loading State -->
    <v-container v-if="loading">
      <v-row class="mt-4">
        <v-col cols="12" class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
            size="64"
          />
          <p class="mt-4">Loading rocket details...</p>
        </v-col>
      </v-row>
    </v-container>

    <!-- Error State -->
    <v-container v-else-if="error">
      <v-row class="mt-4">
        <v-col cols="12">
          <v-alert
            type="error"
            variant="tonal"
          >
            <v-alert-title>Error Loading Rocket</v-alert-title>
            {{ error }}
            <template #append>
              <v-btn
                color="error"
                variant="outlined"
                class="ml-4"
                @click="loadRocket"
              >
                Retry
              </v-btn>
            </template>
          </v-alert>
        </v-col>
      </v-row>
    </v-container>

    <!-- Rocket Detail -->
    <v-container v-else-if="rocket">
      <!-- Back Button -->
      <v-row>
        <v-col cols="12">
          <v-btn
            prepend-icon="mdi-arrow-left"
            variant="text"
            @click="goBack"
          >
            Back to Rocket Lists
          </v-btn>
        </v-col>
      </v-row>

      <!-- Rocket Content -->
      <v-row class="mt-4">
        <v-col cols="12" md="6">
          <v-img
            :src="rocket.image_url || 'https://via.placeholder.com/800x600?text=No+Image'"
            :aspect-ratio="4/3"
            cover
            class="rounded"
          >
            <template #error>
              <v-img
                src="https://via.placeholder.com/800x600?text=No+Image"
                :aspect-ratio="4/3"
                cover
                class="rounded"
              />
            </template>
          </v-img>
        </v-col>

        <v-col cols="12" md="6">
          <h1 class="text-h3 mb-4">{{ rocket.full_name }}</h1>

          <v-card variant="outlined" class="mb-4">
            <v-card-text>
              <v-row dense>
                <v-col cols="12">
                  <div class="d-flex align-center mb-3">
                    <v-icon class="mr-2">mdi-information-outline</v-icon>
                    <span class="font-weight-bold">Description</span>
                  </div>
                  <p>{{ rocket.description || 'No description available' }}</p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card variant="outlined">
            <v-card-text>
              <v-row dense>
                <v-col cols="6" md="12">
                  <div class="info-item">
                    <v-icon class="mr-2">mdi-cash</v-icon>
                    <div>
                      <div class="text-caption text-grey">Cost per Launch</div>
                      <div class="font-weight-bold">
                        {{ formatCost(rocket.launch_cost) }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="6" md="12">
                  <div class="info-item">
                    <v-icon class="mr-2">mdi-earth</v-icon>
                    <div>
                      <div class="text-caption text-grey">Country</div>
                      <div class="font-weight-bold">
                        {{ rocket.manufacturer?.country_code || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="6" md="12">
                  <div class="info-item">
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    <div>
                      <div class="text-caption text-grey">First Flight</div>
                      <div class="font-weight-bold">
                        {{ formatDate(rocket.maiden_flight) }}
                      </div>
                    </div>
                  </div>
                </v-col>

                <v-col cols="6" md="12">
                  <div class="info-item">
                    <v-icon class="mr-2">mdi-factory</v-icon>
                    <div>
                      <div class="text-caption text-grey">Manufacturer</div>
                      <div class="font-weight-bold">
                        {{ rocket.manufacturer?.name || 'N/A' }}
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  await loadRocket()
})

async function loadRocket() {
  const id = Number(route.params.id)
  
  if (isNaN(id)) {
    error.value = 'Invalid rocket ID'
    return
  }

  loading.value = true
  error.value = null

  try {
    rocket.value = await rocketStore.fetchRocketById(id)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load rocket details'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/rockets')
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'N/A'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

function formatCost(cost: string | null): string {
  if (!cost) return 'N/A'
  
  try {
    const numCost = parseInt(cost)
    if (isNaN(numCost)) return cost
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numCost)
  } catch {
    return cost
  }
}
</script>

<style scoped>
.info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 0;
}

.info-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
