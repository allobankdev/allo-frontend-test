<template>
  <v-row class="loading-grid">
    <v-col
      v-for="n in count"
      :key="n"
      cols="12"
      sm="6"
      md="4"
      class="d-flex"
    >
      <v-card
        class="skeleton-card w-100"
        rounded="xl"
        elevation="0"
      >
        <v-skeleton-loader
          type="image, heading, paragraph, actions"
          class="w-100 h-100"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 6,
  },
)
</script>

<style scoped>
.loading-grid {
  margin: 0 -12px;
}

.skeleton-card {
  border: 1px solid #e2e8f0;
  background: #ffffff;
  overflow: hidden;
  min-height: 400px;
}
</style>
