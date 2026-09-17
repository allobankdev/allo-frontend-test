<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div class="min-w-0">
      <slot name="before" />
      <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="mt-2 text-sm text-muted"
      >
        {{ subtitle }}
      </p>
    </div>
    <div class="flex flex-wrap gap-3">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    title: string
    subtitle?: string
  }>()
</script>
