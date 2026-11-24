<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="h-100 d-flex flex-column"
    hover
  >
    <RocketImage
      :src="rocket.imageUrl"
      :alt="rocket.name"
      :height="180"
    />
    <v-card-title class="d-flex align-center ga-2">
      <span class="text-wrap">{{ rocket.name }}</span>
      <v-chip
        v-if="rocket.isLocal"
        size="small"
        color="primary"
        label
      >
        Added
      </v-chip>
    </v-card-title>
    <v-card-text class="flex-grow-1">
      <p class="rocket-description">
        {{ rocket.description ?? 'No description available.' }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
  .rocket-description {
    display: -webkit-box;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>