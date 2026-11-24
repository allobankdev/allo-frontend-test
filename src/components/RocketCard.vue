<template>
  <v-card
    class="h-100 d-flex flex-column"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :alt="rocket.name"
      :src="rocket.imageUrl"
    />

    <v-card-title class="d-flex align-center justify-space-between ga-2 text-wrap">
      <span>{{ rocket.name }}</span>
      <v-chip
        v-if="rocket.isLocal"
        color="primary"
        size="small"
        variant="tonal"
      >
        Local
      </v-chip>
    </v-card-title>

    <v-card-text class="flex-grow-1">
      <p class="rocket-description text-body-2 text-medium-emphasis mb-0">
        {{ formatText(rocket.description, 'No description available.') }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'
import { formatText } from '@/utils/format'

defineProps<{
  rocket: Rocket
}>()
</script>

<style scoped>
.rocket-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
