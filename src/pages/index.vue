<template>
  <v-container class="py-8">
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">
          SpaceX Rockets
        </h1>

        <p class="mt-2">
          Rocket configuration from Launch Library 2
        </p>
      </div>
    </div>

    <div 
      class="d-flex flex-wrap align-center ga-4 mb-6" 
    >
      <v-text-field
        v-model="searchQuery"
        class="mb-0"
        clearable
        hide-details
        label="Search rockets"
        prepend-inner-icon="mdi-magnify"
        placeholder="Search by name or description"
        variant="outlined"
      />

      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        size="x-large"
        @click="createRocketModal = true"
      >
        Add Rocket
      </v-btn>
    </div>
    

    <RocketList 
      v-if="!loading && !listError"
      :rockets="filteredRockets" 
    />

    <CreateRocketModal 
      :open="createRocketModal"
      @submit="handleCreateRocket"
      @close="closeModal"
    />

    <AppLoading 
      v-if="loading" 
      color="primary" 
    />

    <AppAlert 
      v-if="listError" 
      type="error"
      title="Unable to load rockets"
      retry
      :message="listError" 
      @retry="loadRockets"
    />

    <AppAlert 
      v-if="!loading && !listError && filteredRockets.length === 0" 
      type="info"
      :title="rockets.length === 0 ? 'No rockets found' : 'No matching rockets'"
      :message="rockets.length === 0
        ? 'There are no rockets to display.'
        : 'Try a different search term.'"
    />
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRocketStore } from "@/store/rocketStore";
import AppAlert from "@/components/feedback/AppAlert.vue";
import RocketList from "@/components/rocket/RocketList.vue";
import CreateRocketModal from "@/components/rocket/CreateRocketModal.vue";
import type { RocketCreate } from "@/types/rocket";

const rocketStore = useRocketStore();
const createRocketModal = ref(false);

const { rockets, filteredRockets, loading, listError, searchQuery } =
  storeToRefs(rocketStore);

const loadRockets = async () => {
  await rocketStore.getRockets("SpaceX");
};

onMounted(() => {
  loadRockets();
});

const handleCreateRocket = (rocket: RocketCreate) => {
  rocketStore.addNewRocket(rocket);

  createRocketModal.value = false;
}

const closeModal = () => {
  createRocketModal.value = false;
};
</script>
