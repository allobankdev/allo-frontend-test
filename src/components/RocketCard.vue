<script setup lang="ts">
import type { Rocket } from '@/types/rocket'
defineProps<{ rocket: Rocket }>()
</script>

<template>
  <router-link
    :to="`/rocket/${rocket.id}`"
    class="card"
  >
    <div class="image-wrapper">
      <img
        :src="rocket.flickr_images[0]"
        :alt="rocket.name"
      />
    </div>

    <div class="content">
      <h3>{{ rocket.name }}</h3>
      <p>{{ rocket.description }}</p>
    </div>
  </router-link>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;

  background: #0b1220;
  border-radius: 16px;
  overflow: hidden;

  text-decoration: none;
  color: inherit;

  border: 1px solid #1e293b;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 30px rgba(0, 0, 0, 0.4);
}

/* Image */
.image-wrapper {
  height: 100%;
  max-width: 100%;
  background: #111827;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.card:hover img {
  transform: scale(1.05);
}

/* Content */
.content {
  padding: 1rem;
}

.content h3 {
  font-size: 1.1rem;
  margin: 0 0 0.5rem;
  color: #e5e7eb;
}

.content p {
  font-size: 0.9rem;
  color: #9ca3af;
  line-height: 1.4;

  /* Required for line clamping */
  display: -webkit-box;
  -webkit-box-orient: vertical;

  /* Standard property (future support) */
  line-clamp: 3;

  /* Vendor-prefixed fallback (current browsers) */
  -webkit-line-clamp: 3;
  overflow: hidden;
}
</style>