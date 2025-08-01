<template>
  <v-alert
    type="error"
    variant="tonal"
    class="d-flex justify-space-between align-center"
  >
    <span>Terjadi kesalahan saat memuat data.</span>
    <v-btn color="primary" variant="tonal" @click="handleRefresh" size="small">
      Refresh
    </v-btn>
  </v-alert>
</template>

<script setup lang="ts">
const emit = defineEmits(["refresh"]);

const handleRefresh = () => {
  emit("refresh");
};
</script>
