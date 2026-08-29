<template>
  <div class="rocket-detail-view">
    <LoadingState v-if="store.loading" message="Loading rocket details..." />

    <ErrorState
      v-else-if="store.hasError"
      :message="store.error"
      @retry="handleRetry"
    />

    <div v-else-if="rocket" class="rocket-detail">
      <BaseButton class="back-button" variant="secondary" @click="goBack">
        ← Back to List
      </BaseButton>

      <BaseCard class="detail-card">
        <div class="image-container">
          <img
            :src="rocketImage"
            :alt="rocket.name"
            class="rocket-image"
            @error="handleImageError"
            @load="handleImageLoad"
            :class="{ 'image-loaded': imageLoaded }"
          />
          <div v-if="!imageLoaded && !imageError" class="image-loading">
            <div class="spinner-large"></div>
          </div>
        </div>
        <div class="rocket-info">
          <h1>{{ rocket.name }}</h1>
          <p class="description">{{ rocket.description }}</p>

          <div class="details-grid">
            <div class="detail-item">
              <span class="label">Country:</span>
              <span class="value">{{ rocket.country || 'N/A' }}</span>
            </div>

            <div class="detail-item">
              <span class="label">Cost per Launch:</span>
              <span class="value">{{ formatCurrency(rocket.cost_per_launch) }}</span>
            </div>

            <div class="detail-item">
              <span class="label">First Flight:</span>
              <span class="value">{{ formatDate(rocket.first_flight) }}</span>
            </div>

            <div class="detail-item">
              <span class="label">Success Rate:</span>
              <span class="value">{{ rocket.success_rate_pct }}%</span>
            </div>

            <div class="detail-item">
              <span class="label">Active:</span>
              <span class="value">{{ rocket.active ? 'Yes' : 'No' }}</span>
            </div>

            <div class="detail-item">
              <span class="label">Height:</span>
              <span class="value">
                {{ rocket.height?.meters }} meters ({{ rocket.height?.feet }} feet)
              </span>
            </div>

            <div class="detail-item">
              <span class="label">Diameter:</span>
              <span class="value">
                {{ rocket.diameter?.meters }} meters ({{ rocket.diameter?.feet }} feet)
              </span>
            </div>

            <div class="detail-item">
              <span class="label">Mass:</span>
              <span class="value">
                {{ rocket.mass?.kg }} kg ({{ rocket.mass?.lb }} lb)
              </span>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <div v-else class="not-found">
      <h2>Rocket not found</h2>
      <BaseButton variant="primary" @click="goBack">Back to List</BaseButton>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRocketStore } from '@/stores/rocketStore'
import { formatCurrency, formatDate } from '@/utils/formatters'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseButton from '@/components/base/BaseButton.vue'
import LoadingState from '@/components/ui/LoadingState.vue'
import ErrorState from '@/components/ui/ErrorState.vue'

const route = useRoute()
const router = useRouter()
const store = useRocketStore()

const rocket = ref(null)
const imageError = ref(false)
const imageLoaded = ref(false)

// Check if image URL is from problematic domains
const isProblematicUrl = (url) => {
  if (!url) return true
  return url.includes('imgur.com')
}

// Get the first image from flickr_images array, or use a fallback
const rocketImage = computed(() => {
  if (imageError.value) {
    // Show fallback if image failed to load - use data URI to avoid URL parsing issues
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2RjMzQ0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjMyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
  }

  if (rocket.value && rocket.value.flickr_images && rocket.value.flickr_images.length > 0) {
    const firstImage = rocket.value.flickr_images[0]

    // Skip problematic URLs and show fallback immediately
    if (isProblematicUrl(firstImage)) {
      imageError.value = true
      imageLoaded.value = true
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2RjMzQ0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjMyIiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
    }

    return firstImage
  }

  // Initial fallback if no images
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzQyYjg4MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpZW1vPSIzMiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+PC9zdmc+'
})

const handleImageError = () => {
  imageError.value = true
  imageLoaded.value = true
}

const handleImageLoad = () => {
  imageLoaded.value = true
}

onMounted(async () => {
  const rocketId = route.params.id
  try {
    rocket.value = await store.fetchRocketById(rocketId)
  } catch (error) {
    console.error('Failed to load rocket:', error)
  }
})

const handleRetry = async () => {
  const rocketId = route.params.id
  try {
    rocket.value = await store.fetchRocketById(rocketId)
  } catch (error) {
    console.error('Failed to load rocket:', error)
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
.rocket-detail-view {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  margin-bottom: 20px;
}

.detail-card {
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 400px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 30px;
}

.rocket-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.rocket-image.image-loaded {
  opacity: 1;
}

.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner-large {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b883;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.rocket-info {
  padding: 0 20px 20px;
}

.rocket-info h1 {
  font-size: 36px;
  color: #333;
  margin: 0 0 20px 0;
}

.description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.detail-item .label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.detail-item .value {
  font-size: 18px;
  color: #333;
  font-weight: 500;
}

.not-found {
  text-align: center;
  padding: 60px 20px;
}

.not-found h2 {
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
}
</style>
