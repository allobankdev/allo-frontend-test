<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRocketStore } from '../store/rocketStore';
import { useRouter } from 'vue-router/auto'
import type { IRocketList } from '../types/rocket';

const rockets = ref<IRocketList[]>([]);
const status = ref<'loading' | 'success' | 'error'>('loading');
const rocketStore = useRocketStore();

const router = useRouter()

const addRocket = () => {
  router.push('/rocket/add')
}


onMounted(async () => {
  try {
    await rocketStore.fetchAllRockets();
    rockets.value = rocketStore.rocketSummary;
    console.log("Fetched rockets:", rockets.value);
    status.value = 'success';
  } catch (error) {
    console.error("Error fetch data:", error);
    status.value = 'error';
  }
});
</script>

<template>
  <v-container>
    <h1 class="text-h3 mb-6">Rocket SpaceX</h1>

    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4">List Rocket SpaceX</h1>
      
      <v-btn color="primary" prepend-icon="mdi-plus" @click="addRocket">
        Add Rocket
      </v-btn>
    </div>

    <v-row v-if="status === 'loading'" justify="center" align="center" style="height: 400px;">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-row>
    <v-alert
      v-else-if="status === 'error'"
      type="error"
      variant="tonal"
      title="Gagal Memuat Data"
      border="start"
      class="mb-4"
    >
      <div class="d-flex align-center justify-space-between mt-2">
        <span>SomeThing went wrong. Please try again later.</span>
        
        <v-btn 
          color="error" 
          variant="elevated" 
          prepend-icon="mdi-refresh"
          @click="rocketStore.fetchAllRockets()"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <v-row v-else>
      <v-col v-for="rocket in rockets" :key="rocket.id" cols="12" md="4" sm="6">
        
        <Card :rocket="rocket" />

      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>