<template>
  <div>

    <h3>Failed To Load Data</h3>

    <button @click="$emit('retry')">
      Retry
    </button>

  </div>
</template>

<script setup lang="ts">
defineEmits(['retry']);
</script>