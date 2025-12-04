<template>
  <div class="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10">
    <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <header class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-sm font-semibold uppercase tracking-wide text-brand-500">
            SpaceX
          </p>
          <h1 class="text-2xl font-bold text-slate-900">Rocket Dashboard</h1>
    
        </div>
        <button
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-600"
          @click="refreshList"
        >
          <span
            v-if="store.listLoading"
            class="size-3 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"
          />
          Refresh
        </button>
      </header>

      <div class="mt-6 grid gap-4 md:grid-cols-3">
        <label class="md:col-span-2">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</span>
          <input
            v-model.trim="store.filters.search"
            type="text"
            placeholder="Search rocket name..."
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label>
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Country</span>
          <select
            v-model="store.filters.country"
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          >
            <option value="all">All countries</option>
            <option v-for="country in countries" :key="country" :value="country">
              {{ country }}
            </option>
          </select>
        </label>
      </div>
    </section>

    <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-xl font-semibold text-slate-900">Rocket list</h2>
      </div>

      <div v-if="store.listLoading" class="mt-10 flex flex-col items-center gap-3">
        <span class="size-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        <p class="text-sm text-slate-500">Loading rockets...</p>
      </div>

      <div v-else-if="store.listError" class="mt-10 rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
        <p class="text-base font-semibold text-red-600">{{ store.listError }}</p>
        <p class="mt-2 text-sm text-red-500">Please try again.</p>
        <button
          class="mt-4 inline-flex items-center justify-center rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
          @click="refreshList"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="!filteredRockets.length"
        class="mt-10 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-slate-500"
      >
        No rockets match your filters.
      </div>

      <div v-else class="mt-6 grid gap-6 md:grid-cols-2">
        <router-link
          v-for="rocket in filteredRockets"
          :key="rocket.id"
          :to="{ name: 'rocket-detail', params: { id: rocket.id } }"
          class="group overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-lg"
        >
          <div class="aspect-video overflow-hidden bg-slate-200">
            <img
              :src="rocket.flickr_images?.[0] || fallbackImage"
              :alt="rocket.name"
              class="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
          <div class="p-5">
            <p class="text-xs font-semibold uppercase tracking-wide text-brand-500">{{ rocket.country }}</p>
            <h3 class="mt-1 text-lg font-semibold text-slate-900">{{ rocket.name }}</h3>
            <p class="mt-3 text-sm text-slate-600">
              {{ rocket.description }}
            </p>
          </div>
        </router-link>
      </div>
    </section>

    <section class="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-slate-900">Add a new rocket</h2>
        </div>
        <button
          v-if="store.createdRocket"
          class="text-sm font-semibold text-brand-600 underline-offset-4 hover:underline"
          @click="store.clearCreateFeedback"
        >
          Clear latest result
        </button>
      </div>

      <form class="mt-6 grid gap-4 md:grid-cols-2" @submit.prevent="handleCreate">
        <label class="md:col-span-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</span>
          <input
            v-model.trim="form.name"
            required
            type="text"
            placeholder="e.g. Explorer X"
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label class="md:col-span-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Country</span>
          <input
            v-model.trim="form.country"
            required
            type="text"
            placeholder="e.g. United States"
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label class="md:col-span-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">First flight</span>
          <input
            v-model="form.firstFlight"
            required
            type="date"
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label class="md:col-span-1">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cost per launch (USD)</span>
          <input
            v-model.number="form.costPerLaunch"
            required
            type="number"
            min="1"
            placeholder="7000000"
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label class="md:col-span-2">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Image URL</span>
          <input
            v-model.trim="form.imageUrl"
            type="url"
            placeholder="https://..."
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <label class="md:col-span-2">
          <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</span>
          <textarea
            v-model.trim="form.description"
            required
            rows="4"
            placeholder="Describe the rocket..."
            class="mt-1 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </label>
        <div class="md:col-span-2 flex flex-wrap items-center gap-4">
          <button
            type="submit"
            :disabled="store.createLoading || !isFormValid"
            class="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-slate-500 shadow-lg shadow-brand-600/40 transition disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <span
              v-if="store.createLoading"
              class="size-4 animate-spin rounded-full border-2  border-white border-t-transparent"
            />
            {{ store.createLoading ? 'Submitting...' : 'Add rocket' }}
          </button>
          <button
            type="button"
            class="text-sm font-semibold text-slate-500 underline-offset-4 hover:underline"
            @click="resetForm"
          >
            Reset form
          </button>
        </div>
      </form>

      <div v-if="store.createError" class="mt-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
        {{ store.createError }}
        <button class="ml-4 font-semibold underline-offset-4 hover:underline" @click="handleCreate">Retry</button>
      </div>

      <div
        v-else-if="store.createdRocket"
        class="mt-6 rounded-3xl border border-emerald-100 bg-emerald-50 p-6 text-emerald-900"
      >
        <p class="text-base font-semibold">Rocket created!</p>
        <div class="mt-4 flex flex-wrap gap-6">
          <div>
            <p class="text-xs uppercase tracking-wide text-emerald-500">Name</p>
            <p class="font-semibold">{{ store.createdRocket.name }}</p>
          </div>
          <div>
            <p class="text-xs uppercase tracking-wide text-emerald-500">ID</p>
            <p class="font-mono text-sm">{{ store.createdRocket.id }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue'

import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
const fallbackImage = 'https://images2.imgbox.com/94/f2/vhZB6THP_o.png'

const form = reactive({
  name: '',
  description: '',
  imageUrl: '',
  costPerLaunch: 0,
  country: '',
  firstFlight: '',
})

const filteredRockets = computed(() => store.filteredRockets)
const countries = computed(() => store.availableCountries)

const isFormValid = computed(() => {
  return Boolean(
    form.name &&
      form.description &&
      form.country &&
      form.firstFlight &&
      form.costPerLaunch &&
      form.costPerLaunch > 0,
  )
})

const refreshList = async () => {
  try {
    await store.fetchRockets()
  } catch {
    // handled via shared state
  }
}

const handleCreate = async () => {
  if (!isFormValid.value) {
    return
  }
  try {
    await store.createRocket({ ...form })
    resetForm()
  } catch {
    // error already stored
  }
}

const resetForm = () => {
  form.name = ''
  form.description = ''
  form.imageUrl = ''
  form.costPerLaunch = 0
  form.country = ''
  form.firstFlight = ''
}

onMounted(() => {
  if (!store.rockets.length) {
    refreshList()
  }
})
</script>


