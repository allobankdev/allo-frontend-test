<script setup>
defineProps({
  loading: Boolean,
  error: Object,
});
defineEmits(["retry"]);
</script>

<template>
  <v-alert v-if="loading" type="info">Loading...</v-alert>

  <v-alert v-else-if="error" type="error">
    Failed to load data
    <v-btn size="small" @click="$emit('retry')">Retry</v-btn>
  </v-alert>
</template>
