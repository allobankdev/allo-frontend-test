<template>
  <RouterLink
    :to="{ name: '/rockets/[id]', params: { id: rocket.id } }"
    class="group flex h-full flex-col overflow-hidden rounded-lg border border-space-700/80 bg-space-900/85 transition-colors
      hover:border-flare-500/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-flare-400"
  >
    <div class="relative">
      <RocketImage
        :src="rocket.imageUrl"
        :alt="rocket.name"
        class="aspect-[4/3] border-b border-space-700/80"
        image-class="group-hover:scale-[1.03]"
      />
      <span class="absolute left-3 top-3 rounded-sm bg-space-950/80 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-300">
        {{ formatDesignation(rocket) }}
      </span>
      <span
        v-if="rocket.isLocal"
        class="badge-local absolute right-3 top-3 bg-space-950/80"
      >Local</span>
    </div>

    <div class="flex flex-1 flex-col gap-2 p-5">
      <p
        v-if="rocket.family || rocket.country"
        class="data-label"
      >
        {{ [rocket.family, rocket.country].filter(Boolean).join(' · ') }}
      </p>
      <h2 class="font-display text-2xl font-semibold uppercase leading-tight tracking-wide text-white transition-colors group-hover:text-flare-300">
        {{ rocket.name }}
      </h2>
      <p
        class="line-clamp-3 text-sm leading-relaxed"
        :class="rocket.description ? 'text-slate-400' : 'italic text-slate-600'"
      >
        {{ rocket.description || 'No description available.' }}
      </p>

      <dl class="mt-auto grid grid-cols-2 gap-3 border-t border-space-700/60 pt-4">
        <div>
          <dt class="data-label">
            First flight
          </dt>
          <dd class="mt-0.5 font-mono text-sm text-slate-200">
            {{ formatYear(rocket.firstFlight) || 'TBA' }}
          </dd>
        </div>
        <div>
          <dt class="data-label">
            Status
          </dt>
          <dd class="mt-0.5 flex items-center gap-1.5 font-mono text-sm text-slate-200">
            <span
              class="h-1.5 w-1.5 rounded-full"
              :class="statusDot"
              aria-hidden="true"
            />
            {{ statusLabel }}
          </dd>
        </div>
      </dl>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { formatDesignation, formatYear } from '@/utils/format'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{ rocket: Rocket }>()

  const statusLabel = computed(() => {
    if (props.rocket.active === null) return 'Unknown'
    return props.rocket.active ? 'Active' : 'Retired'
  })

  const statusDot = computed(() => {
    if (props.rocket.active === null) return 'bg-slate-600'
    return props.rocket.active ? 'bg-emerald-400' : 'bg-slate-500'
  })
</script>
