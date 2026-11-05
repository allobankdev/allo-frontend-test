<template>
  <div class="blueprint-grid-bg min-vh-100 pb-12">
    <!-- Top Navigation Deck -->
    <AppNavbar @open-add-dialog="isAddModalOpen = true" />

    <v-container
      class="py-6 py-md-10"
      max-width="1280"
    >
      <!-- Navigation Return Action -->
      <div class="mb-6">
        <v-btn
          variant="text"
          color="secondary"
          prepend-icon="mdi-arrow-left"
          class="text-none font-weight-medium px-0"
          @click="goBack"
        >
          Return to Fleet Directory
        </v-btn>
      </div>

      <!-- State: Loading Spec Skeleton -->
      <div v-if="store.isDetailLoading">
        <v-row>
          <v-col
            cols="12"
            md="5"
          >
            <div class="cad-frame rounded-sm pa-4">
              <v-skeleton-loader
                type="image"
                height="380"
                class="bg-surface-variant mb-4"
              />
              <v-skeleton-loader
                type="text"
                width="60%"
              />
            </div>
          </v-col>
          <v-col
            cols="12"
            md="7"
          >
            <v-skeleton-loader
              type="text"
              width="120"
              class="mb-2"
            />
            <v-skeleton-loader
              type="heading"
              class="mb-4"
            />
            <v-skeleton-loader
              type="paragraph"
              class="mb-6"
            />
            <v-row dense>
              <v-col
                v-for="n in 4"
                :key="n"
                cols="6"
              >
                <div class="cad-frame rounded-sm pa-4">
                  <v-skeleton-loader
                    type="text"
                    width="80"
                    class="mb-2"
                  />
                  <v-skeleton-loader
                    type="text"
                    width="140"
                  />
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </div>

      <!-- State: Error with Retry -->
      <StatusState
        v-else-if="store.detailError"
        type="error"
        title="Failed to Load Vehicle Specifications"
        :message="store.detailError"
        @retry="loadData"
      />

      <!-- State: Success Flight Dossier -->
      <div v-else-if="rocket">
        <v-row>
          <!-- Left Column: Visual Media Showcase & Pod Details -->
          <v-col
            cols="12"
            md="5"
            lg="5"
          >
            <div class="cad-frame rounded-sm overflow-hidden sticky-card">
              <div class="position-relative bg-surface-variant overflow-hidden">
                <v-img
                  :src="displayImage"
                  height="380"
                  cover
                  class="align-end"
                  @error="onImageError"
                >
                  <template #placeholder>
                    <div class="d-flex align-center justify-center fill-height bg-surface-variant">
                      <v-progress-circular
                        indeterminate
                        color="primary"
                        size="32"
                      />
                    </div>
                  </template>
                </v-img>

                <!-- Status Badges Overlay -->
                <div class="position-absolute top-0 start-0 pa-3 d-flex flex-wrap ga-2">
                  <span
                    v-if="rocket.is_custom"
                    class="detail-tag detail-tag-custom font-mono"
                  >
                    Custom Registration
                  </span>

                  <span
                    v-if="rocket.active !== null && rocket.active !== undefined"
                    :class="['detail-tag font-mono', rocket.active ? 'detail-tag-active' : 'detail-tag-retired']"
                  >
                    {{ rocket.active ? 'Operational' : 'Retired Variant' }}
                  </span>

                  <span
                    v-if="rocket.reusable"
                    class="detail-tag detail-tag-reusable font-mono"
                  >
                    Reusable Architecture
                  </span>
                </div>
              </div>

              <!-- Avionics Metadata Strip -->
              <div
                class="pa-4 bg-surface border-t"
                style="border-color: var(--titanium-border);"
              >
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="font-mono text-caption text-secondary">REGISTRY ID</span>
                  <span class="font-mono text-caption text-primary font-weight-bold">#{{ rocket.id }}</span>
                </div>
                <div class="d-flex justify-space-between align-center mb-2">
                  <span class="font-mono text-caption text-secondary">MANUFACTURER</span>
                  <span class="font-mono text-caption text-high-emphasis font-weight-medium">
                    {{ rocket.manufacturer?.name || 'SpaceX' }}
                  </span>
                </div>
                <div class="d-flex justify-space-between align-center">
                  <span class="font-mono text-caption text-secondary">ORIGIN JURISDICTION</span>
                  <span class="font-mono text-caption text-high-emphasis font-weight-medium">
                    {{ countryName }}
                  </span>
                </div>
              </div>
            </div>
          </v-col>

          <!-- Right Column: Aerospace Technical Spec Sheet -->
          <v-col
            cols="12"
            md="7"
            lg="7"
          >
            <div class="ps-md-4">
              <!-- Family & Variant Identifier -->
              <div class="d-flex align-center ga-2 mb-2">
                <span
                  class="font-mono text-caption text-primary font-weight-bold px-2 py-1 bg-surface-variant rounded-sm border"
                  style="border-color: var(--titanium-border);"
                >
                  {{ rocket.family || 'SpaceX Architecture' }}
                </span>
                <span class="font-mono text-caption text-secondary">
                  LL2 CONFIG v2.2.0
                </span>
              </div>

              <!-- Vehicle Name -->
              <h1 class="text-h4 text-lg-h3 font-weight-bold text-high-emphasis tracking-tight mb-4">
                {{ rocket.full_name || rocket.name || 'Unnamed Configuration' }}
              </h1>

              <!-- 4-Quadrant Technical Spec Matrix -->
              <div class="mb-6">
                <div class="font-mono text-caption text-secondary text-uppercase mb-3 tracking-wider">
                  Avionics &amp; Commercial Specifications
                </div>

                <v-row
                  dense
                  class="ga-y-3"
                >
                  <!-- Metric 1: Cost per Launch -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <div class="cad-frame pa-4 rounded-sm h-100">
                      <div class="font-mono text-caption text-secondary mb-1">
                        Cost Per Launch
                      </div>
                      <div class="font-mono text-h6 font-weight-bold text-primary">
                        {{ formattedCost }}
                      </div>
                    </div>
                  </v-col>

                  <!-- Metric 2: Maiden Flight -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <div class="cad-frame pa-4 rounded-sm h-100">
                      <div class="font-mono text-caption text-secondary mb-1">
                        First Flight (Maiden)
                      </div>
                      <div class="font-mono text-h6 font-weight-bold text-high-emphasis">
                        {{ formattedMaidenFlight }}
                      </div>
                    </div>
                  </v-col>

                  <!-- Metric 3: Country of Origin -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <div class="cad-frame pa-4 rounded-sm h-100">
                      <div class="font-mono text-caption text-secondary mb-1">
                        Origin Country
                      </div>
                      <div class="font-mono text-h6 font-weight-bold text-high-emphasis">
                        {{ countryName }}
                      </div>
                    </div>
                  </v-col>

                  <!-- Metric 4: Stage Reusability -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <div class="cad-frame pa-4 rounded-sm h-100">
                      <div class="font-mono text-caption text-secondary mb-1">
                        Reusability Class
                      </div>
                      <div
                        class="font-mono text-h6 font-weight-bold"
                        :class="rocket.reusable ? 'text-primary' : 'text-secondary'"
                      >
                        {{ rocket.reusable ? 'Reusable First Stage' : 'Expendable Architecture' }}
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <!-- Technical Mission Dossier Description -->
              <div class="cad-frame pa-5 rounded-sm mb-6">
                <div class="font-mono text-caption text-secondary text-uppercase mb-2 tracking-wider">
                  Engineering Overview &amp; Mission Profile
                </div>
                <p class="text-body-1 text-high-emphasis dossier-text">
                  {{ rocket.description || 'No detailed mission description has been filed for this launch vehicle.' }}
                </p>
              </div>

              <!-- Extended Orbital Telemetry (if available) -->
              <div
                v-if="hasExtendedSpecs"
                class="cad-frame pa-5 rounded-sm"
              >
                <div class="font-mono text-caption text-secondary text-uppercase mb-3 tracking-wider">
                  Extended Orbital Payload Specs
                </div>
                <v-row dense>
                  <v-col
                    v-if="rocket.leo_capacity"
                    cols="6"
                    sm="4"
                  >
                    <div class="font-mono text-caption text-secondary">
                      LEO Capacity
                    </div>
                    <div class="font-mono text-subtitle-2 font-weight-bold text-high-emphasis">
                      {{ rocket.leo_capacity.toLocaleString() }} kg
                    </div>
                  </v-col>
                  <v-col
                    v-if="rocket.gto_capacity"
                    cols="6"
                    sm="4"
                  >
                    <div class="font-mono text-caption text-secondary">
                      GTO Capacity
                    </div>
                    <div class="font-mono text-subtitle-2 font-weight-bold text-high-emphasis">
                      {{ rocket.gto_capacity.toLocaleString() }} kg
                    </div>
                  </v-col>
                  <v-col
                    v-if="rocket.total_launch_count"
                    cols="6"
                    sm="4"
                  >
                    <div class="font-mono text-caption text-secondary">
                      Total Launches
                    </div>
                    <div class="font-mono text-subtitle-2 font-weight-bold text-high-emphasis">
                      {{ rocket.total_launch_count }}
                    </div>
                  </v-col>
                  <v-col
                    v-if="rocket.successful_launches"
                    cols="6"
                    sm="4"
                  >
                    <div class="font-mono text-caption text-secondary">
                      Successful Flights
                    </div>
                    <div class="font-mono text-subtitle-2 font-weight-bold text-success">
                      {{ rocket.successful_launches }}
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- Add Rocket Dialog Modal -->
    <AddRocketModal
      v-model="isAddModalOpen"
      @rocket-added="handleRocketAdded"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import AppNavbar from '@/components/AppNavbar.vue'
import StatusState from '@/components/StatusState.vue'
import AddRocketModal from '@/components/AddRocketModal.vue'
import { formatCurrency, formatDate } from '@/utils/formatters'
import fallbackImage from '@/assets/rocket-placeholder.svg'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const isAddModalOpen = ref(false)
const imageLoadFailed = ref(false)

const rocketId = computed(() => {
  const params = route.params as { id?: string | string[] }
  const param = params.id
  return Array.isArray(param) ? param[0] : param
})

const rocket = computed(() => {
  return store.selectedRocket
})

const displayImage = computed(() => {
  if (imageLoadFailed.value || !rocket.value?.image_url) {
    return fallbackImage
  }
  return rocket.value.image_url
})

const formattedCost = computed(() => {
  return formatCurrency(rocket.value?.launch_cost)
})

const formattedMaidenFlight = computed(() => {
  return formatDate(rocket.value?.maiden_flight)
})

const countryName = computed(() => {
  const code = rocket.value?.manufacturer?.country_code
  if (!code) return 'N/A'
  if (code === 'USA') return 'United States (USA)'
  return code
})

const hasExtendedSpecs = computed(() => {
  if (!rocket.value) return false
  return Boolean(
    rocket.value.leo_capacity ||
      rocket.value.gto_capacity ||
      rocket.value.total_launch_count ||
      rocket.value.successful_launches
  )
})

onMounted(() => {
  loadData()
})

function loadData() {
  if (rocketId.value) {
    store.fetchRocketDetail(rocketId.value)
  }
}

function onImageError() {
  imageLoadFailed.value = true
}

function goBack() {
  router.push('/')
}

function handleRocketAdded() {
  router.push('/')
}
</script>

<style scoped>
.tracking-tight {
  letter-spacing: -0.5px;
}

.tracking-wider {
  letter-spacing: 1px;
}

.sticky-card {
  position: sticky;
  top: 80px;
}

.detail-tag {
  display: inline-block;
  padding: 3px 8px;
  font-size: 0.72rem;
  font-weight: 600;
  border-radius: 2px;
  background: rgba(15, 22, 38, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text-high);
}

.detail-tag-active {
  color: var(--signal-emerald);
  border-color: rgba(16, 185, 129, 0.4);
}

.detail-tag-retired {
  color: var(--text-mid);
  border-color: rgba(148, 163, 184, 0.3);
}

.detail-tag-reusable {
  color: var(--lox-cyan);
  border-color: rgba(56, 189, 248, 0.4);
}

.detail-tag-custom {
  color: var(--burn-amber);
  border-color: rgba(245, 158, 11, 0.4);
}

.dossier-text {
  line-height: 1.8;
  max-width: 72ch;
  color: #cbd5e1 !important;
}
</style>
