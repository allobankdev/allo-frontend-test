<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>

<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="rocket-card"
    rounded="lg"
    variant="flat"
  >
    <v-img
      :aspect-ratio="16 / 9"
      cover
      :src="rocket.image"
    />

    <v-card-item>
      <v-card-title class="text-subtitle-1 font-weight-medium">
        {{ rocket.name }}
      </v-card-title>
      <v-card-subtitle>
        {{ rocket.country }}
      </v-card-subtitle>
    </v-card-item>

    <v-card-text class="text-truncate">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rocket-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: border-color 0.2s ease, background 0.2s ease;
}

.rocket-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.18);
}
</style>