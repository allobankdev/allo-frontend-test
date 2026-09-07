<script setup lang="ts">
import RocketCard
  from './RocketCard.vue'

import type {
  Rocket,
} from '@/types/rocket'


defineProps<{
  rockets: Rocket[]
}>()
</script>


<template>
  <div class="rocket-grid">

    <RocketCard
      v-for="rocket in rockets"

      :key="rocket.id"

      :rocket="rocket"
    />

  </div>
</template>


<style scoped>
.rocket-grid {
  display: grid;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  gap: 24px;
}


@media (max-width: 1000px) {
  .rocket-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 18px;
  }
}


@media (max-width: 640px) {
  .rocket-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );

    gap: 10px;
  }
}
</style>
