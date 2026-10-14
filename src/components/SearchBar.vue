<script setup lang="ts">
const model = defineModel<string>({ default: '' })

withDefaults(
  defineProps<{
    placeholder?: string
    label?: string
  }>(),
  {
    placeholder: 'Search...',
    label: 'Search',
  },
)
</script>

<template>
  <label class="search-box">
    <span class="search-icon" aria-hidden="true">⌕</span>

    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      :aria-label="label"
    />
  </label>
</template>

<style scoped>
.search-box {
  width: min(100%, 440px);
  height: 48px;
  margin: 32px auto 0;
  padding: 0 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #151a25;
  border: 1px solid #30394b;
  border-radius: 8px;
}

.search-box:focus-within {
  border-color: #80aaff;
}

.search-icon {
  color: #a1b8df;
  font-size: 25px;
}

.search-box input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  outline: none;
  color: white;
  font-size: 14px;
}

.search-box input::placeholder {
  color: #7f8ba1;
}
</style>