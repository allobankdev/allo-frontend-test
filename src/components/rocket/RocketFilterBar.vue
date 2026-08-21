<template>
  <div class="hig-search-wrapper" role="search" aria-label="Search rockets">
    <div class="hig-search-bar" :class="{ 'hig-search-bar--focused': isFocused }">
      <v-icon size="18" class="hig-search-icon" aria-hidden="true">mdi-magnify</v-icon>
      <input
        ref="inputRef"
        v-model="store.filterQuery"
        class="hig-search-input"
        placeholder="Search"
        type="search"
        aria-label="Search rockets"
        @focus="isFocused = true"
        @blur="isFocused = false"
      />
      <button
        v-if="store.filterQuery"
        class="hig-clear-btn"
        aria-label="Clear search"
        @click.prevent="store.filterQuery = ''"
      >
        <v-icon size="16" aria-hidden="true">mdi-close-circle</v-icon>
      </button>
    </div>

    <Transition name="hig-cancel">
      <button
        v-if="isFocused"
        class="hig-cancel-btn"
        @mousedown.prevent="handleCancel"
      >
        Cancel
      </button>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'

const store = useRocketStore()
const isFocused = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

function handleCancel() {
  store.filterQuery = ''
  isFocused.value = false
  inputRef.value?.blur()
}
</script>

<style scoped>
.hig-search-wrapper {
  display: flex;
  align-items: center;
  gap: var(--hig-space-sm);
}

.hig-search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--hig-space-sm);
  background: var(--hig-bg-secondary);
  border-radius: var(--hig-radius-pill);
  padding: 0 var(--hig-space-md);
  min-height: var(--hig-tap-target);
  transition: background var(--hig-duration-fast) var(--hig-easing);
}

.hig-search-icon {
  color: var(--hig-tertiary-label);
  flex-shrink: 0;
}

.hig-search-input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: var(--hig-body-size);
  color: var(--hig-label);
  font-family: var(--hig-font-stack);
  min-width: 0;
}

.hig-search-input::placeholder {
  color: var(--hig-tertiary-label);
}

.hig-clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--hig-tertiary-label);
  display: flex;
  align-items: center;
  padding: 0;
  min-height: 24px;
  min-width: 24px;
}

.hig-cancel-btn {
  color: var(--hig-system-blue);
  background: none;
  border: none;
  font-size: var(--hig-body-size);
  font-family: var(--hig-font-stack);
  cursor: pointer;
  min-height: var(--hig-tap-target);
  padding: 0 var(--hig-space-xs);
  white-space: nowrap;
  flex-shrink: 0;
}

.hig-cancel-enter-active,
.hig-cancel-leave-active {
  transition: all var(--hig-duration-fast) var(--hig-easing);
}
.hig-cancel-enter-from,
.hig-cancel-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
