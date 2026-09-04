<template>
  <!--  <HelloWorld /> -->
  <div class="pa-6">
    <h1 class="text-h4 mb-6">SpaceX Rockets</h1>

    <div class="d-flex ga-5 mb-3">
      <v-btn class="mb-3 mt-1" color="primary" @click="addRocket" rounded
        >Add Rocket
        <v-icon color="white" icon="mdi-plus" size="medium" end></v-icon>
      </v-btn>

      <!-- <v-btn class="ma-2" color="primary">
        Accept
        <v-icon icon="mdi-checkbox-marked-circle" end></v-icon>
      </v-btn> -->

      <v-text-field
        v-model="filter"
        placeholder="Search rocket by name"
        prepend-inner-icon="mdi-magnify"
        variant="solo"
        density="comfortable"
        theme="light"
        clearable
        rounded
        class="search-field"
      />
    </div>

    <div v-if="loading" class="d-flex justify-center pa-10">
      <v-progress-circular indeterminate size="50" />
    </div>

    <v-alert v-else-if="error" type="error" variant="tonal">
      {{ error }}
      <template #append>
        <v-btn @click="rocket_store.fetchRockets">Retry</v-btn>
      </template>
    </v-alert>

    <v-alert
      v-else-if="filteredRockets.length === 0"
      type="info"
      variant="tonal"
    >
      No rocket found.
    </v-alert>

    <v-row v-else>
      <v-col
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        cols="12"
        sm="6"
        md="4"
      >
        <RocketCard :rocket="rocket" />
      </v-col>
    </v-row>

    <v-snackbar v-model="apiSuccess" :timeout="3000">
      Successfully loaded rocket data.

      <template #actions>
        <v-btn variant="text" @click="apiSuccess = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="successSnackbar" :timeout="3000">
      {{ successMessage }}

      <template #actions>
        <v-btn variant="text" @click="successSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRocketStore } from "@/stores/rocket_store";
import RocketCard from "@/components/RocketCard.vue";
import type { Rocket } from "@/types/rocket";

const rocket_store = useRocketStore();

const { filteredRockets, loading, error, success, filter } =
  storeToRefs(rocket_store);

const apiSuccess = ref(false);

watch(success, (value) => {
  if (value) {
    apiSuccess.value = true;
  }
});

const successMessage = ref("");
const successSnackbar = ref(false);

const addRocket = () => {
  console.log("ADD ROCKET CLICKED");
  const newRocket: Rocket = {
    id: Date.now(),
    image: null,
    name: "Starship Test Rocket",
    description: "Hard-coded rocket added from the application",
    cost_perlaunch: "100000000",
    country: "Canada",
    first_flight: "2026-06-06",
  };

  console.log("NEW ROCKET:", newRocket);

  rocket_store.addRocket(newRocket);

  console.log("ROCKET AFTER ADD:", rocket_store.rockets);

  successMessage.value = `${newRocket.name} added successfully`;
  successSnackbar.value = true;
};

onMounted(() => {
  rocket_store.fetchRockets();
});

//
</script>

<style scoped>
.search-field :deep(.v-field__outline) {
  border-radius: 30px;
}
.search-field :deep(.v-field__outline__start) {
  border-radius: 30px 0 0 30px;
}
.search-field :deep(.v-field__outline__end) {
  border-radius: 0 30px 30px 0;
}
</style>
