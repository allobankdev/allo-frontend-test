<template>
  <v-container class="py-8 px-4 max-w-1200">
    <!-- Breadcrumb & Top Action Header -->
    <div class="d-flex flex-column flex-sm-row justify-space-between align-start align-sm-center ga-3 mb-6 pb-4 border-b-subtle">
      <div class="d-flex align-center ga-2 text-body-2">
        <router-link to="/" class="breadcrumb-link text-slate-500 font-weight-medium text-decoration-none">
          <v-icon icon="mdi-arrow-left" size="16" class="mr-1" />
          Rockets
        </router-link>
        <span class="text-slate-300">/</span>
        <span class="text-slate-900 font-weight-semibold text-truncate max-w-300">
          {{ rocket?.full_name || 'Rocket Details' }}
        </span>
      </div>

      <!-- Quick Action Buttons -->
      <div v-if="rocket" class="d-flex align-center ga-2">
        <v-btn
          variant="outlined"
          size="small"
          rounded="lg"
          prepend-icon="mdi-share-variant-outline"
          class="text-none font-weight-medium text-slate-700 action-outline-btn"
          @click="copyPageUrl"
        >
          Share
        </v-btn>

        <v-btn
          v-if="rocket.wiki_url"
          variant="outlined"
          size="small"
          rounded="lg"
          prepend-icon="mdi-wikipedia"
          append-icon="mdi-open-in-new"
          :href="rocket.wiki_url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-none font-weight-medium text-slate-700 action-outline-btn"
        >
          Wikipedia
        </v-btn>

        <v-btn
          v-if="rocket.info_url"
          variant="outlined"
          size="small"
          rounded="lg"
          append-icon="mdi-open-in-new"
          :href="rocket.info_url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-none font-weight-medium text-slate-700 action-outline-btn"
        >
          Official Info
        </v-btn>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingState v-if="store.loading" type="detail" />

    <!-- Error State with Retry -->
    <ErrorState
      v-else-if="store.error"
      title="Rocket Not Found"
      :message="store.error"
      @retry="loadData"
    >
      <template #actions>
        <v-btn
          variant="outlined"
          color="secondary"
          rounded="lg"
          class="text-none font-weight-medium"
          @click="goBack"
        >
          Back to list
        </v-btn>
      </template>
    </ErrorState>

    <!-- Professional Two-Column Detail Layout -->
    <div v-else-if="rocket">
      <v-row class="ga-0">
        <!-- Left Column: Media Preview & Key Highlights -->
        <v-col cols="12" md="5" class="pr-md-4 mb-6 mb-md-0">
          <div class="sticky-media-card">
            <!-- Media Container -->
            <div class="media-box rounded-2xl overflow-hidden bg-white mb-4">
              <div class="position-relative">
                <v-img
                  :src="rocket.image_url || DEFAULT_ROCKET_IMAGE"
                  height="340"
                  cover
                  class="rocket-detail-img"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height bg-slate-100">
                      <v-progress-circular color="secondary" indeterminate size="28" />
                    </div>
                  </template>

                  <template #error>
                    <div class="d-flex flex-column align-center justify-center fill-height bg-slate-100 text-slate-400">
                      <v-icon icon="mdi-image-off-outline" size="48" class="mb-1" />
                      <span class="text-caption font-weight-medium">No preview available</span>
                    </div>
                  </template>

                  <!-- Top Status Pill -->
                  <div class="pa-3 d-flex justify-space-between align-center">
                    <span
                      v-if="rocket.isLocal"
                      class="pill-badge pill-badge-amber"
                    >
                      <v-icon icon="mdi-account-edit" size="12" class="mr-1" />
                      Custom Vehicle
                    </span>
                    <span
                      v-else
                      :class="rocket.active ? 'pill-badge pill-badge-emerald' : 'pill-badge pill-badge-slate'"
                    >
                      <span class="pill-dot" :class="rocket.active ? 'bg-emerald' : 'bg-slate'" />
                      {{ rocket.active ? 'Active Fleet' : 'Retired Vehicle' }}
                    </span>

                    <span class="pill-badge pill-badge-white">
                      {{ rocket.manufacturer?.country_code || 'USA' }}
                    </span>
                  </div>
                </v-img>
              </div>

              <!-- Quick Facts Strip -->
              <div class="pa-4 bg-slate-50 border-t-subtle">
                <div class="d-flex justify-space-between align-center text-caption py-1">
                  <span class="text-slate-500 font-weight-medium">Cost / Launch</span>
                  <span class="text-slate-900 font-weight-bold">{{ formatCurrency(rocket.launch_cost) }}</span>
                </div>
                <div class="d-flex justify-space-between align-center text-caption py-1">
                  <span class="text-slate-500 font-weight-medium">First Flight</span>
                  <span class="text-slate-900 font-weight-bold">{{ formatDate(rocket.maiden_flight) }}</span>
                </div>
                <div class="d-flex justify-space-between align-center text-caption py-1">
                  <span class="text-slate-500 font-weight-medium">Reusable Booster</span>
                  <span class="text-slate-900 font-weight-bold">
                    {{ rocket.reusable ? 'Yes' : 'Expendable' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Manufacturer Profile Card -->
            <div class="spec-card pa-4 rounded-xl bg-white mb-4">
              <div class="d-flex align-center mb-3">
                <div class="mfg-icon-box mr-3">
                  <v-icon icon="mdi-domain" size="18" color="primary" />
                </div>
                <div>
                  <span class="text-subtitle-2 font-weight-bold text-slate-900 d-block">
                    {{ rocket.manufacturer?.name || 'SpaceX' }}
                  </span>
                  <span class="text-caption text-slate-500">
                    {{ rocket.manufacturer?.administrator || 'Aerospace Manufacturer' }}
                  </span>
                </div>
              </div>
              <p class="text-caption text-slate-600 mb-0 line-clamp-3">
                {{ rocket.manufacturer?.description || 'Space Exploration Technologies Corp. is an American aerospace company founded with the goal of revolutionizing space transportation.' }}
              </p>
            </div>
          </div>
        </v-col>

        <!-- Right Column: Title, Overview, Reliability & Deep Specs -->
        <v-col cols="12" md="7" class="pl-md-4">
          <!-- Title & Badges -->
          <div class="mb-6">
            <div class="d-flex flex-wrap ga-2 align-center mb-2">
              <span v-if="rocket.family" class="meta-tag">
                {{ rocket.family }} Series
              </span>
              <span v-if="rocket.variant" class="meta-tag">
                Variant {{ rocket.variant }}
              </span>
            </div>
            <h1 class="text-h4 font-weight-bold text-slate-900 tracking-tight mb-3">
              {{ rocket.full_name }}
            </h1>
            <p class="text-body-1 text-slate-600 description-paragraph mb-0">
              {{ rocket.description || 'No detailed overview recorded for this launcher configuration in the catalog database.' }}
            </p>
          </div>

          <!-- Mission Reliability Meter (if launch stats available) -->
          <div v-if="hasReliabilityStats" class="spec-card pa-5 rounded-2xl bg-white mb-6">
            <div class="d-flex justify-space-between align-center mb-3">
              <div>
                <span class="text-caption font-weight-bold text-uppercase tracking-wider text-slate-400 d-block">
                  Mission Reliability Record
                </span>
                <span class="text-subtitle-2 font-weight-bold text-slate-900">
                  {{ rocket.successful_launches }} of {{ rocket.total_launch_count }} launches successful
                </span>
              </div>
              <div class="text-right">
                <span class="text-h6 font-weight-bold text-emerald">
                  {{ reliabilityPercent }}%
                </span>
              </div>
            </div>

            <!-- Reliability Progress Bar -->
            <v-progress-linear
              :model-value="reliabilityPercent"
              color="#059669"
              bg-color="#e2e8f0"
              height="8"
              rounded
              class="mb-3"
            />

            <div class="d-flex justify-space-between text-caption text-slate-500">
              <span>
                <v-icon icon="mdi-check-circle" size="14" color="success" class="mr-1" />
                {{ rocket.consecutive_successful_launches || 0 }} consecutive successes
              </span>
              <span v-if="rocket.failed_launches !== undefined">
                {{ rocket.failed_launches }} anomaly / failure
              </span>
            </div>
          </div>

          <!-- Specifications Categories Grid -->
          <div class="d-flex flex-column ga-4">
            <!-- Dimensions & Architecture -->
            <div class="spec-card pa-5 rounded-2xl bg-white">
              <h3 class="text-caption font-weight-bold text-uppercase tracking-wider text-slate-400 mb-4 d-flex align-center">
                <v-icon icon="mdi-ruler" size="14" class="mr-2 text-slate-400" />
                Physical Dimensions & Architecture
              </h3>

              <v-row dense>
                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">Height / Length</span>
                  <span class="spec-val">{{ rocket.length ? `${rocket.length} m` : 'N/A' }}</span>
                </v-col>

                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">Diameter</span>
                  <span class="spec-val">{{ rocket.diameter ? `${rocket.diameter} m` : 'N/A' }}</span>
                </v-col>

                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">Stage Count</span>
                  <span class="spec-val">
                    {{ rocket.min_stage !== null && rocket.min_stage !== undefined ? (rocket.min_stage === rocket.max_stage ? `${rocket.min_stage} Stages` : `${rocket.min_stage} - ${rocket.max_stage} Stages`) : 'N/A' }}
                  </span>
                </v-col>
              </v-row>
            </div>

            <!-- Payload & Thrust Capabilities -->
            <div class="spec-card pa-5 rounded-2xl bg-white">
              <h3 class="text-caption font-weight-bold text-uppercase tracking-wider text-slate-400 mb-4 d-flex align-center">
                <v-icon icon="mdi-weight" size="14" class="mr-2 text-slate-400" />
                Payload Capacity & Propulsion
              </h3>

              <v-row dense>
                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">LEO Payload</span>
                  <span class="spec-val">
                    {{ rocket.leo_capacity ? `${rocket.leo_capacity.toLocaleString()} kg` : 'N/A' }}
                  </span>
                </v-col>

                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">GTO Payload</span>
                  <span class="spec-val">
                    {{ rocket.gto_capacity ? `${rocket.gto_capacity.toLocaleString()} kg` : 'N/A' }}
                  </span>
                </v-col>

                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">Liftoff Thrust</span>
                  <span class="spec-val">
                    {{ rocket.to_thrust ? `${rocket.to_thrust.toLocaleString()} kN` : 'N/A' }}
                  </span>
                </v-col>
              </v-row>
            </div>

            <!-- Program & Mission Profile -->
            <div class="spec-card pa-5 rounded-2xl bg-white">
              <h3 class="text-caption font-weight-bold text-uppercase tracking-wider text-slate-400 mb-4 d-flex align-center">
                <v-icon icon="mdi-rocket-outline" size="14" class="mr-2 text-slate-400" />
                Mission Economics & Status
              </h3>

              <v-row dense>
                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">Launch Price</span>
                  <span class="spec-val text-slate-900">{{ formatCurrency(rocket.launch_cost) }}</span>
                </v-col>

                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">Fleet Status</span>
                  <span class="spec-val" :class="rocket.active ? 'text-emerald' : 'text-slate-600'">
                    {{ rocket.active ? 'Operational' : 'Retired' }}
                  </span>
                </v-col>

                <v-col cols="6" sm="4" class="py-2">
                  <span class="spec-label">Debut Flight</span>
                  <span class="spec-val">{{ formatDate(rocket.maiden_flight) }}</span>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>

    <!-- Toast Copy Link Notification -->
    <v-snackbar
      v-model="showSnackbar"
      color="surface"
      location="bottom right"
      timeout="2500"
      rounded="lg"
      class="custom-snackbar"
    >
      <div class="d-flex align-center text-slate-900 py-1">
        <v-icon icon="mdi-check-circle" color="success" class="mr-2" size="20" />
        <span class="text-body-2 font-weight-medium">Link copied to clipboard!</span>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { formatCurrency, formatDate, DEFAULT_ROCKET_IMAGE } from '@/utils/formatters'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = computed(() => store.selectedRocket)
const showSnackbar = ref(false)

const hasReliabilityStats = computed(() => {
  if (!rocket.value) return false
  return Boolean(
    rocket.value.total_launch_count &&
    rocket.value.total_launch_count > 0 &&
    rocket.value.successful_launches !== undefined
  )
})

const reliabilityPercent = computed(() => {
  if (!rocket.value || !rocket.value.total_launch_count) return 0
  const rate = (rocket.value.successful_launches || 0) / rocket.value.total_launch_count
  return Math.round(rate * 1000) / 10
})

function loadData() {
  const id = route.params.id as string
  if (id) {
    store.fetchRocketDetail(id)
  }
}

watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      store.fetchRocketDetail(newId as string)
    }
  }
)

function goBack() {
  router.push('/')
}

function copyPageUrl() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href)
    showSnackbar.value = true
  }
}

onMounted(() => {
  loadData()
})

onUnmounted(() => {
  store.clearSelectedRocket()
})
</script>

<style scoped>
.max-w-1200 {
  max-width: 1100px;
}

.max-w-300 {
  max-width: 300px;
}

.border-b-subtle {
  border-bottom: 1px solid #e2e8f0;
}

.border-t-subtle {
  border-top: 1px solid #e2e8f0;
}

.breadcrumb-link {
  transition: color 0.15s ease;
}

.breadcrumb-link:hover {
  color: #0f172a !important;
}

.action-outline-btn {
  border-color: #e2e8f0 !important;
  background-color: #ffffff !important;
}

.action-outline-btn:hover {
  border-color: #cbd5e1 !important;
  background-color: #f8fafc !important;
}

.sticky-media-card {
  position: sticky;
  top: 80px;
}

.media-box {
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
}

.spec-card {
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.mfg-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background-color: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.meta-tag {
  display: inline-flex;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
  background-color: #f1f5f9;
  padding: 2px 8px;
  border-radius: 6px;
}

.description-paragraph {
  line-height: 1.7;
}

.pill-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 9999px;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 6px;
}

.bg-emerald {
  background-color: #059669;
}

.text-emerald {
  color: #059669 !important;
}

.bg-slate {
  background-color: #94a3b8;
}

.pill-badge-emerald {
  background-color: rgba(236, 253, 245, 0.95);
  color: #047857;
  border: 1px solid #a7f3d0;
}

.pill-badge-slate {
  background-color: rgba(248, 250, 252, 0.95);
  color: #475569;
  border: 1px solid #e2e8f0;
}

.pill-badge-amber {
  background-color: rgba(255, 251, 235, 0.95);
  color: #b45309;
  border: 1px solid #fde68a;
}

.pill-badge-white {
  background-color: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  border: 1px solid #e2e8f0;
}

.spec-label {
  display: block;
  font-size: 0.725rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  margin-bottom: 2px;
}

.spec-val {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
}

.tracking-tight {
  letter-spacing: -0.025em;
}

.tracking-wider {
  letter-spacing: 0.05em;
}

.custom-snackbar :deep(.v-snackbar__wrapper) {
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
</style>
