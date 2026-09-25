<template>
  <v-container
    class="py-6"
    max-width="960"
  >
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      class="mb-4"
      @click="router.push('/')"
    >
      Kembali ke Daftar Roket
    </v-btn>

    <div
      v-if="loading"
      class="text-center py-16"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="56"
        width="5"
      />
      <p class="text-body-1 text-medium-emphasis mt-4">
        Lagi memuat detail roket...
      </p>
    </div>

    <v-alert
      v-else-if="error"
      type="error"
      variant="tonal"
      class="my-8"
      prominent
    >
      <div class="d-flex flex-wrap align-center justify-space-between ga-4">
        <div>
          <div class="text-subtitle-1 font-weight-bold">
            Gagal memuat detail roket
          </div>
          <div class="text-body-2">
            {{ error }}
          </div>
        </div>
        <v-btn
          color="error"
          variant="elevated"
          prepend-icon="mdi-reload"
          @click="loadRocket"
        >
          Coba Lagi
        </v-btn>
      </div>
    </v-alert>

    <v-card
      v-else-if="rocket"
      elevation="2"
      class="overflow-hidden"
    >
      <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        height="380"
        cover
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-lighten-4">
            <v-progress-circular
              indeterminate
              color="primary"
            />
          </div>
        </template>
        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-3 text-grey">
            <v-icon
              icon="mdi-rocket-outline"
              size="64"
            />
            <span class="text-caption mt-2">Gambar gak tersedia</span>
          </div>
        </template>
      </v-img>

      <div
        v-else
        class="d-flex flex-column align-center justify-center bg-grey-lighten-3 text-grey"
        style="height: 280px;"
      >
        <v-icon
          icon="mdi-rocket-outline"
          size="64"
        />
        <span class="text-body-2 mt-2">Gak ada gambar</span>
      </div>

      <v-card-text class="pa-6">
        <h1 class="text-h4 font-weight-bold mb-4">
          {{ rocket.full_name || 'Roket Tanpa Nama' }}
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-6">
          {{ rocket.description || 'Belum ada deskripsi buat roket ini.' }}
        </p>

        <v-divider class="my-6" />

        <h2 class="text-h6 font-weight-bold mb-4">
          Spesifikasi & Rincian
        </h2>

        <v-row>
          <v-col
            cols="12"
            sm="4"
          >
            <v-sheet class="pa-4 rounded bg-grey-lighten-4 h-100">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                Biaya Peluncuran
              </div>
              <div class="text-h6 font-weight-bold text-primary mt-1">
                {{ formatCost(rocket.launch_cost) }}
              </div>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="4"
          >
            <v-sheet class="pa-4 rounded bg-grey-lighten-4 h-100">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                Negara
              </div>
              <div class="text-h6 font-weight-bold text-primary mt-1">
                {{ rocket.manufacturer?.country_code || 'N/A' }}
              </div>
            </v-sheet>
          </v-col>

          <v-col
            cols="12"
            sm="4"
          >
            <v-sheet class="pa-4 rounded bg-grey-lighten-4 h-100">
              <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold">
                Penerbangan Perdana
              </div>
              <div class="text-h6 font-weight-bold text-primary mt-1">
                {{ rocket.maiden_flight || 'N/A' }}
              </div>
            </v-sheet>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import type { Rocket } from '@/types/rocket'

const route = useRoute()
const router = useRouter()
const { getRocketById } = useRocketStore()

const rocket = ref<Rocket | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const formatCost = (cost?: string | number | null) => {
  if (!cost) return 'N/A'
  const numeric = Number(cost)
  if (isNaN(numeric)) return String(cost)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(numeric)
}

const loadRocket = async () => {
  if (!('id' in route.params)) return
  const id = String(route.params.id)
  if (!id) return

  loading.value = true
  error.value = null

  const result = await getRocketById(id)
  rocket.value = result.rocket
  error.value = result.error
  loading.value = false
}

onMounted(() => {
  loadRocket()
})
</script>
