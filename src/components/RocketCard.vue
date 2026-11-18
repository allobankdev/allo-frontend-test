<script lang="ts" setup>
import type { Rocket } from '@/types/rocket'

defineProps<{
    rocket: Rocket
}>()
</script>

<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    hover
  >
    <RocketImage
      :src="rocket.imageUrl"
      :alt="rocket.name"
    />

    <v-card-item>
      <v-card-title class="text-body-1 font-weight-bold">
        {{ rocket.name }}
      </v-card-title>
      <v-card-subtitle class="text-caption">
        {{ rocket.country ?? 'Unknown country' }} ·
        {{ rocket.active ? 'Active' : 'Retired' }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="text-body-2 flex-grow-1">
      <p
        v-if="rocket.description"
        class="rocket-card__description"
      >
        {{ rocket.description }}
      </p>
      <p
        v-else
        class="text-medium-emphasis font-italic"
      >
        No description available.
      </p>
    </v-card-text>

    <v-card-actions>
      <v-chip
        v-if="rocket.isLocal"
        size="small"
        color="primary"
        variant="tonal"
      >
        Added by you
      </v-chip>
      <v-spacer />
      <v-btn
        :to="`/rockets/${rocket.id}`"
        variant="text"
        color="primary"
        append-icon="mdi-arrow-right"
      >
        Detail
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.rocket-card__description {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
