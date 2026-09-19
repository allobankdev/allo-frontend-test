<template>
  <div class="rocket-detail-page">
    <AppNavbar />

    <v-container class="py-8 px-4 px-md-8" max-width="1100">
      <!-- Back Navigation -->
      <div class="mb-6">
        <v-btn
          variant="text"
          color="primary"
          prepend-icon="mdi-arrow-left"
          class="font-weight-bold pl-0 text-none"
          @click="goBack"
        >
          Back to Rocket List
        </v-btn>
      </div>

      <!-- 1. Loading State -->
      <LoadingState
        v-if="store.detailLoading"
        message="Loading rocket specifications and mission history..."
      />

      <!-- 2. Error State -->
      <ErrorState
        v-else-if="store.detailError"
        title="Rocket Not Found"
        :message="store.detailError"
        @retry="loadRocket"
      />

      <!-- 3. Rocket Detail Content -->
      <div v-else-if="rocket">
        <!-- Main Card -->
        <v-card class="rounded-xl overflow-hidden mb-6" elevation="2" border>
          <v-row no-gutters>
            <!-- Image Column -->
            <v-col cols="12" md="6">
              <v-img
                :src="rocket.image_url || fallbackImage"
                :alt="rocket.full_name || rocket.name"
                height="100%"
                min-height="380"
                cover
                class="bg-surface-bright"
              >
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height bg-surface-bright">
                    <v-progress-circular indeterminate color="primary" />
                  </div>
                </template>
                <template #error>
                  <div class="d-flex flex-column align-center justify-center fill-height bg-surface-bright text-grey">
                    <v-icon icon="mdi-rocket-launch-outline" size="64" />
                    <span class="text-caption mt-2">Image Not Available</span>
                  </div>
                </template>
              </v-img>
            </v-col>

            <!-- Overview Column -->
            <v-col cols="12" md="6" class="pa-6 pa-md-8 d-flex flex-column justify-space-between bg-surface">
              <div>
                <div class="d-flex align-center gap-2 mb-3 flex-wrap">
                  <v-chip
                    v-if="rocket.is_custom"
                    color="warning"
                    size="small"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    Custom Rocket
                  </v-chip>
                  <v-chip
                    v-if="rocket.family"
                    color="primary"
                    variant="tonal"
                    size="small"
                    class="font-weight-bold"
                  >
                    {{ rocket.family }}
                  </v-chip>
                  <v-chip
                    v-if="rocket.active !== null && rocket.active !== undefined"
                    :color="rocket.active ? 'success' : 'grey-darken-1'"
                    size="small"
                    variant="flat"
                    class="font-weight-bold"
                  >
                    {{ rocket.active ? 'Active in Service' : 'Retired' }}
                  </v-chip>
                </div>

                <h1 class="text-h4 font-weight-black mb-3 text-white">
                  {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
                </h1>

                <p class="text-body-1 text-medium-emphasis mb-6">
                  {{ rocket.description || 'No detailed description has been provided for this launch vehicle.' }}
                </p>
              </div>

              <!-- Quick Specs Grid -->
              <v-card variant="tonal" color="primary" class="pa-4 rounded-lg bg-surface-bright border">
                <v-row dense>
                  <v-col cols="6" sm="4">
                    <div class="text-caption text-medium-emphasis">Country</div>
                    <div class="text-subtitle-2 font-weight-bold text-white">
                      <v-icon icon="mdi-earth" size="16" class="mr-1 text-primary" />
                      {{ rocket.manufacturer?.country_code || 'N/A' }}
                    </div>
                  </v-col>
                  <v-col cols="6" sm="4">
                    <div class="text-caption text-medium-emphasis">Cost per Launch</div>
                    <div class="text-subtitle-2 font-weight-bold text-white">
                      {{ formatCost(rocket.launch_cost) }}
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-caption text-medium-emphasis">First Flight</div>
                    <div class="text-subtitle-2 font-weight-bold text-white">
                      <v-icon icon="mdi-calendar" size="16" class="mr-1 text-primary" />
                      {{ formatDate(rocket.maiden_flight) }}
                    </div>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-card>

        <!-- Technical Specifications Table / Details -->
        <v-card class="rounded-xl pa-6 mb-6" elevation="2" border>
          <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center text-white">
            <v-icon icon="mdi-cog-outline" class="mr-2 text-primary" />
            Key Technical Specifications
          </h2>

          <v-table density="comfortable" class="specs-table bg-transparent">
            <tbody>
              <tr>
                <td class="font-weight-medium text-medium-emphasis w-35">Rocket Full Name</td>
                <td class="font-weight-bold text-white">{{ rocket.full_name || rocket.name || 'N/A' }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">Manufacturer</td>
                <td class="font-weight-bold text-white">
                  {{ rocket.manufacturer?.name || 'SpaceX' }}
                  <span v-if="rocket.manufacturer?.country_code" class="text-medium-emphasis font-weight-regular">
                    ({{ rocket.manufacturer.country_code }})
                  </span>
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">Launch Cost</td>
                <td class="font-weight-bold text-white">{{ formatCost(rocket.launch_cost) }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">First Flight (Maiden Flight)</td>
                <td class="font-weight-bold text-white">{{ formatDate(rocket.maiden_flight) }}</td>
              </tr>
              <tr>
                <td class="font-weight-medium text-medium-emphasis">Reusable Vehicle</td>
                <td>
                  <v-chip
                    v-if="rocket.reusable !== null && rocket.reusable !== undefined"
                    :color="rocket.reusable ? 'success' : 'grey'"
                    size="x-small"
                    variant="flat"
                  >
                    {{ rocket.reusable ? 'Yes (Reusable)' : 'No (Expendable)' }}
                  </v-chip>
                  <span v-else class="text-medium-emphasis">N/A</span>
                </td>
              </tr>
              <tr v-if="rocket.length">
                <td class="font-weight-medium text-medium-emphasis">Vehicle Length / Height</td>
                <td class="text-white">{{ rocket.length }} meters</td>
              </tr>
              <tr v-if="rocket.diameter">
                <td class="font-weight-medium text-medium-emphasis">Vehicle Diameter</td>
                <td class="text-white">{{ rocket.diameter }} meters</td>
              </tr>
              <tr v-if="rocket.leo_capacity">
                <td class="font-weight-medium text-medium-emphasis">LEO Payload Capacity</td>
                <td class="text-white">{{ rocket.leo_capacity.toLocaleString() }} kg</td>
              </tr>
              <tr v-if="rocket.gto_capacity">
                <td class="font-weight-medium text-medium-emphasis">GTO Payload Capacity</td>
                <td class="text-white">{{ rocket.gto_capacity.toLocaleString() }} kg</td>
              </tr>
              <tr v-if="rocket.total_launch_count !== undefined">
                <td class="font-weight-medium text-medium-emphasis">Total Launches Recorded</td>
                <td class="text-white">
                  <strong>{{ rocket.total_launch_count }}</strong>
                  <span v-if="rocket.successful_launches !== undefined" class="text-success ml-2">
                    ({{ rocket.successful_launches }} successful)
                  </span>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- External Links -->
          <div v-if="rocket.wiki_url || rocket.info_url" class="mt-6 pt-4 border-t d-flex gap-3">
            <v-btn
              v-if="rocket.wiki_url"
              :href="rocket.wiki_url"
              target="_blank"
              variant="outlined"
              color="primary"
              size="small"
              prepend-icon="mdi-wikipedia"
              class="text-none"
            >
              Wikipedia Article
            </v-btn>
            <v-btn
              v-if="rocket.info_url"
              :href="rocket.info_url"
              target="_blank"
              variant="outlined"
              color="secondary"
              size="small"
              prepend-icon="mdi-open-in-new"
              class="text-none"
            >
              Official Info
            </v-btn>
          </div>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocket'
import AppNavbar from '@/components/AppNavbar.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const fallbackImage = 'https://images.unsplash.com/photo-1517976487507-5b3b4a45097c?auto=format&fit=crop&w=800&q=80'

const rocket = computed(() => store.selectedRocket)

async function loadRocket() {
  const id = route.params.id as string
  if (id) {
    await store.getRocketById(id)
  }
}

onMounted(() => {
  loadRocket()
})

watch(
  () => route.params.id,
  () => {
    loadRocket()
  }
)

function goBack() {
  router.push('/')
}

function formatCost(cost: string | number | null | undefined): string {
  if (!cost) return 'N/A'
  const num = Number(cost)
  if (isNaN(num)) return String(cost)
  return `$${num.toLocaleString()}`
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
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
}
</script>

<style scoped>
.rocket-detail-page {
  min-height: 100vh;
  background-color: #0a0d14;
}

.gap-2 {
  gap: 8px;
}

.gap-3 {
  gap: 12px;
}

.w-35 {
  width: 35%;
}

.specs-table td {
  padding-top: 12px !important;
  padding-bottom: 12px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
}

.border-t {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}
</style>
