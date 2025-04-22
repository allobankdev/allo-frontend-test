<template>
  <div v-if="rocket">
    <img :src="rocket.flickr_images[0]" :alt="rocket.name" width="200" />
    <h2>{{ rocket.name }}</h2>
    <p>{{ rocket.description }}</p>
    <p>Cost per launch: {{ rocket.cost_per_launch }}</p>
    <p>Country: {{ rocket.country }}</p>
    <p>First flight: {{ rocket.first_flight }}</p>
    <router-link to="/">Back to list</router-link>
  </div>
  <div v-else>
    <Loading />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '../stores/rockets'
import Loading from './Loading.vue'

const route = useRoute()
const store = useRocketStore()

const rocket = computed(() =>
  store.rockets.find(r => r.id === route.params.id)
)
</script>