<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import RocketCard from './RocketCard.vue'

defineProps<{
  rockets: readonly Rocket[]
}>()
</script>

<template>
  <v-row
    tag="ul"
    class="rocket-grid"
    aria-label="Rockets"
  >
    <v-col
      v-for="rocket in rockets"
      :key="rocket.id"
      tag="li"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <RocketCard :rocket="rocket" />
    </v-col>
  </v-row>
</template>

<style scoped>
.rocket-grid {
  list-style: none;
  padding: 0;
}
</style>
