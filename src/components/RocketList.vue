<template>
  <div>
    <input v-model="filter" placeholder="Filter rockets" />
    <button @click="addNewRocket">Add Rocket</button>
    <div v-if="store.loading">
      Loading...
    </div>
    <div v-else-if="store.error">
      <div>Error: {{ store.error }}</div>
      <button @click="fetchRockets">Retry</button>
    </div>
    <ul v-else>
      <li v-for="rocket in filteredRockets" :key="rocket.id">
        <router-link :to="`/rocket/${rocket.id}`">
          <img :src="rocket.flickr_images[0]" :alt="rocket.name" width="100" />
          <div>{{ rocket.name }}</div>
          <div>{{ rocket.description }}</div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRocketStore } from '../stores/rockets'

const store = useRocketStore()
const filter = ref('')

const filteredRockets = computed(() =>
  store.rockets.filter(r =>
    r.name.toLowerCase().includes(filter.value.toLowerCase())
  )
)

function addNewRocket() {
  store.addRocket({
    id: Date.now().toString(),
    name: 'New Rocket',
    description: 'Custom rocket',
    flickr_images: ['https://via.placeholder.com/100']
  })
}

function fetchRockets() {
  store.fetchRockets()
}

onMounted(fetchRockets)
</script>