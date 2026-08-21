<template>
  <v-card
    class="clean-rocket-card d-flex flex-column w-100"
    rounded="xl"
    @click="navigateToDetail"
  >
    <!-- Image Header with Clean Badge Overlay -->
    <div class="card-media-wrapper position-relative">
      <v-img
        :src="rocket.image_url || DEFAULT_ROCKET_IMAGE"
        height="200"
        cover
        class="rocket-image"
      >
        <template #placeholder>
          <div class="d-flex align-center justify-center fill-height bg-slate-100">
            <v-progress-circular
              color="secondary"
              indeterminate
              size="24"
              width="2"
            />
          </div>
        </template>

        <template #error>
          <div class="d-flex flex-column align-center justify-center fill-height bg-slate-100 text-slate-400">
            <v-icon
              icon="mdi-image-off-outline"
              size="36"
              class="mb-1"
            />
            <span class="text-caption font-weight-medium">No preview available</span>
          </div>
        </template>

        <!-- Top Badges Overlay -->
        <div class="badge-overlay pa-3 d-flex justify-space-between align-center">
          <span
            v-if="rocket.isLocal"
            class="pill-badge pill-badge-amber"
          >
            <v-icon icon="mdi-account-edit" size="12" class="mr-1" />
            Custom
          </span>
          <span
            v-else
            :class="rocket.active ? 'pill-badge pill-badge-emerald' : 'pill-badge pill-badge-slate'"
          >
            <span class="pill-dot" :class="rocket.active ? 'bg-emerald' : 'bg-slate'" />
            {{ rocket.active ? 'Active' : 'Retired' }}
          </span>

          <span v-if="rocket.manufacturer?.country_code" class="pill-badge pill-badge-white">
            {{ rocket.manufacturer.country_code }}
          </span>
        </div>
      </v-img>
    </div>

    <!-- Body Area -->
    <div class="pa-5 d-flex flex-column flex-grow-1">
      <div class="mb-2">
        <h3 class="text-subtitle-1 font-weight-bold text-slate-900 line-clamp-1" :title="rocket.full_name">
          {{ rocket.full_name }}
        </h3>
        <p class="text-caption text-slate-500 font-weight-medium mb-0">
          {{ rocket.manufacturer?.name || 'SpaceX' }}
          <span v-if="rocket.family"> &bull; {{ rocket.family }}</span>
        </p>
      </div>

      <p class="text-body-2 text-slate-600 description-text mb-4">
        {{ rocket.description || 'No detailed launcher description recorded for this configuration.' }}
      </p>

      <div class="mt-auto pt-3 border-t-subtle d-flex justify-space-between align-center">
        <div>
          <span class="text-caption text-slate-400 d-block text-uppercase font-weight-semibold letter-spacing-tight">Est. Cost</span>
          <span class="text-caption font-weight-bold text-slate-900">{{ formatCurrency(rocket.launch_cost) }}</span>
        </div>

        <div class="text-right">
          <span class="text-caption text-slate-400 d-block text-uppercase font-weight-semibold letter-spacing-tight">First Flight</span>
          <span class="text-caption font-weight-bold text-slate-900">{{ formatDate(rocket.maiden_flight) }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { formatCurrency, formatDate, DEFAULT_ROCKET_IMAGE } from '@/utils/formatters'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

function navigateToDetail() {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.clean-rocket-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  overflow: hidden;
}

.clean-rocket-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03);
  transform: translateY(-2px);
}

.card-media-wrapper {
  background-color: #f1f5f9;
}

.bg-slate-100 {
  background-color: #f1f5f9;
}

.badge-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
}

.pill-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 9999px;
  letter-spacing: 0.02em;
}

.pill-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  margin-right: 5px;
}

.bg-emerald {
  background-color: #059669;
}

.bg-slate {
  background-color: #94a3b8;
}

.pill-badge-emerald {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.pill-badge-slate {
  background-color: #f8fafc;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.pill-badge-amber {
  background-color: #fffbeb;
  color: #b45309;
  border: 1px solid #fde68a;
}

.pill-badge-white {
  background-color: rgba(255, 255, 255, 0.95);
  color: #0f172a;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
  min-height: 2.8rem;
}

.border-t-subtle {
  border-top: 1px solid #f1f5f9;
}

.letter-spacing-tight {
  letter-spacing: 0.04em;
  font-size: 0.65rem;
}
</style>
