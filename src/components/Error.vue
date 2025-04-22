<template>
  <div>
    <div>Error: {{ message }}</div>
    <button @click="$emit('retry')">Retry</button>
  </div>
</template>

<script setup>
defineProps(['message'])
</script>