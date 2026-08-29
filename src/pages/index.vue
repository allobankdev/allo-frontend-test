<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRocketStore } from '@/store/rocket'
import RocketCard from "@/components/RocketCard.vue";
import type { Rocket } from '@/types/rocket'

const rocketStore = useRocketStore()
const searchQuery = ref('')

const newRocketName = ref('')
const newRocketDescription = ref('')

onMounted(() => {
  rocketStore.loadRockets()
})

const filteredRockets = computed(() => {
  if (!searchQuery.value) {
    return rocketStore.rockets
  }

  return rocketStore.rockets.filter((rocket) =>
    rocket.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const addRocket = () => {
  if (!newRocketName.value || !newRocketDescription.value) return

  const newRocket: Rocket = {
    id: crypto.randomUUID(),
    name: newRocketName.value,
    description: newRocketDescription.value,
    flickr_images: [],
    cost_per_launch: 0,
    country: 'Unknown',
    first_flight: 'N/A',
  }

  rocketStore.addRocket(newRocket)

  newRocketName.value = ''
  newRocketDescription.value = ''
}

</script>

<template>
  <section class="container">
    <!-- Add Rocket -->
    <form class="card form-card" @submit.prevent="addRocket">
      <h2 class="section-title">Add New Rocket</h2>

      <div class="form-row">
        <input
          v-model="newRocketName"
          type="text"
          placeholder="Rocket name"
          required
        />

        <input
          v-model="newRocketDescription"
          type="text"
          placeholder="Rocket description"
          required
        />

        <button type="submit">Add</button>
      </div>
    </form>

    <!-- Filter -->
    <div class="filter-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search rocket by name"
      />
    </div>

    <!-- Loading -->
    <div v-if="rocketStore.isLoading" class="state">
      Loading rockets, please wait…
    </div>

    <!-- Error -->
    <div v-else-if="rocketStore.error" class="state error">
      <p>{{ rocketStore.error }}</p>
      <button @click="rocketStore.loadRockets">Retry</button>
    </div>

    <!-- Success -->
    <div v-else class="rocket-grid">
      <RocketCard
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>
  </section>
</template>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.section-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.form-card {
  padding: 16px;
  margin-bottom: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 2fr auto;
  gap: 12px;
}

input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

input:focus {
  outline: none;
  border-color: #2563eb;
}

button {
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #1d4ed8;
}

.filter-bar {
  margin-bottom: 20px;
}

.state {
  padding: 32px;
  text-align: center;
  color: #6b7280;
}

.state.error {
  color: #b91c1c;
}

.rocket-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
</style>

