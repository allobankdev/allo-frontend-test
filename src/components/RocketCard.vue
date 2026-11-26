<template>
  <v-card
    class="h-100"
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :alt="rocket.name"
      :src="rocket.imageUrl"
    />
    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-text class="description">
      {{ formatText(rocket.description, 'No description available.') }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'
  import { formatText } from '@/utils/format'

  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
