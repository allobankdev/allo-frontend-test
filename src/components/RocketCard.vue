<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import { useRouter } from 'vue-router'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/rockets/${props.rocket.id}`)
}

</script>

<template>
  <article class="rocket-card" @click="goToDetail">
    <img
      v-if="rocket.flickr_images.length"
      :src="rocket.flickr_images[0]"
      :alt="rocket.name"
      class="rocket-image"
    />

    <h3>{{ rocket.name }}</h3>
    <p>{{ rocket.description }}</p>
  </article>
</template>

<style scoped>
.rocket-card {
  border: 1px solid #ddd;
  padding: 12px;
  border-radius: 8px;
}

.rocket-image {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
}
</style>
