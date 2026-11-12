<script lang="ts" setup>
import RocketCreateDialog from "@/components/RocketCreateDialog.vue";
import RocketList from "@/components/RocketList.vue";
import { useRocket } from "@/stores/rocket";
import { ref, watch } from "vue";

const selectedDate = ref(new Date());
const searchInput = ref("");
const rocketStore = useRocket();

let searchTimeout = 0;

watch(searchInput, (search) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = window.setTimeout(() => {
    rocketStore.filter.search = search;
    rocketStore.fetchRockets();
  }, 300);
});
</script>

<template>
  <VContainer>
    <div class="d-flex justify-space-between align-center">
      <div>
        <h1>All Rockets</h1>
        <p></p>
      </div>
      <div>
        <RocketCreateDialog></RocketCreateDialog>
      </div>
    </div>

    <div class="py-6">
      <v-skeleton-loader
        :loading="rocketStore.isLoadingRockets && !rocketStore.filter.search"
        class="bg-transparent skeleton-search"
        type="chip"
      >
        <v-text-field
          v-model="searchInput"
          v-if="!rocketStore.isFetchRocketFailed"
          placeholder="Search rockets by name..."
          prepend-inner-icon="mdi-magnify"
        ></v-text-field>
      </v-skeleton-loader>
      <RocketList></RocketList>
    </div>
  </VContainer>
</template>

<style scoped>
.skeleton-search :deep(.v-skeleton-loader__bone) {
  margin: 1rem 0;
  height: 50px;
  border-radius: 2.5px !important;
  max-width: 100% !important;
}
</style>
