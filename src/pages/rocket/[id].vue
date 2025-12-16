<template>
  <v-container v-if="rocket">
    <v-img :src="rocket.flickr_images[0]" height="300" cover />
    <h1 class="mt-4">{{ rocket.name }}</h1>
    <p>{{ rocket.description }}</p>

    <v-list>
      <v-list-item title="Cost per launch" :subtitle="`$${rocket.cost_per_launch}`" />
      <v-list-item title="Country" :subtitle="rocket.country" />
      <v-list-item title="First flight" :subtitle="rocket.first_flight" />
    </v-list>
  </v-container>

  <LoadingState v-else />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useRocketStore } from '@/stores/rocket'
import LoadingState from '@/components/LoadingState.vue'

const route = useRoute()
const store = useRocketStore()

const rocket = computed(() =>
  store.getRocketById(route.params.id as string)
)
</script>
