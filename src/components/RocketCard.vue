<script setup lang="ts">
import RocketImage from './RocketImage.vue'
import { formatText } from '../utils/format'
import type { Rocket } from '../types/rocket'

defineProps<{ rocket: Rocket }>()
</script>

<template>
  <RouterLink :to="{ name: 'rocket-detail', params: { id: rocket.id } }" class="card">
    <RocketImage :src="rocket.imageUrl" :alt="rocket.name" />
    <div class="card__body">
      <h2 class="card__title">{{ rocket.name }}</h2>
      <p class="card__text">{{ formatText(rocket.description) }}</p>
    </div>
  </RouterLink>
</template>
