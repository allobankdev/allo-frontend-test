<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  value?: string | number | null
  fallback?: string
}

const props = withDefaults(defineProps<Props>(), {
  value: null,
  fallback: 'Tidak diketahui',
})

const isEmpty = computed(() => {
  return props.value === null
    || props.value === undefined
    || (typeof props.value === 'string' && props.value.trim() === '')
})

const display = computed(() => isEmpty.value ? props.fallback : props.value)
</script>

<template>
  <span :class="{ 'text-medium-emphasis font-italic': isEmpty }">{{ display }}</span>
</template>
