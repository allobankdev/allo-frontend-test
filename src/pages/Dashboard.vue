<template>
  <div class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <header class="mb-8 py-10 flex flex-row justify-between">
      <h1 class="text-4xl font-bold tracking-tight text-slate-900">
        Amazing Rocket
      </h1>
      <button
        type="button"
        class="inline-flex items-center gap-1.5 border rounded-2xl px-8 py-3 text-sm font-medium transition hover:bg-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        @click="isAddDialogOpen = true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          class="size-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        Add Rocket
      </button>
      <!-- <p class="mt-2 max-w-2xl text-sm text-slate-500">
        List of rockets with their details. You can search, view, and add new rockets to the list.
      </p> -->
    </header>

    <FilterBarRocket
      v-model="search"
      class="mb-8"
      :visible-count="filteredRockets.length"
      @add-click="isAddDialogOpen = true"
      @filter-change="handleFilterChange"
      @sort-selected="handleSortChange"
    />

    <LoadingHandler v-if="store.status === 'loading'" />

    <ErrorHandler
      v-else-if="store.status === 'error'"
      :message="store.errorMessage"
      @retry="store.fetchRockets(true)"
    />

    <EmptyHandler v-else-if="filteredRockets.length === 0" />

    <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <RocketCard
        v-for="rocket in filteredRockets"
        :key="rocket.id"
        :rocket="rocket"
      />
    </div>

    <AddDialogRocket v-model="isAddDialogOpen" @submit="store.addRocket" />
  </div>
</template>

<script lang="ts" setup>
import EmptyHandler from "@/components/errorComponent/EmptyHandler.vue";
import ErrorHandler from "@/components/errorComponent/ErrorHandler.vue";
import LoadingHandler from "@/components/errorComponent/LoadingHandler.vue";
import AddDialogRocket from "@/components/rocketComponents/AddDialogRocket.vue";
import FilterBarRocket from "@/components/rocketComponents/FilterBarRocket.vue";
import RocketCard from "@/components/rocketComponents/RocketCard.vue";
import { useRocketsStore } from "@/store/rocketStore";
import { computed, onMounted, ref } from "vue";

const store = useRocketsStore();
const search = ref("");
const isAddDialogOpen = ref(false);


const selectCountry = ref("")
const selectSort = ref("first-flight-newest")

const handleFilterChange = (filters : {
  country : string,
}) => {
  selectCountry.value = filters.country
}

const handleSortChange = (sort: string) => {
  selectSort.value = sort
}

const filteredRockets = computed(() => {
  const term = search.value.trim().toLowerCase();
  let result = [...store.rockets]


  if(term) {
    result =  store.rockets.filter((rocket) =>
    rocket.full_name.toLowerCase().includes(term),
  );
  }

  if(selectCountry.value) {
    result = result.filter((rocket) => rocket.manufacturer?.country_code === selectCountry.value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result.sort((a: any,b: any) => {
    switch(selectSort.value) {
      case "first-flight-newest":
      return (
        new Date(b.maiden_flight || "").getDate() -
        new Date(a.maiden_flight || "").getDate()
      )
      case "first-flight-oldest":
        return (
          new Date(a.maiden_flight || "").getDate() -
          new Date(b.maiden_flight || "").getDate()
        )
      case "cost-launch-low":
      return a.launch_cost  - b.launch_cost;

      case "cost-launch-high":
      return b.launch_cost - a.launch_cost;

      case "name-asc":
      return a.full_name.localeCompare(b.full_name);

      case "name-desc":
      return b.full_name.localeCompare(a.full_name);

      default:
      return 0;
    }
  })

  return result
});





onMounted(() => {
  store.fetchRockets();
});
</script>
