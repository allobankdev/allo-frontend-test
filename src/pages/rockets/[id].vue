<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import RocketState from '@/components/RocketState.vue'

import type { Rocket } from '@/types/rocket'
import { fetchRocketById } from '@/service/space'

const route = useRoute()

const rocket = ref<Rocket | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadRocket = async () => {
  loading.value = true
  error.value = null

  try {
    await new Promise(r => setTimeout(r, 500))

    const found = await fetchRocketById(route.params.id as string)

    if (!found) {
      throw new Error('Rocket not found')
    }

    rocket.value = found
    loading.value = false
  } catch (err: any) {
    error.value = err.message || 'Failed to load rocket'
    loading.value = false
  }
}

onMounted(() => {
  loadRocket()
})
</script>

<template>
  <section class="container">
    <RocketState v-if="loading || error" :loading="loading" :error="error" @retry="loadRocket" class="mt-4" />

    <div v-else-if="rocket">

      <div class="card my-4">
        <img v-if="rocket.flickr_images.length" :src="rocket.flickr_images[0]" :alt="rocket.name"
          class="card-img-top img-fluid" style="height: 500px;" />

        <div class="card-body">
          <h5 class="card-title">{{ rocket.name }}</h5>
          <p class="card-text">{{ rocket.description }}</p>
          <hr>
          <div class="d-flex gap-4 flex-wrap justify-space-between">
            <div class="bg-light flex-grow-1 p-2 rounded">
              <h6>Type</h6>
              <p class="lead text-uppercase">{{ rocket.type }}</p>
            </div>
            <div class="bg-light flex-grow-1 p-2 rounded">
              <h6>Status</h6>
              <span v-if="rocket.active" class="badge bg-success">Active</span>
              <span v-else-if="!rocket.active" class="badge bg-error">Inactive</span>
            </div>
            <div class="bg-light flex-grow-1 p-2 rounded">
              <h6>Country</h6>
              <p>{{ rocket.country }}</p>
            </div>
            <div class="bg-light flex-grow-1 p-2 rounded">
              <h6>Company</h6>
              <p class="lead">{{ rocket.company }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>