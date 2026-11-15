<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import RocketImage from './RocketImage.vue'
defineProps<{ rocket: Rocket }>()
</script>

<template>
  <router-link
    :to="{ name: 'rocket', params: { id: rocket.id } }"
    class="rocket-card"
  >
    <RocketImage
      :src="rocket.imageUrl"
      :name="rocket.name"
    />
    <div class="card-content">
      <span
        v-if="rocket.local"
        class="local-label"
      >Added by you</span>
      <div class="card-heading">
        <h2>{{ rocket.name }}</h2>
        <span aria-hidden="true">↗</span>
      </div>
      <p>{{ rocket.description }}</p>
    </div>
  </router-link>
</template>
