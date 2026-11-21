<script setup lang="ts">
import { useRockets } from "@/composables/useRockets";

const {
  rockets,
  isLoading,
  isError,
  error,
  refetch,
} = useRockets();
</script>

<template>
  <main class="mx-auto max-w-7xl px-5 py-12 sm:px-8">
    <section>
      <p class="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-blue-400">
        SpaceX Fleet
      </p>

      <h1 class="text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Explore Rockets
      </h1>

      <p class="mt-4 max-w-2xl text-slate-400">
        Discover the rockets that are pushing humanity further into space.
      </p>
    </section>

    <section class="mt-12">
      <div v-if="isLoading" class="py-10 text-center">
        Loading rockets...
      </div>

      <div v-else-if="isError" class="py-10 text-center">
        <p class="text-red-500">
          {{ error?.message || "Failed to load rockets." }}
        </p>

        <v-btn class="mt-4" color="primary" @click="refetch">
          Retry
        </v-btn>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="rocket in rockets"
          :key="rocket.id"
          class="rounded-xl border border-gray-200 bg-white p-5"
        >
          <h2 class="text-lg font-semibold text-gray-900">
            {{ rocket.name }}
          </h2>

          <p class="mt-2 text-sm text-gray-500">
            {{ rocket.description || "No description available." }}
          </p>

          <p class="mt-3 text-xs text-gray-400">
            ID: {{ rocket.id }}
          </p>
        </div>
      </div>
    </section>
  </main>
</template>