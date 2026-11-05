<template>
  <div>
    <!-- Top Navbar -->
    <AppNavbar @open-add-dialog="isAddModalOpen = true" />

    <v-container
      class="py-6 py-md-10"
      max-width="1280"
    >
      <!-- Back Navigation Bar -->
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

      <!-- State: Loading Skeleton -->
      <div v-if="store.isDetailLoading">
        <v-row>
          <v-col
            cols="12"
            md="5"
          >
            <v-skeleton-loader
              type="image"
              height="420"
              class="rounded-lg bg-surface-variant"
            />
          </v-col>
          <v-col
            cols="12"
            md="7"
          >
            <v-skeleton-loader
              type="chip"
              width="120"
              class="mb-2"
            />
            <v-skeleton-loader
              type="heading"
              class="mb-4"
            />
            <v-skeleton-loader
              type="paragraph"
              class="mb-4"
            />
            <v-row dense>
              <v-col
                v-for="n in 4"
                :key="n"
                cols="6"
              >
                <v-skeleton-loader
                  type="card"
                  height="90"
                  class="rounded-lg"
                />
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

      <!-- State: Success Rocket Detail -->
      <div v-else-if="rocket">
        <v-row>
          <!-- Left Column: Visual Media Showcase -->
          <v-col
            cols="12"
            md="5"
            lg="5"
          >
            <v-card
              color="surface"
              class="rounded-lg overflow-hidden border sticky-card"
              elevation="0"
              style="border-color: rgba(255, 255, 255, 0.08) !important;"
            >
              <div class="position-relative bg-surface-variant">
                <v-img
                  :src="displayImage"
                  height="400"
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

                <!-- Floating Status Badges -->
                <div class="position-absolute top-0 start-0 pa-4 d-flex flex-wrap ga-2">
                  <v-chip
                    v-if="rocket.is_custom"
                    size="small"
                    color="accent"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    <v-icon
                      icon="mdi-account-edit"
                      start
                      size="14"
                    />
                    USER CREATED
                  </v-chip>

                  <v-chip
                    v-if="rocket.active !== null && rocket.active !== undefined"
                    size="small"
                    :color="rocket.active ? 'success' : 'secondary'"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    <v-icon
                      :icon="rocket.active ? 'mdi-check-circle' : 'mdi-archive'"
                      start
                      size="14"
                    />
                    {{ rocket.active ? 'ACTIVE VEHICLE' : 'RETIRED' }}
                  </v-chip>

                  <v-chip
                    v-if="rocket.reusable"
                    size="small"
                    color="info"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    <v-icon
                      icon="mdi-recycle"
                      start
                      size="14"
                    />
                    REUSABLE
                  </v-chip>
                </div>
              </div>

              <!-- Quick Meta Footer -->
              <v-card-text
                class="pa-4 bg-surface border-t"
                style="border-color: rgba(255, 255, 255, 0.08) !important;"
              >
                <div class="d-flex justify-space-between align-center">
                  <span class="text-caption text-secondary font-mono">SPECIFICATION SHEET</span>
                  <span class="text-caption text-primary font-mono font-weight-bold">ID: #{{ rocket.id }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Right Column: Aerospace Technical Spec Sheet -->
          <v-col
            cols="12"
            md="7"
            lg="7"
          >
            <div class="ps-md-4">
              <!-- Subtitle & Family -->
              <div class="d-flex align-center ga-2 mb-2">
                <v-chip
                  size="x-small"
                  color="primary"
                  variant="tonal"
                  class="font-weight-bold text-uppercase"
                >
                  {{ rocket.family || 'SpaceX System' }}
                </v-chip>
                <span class="text-caption text-secondary font-mono">
                  MANUFACTURER: {{ rocket.manufacturer?.name || 'SpaceX' }}
                </span>
              </div>

              <!-- Rocket Name -->
              <h1 class="text-h4 text-lg-h3 font-weight-black text-high-emphasis text-uppercase mb-4">
                {{ rocket.full_name || rocket.name || 'Unnamed Launch Vehicle' }}
              </h1>

              <!-- Core Technical Spec Grid (6 Key Metrics Required by Allo Bank) -->
              <div class="mb-6">
                <div
                  class="text-caption font-mono text-secondary text-uppercase mb-3"
                  style="letter-spacing: 1px;"
                >
                  PRIMARY MISSION TELEMETRY
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
                    <v-card
                      color="surface"
                      class="pa-4 rounded-lg border h-100"
                      elevation="0"
                      style="border-color: rgba(255, 255, 255, 0.08) !important;"
                    >
                      <div class="d-flex align-center ga-3">
                        <v-avatar
                          color="rgba(56, 189, 248, 0.12)"
                          size="40"
                          rounded="sm"
                        >
                          <v-icon
                            icon="mdi-currency-usd"
                            color="primary"
                            size="22"
                          />
                        </v-avatar>
                        <div>
                          <div
                            class="text-caption text-secondary text-uppercase font-weight-medium"
                            style="font-size: 0.72rem;"
                          >
                            Cost Per Launch
                          </div>
                          <div class="text-h6 font-weight-bold font-mono text-primary">
                            {{ formattedCost }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Metric 2: Maiden Flight -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-card
                      color="surface"
                      class="pa-4 rounded-lg border h-100"
                      elevation="0"
                      style="border-color: rgba(255, 255, 255, 0.08) !important;"
                    >
                      <div class="d-flex align-center ga-3">
                        <v-avatar
                          color="rgba(245, 158, 11, 0.12)"
                          size="40"
                          rounded="sm"
                        >
                          <v-icon
                            icon="mdi-calendar-start"
                            color="warning"
                            size="22"
                          />
                        </v-avatar>
                        <div>
                          <div
                            class="text-caption text-secondary text-uppercase font-weight-medium"
                            style="font-size: 0.72rem;"
                          >
                            First Flight (Maiden)
                          </div>
                          <div class="text-h6 font-weight-bold font-mono text-high-emphasis">
                            {{ formattedMaidenFlight }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Metric 3: Country -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-card
                      color="surface"
                      class="pa-4 rounded-lg border h-100"
                      elevation="0"
                      style="border-color: rgba(255, 255, 255, 0.08) !important;"
                    >
                      <div class="d-flex align-center ga-3">
                        <v-avatar
                          color="rgba(16, 185, 129, 0.12)"
                          size="40"
                          rounded="sm"
                        >
                          <v-icon
                            icon="mdi-earth"
                            color="success"
                            size="22"
                          />
                        </v-avatar>
                        <div>
                          <div
                            class="text-caption text-secondary text-uppercase font-weight-medium"
                            style="font-size: 0.72rem;"
                          >
                            Country of Origin
                          </div>
                          <div class="text-h6 font-weight-bold font-mono text-high-emphasis">
                            {{ countryName }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>

                  <!-- Metric 4: Reusability Status -->
                  <v-col
                    cols="12"
                    sm="6"
                  >
                    <v-card
                      color="surface"
                      class="pa-4 rounded-lg border h-100"
                      elevation="0"
                      style="border-color: rgba(255, 255, 255, 0.08) !important;"
                    >
                      <div class="d-flex align-center ga-3">
                        <v-avatar
                          color="rgba(14, 165, 233, 0.12)"
                          size="40"
                          rounded="sm"
                        >
                          <v-icon
                            icon="mdi-autorenew"
                            color="info"
                            size="22"
                          />
                        </v-avatar>
                        <div>
                          <div
                            class="text-caption text-secondary text-uppercase font-weight-medium"
                            style="font-size: 0.72rem;"
                          >
                            Stage Reusability
                          </div>
                          <div class="text-h6 font-weight-bold font-mono text-high-emphasis">
                            {{ rocket.reusable ? 'REUSABLE' : 'EXPENDABLE' }}
                          </div>
                        </div>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </div>

              <!-- Description Section -->
              <v-card
                color="surface"
                class="pa-5 rounded-lg border mb-6"
                elevation="0"
                style="border-color: rgba(255, 255, 255, 0.08) !important;"
              >
                <div
                  class="text-caption font-mono text-secondary text-uppercase mb-2"
                  style="letter-spacing: 1px;"
                >
                  VEHICLE OVERVIEW &amp; MISSION PROFILE
                </div>
                <p
                  class="text-body-1 text-high-emphasis"
                  style="line-height: 1.7;"
                >
                  {{ rocket.description || 'No detailed mission description has been filed for this launch vehicle.' }}
                </p>
              </v-card>

              <!-- Extended Specifications (When Available) -->
              <v-card
                v-if="hasExtendedSpecs"
                color="surface"
                class="pa-5 rounded-lg border"
                elevation="0"
                style="border-color: rgba(255, 255, 255, 0.08) !important;"
              >
                <div
                  class="text-caption font-mono text-secondary text-uppercase mb-3"
                  style="letter-spacing: 1px;"
                >
                  EXTENDED ORBITAL SPECIFICATIONS
                </div>
                <v-row dense>
                  <v-col
                    v-if="rocket.leo_capacity"
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-secondary">
                      LEO Payload
                    </div>
                    <div class="text-subtitle-2 font-mono font-weight-bold text-high-emphasis">
                      {{ rocket.leo_capacity.toLocaleString() }} kg
                    </div>
                  </v-col>

                  <v-col
                    v-if="rocket.gto_capacity"
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-secondary">
                      GTO Payload
                    </div>
                    <div class="text-subtitle-2 font-mono font-weight-bold text-high-emphasis">
                      {{ rocket.gto_capacity.toLocaleString() }} kg
                    </div>
                  </v-col>

                  <v-col
                    v-if="rocket.total_launch_count"
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-secondary">
                      Total Launches
                    </div>
                    <div class="text-subtitle-2 font-mono font-weight-bold text-high-emphasis">
                      {{ rocket.total_launch_count }}
                    </div>
                  </v-col>

                  <v-col
                    v-if="rocket.successful_launches"
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-secondary">
                      Successful Missions
                    </div>
                    <div class="text-subtitle-2 font-mono font-weight-bold text-success">
                      {{ rocket.successful_launches }}
                    </div>
                  </v-col>

                  <v-col
                    v-if="rocket.successful_landings"
                    cols="6"
                    sm="4"
                  >
                    <div class="text-caption text-secondary">
                      Successful Landings
                    </div>
                    <div class="text-subtitle-2 font-mono font-weight-bold text-info">
                      {{ rocket.successful_landings }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- Add Rocket Dialog Modal (also available on detail page via navbar) -->
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
import { formatCurrency, formatDate, formatFallback } from '@/utils/formatters'
import AppNavbar from '@/components/AppNavbar.vue'
import StatusState from '@/components/StatusState.vue'
import AddRocketModal from '@/components/AddRocketModal.vue'
import placeholderSvg from '@/assets/rocket-placeholder.svg'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const isAddModalOpen = ref(false)
const imageLoadFailed = ref(false)

const rocketId = computed(() => {
  const params = route.params as Record<string, string | string[]>
  return Array.isArray(params.id) ? params.id[0] : params.id
})

const rocket = computed(() => {
  return store.selectedRocket
})

const displayImage = computed(() => {
  if (imageLoadFailed.value || !rocket.value?.image_url) {
    return placeholderSvg
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
  return formatFallback(rocket.value?.manufacturer?.country_code, 'USA')
})

const hasExtendedSpecs = computed(() => {
  if (!rocket.value) return false
  return !!(
    rocket.value.leo_capacity ||
    rocket.value.gto_capacity ||
    rocket.value.total_launch_count ||
    rocket.value.successful_launches ||
    rocket.value.successful_landings
  )
})

function onImageError() {
  imageLoadFailed.value = true
}

function goBack() {
  router.push('/')
}

function loadData() {
  if (rocketId.value) {
    imageLoadFailed.value = false
    store.fetchRocketDetail(rocketId.value)
  }
}

function handleRocketAdded() {
  router.push('/')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 80px;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}
</style>
