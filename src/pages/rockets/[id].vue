<script setup lang="ts">
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";
import {
  ArrowLeft,
  Rocket,
  CalendarDays,
  Globe2,
  DollarSign,
  ExternalLink,
} from "lucide-vue-next";
import { useRocket } from "@/composables/useRockets";

const route = useRoute();
const id = computed(() => String(route.params.id));

const { rocket, isLoading, isError, error, refetch } = useRocket(id);

const formattedCost = computed(() => {
  if (rocket.value?.costPerLaunch == null) {
    return "Not available";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(rocket.value.costPerLaunch);
});

const formattedFirstFlight = computed(() => {
  const date = rocket.value?.firstFlight;

  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(parsedDate);
});
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
      <RouterLink
        to="/"
        class="inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition hover:text-blue-600"
      >
        <ArrowLeft :size="17" />
        Back to rocket collection
      </RouterLink>

      <div
        v-if="isLoading"
        class="mt-8 animate-pulse space-y-6"
      >
        <div class="h-80 rounded-3xl bg-slate-200"></div>

        <div class="h-8 w-1/3 rounded bg-slate-200"></div>

        <div class="h-4 w-2/3 rounded bg-slate-200"></div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div
            v-for="item in 3"
            :key="item"
            class="h-32 rounded-2xl bg-slate-200"
          ></div>
        </div>
      </div>

      <div
        v-else-if="isError"
        class="mt-8 rounded-2xl border border-red-100 bg-white px-6 py-16 text-center"
      >
        <h2 class="text-xl font-semibold text-slate-900">
          Unable to load rocket
        </h2>

        <p class="mt-2 text-sm text-slate-500">
          {{ error?.message || "Something went wrong." }}
        </p>

        <button
          class="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          @click="refetch()"
        >
          Retry
        </button>
      </div>

      <div
        v-else-if="rocket"
        class="mt-8"
      >
        <section class="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div class="grid grid-cols-1 lg:grid-cols-2">
            <div class="relative min-h-[320px] bg-slate-100 sm:min-h-[460px]">
              <img
                v-if="rocket.image"
                :src="rocket.image"
                :alt="rocket.name"
                class="absolute inset-0 h-full w-full object-cover"
                @error="($event.target as HTMLImageElement).style.display = 'none'"
              />

              <div
                v-if="!rocket.image"
                class="flex h-full min-h-[320px] items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 sm:min-h-[460px]"
              >
                <Rocket :size="96" class="text-slate-400" />
              </div>

              <div class="absolute left-5 top-5">
                <span class="rounded-full border border-white/80 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-600 backdrop-blur">
                  {{ rocket.isLocal ? "Locally added" : "SpaceX Rocket" }}
                </span>
              </div>
            </div>

            <div class="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <p class="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
                Rocket Overview
              </p>

              <h1 class="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                {{ rocket.name }}
              </h1>

              <p class="mt-6 text-base leading-8 text-slate-600">
                {{ rocket.description || "No description available for this rocket." }}
              </p>

              <div class="mt-8 flex items-center gap-2 text-sm text-slate-400">
                <Rocket :size="16" />

                <span>
                  Rocket ID: {{ rocket.id }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <section class="mt-8">
          <div>
            <h2 class="text-2xl font-bold tracking-tight text-slate-900">
              Rocket specifications
            </h2>

            <p class="mt-2 text-sm text-slate-500">
              Key information about this launch vehicle.
            </p>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <DollarSign :size="22" />
              </div>

              <p class="mt-5 text-sm font-medium text-slate-500">
                Cost per launch
              </p>

              <p class="mt-2 text-xl font-bold text-slate-900">
                {{ formattedCost }}
              </p>

              <p class="mt-1 text-xs text-slate-400">
                Estimated launch cost
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="flex size-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Globe2 :size="22" />
              </div>

              <p class="mt-5 text-sm font-medium text-slate-500">
                Country
              </p>

              <p class="mt-2 text-xl font-bold text-slate-900">
                {{ rocket.country || "Not available" }}
              </p>

              <p class="mt-1 text-xs text-slate-400">
                Country of origin
              </p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div class="flex size-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <CalendarDays :size="22" />
              </div>

              <p class="mt-5 text-sm font-medium text-slate-500">
                First flight
              </p>

              <p class="mt-2 text-xl font-bold text-slate-900">
                {{ formattedFirstFlight }}
              </p>

              <p class="mt-1 text-xs text-slate-400">
                Maiden flight date
              </p>
            </div>
          </div>
        </section>

        <div class="mt-8 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:p-6">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 class="font-semibold text-slate-900">
                Explore more rockets
              </h3>

              <p class="mt-1 text-sm text-slate-600">
                Discover more vehicles in the SpaceX collection.
              </p>
            </div>

            <RouterLink
              to="/"
              class="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-blue-700"
            >
              View rocket collection
              <ExternalLink :size="16" />
            </RouterLink>
          </div>
        </div>
      </div>

      <div
        v-else
        class="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center"
      >
        <Rocket :size="40" class="mx-auto text-slate-400" />

        <h2 class="mt-4 text-xl font-semibold text-slate-900">
          Rocket not found
        </h2>

        <p class="mt-2 text-sm text-slate-500">
          This rocket may not exist or is unavailable.
        </p>

        <RouterLink
          to="/"
          class="mt-5 inline-flex rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white no-underline hover:bg-blue-700"
        >
          Back to rockets
        </RouterLink>
      </div>
    </div>
  </main>
</template>