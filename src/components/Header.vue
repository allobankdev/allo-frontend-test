<script setup lang="ts">
import { Rocket, ArrowUpRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
    <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
      <RouterLink to="/" class="flex items-center gap-3 no-underline">
        <div class="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/20">
          <Rocket :size="20" />
        </div>

        <div>
          <span class="text-lg font-bold tracking-tight text-slate-900">
            RocketExplorer
          </span>
          <span class="hidden text-xs text-slate-500 sm:block">
            SpaceX Launch Vehicles
          </span>
        </div>
      </RouterLink>

      <div class="flex items-center gap-2">
        <RouterLink
          to="/ "
          class="rounded-lg  px-3 py-1.5 text-sm font-medium no-underline text-slate-700 transition hover:text-blue-600"
        >
          Browse rockets
        </RouterLink>
      </div>
    </div>
  </header>
</template>