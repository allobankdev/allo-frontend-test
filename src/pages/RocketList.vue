<template>
  <div class="rocket-list-page">
    <header class="page-header">
      <h1>🚀 SpaceX Rockets</h1>
      <p>Explore all SpaceX rockets and add your own!</p>
    </header>

    <RocketFilter />
    <RocketForm />

    <div v-if="loading" class="loading-section">
      <AppLoading />
    </div>

    <div v-else-if="error" class="error-section">
      <AppError :message="error" :on-retry="fetchRockets" />
    </div>

    <div v-else class="rockets-grid">
      <div
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        class="rocket-item"
      >
        <RocketCard :rocket="rocket" />
      </div>
    </div>

    <div v-if="!loading && !error && filteredRockets.length === 0" class="empty-state">
      <p>No rockets found. Try a different search or add a new rocket!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRocketStore } from '../store';
import RocketCard from '../components/RocketCard.vue';
import RocketFilter from '../components/RocketFilter.vue';
import RocketForm from '../components/RocketForm.vue';
import AppLoading from '../components/AppLoading.vue';
import AppError from '../components/AppError.vue';

const rocketStore = useRocketStore();

const loading = computed(() => rocketStore.loading);
const error = computed(() => rocketStore.error);
const filteredRockets = computed(() => rocketStore.filteredRockets);

const fetchRockets = (): void => {
  rocketStore.fetchRockets();
};

onMounted(() => {
  fetchRockets();
});
</script>

<style scoped>
/* CSS sama seperti sebelumnya */
.rocket-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.rockets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .rockets-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
}

.loading-section,
.error-section {
  margin: 40px 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  color: #666;
  font-size: 1.1rem;
}
</style>