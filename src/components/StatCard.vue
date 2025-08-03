<template>
  <div class="stat-card">
    <div class="d-flex align-center mb-2">
      <v-icon
        :icon="icon"
        size="small"
        class="mr-2"
      />
      <span class="stat-card__title">{{ title }}</span>
    </div>
    <div class="stat-card__value">
      {{ value }}
    </div>
  </div>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    default: "Title",
  },
  value: {
    type: String,
    default: "...",
  },
  icon: { type: String, default: "mdi-card" },
});
</script>
