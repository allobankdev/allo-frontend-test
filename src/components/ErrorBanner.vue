<script setup lang="ts">
  defineProps<{
    errMsg?: string,
  }>();

  const reloadPage = () => {
    window.location.reload();
  };
</script>
<template>
  <v-container class="d-flex flex-column justify-center align-center h-50">
    <v-icon size="64" color="error" class="mb-4">mdi-alert-circle</v-icon>
    <div class="text-h6 font-weight-bold mb-2">Oops! Something went wrong.</div>
    <div class="text-h6 text-medium-emphasis">{{ errMsg }}</div>
    <v-btn 
      class="mt-4 text-none"
      @click="reloadPage"
    >
      Reload Page
    </v-btn>
  </v-container>
</template>