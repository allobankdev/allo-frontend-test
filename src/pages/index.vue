<template>
  <v-container>
    <rocket-filter @filter="applyFilter" />

    <template v-if="loading">
      <div
        class="d-flex justify-center align-center"
        style="height: 100vh"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          size="50"
        />
      </div>
    </template>

    <template v-else-if="error">
      <v-btn
        color="red"
        @click="store.fetchRockets"
      >
        Retry
      </v-btn>
    </template>

    <template v-else>
      <v-btn
        class="mb-3"
        color="green"
        @click="showDialog = true"
      >
        Add Rocket
      </v-btn>

      <v-dialog
        v-model="showDialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>Add Rocket</v-card-title>
          <v-card-text>
            <rocket-form @submit="handleAddRocket" />
          </v-card-text>
        </v-card>
      </v-dialog>

      <v-row
        justify="center"
        no-gutters
      >
        <rocket-card
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          :rocket="rocket"
        />
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
import RocketCard from "@/components/RocketCard.vue";
import RocketFilter from "@/components/RocketFilter.vue";
import RocketForm from "@/components/RocketForm.vue";
import { useRocketStore } from "@/store/rockets";
import type { RocketFormData } from "@/types/rocket";
import { storeToRefs } from 'pinia';
import { onMounted, computed, ref } from "vue";

const store = useRocketStore();
const filterText = ref("");
const showDialog = ref(false);
const { loading, error } = storeToRefs(store);

onMounted(() => {
  store.fetchRockets()
});

const applyFilter = (val: string) => {
  filterText.value = val;
};

const filteredRockets = computed(() =>
  store.rockets.filter((r) =>
    r.name.toLowerCase().includes(filterText.value.toLowerCase())
  )
);

function handleAddRocket(data: RocketFormData) {
  store.addRocket({
    id: Date.now().toString(),
    name: data.name,
    description: data.description,
    height: data.height,
    diameter: data.diameter,
    mass: data.mass,
    first_flight: data.first_flight,
    country: data.country,
    company: data.company,
    wikipedia: data.wikipedia,
    active: data.active,
    cost_per_launch: data.cost_per_launch,
    success_rate_pct: data.success_rate_pct,
    flickr_images: data.flickr_images,
    stages: data.stages,
    boosters: data.boosters,
  });
  showDialog.value = false;
}
</script>
