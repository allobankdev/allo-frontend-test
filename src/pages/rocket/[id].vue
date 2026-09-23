<template>
  <div class="rocket-detail-page py-6">
    <v-container>
      <!-- Navigation Back Button -->
      <div class="mb-6">
        <v-btn
          variant="outlined"
          color="white"
          size="small"
          prepend-icon="mdi-arrow-left"
          class="text-none font-weight-medium"
          @click="goBack"
        >
          Kembali ke Daftar Roket
        </v-btn>
      </div>

      <!-- UI STATE 1: LOADING -->
      <div
        v-if="store.isDetailLoading"
        class="py-12 text-center"
      >
        <v-progress-circular
          indeterminate
          color="white"
          size="48"
          width="3"
          class="mb-4"
        />
        <p class="text-body-1 text-white font-weight-medium">
          Memuat Detail Roket...
        </p>
      </div>

      <!-- UI STATE 2: ERROR / RETRY -->
      <UIStateError
        v-else-if="store.detailError"
        :message="store.detailError"
        @retry="loadRocketDetail"
      />

      <!-- UI STATE 3: SUCCESS (Detail content) -->
      <div
        v-else-if="rocket"
        class="detail-content"
      >
        <!-- Main Card -->
        <v-card class="detail-card bg-surface border-subtle overflow-hidden">
          <v-row no-gutters>
            <!-- Hero Image Column -->
            <v-col
              cols="12"
              md="5"
              class="image-column"
            >
              <RocketImage
                :src="rocket.image_url"
                :alt="rocket.full_name || rocket.name"
                height="100%"
                class="detail-hero-img"
              />
            </v-col>

            <!-- Main Info Column -->
            <v-col
              cols="12"
              md="7"
              class="p-6 d-flex flex-column justify-space-between"
            >
              <div>
                <!-- Status Badges -->
                <div class="d-flex align-center flex-wrap gap-2 mb-3">
                  <v-chip
                    size="small"
                    variant="flat"
                    :color="rocket.active ? 'white' : 'grey-darken-3'"
                    :class="rocket.active ? 'text-black font-weight-bold' : 'text-grey-lighten-2'"
                  >
                    <v-icon
                      start
                      size="12"
                      :icon="rocket.active ? 'mdi-circle' : 'mdi-circle-outline'"
                    />
                    {{ rocket.active ? 'Active' : 'Retired' }}
                  </v-chip>

                  <v-chip
                    v-if="rocket.reusable !== null && rocket.reusable !== undefined"
                    size="small"
                    variant="outlined"
                    class="border-subtle text-caption text-grey-lighten-2"
                  >
                    {{ rocket.reusable ? 'Reusable' : 'Expendable' }}
                  </v-chip>

                  <v-chip
                    v-if="rocket.is_custom"
                    size="small"
                    variant="flat"
                    color="grey-lighten-2"
                    class="text-black font-weight-bold"
                  >
                    Custom Added
                  </v-chip>

                  <v-chip
                    v-if="rocket.family"
                    size="small"
                    variant="text"
                    class="text-grey text-caption px-1 font-weight-medium"
                  >
                    Family: {{ rocket.family }}
                  </v-chip>
                </div>

                <!-- Rocket Full Name -->
                <h1 class="text-h4 font-weight-bold text-white mb-2">
                  {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
                </h1>

                <!-- Manufacturer -->
                <p class="text-caption text-uppercase tracking-wider text-grey mb-4">
                  Manufacturer: <span class="text-white font-weight-medium">{{ rocket.manufacturer?.name || 'SpaceX' }}</span>
                  <span
                    v-if="countryCode"
                    class="ml-2"
                  >({{ countryCode }})</span>
                </p>

                <!-- Description -->
                <div class="description-section mb-6">
                  <h2 class="text-subtitle-2 text-uppercase tracking-wider text-grey mb-1 font-weight-bold">
                    Deskripsi Roket
                  </h2>
                  <p class="text-body-1 text-grey-lighten-2 line-height-relaxed">
                    {{ rocket.description || 'Tidak ada informasi deskripsi yang tersedia untuk konfigurasi roket ini.' }}
                  </p>
                </div>
              </div>

              <!-- Primary Required Specs Grid (Cost, Country, First Flight) -->
              <div class="specs-highlight-box border-subtle p-4 rounded mb-2">
                <v-row dense>
                  <!-- Cost Per Launch -->
                  <v-col
                    cols="12"
                    sm="4"
                    class="spec-highlight-item"
                  >
                    <div class="text-caption text-grey text-uppercase">
                      Biaya / Peluncuran
                    </div>
                    <div class="text-h6 font-weight-bold text-white mt-1">
                      {{ formatCost(rocket.launch_cost) }}
                    </div>
                  </v-col>

                  <!-- Country -->
                  <v-col
                    cols="12"
                    sm="4"
                    class="spec-highlight-item"
                  >
                    <div class="text-caption text-grey text-uppercase">
                      Negara Produsen
                    </div>
                    <div class="text-h6 font-weight-bold text-white mt-1">
                      {{ countryCode }}
                    </div>
                  </v-col>

                  <!-- First Flight -->
                  <v-col
                    cols="12"
                    sm="4"
                    class="spec-highlight-item"
                  >
                    <div class="text-caption text-grey text-uppercase">
                      Penerbangan Pertama
                    </div>
                    <div class="text-h6 font-weight-bold text-white mt-1">
                      {{ formatDate(rocket.maiden_flight) }}
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Additional Specifications Section -->
        <v-card class="specs-card bg-surface border-subtle mt-6 p-6">
          <h2 class="text-h6 font-weight-bold text-white mb-4">
            Spesifikasi Teknis & Performa
          </h2>

          <v-row dense>
            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Panjang (Length)
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ formatMetric(rocket.length, 'm') }}
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Diameter
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ formatMetric(rocket.diameter, 'm') }}
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Massa Peluncuran (Launch Mass)
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ formatMetric(rocket.launch_mass, 'T') }}
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Kapasitas Orbit Rendah (LEO)
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ formatMetric(rocket.leo_capacity, 'kg') }}
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Kapasitas GTO
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ formatMetric(rocket.gto_capacity, 'kg') }}
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Daya Dorong (Thrust)
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ formatMetric(rocket.to_thrust, 'kN') }}
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Total Peluncuran
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ rocket.total_launch_count ?? 'N/A' }}
              </div>
            </v-col>

            <v-col
              cols="6"
              sm="4"
              md="3"
              class="mb-4"
            >
              <div class="text-caption text-grey">
                Peluncuran Sukses
              </div>
              <div class="text-body-1 font-weight-medium text-white">
                {{ rocket.successful_launches ?? 'N/A' }}
              </div>
            </v-col>
          </v-row>

          <!-- External Links if available -->
          <div
            v-if="rocket.wiki_url || rocket.info_url"
            class="border-t pt-4 mt-2 d-flex flex-wrap gap-3"
          >
            <v-btn
              v-if="rocket.wiki_url"
              :href="rocket.wiki_url"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="white"
              size="small"
              class="text-none font-weight-medium"
              append-icon="mdi-open-in-new"
            >
              Wikipedia Roket
            </v-btn>

            <v-btn
              v-if="rocket.info_url"
              :href="rocket.info_url"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              color="grey-lighten-1"
              size="small"
              class="text-none font-weight-medium"
              append-icon="mdi-open-in-new"
            >
              Informasi Resmi
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rockets'
import RocketImage from '@/components/RocketImage.vue'
import UIStateError from '@/components/UIStateError.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocketId = computed(() => {
  const param = (route.params as Record<string, string | string[]>).id
  return Array.isArray(param) ? param[0] : param
})

const rocket = computed(() => store.selectedRocket)

const countryCode = computed(() => {
  return rocket.value?.manufacturer?.country_code || 'USA'
})

function loadRocketDetail() {
  if (rocketId.value) {
    store.fetchRocketById(rocketId.value)
  }
}

onMounted(() => {
  loadRocketDetail()
})

watch(rocketId, () => {
  loadRocketDetail()
})

function goBack() {
  router.push('/')
}

function formatCost(cost: string | number | null | undefined): string {
  if (cost === null || cost === undefined || cost === '') {
    return 'N/A'
  }
  const num = Number(cost)
  if (isNaN(num)) return 'N/A'
  if (num === 0) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num)
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}

function formatMetric(val: number | null | undefined, unit: string): string {
  if (val === null || val === undefined || isNaN(val)) {
    return 'N/A'
  }
  return `${val.toLocaleString('id-ID')} ${unit}`
}
</script>

<style scoped>
.rocket-detail-page {
  min-height: calc(100vh - 65px);
}

.detail-card {
  border-radius: 12px;
}

.image-column {
  min-height: 380px;
  background-color: #121214;
}

.detail-hero-img {
  height: 100% !important;
  min-height: 380px;
}

.border-subtle {
  border: 1px solid #27272a;
}

.border-t {
  border-top: 1px solid #27272a;
}

.specs-highlight-box {
  background-color: #0e0e10;
}

.spec-highlight-item {
  border-right: 1px solid #27272a;
  padding: 0.5rem 1rem;
}

@media (max-width: 600px) {
  .spec-highlight-item {
    border-right: none;
    border-bottom: 1px solid #27272a;
  }
}

.line-height-relaxed {
  line-height: 1.7;
}

.tracking-wider {
  letter-spacing: 0.08em;
}

.p-6 {
  padding: 1.5rem;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}
</style>
