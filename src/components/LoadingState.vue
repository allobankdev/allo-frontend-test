<template>
  <div class="loading-state">
    <v-progress-circular
      indeterminate
      color="primary"
      size="48"
      width="3"
    />
  </div>
</template>

<script lang="ts" setup>
//
</script>

<style scoped>
.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 48px;
}
</style>

