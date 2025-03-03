<template>
    <div class="error">
      <p>{{ message }}</p>
      <button @click="retry">Retry</button>
    </div>
  </template>
  
  <script setup>
  defineProps(['message', 'retry']);
  </script>
  
  <style scoped>
  .error {
    color: red;
    text-align: center;
  }
  button {
    margin-top: 10px;
    padding: 5px 10px;
  }
  </style>
  