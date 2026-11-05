<template>
  <div
    class="cad-frame rounded-sm h-100 d-flex flex-column cursor-pointer"
    role="button"
    tabindex="0"
    @click="navigateToDetail"
    @keydown.enter="navigateToDetail"
  >
    <!-- Media container with consistent aspect ratio -->
    <div class="position-relative media-container bg-surface-variant overflow-hidden">
      <v-img
        :src="displayImage"
        height="200"
        cover
        class="align-end rocket-img"
        @error="onImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-surface-variant">
            <v-progress-circular
              indeterminate
              color="primary"
              size="24"
            />
          </div>
        </template>
      </v-img>

      <!-- Technical Status Indicators -->
      <div class="position-absolute top-0 start-0 pa-3 d-flex flex-wrap ga-2">
        <span
          v-if="rocket.is_custom"
          class="tech-tag tech-tag-custom font-mono"
        >
          Custom
        </span>

        <span
          v-if="rocket.active !== null && rocket.active !== undefined"
          :class="['tech-tag font-mono', rocket.active ? 'tech-tag-active' : 'tech-tag-retired']"
        >
          {{ rocket.active ? 'Active' : 'Retired' }}
        </span>

        <span
          v-if="rocket.reusable"
          class="tech-tag tech-tag-reusable font-mono"
        >
          Reusable
        </span>
      </div>

      <!-- Country Tag -->
      <div
        v-if="countryCode"
        class="position-absolute top-0 end-0 pa-3"
      >
        <span class="tech-tag tech-tag-country font-mono">
          {{ countryCode }}
        </span>
      </div>
    </div>

    <!-- Content / Specifications Block -->
    <div class="d-flex flex-column flex-grow-1 pa-4">
      <div
        class="font-mono text-caption text-secondary mb-1"
        style="font-size: 0.72rem;"
      >
        {{ rocket.family || 'SpaceX Architecture' }}
      </div>

      <h2 class="text-h6 font-weight-bold text-high-emphasis mb-2 line-clamp-1">
        {{ rocket.full_name || rocket.name || 'Unnamed Configuration' }}
      </h2>

      <p class="text-body-2 text-secondary mb-4 flex-grow-1 line-clamp-3">
        {{ rocket.description || 'No engineering summary documented for this launch vehicle.' }}
      </p>

      <div class="spec-matrix-divider mb-3" />

      <!-- Footer Specs & Action -->
      <div class="d-flex align-center justify-space-between pt-1">
        <div>
          <div
            class="font-mono text-caption text-dim"
            style="font-size: 0.68rem;"
          >
            Estimated Launch Cost
          </div>
          <div class="font-mono text-subtitle-2 font-weight-bold text-primary">
            {{ formattedCost }}
          </div>
        </div>

        <v-btn
          variant="tonal"
          color="primary"
          size="small"
          rounded="sm"
          class="text-none font-weight-medium"
          @click.stop="navigateToDetail"
        >
          Inspect Specs
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatCurrency } from '@/utils/formatters'
import fallbackImage from '@/assets/rocket-placeholder.svg'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()
const imageLoadFailed = ref(false)

const displayImage = computed(() => {
  if (imageLoadFailed.value || !props.rocket.image_url) {
    return fallbackImage
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
.media-container {
  height: 200px;
  background-color: #111726;
  border-bottom: 1px solid var(--titanium-border);
}

.rocket-img {
  transition: transform 0.3s ease;
}

.cad-frame:hover .rocket-img {
  transform: scale(1.03);
}

.tech-tag {
  display: inline-block;
  padding: 2px 7px;
  font-size: 0.68rem;
  font-weight: 600;
  border-radius: 2px;
  background: rgba(15, 22, 38, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-high);
}

.tech-tag-active {
  color: var(--signal-emerald);
  border-color: rgba(16, 185, 129, 0.4);
}

.tech-tag-retired {
  color: var(--text-mid);
  border-color: rgba(148, 163, 184, 0.3);
}

.tech-tag-reusable {
  color: var(--lox-cyan);
  border-color: rgba(56, 189, 248, 0.4);
}

.tech-tag-custom {
  color: var(--burn-amber);
  border-color: rgba(245, 158, 11, 0.4);
}

.tech-tag-country {
  color: var(--text-high);
}

.spec-matrix-divider {
  height: 1px;
  background: var(--titanium-border);
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

.text-dim {
  color: var(--text-dim);
}
</style>
