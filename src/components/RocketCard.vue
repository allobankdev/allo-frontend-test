<script setup lang="ts">
import type { Launcher } from '@/types/ll2'

defineProps<{ rocket: Launcher }>()
</script>

<template>
  <v-card
    variant="outlined"
    rounded="lg"
    class="rocket-card h-100"
  >
    <v-img
      v-if="rocket.image_url"
      :src="rocket.image_url"
      :alt="rocket.full_name"
      height="180"
      cover
    />
    <div
      v-else
      class="rocket-card__placeholder d-flex align-center justify-center"
    >
      <v-icon
        size="64"
        icon="mdi-rocket-launch-outline"
      />
    </div>

    <v-card-title class="text-truncate">
      {{ rocket.full_name }}
    </v-card-title>

    <v-card-text class="text-medium-emphasis">
      <p class="rocket-card__description text-body-2">
        {{ rocket.description || 'No description available.' }}
      </p>
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        :to="`/rocket/${rocket.id}`"
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
.rocket-card__placeholder {
  height: 180px;
  background: rgb(var(--v-theme-surface-variant));
}
.rocket-card__description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 3.6em;
}
</style>
