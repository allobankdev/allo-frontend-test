<template>
  <v-card
    class="d-flex flex-column fill-height"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :alt="rocket.name"
      :src="rocket.imageUrl"
    />
    <v-card-title class="d-flex align-center ga-2">
      <span class="text-truncate">{{ rocket.name }}</span>
      <v-chip
        v-if="rocket.isLocal"
        color="secondary"
        size="x-small"
      >
        New
      </v-chip>
    </v-card-title>
    <v-card-text class="rocket-card__desc">
      {{ rocket.description || 'No description available.' }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.rocket-card__desc {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

