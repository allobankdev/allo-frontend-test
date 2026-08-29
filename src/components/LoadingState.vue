<template>
   <div class="loading-state">
    <v-progress-circular
      indeterminate
      color="primary"
      width="5"
      size="40"
    />
   </div>
</template>

<style scoped>
  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
    padding: 48px;
  }
</style>
  