<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
import { useRouter } from 'vue-router'

const props = defineProps<{
  rocket: Rocket
}>()

const router = useRouter()

const goToDetail = () => {
  router.push(`/rockets/${props.rocket.id}`)
}

</script>

<template>
  <article class="rocket-card" @click="goToDetail">
    <img
      v-if="rocket.flickr_images.length"
      :src="rocket.flickr_images[0]"
      :alt="rocket.name"
      class="rocket-image"
    />

    <div class="content">
      <h3>{{ rocket.name }}</h3>
      <p>{{ rocket.description }}</p>
      <span class="detail-link">View detail →</span>
    </div>
  </article>
</template>

<style scoped>
.rocket-card {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.rocket-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.rocket-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.content {
  padding: 14px;
}

h3 {
  margin: 0 0 6px;
  font-size: 16px;
  font-weight: 600;
}

p {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detail-link {
  display: inline-block;
  margin-top: 10px;
  font-size: 13px;
  color: #2563eb;
}
</style>
