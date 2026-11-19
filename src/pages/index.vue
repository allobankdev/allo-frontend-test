<template>
  <v-container class="py-8">
    <v-row
      align="center"
      class="mb-6"
      justify="space-between"
    >
      <v-col
        cols="12"
        md="8"
      >
        <h1 class="text-h4 font-weight-bold mb-1">
          SpaceX Rockets
        </h1>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Browse launcher configurations from Launch Library.
        </p>
      </v-col>

      <v-col
        cols="12"
        md="auto"
      >
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="showAddDialog = true"
        >
          Add rocket
        </v-btn>
      </v-col>
    </v-row>

    <v-row class="mb-4">
      <v-col cols="12">
        <RocketFilter
          :model-value="store.filterQuery"
          @update:model-value="store.setFilterQuery"
        />
      </v-col>
    </v-row>

    <RequestState
      :error-message="store.listError"
      :is-empty="isEmptyList"
      :status="store.listStatus"
      empty-message="No rockets found"
      @retry="retryLoad"
    >
      <RocketList :rockets="store.filteredRockets" />
    </RequestState>

    <AddRocketForm
      v-model="showAddDialog"
      @submit="onAddRocket"
    />
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onMounted, onUnmounted, ref } from "vue";
  import { useRocketStore } from "@/stores";
  import type { AddRocketPayload } from "@/types";

  const store = useRocketStore();
  const showAddDialog = ref(false);

  let abortController: AbortController | null = null;

  const isEmptyList = computed(
    () =>
      store.listStatus === "success" && store.filteredRockets.length === 0,
  );

  function load() {
    abortController?.abort();
    abortController = new AbortController();
    return store.loadRockets(abortController.signal);
  }

  function retryLoad() {
    return load();
  }

  function onAddRocket(payload: AddRocketPayload) {
    store.addRocket(payload);
  }

  onMounted(() => {
    load();
  });

  onUnmounted(() => {
    abortController?.abort();
  });
</script>
