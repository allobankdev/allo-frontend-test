<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    variant="outlined"
    hover
    @click="navigateToDetail"
  >
    <!-- Rocket Image -->
    <RocketImage
      :src="rocket.image_url"
      :alt="rocket.full_name || rocket.name"
      height="220px"
    />

    <!-- Card Content -->
    <v-card-item class="pb-1">
      <div class="d-flex align-center justify-space-between gap-2 mb-2">
        <div class="d-flex align-center flex-wrap gap-1">
          <!-- Active Status Badge -->
          <v-chip
            size="x-small"
            variant="flat"
            :color="rocket.active ? 'white' : 'grey-darken-3'"
            :class="rocket.active ? 'text-black font-weight-bold' : 'text-grey-lighten-1'"
          >
            <v-icon
              start
              size="10"
              :icon="rocket.active ? 'mdi-circle' : 'mdi-circle-outline'"
            />
            {{ rocket.active ? 'Active' : 'Retired' }}
          </v-chip>

          <!-- Reusable Badge -->
          <v-chip
            v-if="rocket.reusable !== null && rocket.reusable !== undefined"
            size="x-small"
            variant="outlined"
            class="border-subtle text-caption text-grey-lighten-2"
          >
            {{ rocket.reusable ? 'Reusable' : 'Expendable' }}
          </v-chip>

          <!-- Custom User Added Badge -->
          <v-chip
            v-if="rocket.is_custom"
            size="x-small"
            variant="flat"
            color="grey-lighten-2"
            class="text-black font-weight-bold"
          >
            Custom
          </v-chip>
        </div>

        <!-- Country Code -->
        <span class="text-caption text-grey text-uppercase font-weight-medium">
          {{ rocket.manufacturer?.country_code || 'USA' }}
        </span>
      </div>

      <!-- Rocket Title -->
      <v-card-title class="px-0 pt-0 text-h6 font-weight-bold text-white text-truncate">
        {{ rocket.full_name || rocket.name || 'Unnamed Rocket' }}
      </v-card-title>
    </v-card-item>

    <v-card-text class="pt-0 flex-grow-1 d-flex flex-column justify-space-between">
      <!-- Description with fallback -->
      <p class="text-body-2 text-grey-lighten-1 description-clamp mb-4">
        {{ rocket.description || 'Tidak ada deskripsi tersedia untuk roket ini.' }}
      </p>

      <!-- Cost & Launch specs preview -->
      <div class="specs-preview pt-3 border-t">
        <div class="d-flex justify-space-between align-center text-caption">
          <span class="text-grey">Biaya / Launch</span>
          <span class="font-weight-medium text-white">
            {{ formatCost(rocket.launch_cost) }}
          </span>
        </div>
        <div class="d-flex justify-space-between align-center text-caption mt-1">
          <span class="text-grey">Penerbangan Pertama</span>
          <span class="text-grey-lighten-1">
            {{ formatDate(rocket.maiden_flight) }}
          </span>
        </div>
      </div>
    </v-card-text>

    <v-card-actions class="px-4 pb-4 pt-0">
      <v-btn
        block
        variant="outlined"
        color="white"
        size="small"
        class="text-none tracking-normal font-weight-medium"
        append-icon="mdi-arrow-right"
      >
        Lihat Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import RocketImage from './RocketImage.vue'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

function navigateToDetail() {
  router.push(`/rocket/${props.rocket.id}`)
}

function formatCost(cost: string | number | null | undefined): string {
  if (cost === null || cost === undefined || cost === '') {
    return 'N/A'
  }
  const num = Number(cost)
  if (isNaN(num)) return 'N/A'
  if (num === 0) return 'N/A'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(num)
}

function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return dateStr
  }
}
</script>

<style scoped>
.rocket-card {
  background-color: #141416;
  border: 1px solid #27272a;
  border-radius: 8px;
  transition: all 0.25s ease;
  cursor: pointer;
}

.rocket-card:hover {
  border-color: #ffffff;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6);
}

.description-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.border-subtle {
  border-color: #3f3f46 !important;
}

.border-t {
  border-top: 1px solid #27272a;
}

.gap-1 {
  gap: 0.25rem;
}

.gap-2 {
  gap: 0.5rem;
}
</style>
