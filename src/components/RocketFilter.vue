<template>
  <div class="rocket-filter">
    <input
      type="text"
      placeholder="Filter rocket..."
      v-model="keyword"
      @input="$emit('filter', keyword)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const keyword = ref("");
</script>

<style scoped>
.rocket-filter {
  margin-bottom: 16px;
}
</style>
