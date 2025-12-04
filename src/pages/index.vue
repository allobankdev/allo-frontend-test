<template>
  <div class="home-view">
    <RocketList />
  </div>
</template>

<script setup lang="ts">
import RocketList from '@/components/RocketList.vue';
</script>

<style scoped>
.home-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px;
}
</style>