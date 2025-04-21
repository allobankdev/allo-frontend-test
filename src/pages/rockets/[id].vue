<template>
  <v-container v-if="rocket">
    <v-img
      :src="rocket.flickr_images[0]"
      height="400px"
    />
  
    <v-card class="mt-4">
      <v-card-title 
        class="text-center"
      >
        {{ rocket.name }}
      </v-card-title>
      <v-card-text>
        <p>
          <strong>Description:</strong> {{ rocket.description }}
        </p>
        <p>
          <strong>Cost per Launch:</strong> {{ rocket.cost_per_launch.toLocaleString() }}
        </p>
        <p>
          <strong>Country:</strong> {{ rocket.country }}
        </p>
        <p>
          <strong>First Flight:</strong> {{ rocket.first_flight }}
        </p>
      </v-card-text>
    </v-card>
  </v-container>
</template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { fetchRocketById } from '@/services/rocketService'
  import type { Rocket } from '@/types/Rocket'
  
  const route = useRoute()
  const rocket = ref<Rocket | null>(null)
  
  onMounted(async () => {
    const id = route.params.id as string
    rocket.value = await fetchRocketById(id)
  })
  </script>
  