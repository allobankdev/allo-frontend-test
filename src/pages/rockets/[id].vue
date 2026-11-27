<template>
  <v-container
    class="py-6 py-md-10"
    max-width="1100"
  >
    <!-- Breadcrumbs / Back button -->
    <div class="mb-6 d-flex align-center justify-space-between">
      <v-btn
        variant="elevated"
        color="#ffbc25"
        prepend-icon="mdi-arrow-left"
        class="font-weight-bold text-black rounded-lg px-4"
        @click="goBack"
      >
        Back to Rocket List
      </v-btn>

      <v-btn
        v-if="rocket"
        icon="mdi-refresh"
        variant="text"
        color="#8b95a5"
        :loading="rocketStore.isLoadingDetail"
        title="Refresh details"
        @click="loadData(true)"
      />
    </div>

    <!-- UI State 1: Loading State -->
    <LoadingState
      v-if="rocketStore.isLoadingDetail && !rocket"
      message="Fetching rocket specifications..."
      :count="1"
    />

    <!-- UI State 2: Error State with Retry Button -->
    <ErrorState
      v-else-if="rocketStore.errorDetail && !rocket"
      title="Rocket Not Found"
      :message="rocketStore.errorDetail"
      @retry="loadData(true)"
    >
      <template #extra-actions>
        <v-btn
          variant="outlined"
          color="grey"
          @click="goBack"
        >
          Back to List
        </v-btn>
      </template>
    </ErrorState>

    <!-- UI State 3: Success State - Detailed View -->
    <div v-else-if="rocket">
      <!-- Main Rocket Banner Card -->
      <v-card
        class="rounded-xl overflow-hidden mb-6 bg-allo-card border-subtle"
        elevation="6"
      >
        <v-row no-gutters>
          <!-- Rocket Image with Fallback -->
          <v-col
            cols="12"
            md="6"
          >
            <v-img
              :src="imageSrc"
              :height="$vuetify.display.smAndDown ? 260 : 420"
              cover
              class="bg-grey-darken-3 h-100"
              @error="handleImageError"
            >
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height bg-grey-darken-3">
                  <v-progress-circular
                    indeterminate
                    color="#ffbc25"
                    size="48"
                  />
                </div>
              </template>
            </v-img>
          </v-col>

          <!-- Key Header Info -->
          <v-col
            cols="12"
            md="6"
            class="pa-4 pa-sm-6 pa-md-8 d-flex flex-column justify-space-between"
          >
            <div>
              <div class="d-flex align-center flex-wrap ga-2 mb-3">
                <v-chip
                  v-if="rocket.is_local"
                  color="#ffbc25"
                  variant="flat"
                  size="small"
                  class="font-weight-bold text-black"
                >
                  Custom Added
                </v-chip>
                <v-chip
                  v-if="rocket.active !== undefined"
                  :color="rocket.active ? '#17a16e' : '#8b95a5'"
                  variant="flat"
                  size="small"
                  class="font-weight-bold"
                >
                  {{ rocket.active ? 'Active Vehicle' : 'Retired Vehicle' }}
                </v-chip>
                <v-chip
                  v-if="rocket.reusable !== undefined"
                  :color="rocket.reusable ? '#216ba5' : '#626b79'"
                  variant="tonal"
                  size="small"
                >
                  {{ rocket.reusable ? 'Reusable' : 'Expendable' }}
                </v-chip>
              </div>

              <!-- Required: Rocket Name -->
              <h1 class="text-h4 text-md-h3 font-weight-bold text-white mb-2 font-montserrat">
                {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
              </h1>

              <div class="d-flex align-center text-subtitle-1 text-grey-lighten-1 mb-4">
                <v-icon
                  icon="mdi-factory"
                  size="20"
                  class="mr-2 text-allo-yellow"
                />
                <span>{{ rocket.manufacturer?.name || 'SpaceX' }}</span>
              </div>

              <!-- Required: Description -->
              <p
                class="text-body-1 text-grey-lighten-2 mb-6"
                style="line-height: 1.7;"
              >
                {{ descriptionText }}
              </p>
            </div>

            <!-- External links if present -->
            <div
              v-if="rocket.wiki_url || rocket.info_url"
              class="d-flex flex-wrap ga-2 pt-2"
            >
              <v-btn
                v-if="rocket.wiki_url"
                :href="rocket.wiki_url"
                target="_blank"
                rel="noopener"
                variant="outlined"
                color="amber"
                size="small"
                prepend-icon="mdi-wikipedia"
              >
                Wikipedia
              </v-btn>
              <v-btn
                v-if="rocket.info_url"
                :href="rocket.info_url"
                target="_blank"
                rel="noopener"
                variant="outlined"
                color="grey-lighten-1"
                size="small"
                prepend-icon="mdi-open-in-new"
              >
                Official Page
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-card>

      <!-- Key Requirements Specifications Grid -->
      <h2 class="text-h5 font-weight-bold text-white mb-4">
        Technical Specifications
      </h2>

      <v-row dense>
        <!-- Required: Cost Per Launch -->
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="pa-5 rounded-xl h-100 bg-allo-card border-subtle"
            elevation="2"
          >
            <div class="d-flex align-center mb-2">
              <v-avatar
                color="#17a16e"
                size="36"
                class="mr-3"
              >
                <v-icon
                  icon="mdi-currency-usd"
                  color="#ffffff"
                  size="20"
                />
              </v-avatar>
              <span class="text-caption text-grey text-uppercase font-weight-bold">Cost Per Launch</span>
            </div>
            <div class="text-h6 font-weight-bold text-white font-montserrat">
              {{ formattedCost }}
            </div>
            <div class="text-caption text-grey-darken-1 mt-1">
              Estimated launch contract cost
            </div>
          </v-card>
        </v-col>

        <!-- Required: Country -->
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="pa-5 rounded-xl h-100 bg-allo-card border-subtle"
            elevation="2"
          >
            <div class="d-flex align-center mb-2">
              <v-avatar
                color="#216ba5"
                size="36"
                class="mr-3"
              >
                <v-icon
                  icon="mdi-earth"
                  color="#ffffff"
                  size="20"
                />
              </v-avatar>
              <span class="text-caption text-grey text-uppercase font-weight-bold">Country</span>
            </div>
            <div class="text-h6 font-weight-bold text-white font-montserrat">
              {{ countryText }}
            </div>
            <div class="text-caption text-grey-darken-1 mt-1">
              Manufacturer nationality code
            </div>
          </v-card>
        </v-col>

        <!-- Required: First Flight -->
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            class="pa-5 rounded-xl h-100 bg-allo-card border-subtle"
            elevation="2"
          >
            <div class="d-flex align-center mb-2">
              <v-avatar
                color="#ffbc25"
                size="36"
                class="mr-3"
              >
                <v-icon
                  icon="mdi-calendar-star"
                  color="#0a101d"
                  size="20"
                />
              </v-avatar>
              <span class="text-caption text-grey text-uppercase font-weight-bold">First Flight (Maiden)</span>
            </div>
            <div class="text-h6 font-weight-bold text-white font-montserrat">
              {{ formattedMaidenFlight }}
            </div>
            <div class="text-caption text-grey-darken-1 mt-1">
              Initial flight demonstration date
            </div>
          </v-card>
        </v-col>

        <!-- Extra: Vehicle Height / Length -->
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="pa-4 rounded-xl h-100 bg-allo-card border-subtle"
            elevation="1"
          >
            <span class="text-caption text-grey text-uppercase font-weight-medium">Length</span>
            <div class="text-subtitle-1 font-weight-bold text-white mt-1 font-montserrat">
              {{ rocket.length ? `${rocket.length} m` : 'N/A' }}
            </div>
          </v-card>
        </v-col>

        <!-- Extra: Vehicle Diameter -->
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="pa-4 rounded-xl h-100 bg-allo-card border-subtle"
            elevation="1"
          >
            <span class="text-caption text-grey text-uppercase font-weight-medium">Diameter</span>
            <div class="text-subtitle-1 font-weight-bold text-white mt-1 font-montserrat">
              {{ rocket.diameter ? `${rocket.diameter} m` : 'N/A' }}
            </div>
          </v-card>
        </v-col>

        <!-- Extra: Launch Mass -->
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="pa-4 rounded-xl h-100 bg-allo-card border-subtle"
            elevation="1"
          >
            <span class="text-caption text-grey text-uppercase font-weight-medium">Launch Mass</span>
            <div class="text-subtitle-1 font-weight-bold text-white mt-1 font-montserrat">
              {{ rocket.launch_mass ? `${rocket.launch_mass.toLocaleString()} T` : 'N/A' }}
            </div>
          </v-card>
        </v-col>

        <!-- Extra: LEO Payload Capacity -->
        <v-col
          cols="6"
          md="3"
        >
          <v-card
            class="pa-4 rounded-xl h-100 bg-allo-card border-subtle"
            elevation="1"
          >
            <span class="text-caption text-grey text-uppercase font-weight-medium">LEO Payload</span>
            <div class="text-subtitle-1 font-weight-bold text-white mt-1 font-montserrat">
              {{ rocket.leo_capacity ? `${rocket.leo_capacity.toLocaleString()} kg` : 'N/A' }}
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { formatCurrency, formatDate, DEFAULT_ROCKET_IMAGE } from '@/utils/formatters'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const rocketStore = useRocketStore()

const rocketId = computed(() => {
  const params = route.params as Record<string, string | string[]>
  return Array.isArray(params?.id) ? params.id[0] : params?.id
})

const rocket = computed(() => {
  return rocketStore.currentRocket
})

const imageFailed = ref(false)

const imageSrc = computed(() => {
  if (imageFailed.value || !rocket.value?.image_url) {
    return DEFAULT_ROCKET_IMAGE
  }
  return rocket.value.image_url
})

function handleImageError() {
  imageFailed.value = true
}

// Graceful fallbacks for missing data
const descriptionText = computed(() => {
  const desc = rocket.value?.description
  if (!desc || !desc.trim()) {
    return 'No description is currently available for this rocket.'
  }
  return desc.trim()
})

const formattedCost = computed(() => {
  return formatCurrency(rocket.value?.launch_cost)
})

const countryText = computed(() => {
  return rocket.value?.manufacturer?.country_code || rocket.value?.country || 'USA'
})

const formattedMaidenFlight = computed(() => {
  return formatDate(rocket.value?.maiden_flight)
})

// Lifecycle hook: fetch rocket details on mount
async function loadData(force = false) {
  if (!rocketId.value) return
  imageFailed.value = false
  await rocketStore.fetchRocketDetail(rocketId.value, force)
}

onMounted(() => {
  loadData()
})

function goBack() {
  router.push('/')
}
</script>

<style scoped>
.bg-allo-card {
  background-color: #131c2e !important;
}
.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.text-allo-yellow {
  color: #ffbc25 !important;
}
.font-montserrat {
  font-family: 'Montserrat', sans-serif !important;
}
</style>
