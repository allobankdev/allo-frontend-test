<script setup lang="ts">
defineProps<{
  message: string;
}>();

defineEmits(["retry"]);
</script>

<template>
  <div class="center">
    <p>{{ message }}</p>
    <button @click="$emit('retry')">Retry</button>
  </div>
</template>

<style scoped>
.center {
  text-align: center;
  padding: 24px;
}
button {
  margin-top: 8px;
}
</style>
