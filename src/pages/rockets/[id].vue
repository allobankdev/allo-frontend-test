<template>
  <v-container class="py-6 py-md-10 max-width-lg">
    <!-- Back Navigation Button -->
    <div class="mb-6">
      <v-btn
        variant="tonal"
        color="primary"
        prepend-icon="mdi-arrow-left"
        class="font-weight-medium rounded-lg"
        @click="goBack"
      >
        Kembali ke Katalog
      </v-btn>
    </div>

    <!-- 1. LOADING STATE -->
    <v-card
      v-if="rocketStore.isDetailLoading"
      class="rounded-xl elevation-1 border pa-6"
    >
      <v-skeleton-loader
        type="image, heading, paragraph, text, actions"
        height="500"
      />
    </v-card>

    <!-- 2. ERROR STATE -->
    <ErrorState
      v-else-if="rocketStore.detailError"
      title="Gagal Memuat Detail Roket"
      :message="rocketStore.detailError"
      :loading="rocketStore.isDetailLoading"
      @retry="loadDetail"
    />

    <!-- 3. SUCCESS STATE: ROCKET DETAIL -->
    <v-card
      v-else-if="rocket"
      class="rounded-xl elevation-3 border overflow-hidden"
      color="surface"
    >
      <!-- Hero Image Banner with Gradient Overlay -->
      <div
        class="position-relative overflow-hidden"
        style="max-height: 460px; background-color: #0b1118;"
      >
        <v-img
          :src="imageUrl"
          :alt="rocket.full_name"
          height="420"
          cover
          @error="onImageError"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
              <v-progress-circular
                indeterminate
                color="primary"
              />
            </div>
          </template>
        </v-img>

        <!-- Gradient Vignette -->
        <div class="hero-gradient-overlay" />

        <!-- Floating Badges on Hero Image -->
        <div
          class="position-absolute d-flex ga-2"
          style="top: 20px; left: 24px;"
        >
          <v-chip
            v-if="rocket.isCustom"
            color="amber-accent-4"
            variant="flat"
            size="small"
            class="font-weight-bold elevation-4"
          >
            <v-icon
              start
              icon="mdi-star"
              size="14"
            />
            Custom Rocket
          </v-chip>

          <v-chip
            v-if="countryCode !== 'N/A'"
            color="surface"
            variant="flat"
            size="small"
            class="font-weight-bold text-uppercase elevation-4"
          >
            <v-icon
              start
              icon="mdi-flag"
              size="14"
            />
            {{ countryCode }}
          </v-chip>
        </div>
      </div>

      <!-- Detail Information Body -->
      <v-card-text class="pa-6 pa-md-8">
        <!-- Title and Manufacturer -->
        <div class="mb-6">
          <div class="text-caption text-primary font-weight-bold text-uppercase tracking-wider mb-1">
            {{ manufacturerName }}
          </div>
          <h1 class="text-h4 text-md-h3 font-weight-bold text-high-emphasis">
            {{ rocket.full_name }}
          </h1>
        </div>

        <!-- Metric Stat Cards Grid -->
        <v-row
          class="mb-8"
          dense
        >
          <!-- Launch Cost -->
          <v-col
            cols="12"
            sm="4"
          >
            <v-card
              variant="tonal"
              color="primary"
              class="pa-4 rounded-xl h-100"
            >
              <div class="d-flex align-center ga-3 mb-2">
                <v-avatar
                  color="primary"
                  size="36"
                >
                  <v-icon
                    icon="mdi-currency-usd"
                    color="black"
                    size="20"
                  />
                </v-avatar>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
                  Biaya per Peluncuran
                </div>
              </div>
              <div class="text-h6 font-weight-bold text-high-emphasis pl-1">
                {{ formattedCost }}
              </div>
            </v-card>
          </v-col>

          <!-- First Flight -->
          <v-col
            cols="12"
            sm="4"
          >
            <v-card
              variant="tonal"
              color="primary"
              class="pa-4 rounded-xl h-100"
            >
              <div class="d-flex align-center ga-3 mb-2">
                <v-avatar
                  color="primary"
                  size="36"
                >
                  <v-icon
                    icon="mdi-calendar-start"
                    color="black"
                    size="20"
                  />
                </v-avatar>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
                  Penerbangan Perdana
                </div>
              </div>
              <div class="text-h6 font-weight-bold text-high-emphasis pl-1">
                {{ formattedMaidenFlight }}
              </div>
            </v-card>
          </v-col>

          <!-- Country of Origin -->
          <v-col
            cols="12"
            sm="4"
          >
            <v-card
              variant="tonal"
              color="primary"
              class="pa-4 rounded-xl h-100"
            >
              <div class="d-flex align-center ga-3 mb-2">
                <v-avatar
                  color="primary"
                  size="36"
                >
                  <v-icon
                    icon="mdi-earth"
                    color="black"
                    size="20"
                  />
                </v-avatar>
                <div class="text-caption text-medium-emphasis text-uppercase font-weight-medium">
                  Negara Asal
                </div>
              </div>
              <div class="text-h6 font-weight-bold text-high-emphasis pl-1">
                {{ countryCode }}
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Description Section -->
        <div>
          <h2 class="text-h6 font-weight-bold mb-3 d-flex align-center ga-2">
            <v-icon
              icon="mdi-information-outline"
              color="primary"
              size="22"
            />
            Deskripsi & Riwayat
          </h2>
          <p class="text-body-1 text-medium-emphasis leading-relaxed mb-0">
            {{ displayDescription }}
          </p>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Technical Footer Metadata (Tanpa Tombol Duplikat) -->
      <v-card-actions class="pa-4 pa-sm-6 bg-surface-light d-flex flex-wrap justify-space-between align-center ga-2">
        <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
          <v-icon
            icon="mdi-pound"
            size="16"
            color="primary"
          />
          <span>ID Konfigurasi Sistem: <strong>{{ rocket.id }}</strong></span>
        </div>
        <div class="d-flex align-center ga-2 text-caption text-medium-emphasis">
          <v-icon
            icon="mdi-cloud-check"
            size="16"
            color="primary"
          />
          <span>Sumber Resmi Launch Library 2 API v2.2.0</span>
        </div>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import ErrorState from '@/components/ErrorState.vue'
import { formatCurrency, formatDate, FALLBACK_ROCKET_IMAGE } from '@/utils/formatters'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()
const imageFailed = ref(false)

const rocketId = computed(() => route.params.id as string)
const rocket = computed(() => rocketStore.selectedRocket)

onMounted(() => {
  rocketStore.initCustomRockets()
  loadDetail()
})

function loadDetail() {
  if (rocketId.value) {
    rocketStore.fetchRocketById(rocketId.value)
  }
}

function goBack() {
  router.push('/')
}

function onImageError() {
  imageFailed.value = true
}

const imageUrl = computed(() => {
  if (imageFailed.value || !rocket.value?.image_url) {
    return FALLBACK_ROCKET_IMAGE
  }
  return rocket.value.image_url
})

const manufacturerName = computed(() => {
  return rocket.value?.manufacturer?.name || 'SpaceX'
})

const countryCode = computed(() => {
  return rocket.value?.manufacturer?.country_code || 'N/A'
})

const formattedCost = computed(() => {
  return formatCurrency(rocket.value?.launch_cost)
})

const formattedMaidenFlight = computed(() => {
  return formatDate(rocket.value?.maiden_flight)
})

const displayDescription = computed(() => {
  if (!rocket.value?.description || rocket.value.description.trim() === '') {
    return 'Deskripsi teknis dan detail operasional roket ini belum tersedia dalam basis data resmi Launch Library 2.'
  }
  return rocket.value.description
})
</script>

<style scoped>
.max-width-lg {
  max-width: 960px;
}

.hero-gradient-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.1) 60%, rgba(0, 0, 0, 0) 100%);
  pointer-events: none;
}

.leading-relaxed {
  line-height: 1.8;
}

.tracking-wider {
  letter-spacing: 0.08em;
}
</style>
