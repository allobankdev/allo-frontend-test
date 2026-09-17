<template>
  <div
    class="relative overflow-hidden rounded-3xl p-4 transition sm:p-5"
    :class="highlighted
      ? 'bg-linear-to-br from-brand-600 to-brand-900 text-white'
      : ['bg-white', selected && 'ring-2 ring-brand-700']"
  >
    <div
      v-if="highlighted"
      class="pointer-events-none absolute -top-16 -left-10 size-48 rounded-full bg-brand-400/30 blur-3xl"
    />

    <div class="relative flex items-start justify-between gap-3">
      <p class="text-sm font-medium sm:text-base">
        {{ label }}
      </p>
      <button
        v-if="selectable"
        :aria-label="`Show ${label}`"
        class="icon-btn"
        :class="highlighted ? 'border-white bg-white text-brand-900' : 'border-ink hover:bg-ink hover:text-white'"
        type="button"
        @click="emit('select')"
      >
        <i class="mdi mdi-arrow-top-right" />
      </button>
    </div>

    <p
      class="relative mt-3 font-semibold tracking-tight break-words"
      :class="compact ? 'text-2xl sm:text-3xl' : 'text-4xl sm:text-5xl'"
    >
      {{ value }}
    </p>

    <p
      v-if="hint"
      class="relative mt-3 flex items-center gap-2 text-xs"
      :class="highlighted ? 'text-brand-100' : 'text-brand-700'"
    >
      <i
        v-if="icon"
        class="mdi rounded border px-0.5 text-[10px] leading-none"
        :class="icon"
      />
      {{ hint }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  withDefaults(defineProps<{
    label: string
    value: string | number
    hint?: string
    icon?: string
    highlighted?: boolean
    selectable?: boolean
    selected?: boolean
    compact?: boolean
  }>(), {
    hint: '',
    icon: '',
  })

  const emit = defineEmits<{ select: [] }>()
</script>
