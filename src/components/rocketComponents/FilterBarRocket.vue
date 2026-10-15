<template>
  <div
    class="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-center sm:justify-between"
  >
    <label class="relative w-full sm:max-w-sm">
      <span class="sr-only">Filter by name or description</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="m21 21-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
        />
      </svg>
      <input
        :value="modelValue"
        type="text"
        placeholder="Filter by name or description"
        class="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        @input="
          $emit('update:modelValue', ($event.target as HTMLInputElement).value)
        "
      />
    </label>

    <div class="flex items-center justify-center">
      <div class="flex flex-row gap-5">
        <div class="relative">
          <!-- Filter Button -->
          <button
            type="button"
            @click="isFilterOpen = !isFilterOpen"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
          >
            <!-- Filter Icon -->
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
                d="M3 6h18M6 12h12m-9 6h6"
              />
            </svg>

            <span>Filter</span>

            <!-- Chevron -->
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
                d="m6 9 6 6 6-6"
              />
            </svg>
          </button>

          <!-- Dropdown -->
          <div
            v-if="isFilterOpen"
            class="absolute right-0 z-50 mt-2 w-64 origin-top-right rounded-xl border border-slate-200 bg-white p-4 shadow-lg ring-1 ring-black/5"
          >
            <div class="mb-4">
              <h3 class="text-sm font-semibold text-slate-900">
                Filter Rockets
              </h3>

              <p class="mt-1 text-xs text-slate-500">
                Filter rockets based on available data.
              </p>
            </div>

            <!-- Country -->
            <div class="mb-4">
              <label class="mb-1.5 block text-xs font-medium text-slate-700">
                Country
              </label>

              <select
                v-model="selectedCountry"
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              >
                <option value="">All Countries</option>
                <option value="USA">USA</option>
                <option value="RUS">Russia</option>
                <option value="CHN">China</option>
                <option value="JPN">Japan</option>
              </select>
            </div>


            <!-- Actions -->
            <div
              class="mt-4 flex justify-end gap-2 border-t border-slate-100 pt-4"
            >
              <button
                type="button"
                @click="clearFilter"
                class="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
              >
                Clear
              </button>

              <button
                type="button"
                @click="applyFilter"
                class="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <div class="relative">
          <!-- Sort Button -->
          <button
            type="button"
            @click="isSortOpen = !isSortOpen"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
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
                d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
              />
            </svg>

            <span> Sort: {{ selectNameSort || "" }} </span>

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
                d="m6 9 6 6 6-6"
              />
            </svg>
          </button>

          <!-- Sort Dropdown -->
          <div
          v-if="isSortOpen"
            class="absolute right-0 z-50 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black/5"
          >
            <div class="px-3 py-2">
              <p
                class="text-xs font-semibold uppercase tracking-wider text-slate-400"
              >
                Sort by
              </p>
            </div>

            <!-- Option -->
            <button
              type="button"
              @click="selectSort('first-flight-newest')"
              class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span>First Flight</span>

              <span class="text-xs text-slate-400"> Newest </span>
            </button>

            <button
              type="button"
              @click="selectSort('first-flight-oldest')"
              class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span>First Flight</span>

              <span class="text-xs text-slate-400"> Oldest </span>
            </button>

            <div class="my-1 border-t border-slate-100"></div>

            <button
              type="button"
              @click="selectSort('cost-launch-low')"
              class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span>Cost per Launch</span>

              <span class="text-xs text-slate-400"> Low → High </span>
            </button>

            <button
              type="button"
              @click="selectSort('cost-launch-high')"
              class="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <span>Cost per Launch</span>

              <span class="text-xs text-slate-400"> High → Low </span>
            </button>

            <div class="my-1 border-t border-slate-100"></div>

            <button
              type="button"
              @click="selectSort('name-asc')"
              class="flex w-full items-center px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Name: A → Z
            </button>

            <button
              type="button"
              @click="selectSort('name-desc')"
              class="flex w-full items-center px-4 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Name: Z → A
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 sm:justify-end">
      <span class="text-sm text-slate-500 whitespace-nowrap">
        {{ visibleCount }}
        {{ visibleCount === 1 ? "rocket" : "rockets" }} visible
      </span>
      <!-- <button
        type="button"
        class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        @click="$emit('add-click')"
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
        Add rocket
      </button> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


const isFilterOpen = ref(false)
const isSortOpen = ref(false)

const selectedCountry = ref("")
const selectedSort = ref("")

const selectNameSort = ref("")


defineProps<{
  modelValue: string;
  visibleCount: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "filter-change", value : {
  country : string;
  }): void;
  (e: "sort-selected", value : string): void ;
}>();

const applyFilter = () => {
  emit("filter-change", {
    country: selectedCountry.value,
  });

  isFilterOpen.value = false;
};

const clearFilter = () => {

  selectedCountry.value = ""

  emit("filter-change", {
    country : "",
  })

  isFilterOpen.value = false

}

const selectSort = (sort: string) => {
  selectedSort.value = sort;

  emit("sort-selected", sort);
  isFilterOpen.value = false

  switch(sort) {
    case "first-flight-oldest":
    return (selectNameSort.value = "First Flight Oldest",   isSortOpen.value = false)

    case "first-flight-newest":
      return (selectNameSort.value = "First Flight Newest",   isSortOpen.value = false)

    case "cost-launch-low":
      return (selectNameSort.value = "Low Cost",   isSortOpen.value = false)
    case "cost-launch-high":
      return (selectNameSort.value = "High Cost",   isSortOpen.value = false)

    case "name-asc":
      return (selectNameSort.value = "Ascending", isSortOpen.value = false)

    case "name-desc":
    return(selectNameSort.value = "Descending", isSortOpen.value = false)
    default:
      return ""
  }
};


</script>
