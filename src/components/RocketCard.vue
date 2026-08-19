<script setup lang="ts">
import RocketImage from './RocketImage.vue'
import type { Rocket } from '@/types/rocket'
defineProps<{ rocket: Rocket }>()
</script>

<template>
  <v-card
    class="rocket-card h-100 d-flex flex-column"
    rounded="lg"
    :to="`/rockets/${rocket.id}`"
    variant="flat"
  >
    <RocketImage
      :src="rocket.imageUrl"
      :alt="rocket.name"
    />
    <v-card-item class="pa-5 pb-2">
      <template #prepend>
        <v-icon
          class="mr-3"
          color="primary"
          icon="mdi-rocket-launch"
        />
      </template>
      <v-card-title class="font-weight-bold text-wrap">
        {{ rocket.name }}
      </v-card-title>
      <template #append>
        <v-chip
          v-if="rocket.isLocal"
          color="primary"
          size="small"
        >
          Local
        </v-chip>
      </template>
    </v-card-item>
    <v-card-text class="px-5 pb-5 text-medium-emphasis description">
      {{ rocket.description || 'No description available.' }}
    </v-card-text>
  </v-card>
</template>

<style scoped>
.rocket-card { border: 1px solid #dce2e5; box-shadow: 0 10px 30px rgba(25, 39, 46, .06); transition: transform .2s, box-shadow .2s; overflow: hidden; }
.rocket-card:hover { transform: translateY(-4px); box-shadow: 0 16px 36px rgba(25, 39, 46, .12); }
.description { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 4; line-height: 1.6; }
</style>
