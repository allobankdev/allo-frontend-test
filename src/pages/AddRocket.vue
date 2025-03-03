<script setup lang="ts">
import { ref } from 'vue';
import { useRocketStore } from '@/store/rocketStore';
import RocketForm from '@/components/RocketForm.vue';

const store = useRocketStore();
const rockets = ref([...store.rockets]);

const addRocket = (newRocket) => {
  rockets.value.push(newRocket);
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
      <li v-for="rocket in rockets" :key="rocket.id">
        <img :src="rocket.image" alt="Rocket Image" width="100" />
        <h3>{{ rocket.name }}</h3>
        <p>{{ rocket.description }}</p>
      </li>
    </ul>
  </div>
</template>
