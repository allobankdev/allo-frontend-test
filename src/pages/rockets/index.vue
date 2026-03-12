<template>
  <v-container>
    <!-- Header -->
    <div class="d-flex align-center mb-6">
      <h1 class="text-h4 font-weight-bold">Rockets</h1>
      <v-spacer />
      <v-btn color="primary" prepend-icon="mdi-plus" @click="showDialog = true">
        Add Rocket
      </v-btn>
    </div>

    <!-- Filter -->
    <v-text-field
      v-model="store.filter"
      label="Search rockets..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="comfortable"
      clearable
      hide-details
      class="mb-6"
    />

    <!-- Loading -->
    <div v-if="store.loading" class="d-flex justify-center py-16">
      <v-progress-circular indeterminate size="64" color="primary" />
    </div>

    <!-- Error -->
    <v-alert v-else-if="store.error" type="error" class="mb-4">
      {{ store.error }}
      <template #append>
        <v-btn variant="outlined" size="small" @click="store.fetchRockets()">
          Retry
        </v-btn>
      </template>
    </v-alert>

    <!-- Rocket Grid -->
    <v-row v-else>
      <v-col
        v-for="rocket in store.filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <RocketCard :rocket="rocket" />
      </v-col>

      <v-col v-if="store.filteredRockets.length === 0" cols="12">
        <v-alert type="info" variant="tonal">
          No rockets found.
        </v-alert>
      </v-col>
    </v-row>

    <!-- Add Rocket Dialog -->
    <AddRocketDialog v-model="showDialog" />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRocketStore } from '@/stores/rocket'

const store = useRocketStore()
const showDialog = ref(false)

onMounted(() => {
  if (store.rockets.length === 0) {
    store.fetchRockets()
  }
})
</script>
