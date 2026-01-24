<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRocketListStore } from '@/stores/rocket-list.store'
import { useLocalRocketCrudStore } from '@/stores/locale-rocket-crud.store'

const store = useRocketListStore()
const storeRocketLocale = useLocalRocketCrudStore();
const keyword = ref(store.search)

let debounceTimer: number | undefined

watch(keyword, (val) => {
  window.clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    store.queryAllRockets(val.trim())
    storeRocketLocale.findAll(val.trim())
  }, 800)

  return ()=> {
    clearTimeout(debounceTimer)
  }
})

const clearSearch = () => {
  keyword.value = ''
  store.queryAllRockets('')
  storeRocketLocale.findAll("")
}
</script>

<template>
  <div class="relative w-full ">
    <!-- Search Icon -->
    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
      <svg
        class="h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
        />
      </svg>
    </div>

    <!-- Input -->
    <input
      v-model="keyword"
      type="text"
      placeholder="Search rockets..."
      class="w-full rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10
             text-sm shadow-sm transition
             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500
             disabled:opacity-60"
      :disabled="store.loading"
    />

    <!-- Clear Button -->
    <button
      v-if="keyword"
      @click="clearSearch"
      class="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
    >
      ✕
    </button>

    <!-- Loading Indicator -->
    <div
      v-if="store.loading"
      class="absolute right-8 top-1/2 -translate-y-1/2"
    >
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></span>
    </div>
  </div>
</template>
