<template>
  <v-container class="py-8 rocket-list-page">
    <div class="mb-8">
      <h1 class="text-h3 font-weight-bold text-secondary">Explore Rockets</h1>

      <p class="text-body-1 text-medium-emphasis">
        Discover SpaceX launch vehicles and their specifications.
      </p>
    </div>

    <div class="d-flex flex-column flex-sm-row align-sm-center ga-4 mb-4">
      <v-text-field
        v-model="search"
        placeholder="Search rockets..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
        max-width="500"
      />
    </div>
    <p class="text-body-2 text-medium-emphasis mb-6">
      <template v-if="search">
        {{ filteredRockets.length }} results for
        <strong>"{{ search }}"</strong>
      </template>

      <template v-else> {{ filteredRockets.length }} rockets </template>
    </p>

    <AppLoading v-if="rocketStore.loading" message="Loading rockets..." />

    <AppError
      v-else-if="rocketStore.error"
      :message="rocketStore.error"
      @retry="rocketStore.fetchRockets"
    />

    <AppEmptyState
      v-else-if="filteredRockets.length === 0"
      icon="mdi-rocket-outline"
      title="No rockets found"
      message="Try using a different search keyword."
    />

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
  </v-container>

  <v-btn
    color="primary"
    prepend-icon="mdi-plus"
    size="large"
    rounded="pill"
    elevation="6"
    class="add-rocket-fab"
    @click="addDialog = true"
  >
    Add Rocket
  </v-btn>

  <v-dialog v-model="addDialog" max-width="600">
    <v-card>
      <v-card-item class="pa-6 pb-2">
        <v-card-title class="text-h5 font-weight-bold">
          Add Rocket
        </v-card-title>

        <v-card-subtitle>
          Create a new rocket for this session.
        </v-card-subtitle>
      </v-card-item>

      <v-card-text>
        <RocketForm @submit="handleAddRocket" @cancel="addDialog = false" />
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="snackbar" timeout="3000" location="bottom right">
    Rocket added successfully.

    <template #actions>
      <v-btn variant="text" @click="snackbar = false"> Close </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";

import type { Rocket } from "@/types/rocket";
import { useRocketStore } from "@/stores/rocket";

import RocketForm from "@/components/rocket/RocketForm.vue";
import RocketCard from "@/components/rocket/RocketCard.vue";

import AppError from "@/components/common/AppError.vue";
import AppLoading from "@/components/common/AppLoading.vue";
import AppEmptyState from "@/components/common/AppEmptyState.vue";

const rocketStore = useRocketStore();
const addDialog = ref(false);
const snackbar = ref(false);

function handleAddRocket(rocket: Rocket) {
  rocketStore.addRocket(rocket);
  addDialog.value = false;
  snackbar.value = true;
}

const search = ref<string | null>("");
const filteredRockets = computed(() => {
  const keyword = search.value?.trim().toLowerCase() ?? "";

  if (!keyword) {
    return rocketStore.allRockets;
  }

  return rocketStore.allRockets.filter((rocket) =>
    rocket.full_name?.toLowerCase().includes(keyword),
  );
});

onMounted(() => {
  if (!rocketStore.rockets.length) {
    rocketStore.fetchRockets();
  }
});
</script>

<style scoped>
.add-rocket-fab {
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 10;
}

.rocket-list-page {
  padding-bottom: 100px !important;
}

@media (max-width: 600px) {
  .add-rocket-fab {
    right: 16px;
    bottom: 16px;
  }
}
</style>
