<template>
  <v-container class="py-8 max-width-900">
    <!-- Tombol Navigasi Kembali ke Halaman Utama -->
    <v-btn
      prepend-icon="mdi-arrow-left"
      variant="text"
      color="primary"
      class="mb-4"
      to="/"
    >
      Back to Rocket List
    </v-btn>

    <!-- State Loading Detail -->
    <LoadingState v-if="rocketStore.loadingDetail" message="Loading rocket details..." />

    <!-- State Error Detail + Tombol Retry -->
    <ErrorState
      v-else-if="rocketStore.errorDetail"
      :message="rocketStore.errorDetail"
      @retry="loadRocket"
    />

    <!-- Tampilan Konten Detail Roket -->
    <v-card v-else-if="rocket" rounded="0" elevation="6" class="overflow-hidden">
      <!-- Header Gambar Roket dengan Gradient Overlay -->
      <v-img
        v-if="hasImage"
        :src="imageSrc"
        height="380"
        cover
        class="bg-grey-lighten-2 text-white align-end"
      >
        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-2 text-grey-darken-1">
            <v-icon size="64" icon="mdi-rocket-launch-outline"></v-icon>
            <span class="text-subtitle-1 mt-2">No Image Available</span>
          </div>
        </template>
        <div class="pa-6 bg-gradient-overlay">
          <v-chip
            v-if="rocket.is_custom"
            color="secondary"
            class="mb-2 font-weight-bold"
            variant="elevated"
            rounded="0"
          >
            User Created Rocket
          </v-chip>
          <h1 class="text-h3 font-weight-bold text-white mb-1">
            {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
          </h1>
          <div v-if="rocket.name && rocket.name !== rocket.full_name" class="text-h6 text-grey-lighten-2">
            ({{ rocket.name }})
          </div>
        </div>
      </v-img>

      <!-- Header Alternatif jika TIDAK ada gambar -->
      <div
        v-else
        class="bg-grey-darken-3 text-white pa-6 d-flex flex-column justify-space-between"
        style="min-height: 220px;"
      >
        <div class="d-flex flex-column align-center justify-center py-4 text-grey-lighten-1">
          <v-icon size="56" icon="mdi-rocket-launch-outline"></v-icon>
          <span class="text-subtitle-2 mt-1">No Image Available</span>
        </div>
        <div>
          <v-chip
            v-if="rocket.is_custom"
            color="secondary"
            class="mb-2 font-weight-bold"
            variant="elevated"
            rounded="0"
          >
            User Created Rocket
          </v-chip>
          <h1 class="text-h3 font-weight-bold text-white mb-1">
            {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
          </h1>
          <div v-if="rocket.name && rocket.name !== rocket.full_name" class="text-h6 text-grey-lighten-2">
            ({{ rocket.name }})
          </div>
        </div>
      </div>

      <v-card-text class="pa-6">
        <!-- Section Spesifikasi Kunci (Cost, Country, Maiden Flight) -->
        <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center">
          <v-icon icon="mdi-information-outline" class="mr-2" color="primary"></v-icon>
          Specifications & Overview
        </h2>

        <v-row class="mb-6">
          <!-- Card: Biaya Peluncuran (Cost per Launch) -->
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="primary" class="pa-4 text-center rounded-0 h-100">
              <v-icon icon="mdi-currency-usd" size="32" class="mb-1"></v-icon>
              <div class="text-caption text-uppercase font-weight-bold text-medium-emphasis">
                Cost Per Launch
              </div>
              <div class="text-h6 font-weight-bold mt-1">
                {{ formattedCost }}
              </div>
            </v-card>
          </v-col>

          <!-- Card: Negara Pembuat (Country Code) -->
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="info" class="pa-4 text-center rounded-0 h-100">
              <v-icon icon="mdi-earth" size="32" class="mb-1"></v-icon>
              <div class="text-caption text-uppercase font-weight-bold text-medium-emphasis">
                Country
              </div>
              <div class="text-h6 font-weight-bold mt-1">
                {{ formattedCountry }}
              </div>
            </v-card>
          </v-col>

          <!-- Card: Penerbangan Perdana (Maiden Flight) -->
          <v-col cols="12" sm="4">
            <v-card variant="tonal" color="success" class="pa-4 text-center rounded-0 h-100">
              <v-icon icon="mdi-calendar-star" size="32" class="mb-1"></v-icon>
              <div class="text-caption text-uppercase font-weight-bold text-medium-emphasis">
                First Flight
              </div>
              <div class="text-h6 font-weight-bold mt-1">
                {{ formattedMaidenFlight }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <v-divider class="mb-6"></v-divider>

        <!-- Section Deskripsi Lengkap Roket -->
        <h2 class="text-h6 font-weight-bold mb-3 d-flex align-center">
          <v-icon icon="mdi-text-box-outline" class="mr-2" color="primary"></v-icon>
          Description
        </h2>
        <p class="text-body-1 text-high-emphasis line-height-relaxed">
          {{ formattedDescription }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

// Ambil rute halaman aktif untuk membaca parameter URL (:id)
const route = useRoute('/rockets/[id]')
const rocketStore = useRocketStore()

// Ambil objek roket terpilih dari Pinia store
const rocket = computed(() => rocketStore.selectedRocket)

// Cek apakah roket memiliki image_url
const hasImage = computed(() => {
  return !!(rocket.value?.image_url && rocket.value.image_url.trim())
})

// Format URL Gambar
const imageSrc = computed(() => {
  return rocket.value?.image_url?.trim() || ''
})

// Format tampilan Biaya Peluncuran ($) atau 'N/A' jika kosong
const formattedCost = computed(() => {
  const cost = rocket.value?.launch_cost
  if (cost === null || cost === undefined || cost === '') {
    return 'N/A'
  }
  if (typeof cost === 'number') {
    return `$${cost.toLocaleString()}`
  }
  return String(cost).startsWith('$') ? String(cost) : `$${cost}`
})

// Format tampilan Kode Negara (misal: USA) atau 'N/A' jika kosong
const formattedCountry = computed(() => {
  const country = rocket.value?.manufacturer?.country_code
  if (!country || country.trim() === '') {
    return 'N/A'
  }
  return country.toUpperCase()
})

// Format tampilan Tanggal Penerbangan Perdana ke format tanggal terbaca
const formattedMaidenFlight = computed(() => {
  const dateStr = rocket.value?.maiden_flight
  if (!dateStr || dateStr.trim() === '') {
    return 'N/A'
  }
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
})

// Format tampilan Deskripsi dengan fallback
const formattedDescription = computed(() => {
  const desc = rocket.value?.description
  if (!desc || !desc.trim()) {
    return 'No description available for this rocket.'
  }
  return desc
})

// Fungsi memuat data detail roket berdasarkan ID di URL
const loadRocket = () => {
  const id = route.params.id
  if (id) {
    rocketStore.fetchRocketById(id)
  }
}

// Lifecycle hook: Panggil loadRocket saat halaman pertama kali dibuka
onMounted(() => {
  loadRocket()
})
</script>

<style scoped>
.max-width-900 {
  max-width: 900px;
}

.bg-gradient-overlay {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 60%, transparent 100%);
}

.line-height-relaxed {
  line-height: 1.7;
}
</style>
