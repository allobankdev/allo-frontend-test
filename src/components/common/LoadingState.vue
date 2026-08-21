<template>
  <v-row class="hig-skeleton-grid">
    <v-col
      v-for="n in count"
      :key="n"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-skeleton-loader
        type="image, article"
        rounded="lg"
        class="hig-skeleton"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ count?: number }>(), { count: 8 })
</script>

<style scoped>
.hig-skeleton-grid {
  margin: calc(var(--hig-space-md) * -0.5) !important;
}

.hig-skeleton-grid :deep(.v-col) {
  padding: calc(var(--hig-space-md) * 0.5) !important;
  display: flex;
}

.hig-skeleton {
  width: 100%;
  height: 100%;
  border: 0.5px solid var(--hig-separator);
}
</style>
