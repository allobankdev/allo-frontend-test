<template>
  <v-card
    class="rocket-card h-100"
    elevation="0"
    rounded="xl"
    tabindex="0"
    @click="emit('select', rocket)"
    @keydown.enter="emit('select', rocket)"
  >
    <RocketImage
      :alt="rocket.full_name"
      :src="rocket.image_url"
    />

    <v-card-item class="px-5 pt-5">
      <div class="d-flex align-start justify-space-between ga-3">
        <v-card-title class="pa-0 text-h6 font-weight-bold text-wrap">
          {{ rocket.full_name }}
        </v-card-title>
        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          size="small"
          variant="tonal"
        >
          Lokal
        </v-chip>
      </div>
    </v-card-item>

    <v-card-text class="rocket-card__description px-5 pt-2">
      {{ displayValue(rocket.description, 'Deskripsi belum tersedia.') }}
    </v-card-text>

    <v-card-actions class="px-5 pb-5">
      <span class="text-primary font-weight-medium">Lihat detail</span>
      <v-spacer />
      <v-icon color="primary">
        mdi-arrow-right
      </v-icon>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { Rocket } from '../types/rocket'
  import { displayValue } from '../utils/rocket-formatters'
  import RocketImage from './RocketImage.vue'

  defineProps<{ rocket: Rocket }>()
  const emit = defineEmits<{ select: [rocket: Rocket] }>()
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.09);
  background: rgba(17, 27, 49, 0.88);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.rocket-card:hover,
.rocket-card:focus-visible {
  transform: translateY(-5px);
  border-color: rgba(92, 145, 255, 0.55);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28) !important;
  outline: none;
}

.rocket-card__description {
  display: -webkit-box;
  min-height: 5.5rem;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.68);
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
