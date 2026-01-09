<template>
  <div v-if="items.length">
    <div class="text-subtitle-2 mb-2">{{ title }}</div>
    <div class="kv">
      <div class="kv__row" v-for="item in items" :key="item.key">
        <div class="kv__key">{{ item.key }}</div>
        <div class="kv__val">{{ item.value }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export type KeyValueItem = {
  key: string;
  value: string;
};

defineProps<{
  title: string;
  items: KeyValueItem[];
}>();
</script>

<style scoped>
.kv {
  display: grid;
  gap: 8px;
}

.kv__row {
  display: grid;
  grid-template-columns: minmax(140px, 180px) 1fr;
  gap: 12px;
}

.kv__key {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.kv__val {
  font-size: 14px;
}
</style>
