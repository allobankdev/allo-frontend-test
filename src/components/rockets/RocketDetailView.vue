<template>
  <div>
    <button
      type="button"
      class="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
      @click="goBack"
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
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
        />
      </svg>
      Back to fleet
    </button>

    <div class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-7">
        <div class="relative aspect-[4/3] w-full bg-slate-100 md:aspect-auto">
          <img
            v-if="rocket.image_url"
            :src="rocket.image_url"
            :alt="rocket.full_name"
            class="size-full object-cover"
          >
          <div
            v-else
            class="flex size-full flex-col items-center justify-center gap-2 text-slate-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              class="size-12"
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
            <span class="text-sm font-medium">No image available</span>
          </div>
        </div>

        <div class="flex flex-col gap-6 p-6 sm:p-8 justify-center">
          <div>
            <h1 class="mt-1 text-3xl font-bold text-slate-900">
              {{ rocket.full_name }}
            </h1>
            <p class="mt-3 text-sm leading-relaxed text-slate-600">
              {{ rocket.description || 'No description available.' }}
            </p>
          </div>

          <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-slate-200 p-4">
              <dt class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    d="M12 6v12m4-8H9.5a2.5 2.5 0 0 0 0 5H14a2.5 2.5 0 0 1 0 5H8"
                  />
                </svg>
                Cost per launch
              </dt>
              <dd class="mt-1 text-base font-semibold text-slate-900">
                {{ formatCost(rocket.launch_cost) }}
              </dd>
            </div>

            <div class="rounded-xl border border-slate-200 p-4">
              <dt class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    d="M12 21c4.5-4.5 7-8.25 7-11.5A7 7 0 0 0 5 9.5C5 12.75 7.5 16.5 12 21Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"
                  />
                </svg>
                Country
              </dt>
              <dd class="mt-1 text-base font-semibold text-slate-900">
                {{ orFallback(rocket.manufacturer?.country_code) }}
              </dd>
            </div>

            <div class="rounded-xl border border-slate-200 p-4 sm:col-span-2">
              <dt class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M4.5 5.25h15a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V6a.75.75 0 0 1 .75-.75Z"
                  />
                </svg>
                First flight
              </dt>
              <dd class="mt-1 text-base font-semibold text-slate-900">
                {{ formatDate(rocket.maiden_flight) }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'
  import { formatCost, formatDate, orFallback } from '@/utils/format'
  import { useRouter } from 'vue-router';

  defineProps<{
    rocket: Rocket
  }>()

  const router = useRouter()

  const goBack = () => {
    router.back()
  }
</script>
