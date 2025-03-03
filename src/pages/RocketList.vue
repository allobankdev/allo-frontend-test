<script setup lang="ts">
import { onMounted } from 'vue';
import { useRocketStore } from '@/store/rocketStore';
import RocketForm from '@/components/RocketForm.vue';
import { useRouter } from 'vue-router';

const store = useRocketStore();
const router = useRouter();

onMounted(() => {
  store.fetchRockets();
});

const addRocket = (newRocket) => {
  store.rockets.push(newRocket);
};

const goToDetail = (id) => {
  router.push(`/rocket/${id}`);
};
</script>

<template>
  <div>
    <h1>Rocket List</h1>

    <RocketForm @addRocket="addRocket" />

    <div v-if="store.loading">Loading...</div>
    <div v-else-if="store.error">
      <p>Error: {{ store.error }}</p>
      <button @click="store.fetchRockets">Retry</button>
    </div>
    
    <ul v-else>
      <li v-for="rocket in store.rockets" :key="rocket.id" @click="goToDetail(rocket.id)" class="rocket-card">
        <img :src="rocket.flickr_images.length ? rocket.flickr_images[0] : 'https://via.placeholder.com/150'" 
         alt="Rocket Image" width="100" />
        <h3>{{ rocket.name }}</h3>
        <p>{{ rocket.description }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.rocket-card {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  transition: 0.3s;
}

.rocket-card:hover {
  background-color: #f5f5f5;
  color: #121212;
}
</style>
