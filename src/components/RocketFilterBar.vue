<template>
  <div class="d-flex flex-column flex-sm-row gap-4 align-sm-center" style="width: 100%; max-width: 700px;">
    <!-- Global search input -->
    <v-text-field
      v-model="store.searchQuery"
      prepend-inner-icon="mdi-magnify"
      label="Search rockets..."
      variant="outlined"
      density="comfortable"
      hide-details
      class="flex-grow-1"
    ></v-text-field>
    
    <!-- Status filter dropdown -->
    <v-select
      v-model="store.statusFilter"
      :items="[
        { title: 'All Status', value: 'all' },
        { title: 'Active Only', value: 'active' },
        { title: 'Inactive Only', value: 'inactive' }
      ]"
      item-title="title"
      item-value="value"
      variant="outlined"
      density="comfortable"
      hide-details
      style="min-width: 150px; max-width: 180px;"
    ></v-select>

    <!-- Trigger Add Modal -->
    <v-btn
      color="blue-darken-3"
      prepend-icon="mdi-plus"
      height="48"
      class="text-none font-weight-bold rounded-lg px-6"
      @click="$emit('open-modal')"
    >
      Add Rocket
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { useRocketStore } from '@/stores/rocketStore'

// Define explicit emit for opening modal
defineEmits<{ (e: 'open-modal'): void }>()

// Inject global store for 2-way binding on filters
const store = useRocketStore()
</script>
