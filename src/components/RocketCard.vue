<template>
  <div class="rocket-card" @click="goToDetail">
    <div class="image-container">
      <img 
        :src="rocket.flickr_images[0]" 
        :alt="rocket.name" 
        class="rocket-image"
      />
      <div v-if="isLocalRocket" class="local-badge">Local</div>
    </div>
    <div class="card-content">
      <h3 class="rocket-name">{{ rocket.name }}</h3>
      <p class="rocket-description">{{ truncatedDescription }}</p>
      <div class="card-footer">
        <span class="country-badge">{{ rocket.country }}</span>
        <span class="cost">${{ formatCost(rocket.cost_per_launch) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { Rocket } from '../types';

interface Props {
  rocket: Rocket;
}

const props = defineProps<Props>();
const router = useRouter();

const isLocalRocket = computed(() => {
  return props.rocket.id.startsWith('local-');
});

const truncatedDescription = computed(() => {
  const desc = props.rocket.description;
  return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
});

const formatCost = (cost: number): string => {
  return new Intl.NumberFormat('en-US').format(cost);
};

const goToDetail = (): void => {
  router.push(`/rocket/${props.rocket.id}`);
};
</script>

<style scoped>
.rocket-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  height: 100%;
}

.rocket-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.image-container {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.rocket-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.rocket-card:hover .rocket-image {
  transform: scale(1.05);
}

.local-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #4CAF50;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.card-content {
  padding: 20px;
}

.rocket-name {
  margin: 0 0 10px 0;
  font-size: 1.25rem;
  color: #333;
}

.rocket-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 15px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.country-badge {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.cost {
  font-weight: bold;
  color: #2e7d32;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .image-container {
    height: 160px;
  }
  
  .card-content {
    padding: 15px;
  }
}
</style>