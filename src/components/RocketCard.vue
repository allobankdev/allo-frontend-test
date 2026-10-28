<template>
  <v-card
    class="rocket-card h-100"
    rounded="lg"
    elevation="2"
    hover
    @click="$emit('click', rocket)"
  >
    <!-- Rocket Image -->
    <v-img
      :src="rocket.image_url ?? undefined"
      :lazy-src="undefined"
      height="200"
      cover
      class="rocket-card__image"
    >
      <template #placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular indeterminate color="primary" />
        </v-row>
      </template>
      <template #error>
        <div class="rocket-card__no-image fill-height d-flex flex-column align-center justify-center">
          <v-icon icon="mdi-rocket-launch-outline" size="64" color="grey-lighten-1" />
          <span class="text-caption text-grey-lighten-1 mt-2">No Image Available</span>
        </div>
      </template>

      <!-- Local badge -->
      <v-chip
        v-if="rocket.isLocal"
        class="ma-2"
        color="success"
        size="small"
        prepend-icon="mdi-plus-circle"
      >
        New
      </v-chip>
    </v-img>

    <v-card-title class="text-subtitle-1 font-weight-bold pt-3 pb-1">
      {{ rocket.full_name || 'Unknown Rocket' }}
    </v-card-title>

    <v-card-text class="rocket-card__description text-body-2 text-medium-emphasis">
      {{ truncatedDescription }}
    </v-card-text>

    <v-card-actions class="pt-0">
      <v-btn
        variant="tonal"
        color="primary"
        size="small"
        append-icon="mdi-arrow-right"
        @click.stop="$emit('click', rocket)"
      >
        View Details
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{
  rocket: Rocket
}>()

defineEmits<{
  click: [rocket: Rocket]
}>()

const truncatedDescription = computed(() => {
  const desc = props.rocket.description
  if (!desc) return 'No description available.'
  return desc.length > 120 ? desc.slice(0, 120) + '…' : desc
})
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.rocket-card:hover {
  transform: translateY(-4px);
}

.rocket-card__image {
  background-color: rgba(var(--v-theme-surface-variant), 0.5);
}

.rocket-card__no-image {
  background: linear-gradient(135deg, rgba(var(--v-theme-surface-variant), 0.8) 0%, rgba(var(--v-theme-background), 0.6) 100%);
}

.rocket-card__description {
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

