<template>
  <div class="d-flex align-center ga-3 py-2">
    <v-avatar
      :color="iconColor"
      size="40"
      variant="tonal"
      rounded="lg"
    >
      <v-icon
        :icon="icon"
        size="20"
      />
    </v-avatar>
    <div>
      <div class="text-caption text-medium-emphasis text-uppercase font-weight-bold letter-spacing-1">
        {{ label }}
      </div>
      <div class="text-body-1">
        {{ displayValue }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps<{
  icon: string
  label: string
  value: string | null | undefined
  fallback?: string
  iconColor?: string
}>()

const displayValue = computed(() => props.value || props.fallback || 'N/A')
const iconColor = computed(() => props.iconColor || 'primary')
</script>
