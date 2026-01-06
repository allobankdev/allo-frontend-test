<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Rocket } from '@/types/rocket'
import { fetchRocketById } from '@/api/space'

const route = useRoute()

const rocket = ref<Rocket | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  isLoading.value = true
  error.value = null

  try {
    rocket.value = await fetchRocketById(route.params.id as string)
  } catch (e) {
    error.value = 'Failed to load rocket detail ' + e
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <section>
    <!-- Loading -->
    <div v-if="isLoading">
      <p>Loading rocket detail...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error">
      <p>{{ error }}</p>
    </div>

    <!-- Success -->
    <div v-else-if="rocket">
      <img
        v-if="rocket.flickr_images.length"
        :src="rocket.flickr_images[0]"
        :alt="rocket.name"
      />

      <h1>{{ rocket.name }}</h1>
      <p>{{ rocket.description }}</p>

      <ul>
        <li><strong>Country:</strong> {{ rocket.country }}</li>
        <li><strong>First flight:</strong> {{ rocket.first_flight }}</li>
        <li>
          <strong>Cost per launch:</strong>
          ${{ rocket.cost_per_launch.toLocaleString() }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>

</style>
