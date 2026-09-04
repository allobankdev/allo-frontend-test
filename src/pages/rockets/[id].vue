<template>
  <v-container class="py-8" max-width="960">
    <!-- Back Navigation -->
    <v-btn
      variant="text"
      prepend-icon="mdi-arrow-left"
      class="mb-6"
      @click="navigateBack"
    >
      Back to Rockets
    </v-btn>

    <!-- Error State -->
    <ErrorState
      v-if="store.detailError"
      :message="store.detailError"
      @retry="loadDetail(true)"
    />

    <!-- Loading State -->
    <v-card v-else-if="store.detailLoading" class="rounded-lg pa-4">
      <v-skeleton-loader type="image, heading, paragraph, list-item-two-line, list-item-two-line" />
    </v-card>

    <!-- Detail Content -->
    <v-card
      v-else-if="rocket"
      class="rocket-detail-card rounded-lg overflow-hidden elevation-3"
    >
      <!-- Hero Image -->
      <div class="detail-image-wrapper">
        <v-img
          :src="currentImageSrc"
          height="400"
          cover
          class="detail-image"
          @error="handleImageError"
        >
          <template #placeholder>
            <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
              <v-progress-circular indeterminate color="primary" size="36" />
            </div>
          </template>

          <v-chip
            v-if="rocket.isCustom"
            color="secondary"
            variant="flat"
            class="detail-custom-badge"
          >
            Custom Added
          </v-chip>
        </v-img>
      </div>

      <div class="pa-6 pa-md-8">
        <!-- Title & Metadata Header -->
        <div class="mb-6">
          <h1 class="text-h3 font-weight-bold mb-2">
            {{ rocket.name }}
          </h1>
          <v-chip
            size="small"
            color="primary"
            variant="tonal"
            prepend-icon="mdi-rocket-outline"
          >
            SpaceX Launch Vehicle
          </v-chip>
        </div>

        <v-divider class="mb-6" />

        <!-- Description Section -->
        <section class="mb-8">
          <h2 class="text-h6 font-weight-bold mb-3 d-flex align-center ga-2">
            <v-icon icon="mdi-text-box-outline" size="20" color="primary" />
            Description
          </h2>
          <p class="text-body-1 text-medium-emphasis line-height-relaxed">
            {{ rocket.description }}
          </p>
        </section>

        <v-divider class="mb-8" />

        <!-- Specifications Grid: Cost, Country, First Flight -->
        <section>
          <h2 class="text-h6 font-weight-bold mb-4 d-flex align-center ga-2">
            <v-icon icon="mdi-information-outline" size="20" color="primary" />
            Launch Specifications
          </h2>

          <v-row>
            <!-- Cost per Launch -->
            <v-col cols="12" sm="4">
              <v-card variant="tonal" class="pa-4 h-100 rounded-lg">
                <div class="d-flex align-center ga-2 text-medium-emphasis mb-1">
                  <v-icon icon="mdi-currency-usd" size="18" color="success" />
                  <span class="text-caption text-uppercase font-weight-bold">Cost Per Launch</span>
                </div>
                <div class="text-h5 font-weight-bold text-success">
                  {{ formatCurrency(rocket.launchCost) }}
                </div>
                <div v-if="!rocket.launchCost" class="text-caption text-medium-emphasis">
                  Data not published
                </div>
              </v-card>
            </v-col>

            <!-- Country -->
            <v-col cols="12" sm="4">
              <v-card variant="tonal" class="pa-4 h-100 rounded-lg">
                <div class="d-flex align-center ga-2 text-medium-emphasis mb-1">
                  <v-icon icon="mdi-earth" size="18" color="info" />
                  <span class="text-caption text-uppercase font-weight-bold">Country</span>
                </div>
                <div class="text-h5 font-weight-bold">
                  {{ fallbackText(rocket.country, 'Unknown') }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Manufacturer Origin
                </div>
              </v-card>
            </v-col>

            <!-- First Flight -->
            <v-col cols="12" sm="4">
              <v-card variant="tonal" class="pa-4 h-100 rounded-lg">
                <div class="d-flex align-center ga-2 text-medium-emphasis mb-1">
                  <v-icon icon="mdi-calendar-start" size="18" color="warning" />
                  <span class="text-caption text-uppercase font-weight-bold">First Flight</span>
                </div>
                <div class="text-h5 font-weight-bold">
                  {{ formatDate(rocket.maidenFlight) }}
                </div>
                <div class="text-caption text-medium-emphasis">
                  Maiden Flight Date
                </div>
              </v-card>
            </v-col>
          </v-row>
        </section>
      </div>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { formatCurrency, formatDate, fallbackText } from '@/utils/format'
import ErrorState from '@/components/common/ErrorState.vue'
import placeholderSvg from '@/assets/rocket-placeholder.svg'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocketId = computed(() => route.params.id as string)
const rocket = computed(() => store.selectedRocket)

const currentImageSrc = ref(placeholderSvg)

watch(
  () => rocket.value?.imageUrl,
  (newUrl) => {
    currentImageSrc.value = newUrl || placeholderSvg
  },
  { immediate: true }
)

function handleImageError(): void {
  currentImageSrc.value = placeholderSvg
}

function navigateBack(): void {
  router.push('/')
}

async function loadDetail(force = false): Promise<void> {
  if (!rocketId.value) return
  await store.loadRocketById(rocketId.value, force)
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.rocket-detail-card {
  background-color: #1a1a24;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.detail-image-wrapper {
  position: relative;
  background-color: #121218;
}

.detail-custom-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  font-weight: 600;
  text-transform: uppercase;
}

.line-height-relaxed {
  line-height: 1.8;
}
</style>
