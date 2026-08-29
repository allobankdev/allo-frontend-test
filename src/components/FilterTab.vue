<template>
  <div class="tabs-wrapper d-flex align-center">
    <div
      v-for="tab in tabs"
      :key="tab"
      class="tab-item"
      :class="{ active: tab === activeTab }"
      @click="activeTab = tab"
    >
      {{ tab }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const tabs = ["Offers", "Following", "Communities", "Subscriptions"];
const activeTab = ref("Following");
</script>

<style scoped>
.tabs-wrapper {
  gap: 32px;
  padding: 20px 0;
}

.tab-item {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: 0.25s ease;
  padding: 6px 20px;
  border-radius: 20px;
}

.tab-item:hover {
  color: rgba(255, 255, 255, 0.9);
}

.tab-item.active {
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 24px;
  padding: 6px 22px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(12px);
}
</style>
