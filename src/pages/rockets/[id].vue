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
  <section class="detail-container">
    <!-- Loading -->
    <div v-if="isLoading" class="state">
      Loading rocket detail…
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state error">
      {{ error }}
    </div>

    <!-- Success -->
    <div v-else-if="rocket" class="detail-card">
      <img
        v-if="rocket.flickr_images.length"
        :src="rocket.flickr_images[0]"
        :alt="rocket.name"
        class="detail-image"
      />

      <div class="detail-content">
        <h1>{{ rocket.name }}</h1>
        <p class="description">{{ rocket.description }}</p>

        <ul class="meta">
          <li>
            <span>Country</span>
            <strong>{{ rocket.country }}</strong>
          </li>
          <li>
            <span>First flight</span>
            <strong>{{ rocket.first_flight }}</strong>
          </li>
          <li>
            <span>Cost per launch</span>
            <strong>
              ${{ rocket.cost_per_launch.toLocaleString() }}
            </strong>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.state {
  padding: 48px;
  text-align: center;
  color: #6b7280;
}

.state.error {
  color: #b91c1c;
}

.detail-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.detail-image {
  width: 100%;
  max-height: 420px;
  object-fit: cover;
}

.detail-content {
  padding: 24px;
}

h1 {
  margin: 0 0 12px;
  font-size: 26px;
  font-weight: 700;
}

.description {
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 24px;
}

.meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  color: #6b7280;
}

.meta li {
  background: #f9fafb;
  border-radius: 8px;
  padding: 12px 16px;
}

.meta span {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}
</style>
