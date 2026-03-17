<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import { useRouter } from 'vue-router'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

const toDetil = () => {
  router.push(`/rockets/${props.rocket.id}`)
}

</script>

<template>
  <article class="col" @click="toDetil">
    <div class="card" role="button">
      <img v-if="rocket.flickr_images.length" :src="rocket.flickr_images[0]" :alt="rocket.name" style="height:150px;"
        class="img-fluid" />

      <div class="card-body">
        <h5 class="card-title">{{ rocket.name }}</h5>
        <p>{{ rocket.description }}</p>
      </div>

    </div>
  </article>
</template>

<style scoped>
p {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
