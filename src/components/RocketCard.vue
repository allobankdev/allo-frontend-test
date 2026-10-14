<template>
  <v-card
    class="fill-height"
    :to="{ name: '/rockets/[id]', params: { id: rocket.id } }"
  >
    <RocketImage
      :name="rocket.name"
      :src="rocket.imageUrl"
    />

    <v-card-title class="text-wrap">
      {{ rocket.name }}
    </v-card-title>

    <v-card-text>
      <v-chip
        v-if="rocket.source === 'local'"
        class="mb-2"
        size="small"
      >
        Added locally
      </v-chip>
      <!-- Clamped on an inner element so the card padding does not reveal an extra line -->
      <p class="description">
        {{ formatDescription(rocket.description) }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'
  import { formatDescription } from '@/utils/formatters'

  defineProps<{
    rocket: Rocket
  }>()
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  overflow: hidden;
}
</style>
