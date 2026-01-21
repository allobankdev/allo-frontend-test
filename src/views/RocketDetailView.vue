<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useRocketStore } from '@/store/rocket'
import { computed } from 'vue'

const route = useRoute()
const store = useRocketStore()

const rocket = computed(() =>
  store.rockets.find(r => r.id === route.params.id)
)
</script>

<template>
  <div v-if="rocket" class="page-wrapper">
    <div class="detail-page">
      <div class="image-wrapper">
        <img
          :src="rocket.flickr_images[0]"
          :alt="rocket.name"
        />
      </div>

      <div class="content">
        <h1>{{ rocket.name }}</h1>
        <p class="description">{{ rocket.description }}</p>

        <ul class="meta">
          <li>
            <span>Country</span>
            <strong>{{ rocket.country }}</strong>
          </li>
          <li>
            <span>First Flight</span>
            <strong>{{ rocket.first_flight }}</strong>
          </li>
          <li>
            <span>Cost per Launch</span>
            <strong>${{ rocket.cost_per_launch.toLocaleString() }}</strong>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<style scoped>
.page-wrapper {
  min-height: 100vh;              /* ✅ full screen */
  display: flex;
  align-items: center;            /* ✅ vertical center */
  justify-content: center;        /* ✅ horizontal center */
  padding: 2rem;
  background: radial-gradient(
    circle at top,
    #0f172a,
    #020617
  ); /* optional tapi cakep */
}


.detail-page {
  max-width: 1100px;
  width: 100%;
  background: transparent;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2.5rem;
}

/* Image */
.image-wrapper {
  aspect-ratio: 3 / 4; /* portrait rocket */
  border-radius: 16px;
  overflow: hidden;
  background: #f5f5f5;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Content */
.content h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.description {
   color: #d1d5db;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

/* Meta info */
.meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 0.75rem;
}

.meta li {
  display: flex;
  justify-content: space-between;
  background: #f8f9fb;
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.meta span {
  color: #1f0589;
  font-size: 0.9rem;
}

.meta strong {
  font-weight: 600;
  color: #2563eb; /* blue-600 */
}

/* Responsive */
@media (max-width: 768px) {
  .detail-page {
    grid-template-columns: 1fr;
  }
}
</style>
