<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-lg overflow-hidden border transition-swing"
    color="surface"
    elevation="0"
    :ripple="false"
    @click="navigateToDetail"
  >
    <!-- Media container with fixed 16:9 aspect ratio and fallback handling -->
    <div class="position-relative media-container bg-surface-variant overflow-hidden">
      <v-img
        :src="displayImage"
        height="220"
        cover
        class="align-end rocket-img"
        @error="onImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-surface-variant">
            <v-progress-circular
              indeterminate
              color="primary"
              size="28"
            />
          </div>
        </template>
      </v-img>

      <!-- Status overlay tags -->
      <div class="position-absolute top-0 start-0 pa-3 d-flex flex-wrap ga-2">
        <v-chip
          v-if="rocket.is_custom"
          size="x-small"
          color="accent"
          variant="flat"
          class="font-weight-bold text-uppercase"
        >
          <v-icon
            icon="mdi-account-edit"
            start
            size="12"
          />
          User Added
        </v-chip>

        <v-chip
          v-if="rocket.active !== null && rocket.active !== undefined"
          size="x-small"
          :color="rocket.active ? 'success' : 'secondary'"
          variant="flat"
          class="font-weight-bold text-uppercase"
        >
          <v-icon
            :icon="rocket.active ? 'mdi-check-circle' : 'mdi-archive'"
            start
            size="12"
          />
          {{ rocket.active ? 'Active' : 'Retired' }}
        </v-chip>

        <v-chip
          v-if="rocket.reusable"
          size="x-small"
          color="info"
          variant="flat"
          class="font-weight-bold text-uppercase"
        >
          <v-icon
            icon="mdi-recycle"
            start
            size="12"
          />
          Reusable
        </v-chip>
      </div>

      <!-- Country badge on top right -->
      <div
        v-if="countryCode"
        class="position-absolute top-0 end-0 pa-3"
      >
        <v-chip
          size="x-small"
          variant="elevated"
          color="surface"
          class="font-weight-bold"
        >
          <v-icon
            icon="mdi-flag"
            start
            size="12"
            color="primary"
          />
          {{ countryCode }}
        </v-chip>
      </div>
    </div>

    <!-- Content details -->
    <v-card-text class="d-flex flex-column flex-grow-1 pa-4">
      <div
        class="text-caption text-secondary font-weight-medium text-uppercase mb-1"
        style="letter-spacing: 1px;"
      >
        {{ rocket.family || 'SpaceX System' }}
      </div>

      <h3 class="text-h6 font-weight-bold text-high-emphasis mb-2 line-clamp-1">
        {{ rocket.full_name || rocket.name || 'Unnamed Vehicle' }}
      </h3>

      <p class="text-body-2 text-secondary mb-4 flex-grow-1 line-clamp-3">
        {{ rocket.description || 'No detailed mission description available for this configuration.' }}
      </p>

      <v-divider
        class="mb-3"
        style="border-color: rgba(255, 255, 255, 0.08);"
      />

      <!-- Action Footer -->
      <div class="d-flex align-center justify-space-between pt-1">
        <div class="d-flex flex-column">
          <span
            class="text-caption text-secondary text-uppercase"
            style="font-size: 0.68rem;"
          >Launch Cost</span>
          <span class="text-caption font-weight-bold font-mono text-primary">
            {{ formattedCost }}
          </span>
        </div>

        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          rounded="sm"
          append-icon="mdi-arrow-right"
          class="text-none font-weight-medium"
          @click.stop="navigateToDetail"
        >
          View Specs
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatCurrency } from '@/utils/formatters'
import placeholderSvg from '@/assets/rocket-placeholder.svg'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()
const imageLoadFailed = ref(false)

const displayImage = computed(() => {
  if (imageLoadFailed.value || !props.rocket.image_url) {
    return placeholderSvg
  }
  return props.rocket.image_url
})

const countryCode = computed(() => {
  return props.rocket.manufacturer?.country_code || null
})

const formattedCost = computed(() => {
  return formatCurrency(props.rocket.launch_cost)
})

function onImageError() {
  imageLoadFailed.value = true
}

function navigateToDetail() {
  router.push(`/rocket/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  border-color: rgba(255, 255, 255, 0.08) !important;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.rocket-card:hover {
  transform: translateY(-4px);
  border-color: rgba(56, 189, 248, 0.4) !important;
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.5);
}

.media-container {
  height: 220px;
}

.rocket-img {
  transition: transform 0.4s ease;
}

.rocket-card:hover .rocket-img {
  transform: scale(1.03);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace !important;
}
</style>
