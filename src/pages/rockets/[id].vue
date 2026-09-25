<template>
  <v-container class="detail-container py-8 py-md-14">
    <v-btn
      class="mb-7"
      prepend-icon="mdi-arrow-left"
      variant="text"
      @click="router.push('/')"
    >
      Kembali ke daftar
    </v-btn>

    <div
      v-if="loading"
      class="py-16 text-center"
    >
      <v-progress-circular
        color="primary"
        indeterminate
        size="52"
        width="4"
      />
      <p class="mt-5 text-medium-emphasis">
        Memuat detail roket...
      </p>
    </div>

    <ErrorState
      v-else-if="error"
      :message="error"
      @retry="loadRocket"
    />

    <v-card
      v-else-if="rocket"
      class="detail-card"
      elevation="0"
      rounded="xl"
    >
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
        >
          <RocketImage
            :alt="rocket.full_name"
            height="100%"
            :src="rocket.image_url"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <div class="pa-6 pa-md-10">
            <div class="d-flex align-center ga-3 mb-4">
              <v-chip
                color="secondary"
                size="small"
                variant="tonal"
              >
                {{ rocket.manufacturer?.name || 'SpaceX' }}
              </v-chip>
              <v-chip
                v-if="rocket.isLocal"
                color="primary"
                size="small"
                variant="tonal"
              >
                Data lokal
              </v-chip>
            </div>

            <h1 class="text-h3 font-weight-black">
              {{ rocket.full_name }}
            </h1>
            <p class="detail-description mt-5">
              {{ displayValue(rocket.description, 'Deskripsi belum tersedia.') }}
            </p>

            <v-divider class="my-8" />

            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <div class="detail-label">
                  Biaya per peluncuran
                </div>
                <div class="detail-value">
                  {{ formatLaunchCost(rocket.launch_cost) }}
                </div>
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <div class="detail-label">
                  Negara
                </div>
                <div class="detail-value">
                  {{ displayValue(rocket.manufacturer?.country_code, 'Tidak diketahui') }}
                </div>
              </v-col>
              <v-col cols="12">
                <div class="detail-label">
                  Penerbangan pertama
                </div>
                <div class="detail-value">
                  {{ formatFlightDate(rocket.maiden_flight) }}
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import ErrorState from '@/components/common/ErrorState.vue'
  import {
    displayValue,
    formatFlightDate,
    formatLaunchCost,
    getRocketById,
    RocketImage,
    useRocketStore,
  } from '@/features/rockets'
  import type { Rocket } from '@/features/rockets'

  const route = useRoute()
  const router = useRouter()
  const store = useRocketStore()
  const rocket = ref<Rocket | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function loadRocket () {
    loading.value = true
    error.value = null

    if (!('id' in route.params)) {
      error.value = 'ID roket tidak ditemukan pada alamat halaman.'
      loading.value = false
      return
    }

    const id = String(route.params.id)

    const localRocket = store.findLocalRocket(id)
    if (localRocket) {
      rocket.value = localRocket
      loading.value = false
      return
    }

    try {
      rocket.value = await getRocketById(id)
    } catch (requestError) {
      error.value = requestError instanceof Error
        ? requestError.message
        : 'Terjadi kesalahan saat mengambil detail roket.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadRocket)
</script>

<style scoped>
.detail-container {
  max-width: 1180px;
}

.detail-card {
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(17, 27, 49, 0.88);
}

.detail-card :deep(.rocket-image) {
  min-height: 440px;
}

.detail-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  line-height: 1.75;
}

.detail-label {
  margin-bottom: 0.35rem;
  color: rgba(255, 255, 255, 0.52);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.detail-value {
  font-size: 1.05rem;
  font-weight: 600;
}

@media (max-width: 959px) {
  .detail-card :deep(.rocket-image) {
    min-height: 330px;
  }
}
</style>
