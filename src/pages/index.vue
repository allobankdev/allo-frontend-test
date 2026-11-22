<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getRockets } from "@/services/rocketService";
import type { Rocket } from "@/types/rocket";
import { useRocketStore } from "@/stores/rocketStore";
import RocketCard from "@/components/RocketCard.vue";

const store = useRocketStore();

const search = ref("");

const dialog = ref(false);
const newRocketName = ref("");
const newRocketDescription = ref("");

const filteredRockets = computed(() => {
  return store.rockets.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(search.value.toLowerCase()),
  );
});

const addRocket = () => {
  if (!newRocketName.value.trim()) return;

  const newRocket: Rocket = {
    id: Date.now(),
    full_name: newRocketName.value.trim(),
    description: newRocketDescription.value || null,
    image_url: null,
    launch_cost: null,
    maiden_flight: null,
    manufacturer: {
      country_code: null,
    },
  };

  store.addRocket(newRocket);

  newRocketName.value = "";
  newRocketDescription.value = "";
  dialog.value = false;
};

onMounted(() => {
  store.fetchRockets();
});
</script>

<template>
  <v-container>
    <h1 class="mb-4">SpaceX Rockets</h1>

    <v-text-field
      v-model="search"
      label="Search rockets"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      clearable
    />

    <div v-if="store.loading">Loading rockets...</div>

    <div v-else-if="store.error">
      <p>{{ store.error }}</p>
      <v-btn color="primary" @click="store.fetchRockets"> Retry </v-btn>
    </div>

    <div v-else>
      <v-btn color="primary" class="mb-4" @click="dialog = true">
        Add Rocket
      </v-btn>

      <v-row>
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
    </div>

    <v-dialog v-model="dialog" max-width="500">
      <v-card title="Add New Rocket">
        <v-card-text>
          <v-text-field v-model="newRocketName" label="Rocket Name" required />

          <v-textarea v-model="newRocketDescription" label="Description" />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="addRocket">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
