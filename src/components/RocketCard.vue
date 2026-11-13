<template>
  <v-card
    class="h-100"
    hover
    :to="`/rockets/${rocket.id}`"
  >
    <RocketImage
      :alt="rocket.full_name"
      :src="rocket.image_url"
    />
    <v-card-title>{{ rocket.full_name }}</v-card-title>
    <v-card-text class="description">
      {{ formatText(rocket.description) }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { formatText } from '@/utils/formatters'
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>