<template>
  <v-container>
    <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="$router.push('/')" class="mb-4">
      Back to Rockets
    </v-btn>

    <!-- Handle Loading if directly visiting the URL -->
    <v-row v-if="store.isLoading" justify="center" class="my-10">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
    </v-row>

    <!-- Content -->
    <v-row v-else-if="rocket">
      <v-col cols="12" md="6">
        <v-carousel hide-delimiters height="400">
          <v-carousel-item
            v-for="(img, i) in (rocket.flickr_images?.length ? rocket.flickr_images : ['https://via.placeholder.com/800x400?text=No+Image'])"
            :key="i"
            :src="img"
            cover
          ></v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col cols="12" md="6">
        <h1 class="text-h3 mb-2">{{ rocket.name }}</h1>
        <p class="text-body-1 text-grey-darken-1 mb-4">{{ rocket.country }} &bull; First Flight: {{ rocket.first_flight }}</p>
        
        <p class="text-body-1 mb-6">{{ rocket.description }}</p>

        <v-card variant="outlined" class="pa-4 bg-grey-lighten-4">
          <div class="text-h6 text-primary">Cost per Launch</div>
          <div class="text-h4 font-weight-bold">${{ (rocket.cost_per_launch || 0).toLocaleString() }}</div>
        </v-card>
      </v-col>
    </v-row>
    
    <!-- Not Found -->
    <v-row v-else justify="center" class="my-10">
      <v-col cols="12" class="text-center">
        <h2 class="text-h5 text-grey">Rocket not found</h2>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'

const route = useRoute()
const store = useRocketStore()

const rocketId = computed(() => route.params.id as string)

const rocket = computed(() => {
  return store.rockets.find(r => r.id === rocketId.value)
})

onMounted(() => {
  // If navigating directly to detail layout, initiate a background fetch
  store.fetchRockets()
})
</script>
