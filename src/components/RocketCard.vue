<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="rocket-card h-100"
    hover
  >
    <v-img
      v-if="rocket.image_url"
      :src="rocket.image_url"
      height="190"
      cover
    >
      <template #error>
        <RocketImageFallback />
      </template>
    </v-img>
    <RocketImageFallback
      v-else
      height="190"
    />
    <v-card-item>
      <v-card-title class="text-wrap">
        {{ rocket.full_name }}
      </v-card-title>
    </v-card-item>
    <v-card-text class="text-medium-emphasis description">
      {{ rocket.description || 'No description available.' }}
    </v-card-text>
    <v-card-actions><span class="text-primary text-body-2 font-weight-medium">View details</span><v-spacer /><v-icon icon="mdi-arrow-right" /></v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
  import type { Rocket } from '@/types/rocket'
  defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.rocket-card { transition: transform .2s ease, box-shadow .2s ease; }
.rocket-card:hover { transform: translateY(-4px); }
.description { display: -webkit-box; overflow: hidden; -webkit-line-clamp: 3; -webkit-box-orient: vertical; }
</style>
