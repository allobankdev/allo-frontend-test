<template>
  <v-container class="py-8 page-shell">
    <header class="page-header mb-8">
      <div class="page-header__copy">
        <p class="text-overline text-primary mb-1">
          Launch Library
        </p>
        <h1 class="text-h4 text-md-h3 font-weight-bold mb-2">
          SpaceX Rockets
        </h1>
        <p class="text-body-1 text-medium-emphasis mb-0">
          Browse launcher configurations, filter by name or description, and add a local rocket.
        </p>
      </div>

      <v-btn
        class="page-header__action"
        color="primary"
        prepend-icon="mdi-plus"
        size="large"
        variant="flat"
        @click="showAddDialog = true"
      >
        Add rocket
      </v-btn>
    </header>

    <v-sheet
      border
      class="mb-6 pa-4"
      color="surface"
      rounded="lg"
    >
      <RocketFilter
        :model-value="store.filterQuery"
        @update:model-value="store.setFilterQuery"
      />
    </v-sheet>

    <v-alert
      v-if="showListErrorBanner"
      border="start"
      class="mb-6"
      type="error"
      variant="tonal"
    >
      <div class="d-flex flex-wrap align-center justify-space-between ga-3">
        <span>{{ store.listError || "Failed to load rockets" }}</span>
        <v-btn
          color="error"
          prepend-icon="mdi-refresh"
          variant="flat"
          @click="retryLoad"
        >
          Retry
        </v-btn>
      </div>
    </v-alert>

    <RequestState
      :error-message="store.listError"
      :is-empty="isEmptyList"
      :status="listViewStatus"
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

  const listViewStatus = computed(() => {
    if (store.listStatus === "error" && store.allRockets.length > 0) {
      return "success";
    }
    return store.listStatus;
  });

  const showListErrorBanner = computed(
    () => store.listStatus === "error" && store.allRockets.length > 0,
  );

  const isEmptyList = computed(
    () =>
      listViewStatus.value === "success" &&
      store.filteredRockets.length === 0,
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

<style scoped>
  .page-shell {
    max-width: 1120px;
  }

  .page-header {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 1.25rem;
  }

  .page-header__copy {
    min-width: min(100%, 28rem);
    flex: 1 1 18rem;
  }

  .page-header__action {
    flex: 0 0 auto;
  }
</style>
