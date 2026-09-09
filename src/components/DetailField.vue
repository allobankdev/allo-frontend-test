<template>
  <div class="detail-field">
    <div class="d-flex align-center ga-2 text-medium-emphasis">
      <v-icon
        :icon="icon"
        size="18"
      />
      <span class="text-caption text-uppercase font-weight-medium">{{ label }}</span>
    </div>
    <p class="text-body-1 font-weight-medium mt-1">
      {{ value }}
    </p>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{ label: string, value: string, icon: string }>()
</script>

<style scoped>
  .detail-field {
    min-width: 0;
  }
</style>
