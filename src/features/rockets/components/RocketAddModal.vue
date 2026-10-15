<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title class="pa-4 bg-primary text-white">
        <span class="text-h6">Add New Rocket</span>
      </v-card-title>

      <v-card-text class="pt-4">
        <RocketForm
          @submit="handleAddRocket"
          @cancel="closeModal"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useRocketStore } from '../store/rocket.store';
import type { Rocket } from '../rocket.types';
import RocketForm from './RocketForm.vue';

// Model
const isOpen = defineModel<boolean>()

const rocketStore = useRocketStore();

const closeModal = () => {
  isOpen.value = false;
};

const handleAddRocket = (rocketData: Omit<Rocket, 'id'>) => {
  const newRocket: Rocket = {
    id: Date.now(),
    ...rocketData,
  };

  // Add to store's local rockets state
  rocketStore.addLocalRocket(newRocket);
  closeModal();
};
</script>
