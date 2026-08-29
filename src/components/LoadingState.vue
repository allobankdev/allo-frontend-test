<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>

<template>
  <v-container class="loading-state">
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate color="primary" size="64" width="6" />
        <p class="mt-4 text-h6 text-medium-emphasis">
          {{ message || 'Loading...' }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.loading-state {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
