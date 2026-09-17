<template>
  <div class="detail-item">
    <v-icon
      class="text-medium-emphasis"
      :icon="icon"
      size="20"
    />
    <div>
      <div class="text-caption text-medium-emphasis text-uppercase">
        {{ label }}
      </div>
      <div class="text-body-1 font-weight-medium">
        {{ value }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  defineProps<{
    icon: string
    label: string
    value: string
  }>()
</script>

<style scoped>
.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
}

.detail-item .v-icon {
  margin-top: 2px;
}
</style>
