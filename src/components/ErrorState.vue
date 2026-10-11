<template>
  <v-alert type="error" variant="tonal">
    <div class="d-flex justify-space-between align-center">
      <span>{{ message }}</span>
      <v-btn variant="outlined" color="error" @click="$emit('retry')">
        Reload
      </v-btn>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
defineProps<{message: string}>()
</script>
