<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRocketStore } from "@/stores/rocketStores";
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";
import LoadingSpinner from "@/components/LoadingSpinner.vue";

const store = useRocketStore();
const router = useRouter();

onMounted(() => {
  store.fetchRockets();
});
</script>

<template>
  <div class="px-2 py-2 max-w-7xl mx-auto">
    <div class="flex items-center justify-between my-4">
      <h1 class="text-2xl font-bold">🚀 SpaceX Rockets</h1>
      <v-button 
      class= "bg-green-500 text-white cursor-pointer w-10 h-10 flex items-center justify-center text-3xl text-semibold py-2 rounded-md"
      @click="router.push('/rockets/new')">
        +
      </v-button>
      
    </div>

    <RocketFilter />

    <LoadingSpinner v-if="store.loading" />

    <div v-if="store.error" class="text-center">
      <p class="text-red-500 mb-2">{{ store.error }}</p>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded"
        @click="store.fetchRockets"
      >
        Retry
      </button>
    </div>

    <div
      v-if="!store.loading && !store.error"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <RocketCard
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>
  </div>
</template>

