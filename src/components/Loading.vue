<template>
  <v-container class="loading-wrapper" fluid>
    <v-progress-circular indeterminate color="primary" size="56" width="5" />
  </v-container>
</template>
<script lang="ts" setup></script>
<style lang="css" scoped>
.loading-wrapper {
  min-height: calc(100vh - 64px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
