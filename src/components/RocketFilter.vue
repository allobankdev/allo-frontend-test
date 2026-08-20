<template>
  <div class="rocket-filter">
    <label for="rocket-search" class="rocket-filter__label">Search</label>
    <div class="rocket-filter__input-wrap">
      <input
        id="rocket-search"
        v-model="searchQuery"
        type="search"
        class="rocket-filter__input"
        placeholder="Search by name, description, or country…"
        autocomplete="off"
        @input="emitUpdate"
      />
      <button
        v-if="searchQuery"
        type="button"
        class="rocket-filter__clear"
        aria-label="Clear search"
        @click="clearSearch"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const emit = defineEmits<{
  update: [query: string]
}>()

const searchQuery = ref('')

function emitUpdate() {
  emit('update', searchQuery.value)
}

function clearSearch() {
  searchQuery.value = ''
  emit('update', '')
}
</script>

<style scoped>
.rocket-filter {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin-bottom: 1.25rem;
}

.rocket-filter__label {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-muted);
}

.rocket-filter__input-wrap {
  position: relative;
}

.rocket-filter__input {
  width: 100%;
  padding: 0.55rem 2rem 0.55rem 0.75rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  color: var(--text);
  font-size: 0.875rem;
  font-family: inherit;
  transition: border-color 0.15s;
  -webkit-appearance: none;
}

.rocket-filter__input::placeholder {
  color: var(--text-subtle);
}

.rocket-filter__input:focus {
  outline: none;
  border-color: var(--border-focus);
}

.rocket-filter__input::-webkit-search-cancel-button {
  display: none;
}

.rocket-filter__clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 0.2rem;
  line-height: 1;
}

.rocket-filter__clear:hover {
  color: var(--text);
}

.rocket-filter__clear:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 2px;
  border-radius: 3px;
}
</style>
