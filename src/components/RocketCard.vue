<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column rounded-xl elevation-2"
    hover
    @click="$emit('select', rocket.id)"
  >
    <div
      class="position-relative overflow-hidden"
      style="height: 220px; background-color: #0d1520;"
    >
      <v-img
        :src="imageUrl"
        :alt="rocket.full_name"
        height="220"
        cover
        class="rocket-image"
        @error="onImageError"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-grey-darken-4">
            <v-progress-circular
              indeterminate
              color="primary"
              size="32"
            />
          </div>
        </template>
      </v-img>

      <!-- Gradient Overlay on Image -->
      <div class="card-image-gradient" />

      <!-- Top Left: Country Badge -->
      <div
        class="position-absolute"
        style="top: 12px; left: 12px; z-index: 2;"
      >
        <v-chip
          v-if="rocket.manufacturer?.country_code"
          size="small"
          color="surface"
          variant="flat"
          class="font-weight-bold text-uppercase elevation-3"
        >
          <v-icon
            start
            icon="mdi-flag"
            size="13"
          />
          {{ rocket.manufacturer.country_code }}
        </v-chip>
      </div>

      <!-- Top Right: Origin Badge (Custom or SpaceX Official) -->
      <div
        class="position-absolute"
        style="top: 12px; right: 12px; z-index: 2;"
      >
        <v-chip
          v-if="rocket.isCustom"
          size="small"
          color="primary"
          variant="flat"
          class="font-weight-bold elevation-3 text-black"
        >
          <v-icon
            start
            icon="mdi-star"
            size="13"
          />
          Custom
        </v-chip>
        <v-chip
          v-else
          size="small"
          color="surface"
          variant="flat"
          class="font-weight-bold elevation-3"
        >
          <v-icon
            start
            icon="mdi-rocket-launch"
            size="13"
            color="primary"
          />
          SpaceX
        </v-chip>
      </div>
    </div>

    <!-- Title Header -->
    <v-card-item class="pb-1 pt-3">
      <v-card-title
        class="text-h6 font-weight-bold text-truncate"
        :title="rocket.full_name"
      >
        {{ rocket.full_name }}
      </v-card-title>
    </v-card-item>

    <!-- Key Metadata Row with Icons (Clean & Professional) -->
    <div class="px-4 py-1 d-flex flex-wrap ga-3 text-caption text-medium-emphasis">
      <div class="d-flex align-center ga-1">
        <v-icon
          icon="mdi-calendar-blank"
          size="14"
          color="primary"
        />
        <span>{{ formattedMaidenFlight }}</span>
      </div>
      <div class="d-flex align-center ga-1">
        <v-icon
          icon="mdi-currency-usd"
          size="14"
          color="primary"
        />
        <span>{{ formattedCost }}</span>
      </div>
    </div>

    <!-- Description Body -->
    <v-card-text class="flex-grow-1 text-body-2 text-medium-emphasis pt-2 pb-3">
      <p class="description-text mb-0">
        {{ displayDescription }}
      </p>
    </v-card-text>

    <v-divider />

    <!-- Action Link -->
    <v-card-actions class="px-4 py-3 bg-surface-light d-flex justify-space-between align-center">
      <span class="text-caption font-weight-medium text-primary d-flex align-center">
        Lihat Spesifikasi
        <v-icon
          end
          icon="mdi-arrow-right"
          size="16"
        />
      </span>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        icon="mdi-chevron-right"
        density="comfortable"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, FALLBACK_ROCKET_IMAGE } from '@/utils/formatters'

const props = defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  (e: 'select', id: string | number): void
}>()

const imageFailed = ref(false)

const imageUrl = computed(() => {
  if (imageFailed.value || !props.rocket.image_url) {
    return FALLBACK_ROCKET_IMAGE
  }
  return props.rocket.image_url
})

const formattedCost = computed(() => {
  return formatCurrency(props.rocket.launch_cost)
})

const formattedMaidenFlight = computed(() => {
  return formatDate(props.rocket.maiden_flight)
})

const displayDescription = computed(() => {
  if (!props.rocket.description || props.rocket.description.trim() === '') {
    return 'Deskripsi teknis belum tersedia dalam basis data sistem.'
  }
  return props.rocket.description
})

function onImageError() {
  imageFailed.value = true
}
</script>

<style scoped>
.rocket-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.rocket-card:hover {
  transform: translateY(-4px);
  border-color: rgba(229, 169, 60, 0.45);
}

.rocket-image {
  transition: transform 0.35s ease;
}

.rocket-card:hover .rocket-image {
  transform: scale(1.05);
}

.card-image-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 60%);
  pointer-events: none;
  z-index: 1;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
}
</style>
