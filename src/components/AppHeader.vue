<template>
  <header class="sticky top-0 z-30 border-b border-space-800 bg-space-950/90 backdrop-blur-sm">
    <div class="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
      <RouterLink
        to="/"
        class="group flex items-center gap-3 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-flare-400"
      >
        <svg
          class="h-6 w-6 text-flare-500"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 2c2.6 2.2 4 5.3 4 9v5l-2 2h-4l-2-2v-5c0-3.7 1.4-6.8 4-9Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path
            d="M8 13l-3 3v3l3-1M16 13l3 3v3l-3-1M10.5 20.5 12 22l1.5-1.5"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <circle
            cx="12"
            cy="9"
            r="1.6"
            fill="currentColor"
          />
        </svg>
        <span class="font-display text-lg font-semibold uppercase tracking-[0.12em] text-white">
          Launch Vehicle Registry
        </span>
      </RouterLink>

      <div
        class="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-slate-500 sm:flex"
        :title="`API status: ${status.label}`"
      >
        <span
          class="h-1.5 w-1.5 rounded-full"
          :class="status.dot"
          aria-hidden="true"
        />
        LL2 API · v2.2.0 · {{ status.label }}
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useRocketStore } from '@/stores/rockets'

  const { listStatus, detailStatus, detailNotFound } = storeToRefs(useRocketStore())

  /** Reflects the real state of the API requests (list or a directly opened detail page). */
  const status = computed(() => {
    const statuses = [listStatus.value, detailStatus.value]
    // A 404 means the API answered, so it doesn't count as being offline.
    const hasError = listStatus.value === 'error' || (detailStatus.value === 'error' && !detailNotFound.value)

    if (statuses.includes('loading')) return { label: 'Connecting', dot: 'bg-amber-400 animate-pulse' }
    if (hasError) return { label: 'Offline', dot: 'bg-rose-500' }
    if (statuses.includes('success') || detailNotFound.value) return { label: 'Online', dot: 'bg-emerald-400' }
    return { label: 'Standby', dot: 'bg-slate-500' }
  })
</script>
