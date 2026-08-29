<template>
  <div class="home-page">
    <RocketList />
  </div>
</template>

<script setup lang="ts">
import RocketList from '@/components/RocketList.vue'
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background-color: #fafafa;
}
</style>
