<template>
  <v-card class="cursor-pointer" @click="goDetail">
    <v-img :src="rocket.flickr_images[0]" height="200" cover />
    <v-card-title>{{ rocket.name }}</v-card-title>
    <v-card-text class="line-clamp">
      {{ rocket.description }}
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Rocket } from '@/api/spacex'
// import type { Rocket } from '../../src/api/spacex'

const props = defineProps<{ rocket: Rocket }>()
const router = useRouter()

function goDetail() {
  router.push(`/rocket/${props.rocket.id}`)
}
</script>

<style scoped>
.line-clamp {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
