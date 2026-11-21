<script setup lang="ts">
import { ref } from "vue";
import { ArrowUpRight, Rocket } from "lucide-vue-next";
import type { Rocket as RocketType } from "@/types/rockets";

defineProps<{
  rocket: RocketType;
}>();

const imageFailed = ref(false);
</script>

<template>
  <RouterLink
    :to="`/rockets/${rocket.id}`"
    class="group overflow-hidden rounded-2xl border border-slate-200 bg-white no-underline transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/60"
  >
    <div class="relative h-56 overflow-hidden bg-slate-100">
      <img
        v-if="rocket.image && !imageFailed"
        :src="rocket.image"
        :alt="rocket.name"
        class="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        @error="imageFailed = true"
      />

      <div
        v-if="!rocket.image || imageFailed"
        class="flex h-full items-center justify-center bg-linear-to-br from-slate-100 to-slate-200"
      >
        <Rocket :size="56" class="text-slate-400" />
      </div>

      <div class="absolute left-4 top-4">
        <span
          class="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur"
        >
          {{ rocket.isLocal ? "Added locally" : "SpaceX" }}
        </span>
      </div>

      <div class="absolute bottom-4 right-4 flex size-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm transition group-hover:bg-blue-600 group-hover:text-white">
        <ArrowUpRight :size="17" />
      </div>
    </div>

    <div class="!p-5">
      <h2 class="text-lg font-semibold tracking-tight text-slate-900">
        {{ rocket.name }}
      </h2>

      <p class="mt-2 line-clamp-3 min-h-15 text-sm leading-6 text-slate-500">
        {{ rocket.description || "No description available for this rocket." }}
      </p>

      <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <span class="text-xs font-medium uppercase tracking-wider text-slate-400">
          Rocket details
        </span>

        <span class="text-sm font-semibold text-blue-600 transition group-hover:text-blue-700">
          Explore rocket
        </span>
      </div>
    </div>
  </RouterLink>
</template>