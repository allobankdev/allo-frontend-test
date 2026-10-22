<template>
  <div class="flex flex-wrap items-center gap-1.5">
    <span
      v-if="rocket.isLocal"
      class="badge border-amber-300 bg-amber-50 text-amber-700"
    >
      New
    </span>
    <span
      v-if="rocket.active !== undefined"
      class="badge"
      :class="rocket.active
        ? 'border-brand-200 bg-brand-50 text-brand-700'
        : 'border-gray-200 bg-gray-50 text-gray-500'"
    >
      {{ rocket.active ? 'Active' : 'Retired' }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import type { Rocket } from '@/types/rocket'

  defineProps<{ rocket: Rocket }>()
</script>
