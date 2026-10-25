<template>
  <article
    class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-within:-translate-y-0.5 focus-within:shadow-md"
  >
    <button
      type="button"
      class="flex h-full flex-col text-left focus:outline-none"
      @click="selectRocket(rocket)"
    >
      <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        <img
          v-if="rocket.image_url"
          :src="rocket.image_url"
          :alt="rocket.full_name"
          class="size-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
          @error="imageFailed = true"
        >
        <div
          v-if="!rocket.image_url || imageFailed"
          class="absolute inset-0 flex flex-col items-center justify-center gap-1 text-slate-400"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            class="size-9"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 19.5 9 8.25l4 6 2.5-3.5 4 8.75m-14-11a2 2 0 1 1 4 0 2 2 0 0 1-4 0Z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.5 19.5h15"
            />
          </svg>
          <span class="text-xs font-medium">No image</span>
        </div>
      </div>

      <div class="flex flex-1 flex-col gap-2 p-4">
        <h3 class="text-base font-semibold text-slate-900">
          {{ rocket.full_name }}
        </h3>
        <p class="line-clamp-3 flex-1 text-sm text-slate-500">
          {{ rocket.description || 'No description available.' }}
        </p>
        <span class="mt-1 inline-flex items-center gap-1 text-sm font-medium text-brand-600">
          View details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            class="size-3.5 transition group-hover:translate-x-0.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </span>
      </div>
    </button>
  </article>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Rocket } from '@/types/rocket'
  import { useRouter } from 'vue-router';

  defineProps<{
    rocket: Rocket
  }>()
  const router = useRouter()

  const selectRocket = (rocket: Rocket) => {
    router.push({ path: `/rockets/${rocket.id}` })
  }

  const imageFailed = ref(false)
</script>
