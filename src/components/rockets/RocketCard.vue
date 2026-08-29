<template>
  <BaseCard class="rocket-card" @click="handleClick">
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
        <div class="spinner-small"></div>
      </div>
    </div>
    <div class="rocket-info">
      <h3>{{ rocket.name }}</h3>
      <p>{{ truncateDescription(rocket.description) }}</p>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseCard from '@/components/base/BaseCard.vue'

const props = defineProps({
  rocket: {
    type: Object,
    required: true
  }
})

const router = useRouter()
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
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RjMzQ0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
  }

  if (props.rocket.flickr_images && props.rocket.flickr_images.length > 0) {
    const firstImage = props.rocket.flickr_images[0]

    // Skip problematic URLs and show fallback immediately
    if (isProblematicUrl(firstImage)) {
      imageError.value = true
      imageLoaded.value = true
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2RjMzQ0NSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5JbWFnZSBOb3QgQXZhaWxhYmxlPC90ZXh0Pjwvc3ZnPg=='
    }

    return firstImage
  }

  // Initial fallback if no images
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzQyYjg4MyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4='
})

const handleImageError = () => {
  imageError.value = true
  imageLoaded.value = true
}

const handleImageLoad = () => {
  imageLoaded.value = true
}

const truncateDescription = (description) => {
  if (!description) return ''
  return description.length > 100 ? description.substring(0, 100) + '...' : description
}

const handleClick = () => {
  router.push(`/rockets/${props.rocket.id}`)
}
</script>

<style scoped>
.rocket-card {
  cursor: pointer;
  overflow: hidden;
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
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

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #42b883;
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
  padding-top: 15px;
}

.rocket-info h3 {
  font-size: 20px;
  color: #333;
  margin: 0 0 10px 0;
}

.rocket-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.5;
}
</style>
