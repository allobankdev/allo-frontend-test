<script setup lang="ts">
import { computed, ref } from "vue";
import { Search, SlidersHorizontal, Rocket } from "lucide-vue-next";
import { useRockets } from "@/composables/useRockets";
import { useRocketStore } from "@/stores/rockets";
import RocketCard from "@/components/Card.vue";
import type { Rocket as RocketType } from "@/types/rockets";
import AddRocketModal from "@/components/Modal.vue";

const { rockets, isLoading, isError, error, refetch } = useRockets();
const store = useRocketStore();

const search = ref("");
const selectedCountry = ref("");
const isAddRocketModalOpen = ref(false);

const handleAddRocket = (rocket: RocketType) => {
  store.addRocket(rocket);
  search.value = "";
  selectedCountry.value = "";
};

const allRockets = computed(() => [
  ...rockets.value,
  ...store.localRockets,
]);

const countries = computed(() => {
  const values = allRockets.value
    .map((rocket) => rocket.country)
    .filter((country): country is string => Boolean(country));

  return [...new Set(values)].sort();
});

const filteredRockets = computed(() => {
  return allRockets.value.filter((rocket) => {
    const matchesSearch =
      rocket.name.toLowerCase().includes(search.value.toLowerCase()) ||
      rocket.description.toLowerCase().includes(search.value.toLowerCase());

    const matchesCountry =
      !selectedCountry.value || rocket.country === selectedCountry.value;

    return matchesSearch && matchesCountry;
  });
});
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
      <section class="mt-5">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900">
              Rocket collection
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Browse and discover the available launch vehicles.
            </p>
          </div>

          <div class="text-sm text-slate-500">
            Showing
            <span class="font-semibold text-slate-900">
              {{ filteredRockets.length }}
            </span>
            rockets
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 sm:flex-row">
          <div class="relative flex-1">
            <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <input v-model="search" type="text" placeholder="Search rockets by name or description..."
              class="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10" />
          </div>

          <div class="relative sm:w-56">
            <SlidersHorizontal :size="17" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

            <select v-model="selectedCountry"
              class="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10">
              <option value="">All countries</option>

              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>

          <button type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            @click="isAddRocketModalOpen = true">
            <Rocket :size="18" />
            Add Rocket
          </button>
        </div>
      </section>

      <section class="mt-8">
        <div v-if="isLoading" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div v-for="item in 6" :key="item"
            class="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div class="h-56 bg-slate-200"></div>

            <div class="space-y-3 p-5">
              <div class="h-5 w-2/3 rounded bg-slate-200"></div>
              <div class="h-3 w-full rounded bg-slate-100"></div>
              <div class="h-3 w-4/5 rounded bg-slate-100"></div>
              <div class="h-3 w-1/2 rounded bg-slate-100"></div>
            </div>
          </div>
        </div>

        <div v-else-if="isError" class="rounded-2xl border border-red-100 bg-white px-6 py-16 text-center">
          <p class="text-lg font-semibold text-slate-900">
            Unable to load rockets
          </p>

          <p class="mt-2 text-sm text-slate-500">
            {{ error?.message || "Something went wrong while fetching rocket data." }}
          </p>

          <button
            class="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            @click="refetch()">
            Try again
          </button>
        </div>

        <div v-else-if="filteredRockets.length" class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <RocketCard v-for="rocket in filteredRockets" :key="rocket.id" :rocket="rocket" />
        </div>

        <div v-else class="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <div class="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100">
            <Search :size="24" class="text-slate-400" />
          </div>

          <h3 class="mt-4 text-lg font-semibold text-slate-900">
            No rockets found
          </h3>

          <p class="mt-2 text-sm text-slate-500">
            Try adjusting your search or country filter.
          </p>

          <button class="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
            @click="search = ''; selectedCountry = ''">
            Clear filters
          </button>
        </div>
      </section>
    </div>
    <AddRocketModal v-model="isAddRocketModalOpen" @created="handleAddRocket" />
  </main>
</template>