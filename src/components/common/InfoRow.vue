<template>
  <div class="info-row">
    <v-icon
      v-if="icon"
      class="info-row__icon"
      color="primary"
      :icon="icon"
    />
    <div>
      <div class="text-caption text-medium-emphasis">
        {{ label }}
      </div>
      <div
        v-if="hasValue"
        class="text-body-1"
      >
        {{ value }}
      </div>
      <div
        v-else
        class="text-body-1 text-disabled font-italic"
      >
        {{ fallback }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'

  const props = withDefaults(defineProps<{
    label: string
    value?: string | null
    icon?: string
    fallback?: string
  }>(), {
    value: null,
    icon: undefined,
    fallback: 'Not available',
  })

  const hasValue = computed(() => props.value !== null && props.value.trim() !== '')
</script>

<style scoped>
  .info-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .info-row__icon {
    margin-top: 6px;
  }
</style>
