<template>
  <v-container class="py-8">
    <div class="d-flex flex-column ga-6">
      <div class="d-flex align-center ga-3">
        <v-btn
          variant="text"
          prepend-icon="mdi-arrow-left"
          to="/"
        >
          Kembali
        </v-btn>
        <h1 class="text-h5 font-weight-bold">
          Detail Rocket
        </h1>
      </div>

      <UiState
        :status="store.state.status"
        :error="store.state.error"
        @retry="prepare"
      >
        <v-alert
          v-if="isNotFound"
          type="warning"
          variant="tonal"
        >
          Rocket dengan id tersebut tidak ditemukan.
        </v-alert>

        <v-card
          v-else-if="rocket"
          variant="outlined"
        >
          <v-img
            :src="rocket.image || fallbackImage"
            height="340"
            cover
          />

          <v-card-item>
            <v-card-title class="text-h5">
              {{ rocket.name }}
            </v-card-title>
            <v-card-subtitle>{{ rocket.country }}</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <p class="text-body-1 mb-6">
              {{ rocket.description }}
            </p>

            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <div class="text-caption text-medium-emphasis">
                  Cost Per Launch
                </div>
                <div class="text-body-1 font-weight-bold">
                  {{ formatCurrency(rocket.costPerLaunch) }}
                </div>
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <div class="text-caption text-medium-emphasis">
                  Country
                </div>
                <div class="text-body-1 font-weight-bold">
                  {{ rocket.country }}
                </div>
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <div class="text-caption text-medium-emphasis">
                  First Flight
                </div>
                <div class="text-body-1 font-weight-bold">
                  {{ formatDate(rocket.firstFlight) }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </UiState>
    </div>
  </v-container>
</template>

<script setup lang="ts">
  import { computed, onMounted, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import UiState from '@/components/UiState.vue'
  import { useRocketStore } from '@/store/rocketStore'

  const fallbackImage = 'https://images2.imgbox.com/9a/96/nLppz9HW_o.png'
  const store = useRocketStore()
  const route = useRoute()

  const rocketId = computed(() => {
    const params = route.params as Record<string, string | string[] | undefined>
    const raw = params.id
    if (Array.isArray(raw)) return raw[0]
    return raw
  })

  const rocket = computed(() => store.selectedRocket.value)

  const isNotFound = computed(() => {
    return store.state.status === 'success' && !rocket.value
  })

  async function prepare() {
    if (store.state.status === 'idle' || store.state.status === 'error') {
      await store.fetchRockets()
    }

    store.setSelectedRocketById(rocketId.value ?? null)
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  function formatDate(date: string) {
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) return date

    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'long',
    }).format(parsed)
  }

  onMounted(prepare)

  watch(
    () => route.fullPath,
    () => {
      void prepare()
    },
  )
</script>
