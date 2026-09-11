<template>
  <v-container>
    <v-responsive class="align-center fill-height mx-auto" max-width="900">
      <Header title="Rocket List">
        <AddRocket />
      </Header>

      <Filters :isLoading="isLoading" />

      <Table
        :rockets="rocketStore.data"
        :isLoading="isLoading"
        :error="error"
        :refetch="refetch"
      />
    </v-responsive>
  </v-container>
</template>

<script lang="ts" setup>
import Header from "@/components/Header.vue";
import { useDebounce } from "@/composables/useDebounce";
import { useSimpleFetch } from "@/composables/useSimpleFetch";
import AddRocket from "@/features/rockets/components/AddRocket.vue";
import Filters from "@/features/rockets/components/Filters.vue";
import Table from "@/features/rockets/components/Table.vue";
import { useFiltersStore } from "@/stores/filters";
import { useRocketStore } from "@/stores/rocket";
import type { RocketResponse } from "@/types";
import { ref, watch } from "vue";

const fetchUrl = ref(
  "/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20&search=",
);

const {
  data: apiData,
  isLoading,
  error,
  refetch,
} = useSimpleFetch<RocketResponse>(fetchUrl);

const filtersStore = useFiltersStore();
const rocketStore = useRocketStore();

watch(
  apiData,
  (newData) => {
    if (newData && newData.results) {
      rocketStore.data = [...newData.results];
    } else {
      rocketStore.data = [];
    }
  },
  { immediate: true },
);

const debouncedSearch = useDebounce((query: string) => {
  fetchUrl.value = `/launcher/?manufacturer__name=SpaceX&mode=detailed&limit=20&search=${encodeURIComponent(query || "")}`;
}, 500);

watch(
  () => filtersStore.searchQuery,
  (newQuery) => {
    debouncedSearch(newQuery);
  },
);
</script>

<style scoped>
.desc {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
