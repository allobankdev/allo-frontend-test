<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AddRocketDialog from "@/components/AddRocketDialog.vue";
import AsyncState from "@/components/AsyncState.vue";
import RocketCard from "@/components/RocketCard.vue";
import { useRocketStore } from "@/stores/rockets";

const store = useRocketStore();
const query = ref<string | null>("");
const showForm = ref(false);

const filteredRockets = computed(() => {
  const keyword = query.value?.trim().toLowerCase();
  if (!keyword) return store.rockets;

  return store.rockets.filter((rocket) =>
    `${rocket.full_name} ${rocket.description ?? ""}`
      .toLowerCase()
      .includes(keyword),
  );
});

onMounted(() => {
  if (!store.cached) store.getServerRockets();
});
</script>

<template>
  <v-container class="py-8" max-width="1200">
    <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-7">
      <div>
        <h1 class="text-h3 font-weight-bold">SpaceX Rockets</h1>
        <p class="text-medium-emphasis mt-2">
          Explore launch vehicle configurations from Launch Library 2.
        </p>
      </div>
      <v-btn prepend-icon="mdi-plus" color="primary" @click="showForm = true">
        Add rocket
      </v-btn>
    </div>

    <v-text-field
      v-model="query"
      label="Filter rockets"
      prepend-inner-icon="mdi-magnify"
      clearable
      class="mb-4"
    />

    <AsyncState
      :loading="store.loading"
      :error="store.error"
      error-title="Could not load rockets"
      @retry="store.getServerRockets"
    >
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
        <v-col v-if="!filteredRockets.length" cols="12">
          <v-alert type="info">
            {{ query ? "No rockets match your filter." : "No rockets yet." }}
          </v-alert>
        </v-col>
      </v-row>
    </AsyncState>

    <AddRocketDialog v-model="showForm" @save="store.addRocket" />
  </v-container>
</template>
