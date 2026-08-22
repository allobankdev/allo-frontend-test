<template>
  <v-card
    :aria-label="`View details for ${rocket.fullName}`"
    class="h-100"
    hover
    :to="`/${rocket.id}`"
  >
    <RocketImage
      :alt="rocket.fullName"
      :src="rocket.imageUrl"
    />

    <v-card-title>{{ rocket.fullName }}</v-card-title>

    <v-card-text class="description text-medium-emphasis">
      {{ rocket.description ?? 'Description unavailable.' }}
    </v-card-text>

    <v-card-actions>
      <v-btn
        append-icon="mdi-arrow-right"
        color="primary"
        text="View details"
        variant="text"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { Rocket } from '@/types/rocket'

  defineProps<{
    rocket: Rocket
  }>()
</script>

<style scoped>
  .description {
    display: -webkit-box;
    min-height: 4.5rem;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
  }
</style>
