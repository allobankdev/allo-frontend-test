<template>
  <div class="search-wrapper">
    <span class="icon">🔍</span>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="placeholder"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
  placeholder?: string;
}>();

defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.search-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid #ddd;
  background: #fff;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    border-color: #bbb;
  }

  &:focus-within {
    border-color: #1976d2;
    box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
  }

  .icon {
    font-size: 14px;
    opacity: 0.6;
  }

  input {
    border: none;
    outline: none;
    width: 100%;
    font-size: 14px;
    background: transparent;
  }
}
</style>
