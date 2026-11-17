<template>
  <v-container>
    <div class="d-flex align-center justify-space-between mb-4">
      <h1 class="text-h4 font-weight-bold">
        SpaceX Rocket Explorer
      </h1>
      <!-- Add form -->
      <AddRocketForm />
    </div>
    <v-text-field 
      v-model="keyword" 
      label="Filter rockets by name" 
      prepend-inner-icon="mdi-magnify" 
      clearable
      density="comfortable"
      class="mb-4"
    />
    <div
      v-if="status === 'idle'|| status === 'loading'"
      class="d-flex justify-center py-16"
    >
      <v-progress-circular
        indeterminate
        size="48"
      />
    </div>

    <v-alert
      v-else-if="status === 'error'"
      type="error"
    >
      <div class="d-flex align-center justify-space-between flex-wrap ga-2">
        <span>Failed to load rockets.</span>
        <v-btn @click="retry">
          Retry
        </v-btn>
      </div>
    </v-alert>

    <template v-else>
      <v-row v-if="filteredRockets.length">
        <v-col 
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
        >
          <!-- Rocet card -->
          <RocketCard :rocket="rocket" />
        </v-col>
      </v-row>

      <div
        v-else
        class="text-center text-body-1 py-16"
      >
        No rockets found.
      </div>
    </template>
  </v-container>
</template>

<script lang="ts" setup>
import RocketCard from '@/components/RocketCard.vue';
// import { fetchRockets } from '@/services/rocketService';
import { useRockets } from '@/stores/rockets';
import { onMounted } from 'vue';

  const { status, keyword, filteredRockets, loadRockets, retry } = useRockets();
  
  onMounted(() => {
    loadRockets()
  })
</script>
