<template>
  <v-container class="py-8">
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="goBack"
    >
      Back to Rockets
    </v-btn>

    <div v-if="loading" class="d-flex justify-center py-12">
      <v-progress-circular
        indeterminate
        size="48"
      />
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
    >
      {{ error }}

      <template #append>
        <v-btn
          variant="text"
          @click="fetchRocket"
        >
          Retry
        </v-btn>
      </template>
    </v-alert>

    <v-card
      v-else-if="rocket"
      elevation="2"
      rounded="lg"
    >
      <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        height="400"
        cover
      />

      <v-card-item class="pa-6">
        <v-card-title class="text-h4 font-weight-bold px-0">
          {{ rocket.full_name }}
        </v-card-title>

        <v-card-subtitle
          v-if="rocket.manufacturer"
          class="px-0 mt-2"
        >
          {{ rocket.manufacturer.name }}
          <span v-if="rocket.manufacturer.country_code">
            · {{ rocket.manufacturer.country_code }}
          </span>
        </v-card-subtitle>
      </v-card-item>

      <v-card-text class="px-6 pb-6">
        <p
          v-if="rocket.description"
          class="text-body-1 mb-6"
        >
          {{ rocket.description }}
        </p>

        <v-row>
          <v-col
            v-if="rocket.maiden_flight"
            cols="12"
            sm="6"
          >
            <div class="text-caption text-medium-emphasis">
              Maiden Flight
            </div>
            <div class="text-body-1 font-weight-medium">
              {{ rocket.maiden_flight }}
            </div>
          </v-col>

          <v-col
            v-if="rocket.launch_cost !== null"
            cols="12"
            sm="6"
          >
            <div class="text-caption text-medium-emphasis">
              Launch Cost
            </div>
            <div class="text-body-1 font-weight-medium">
              ${{ rocket.launch_cost.toLocaleString() }}
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRocketById } from '@/services/rocketService'
import type { Rocket } from '@/types/rocket'
import { useRocketStore } from '@/stores/rocket'

const route = useRoute()
const router = useRouter()

const rocket = ref<Rocket | null>(null)
const rocketStore = useRocketStore()
const loading = ref(true)
const error = ref<string | null>(null)

async function fetchRocket() {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.rocketId)

    if (!Number.isInteger(id)) {
      throw new Error('Invalid rocket ID')
    }

    const existingRocket = rocketStore.findRocketById(id)

    if (existingRocket) {
      rocket.value = existingRocket
      return
    }

    rocket.value = await getRocketById(id)
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Failed to load rocket'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push('/')
}

onMounted(fetchRocket)
</script>
