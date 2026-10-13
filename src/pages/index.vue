<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import RocketItem from "@/components/RocketItem.vue";
import { useRocketStore } from "@/stores/rockets";
import LoadingState from "@/components/LoadingState.vue";

const rocketStore = useRocketStore();
const {
  rockets,
  listLoading: loading,
  listError: error,
} = storeToRefs(rocketStore);

const search = ref("");
const showDialog = ref(false);
const filteredRockets = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) {
    return rockets.value;
  }

  return rockets.value.filter((rocket) => {
    const name = rocket.full_name?.toLowerCase() ?? "";
    const description = rocket.description?.toLowerCase() ?? "";

    return name.includes(query) || description.includes(query);
  });
});

const retry = () => {
  rocketStore.retryRockets();
};

onMounted(() => {
  rocketStore.fetchRockets();
});
</script>

<template>
  <div>
    <div class="max-w-7xl mx-auto min-h-screen">
      <LoadingState v-if="loading" />

      <ErrorState v-else-if="error" :error="error" @retry="retry" />

      <div v-else>
        <div
          class="flex flex-col gap-3 px-4 pt-4 pb-4 sm:flex-row sm:items-center sm:px-0"
        >
          <div class="relative w-full sm:max-w-md">

            <input
              v-model="search"
              type="text"
              placeholder="Search rockets..."
              class="w-full rounded-lg border border-gray-200 bg-white py-3 pl-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
            />
          </div>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 active:scale-[0.98]"
            @click="showDialog = true"
          >
            <v-icon icon="mdi-plus" size="20" />
            Add Rocket
          </button>
        </div>

        <div
          v-if="filteredRockets.length"
          class="grid grid-cols-1 gap-4 border-b p-4 md:grid-cols-3"
        >
          <RocketItem :data="filteredRockets" />
        </div>

        <EmptyState v-else :showGoBackButton="false">
          <template #message>
            <h2 class="mt-4 text-lg font-semibold text-gray-900">
              No rockets found
            </h2>
          </template>
        </EmptyState>
      </div>
    </div>
    <AddRocketDialog v-model="showDialog" />
  </div>
</template>