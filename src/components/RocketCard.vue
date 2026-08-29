<template>
  <v-card
    class="rocket-card"
    variant="outlined"
    rounded="lg"
    hover
    @click="$router.push(`/rockets/${rocket.id}`)"
  >
    <v-img
      :src="imageUrl"
      :alt="rocket.name"
      height="180"
      cover
      gradient="to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%"
    >
      <v-card-title class="text-h6 text-white mt-auto pt-8">
        {{ rocket.name }}
      </v-card-title>
    </v-img>
    <v-card-text class="pt-3">
      <p class="text-body-2 text-medium-emphasis line-clamp-3">
        {{ description }}
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{ rocket: Rocket }>()

const imageUrl = computed(() => {
  const imgs = props.rocket.flickr_images
  return imgs?.[0] ?? 'https://imgur.com/DaCfMsj.jpg'
})

const description = computed(() => props.rocket.description ?? 'No description.')
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
}
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
