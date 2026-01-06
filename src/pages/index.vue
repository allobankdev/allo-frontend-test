<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRocketStore } from '@/store/rocket'
import RocketCard from "@/components/RocketCard.vue";

const rocketStore = useRocketStore()
const searchQuery = ref('')

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
</script>

<template>
  <section>

    <!-- Filter -->
    <input
      v-model="searchQuery"
      type="text"
      placeholder="Search rocket by name"
    />

    <!-- Loading State -->
    <div v-if="rocketStore.isLoading">
      <p>Loading rockets...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="rocketStore.error">
      <p>{{ rocketStore.error }}</p>
      <button @click="rocketStore.loadRockets">
        Retry
      </button>
    </div>

    <!-- Success State -->
    <div v-else>
<!--      <ul>-->
<!--        <li-->
<!--          v-for="rocket in rocketStore.rockets"-->
<!--          :key="rocket.id"-->
<!--        >-->
<!--          <h2>{{ rocket.id }}</h2>-->
<!--          <h3>{{ rocket.name }}</h3>-->
<!--          <p>{{ rocket.description }}</p>-->
<!--        </li>-->
<!--      </ul>-->
      <RocketCard
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />

    </div>
  </section>
</template>

<style scoped>

</style>

