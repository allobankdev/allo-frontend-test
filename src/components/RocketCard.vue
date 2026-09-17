<template>
  <router-link
    class="group flex h-full flex-col rounded-3xl bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-900/5"
    :to="{ name: '/rockets/[id]', params: { id: String(rocket.id) } }"
  >
    <RocketImage
      :alt="name"
      class="aspect-[4/3] rounded-2xl"
      :src="rocket.image_url"
    />

    <div class="flex flex-1 flex-col px-2 pt-4 pb-2">
      <div class="flex items-start justify-between gap-3">
        <h3 class="line-clamp-2 text-base font-semibold">
          {{ name }}
        </h3>
        <span class="icon-btn size-8 border-ink text-base transition group-hover:bg-ink group-hover:text-white">
          <i class="mdi mdi-arrow-top-right" />
        </span>
      </div>

      <p class="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
        {{ description }}
      </p>

      <div class="mt-auto flex items-center justify-between gap-2 pt-4">
        <RocketStatusBadges :rocket="rocket" />
        <span class="text-xs text-muted">
          {{ firstFlight }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  import { FALLBACK_TEXT, formatDate, getRocketDescription, getRocketName } from '@/utils/rocket'
  import type { Rocket } from '@/types/rocket'

  const props = defineProps<{ rocket: Rocket }>()

  const name = computed(() => getRocketName(props.rocket))
  const description = computed(() => getRocketDescription(props.rocket))
  const firstFlight = computed(() => {
    const date = formatDate(props.rocket.maiden_flight)
    return date === FALLBACK_TEXT ? 'First flight N/A' : `Since ${date}`
  })
</script>
