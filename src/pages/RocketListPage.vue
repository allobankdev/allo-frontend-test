<script setup lang="ts">
import { useRocketStore } from "@/stores/rocket";
import { computed, onMounted, ref } from "vue";

const store = useRocketStore();
const search = ref("");

onMounted(async () => {
  await store.fetchRockets();
});

const filteredRockets = computed(() => {
  if (!search.value) return store.rockets;
  const filterValue = search.value.toLowerCase();
  return store.rockets.filter(
    (rocket) =>
    rocket.name.toLowerCase().includes(filterValue)
  );
});
</script>

<template>
  <v-container class="py-8">
    <div>
      <div class="d-flex align-sm-center justify-space-between mb-8">
        <h1>Rocket List</h1>
        <DialogAddRocket />
      </div>
      <FilterSearch v-model="search" />
      <div v-if="store.loading" class="d-flex justify-center align-center h-50">
        <v-progress-circular indeterminate color="primary" size="64" />
      </div>
      <div v-else-if="store.errorMsg">
        <ErrorBanner :errMsg="store.errorMsg" />
      </div>
      
      <v-row>
        <v-col
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card-item class="pa-0">
            <RocketCard :rocket="rocket" />
          </v-card-item>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>
