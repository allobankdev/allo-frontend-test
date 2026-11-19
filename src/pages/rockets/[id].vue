<template>
  <v-container class="py-8 page-shell">
    <v-btn
      class="mb-6"
      color="primary"
      prepend-icon="mdi-arrow-left"
      variant="tonal"
      :to="{ path: '/' }"
    >
      Back to list
    </v-btn>

    <RequestState
      :error-message="store.detailError"
      :show-retry="!store.isDetailNotFound"
      :status="store.detailStatus"
      loading-message="Loading rocket..."
      @retry="retryLoad"
    >
      <RocketDetail
        v-if="store.selectedRocket"
        :rocket="store.selectedRocket"
      />
    </RequestState>
  </v-container>
</template>

<script lang="ts" setup>
  import { computed, onUnmounted, watch } from "vue";
  import { useRoute } from "vue-router";
  import { useRocketStore } from "@/stores";

  const route = useRoute("/rockets/[id]");
  const store = useRocketStore();

  const id = computed(() => String(route.params.id));

  let abortController: AbortController | null = null;

  function load() {
    abortController?.abort();
    abortController = new AbortController();
    return store.loadRocketDetail(id.value, abortController.signal);
  }

  function retryLoad() {
    return load();
  }

  watch(id, () => load(), { immediate: true });

  onUnmounted(() => {
    abortController?.abort();
  });
</script>

<style scoped>
  .page-shell {
    max-width: 1120px;
  }
</style>
