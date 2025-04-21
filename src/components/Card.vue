<template>
  <v-card 
    class="hoverable" 
    elevation="2"
    @click="$emit('click')"
  >
    <v-img 
      :src="rocket.flickr_images.length ? rocket.flickr_images[0] : defaultImage" 
      height="200" 
    />
    <v-card-title 
      class="text-center"
    >
      {{ rocket.name }}
    </v-card-title>
    <v-card-text>{{ truncateText(rocket.description, 200) }}</v-card-text>
  </v-card>
</template>
  
<script lang="ts" setup>
import type { Rocket } from '@/types/Rocket'
import defaultImage from '@/assets/logo.png'

defineProps<{ rocket: Rocket }>()

defineEmits<{
  (e: 'click'): void
}>()

function truncateText(text: string, length: number): string {
    return text.length > length ? text.slice(0, length) + '...' : text
}
</script>
  