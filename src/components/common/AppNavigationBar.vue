<template>
  <header class="hig-nav-header" :class="{ 'hig-nav-header--scrolled': scrolled }">
    <div
      v-if="!largeTitle || !largeTitleVisible"
      class="hig-nav-inner"
      :style="{ maxWidth }"
    >
      <div class="hig-nav-side hig-nav-side--left">
        <button
          v-if="showBack"
          class="hig-back-btn"
          type="button"
          :aria-label="`Back to ${backLabel}`"
          @click="$emit('back')"
        >
          <v-icon size="24" class="hig-chevron-icon">mdi-chevron-left</v-icon>
          <span class="hig-back-text">{{ backLabel }}</span>
        </button>
      </div>

      <div class="hig-nav-center">
        <h2 class="hig-nav-title">
          {{ title }}
        </h2>
      </div>

      <div class="hig-nav-side hig-nav-side--right">
        <button
          class="hig-action-btn hig-theme-btn"
          type="button"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          @click="toggleTheme"
        >
          <v-icon size="20" class="hig-theme-icon">
            {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
          </v-icon>
        </button>

        <button
          v-if="showAdd"
          class="hig-action-btn"
          type="button"
          aria-label="Add new rocket"
          @click="$emit('add')"
        >
          <v-icon size="24">mdi-plus</v-icon>
        </button>
      </div>
    </div>

    <div
      v-if="largeTitle"
      ref="largeTitleRef"
      class="hig-large-title-wrapper"
      :style="{ maxWidth }"
    >
      <div class="hig-large-title-row">
        <h1 class="hig-large-title">{{ title }}</h1>
        <div class="hig-large-title-actions">
          <button
            class="hig-action-btn hig-theme-btn hig-action-btn--large"
            type="button"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            @click="toggleTheme"
          >
            <v-icon size="22" class="hig-theme-icon">
              {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
            </v-icon>
          </button>

          <button
            v-if="showAdd"
            class="hig-action-btn hig-action-btn--large"
            type="button"
            aria-label="Add new rocket"
            @click="$emit('add')"
          >
            <v-icon size="28">mdi-plus</v-icon>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTheme } from '@/composables/useTheme'

interface Props {
  title: string
  largeTitle?: boolean
  showBack?: boolean
  backLabel?: string
  showAdd?: boolean
  maxWidth?: string
}

withDefaults(defineProps<Props>(), {
  largeTitle: false,
  showBack: false,
  backLabel: 'Back',
  showAdd: false,
  maxWidth: '1280px',
})

defineEmits<{ back: []; add: [] }>()

const { isDark, toggleTheme } = useTheme()
const scrolled = ref(false)
const largeTitleVisible = ref(true)
const largeTitleRef = ref<HTMLElement | null>(null)

function onScroll() {
  scrolled.value = window.scrollY > 4
  if (largeTitleRef.value) {
    const rect = largeTitleRef.value.getBoundingClientRect()
    largeTitleVisible.value = rect.bottom > 50
  }
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.hig-nav-header {
  position: sticky;
  top: 0;
  z-index: 99;
  width: 100%;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-bottom: 0.5px solid transparent;
  transition: background-color var(--hig-duration-theme) var(--hig-easing),
              border-color var(--hig-duration-theme) var(--hig-easing),
              box-shadow var(--hig-duration-theme) var(--hig-easing);
  font-family: var(--hig-font-stack);
}

:root[data-theme="dark"] .hig-nav-header,
html.dark .hig-nav-header {
  background: rgba(0, 0, 0, 0.82);
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .hig-nav-header {
    background: rgba(0, 0, 0, 0.82);
  }
}

.hig-nav-header--scrolled {
  border-bottom-color: var(--hig-separator);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.hig-nav-inner {
  margin: 0 auto;
  height: 44px;
  min-height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: var(--hig-space-md);
  padding-right: var(--hig-space-md);
}

@media (min-width: 600px) {
  .hig-nav-inner {
    padding-left: var(--hig-space-lg);
    padding-right: var(--hig-space-lg);
  }
}

@media (min-width: 960px) {
  .hig-nav-inner {
    padding-left: var(--hig-space-xl);
    padding-right: var(--hig-space-xl);
  }
}

.hig-nav-side {
  display: flex;
  align-items: center;
  gap: var(--hig-space-xs);
  min-width: 90px;
}

.hig-nav-side--left {
  justify-content: flex-start;
}

.hig-nav-side--right {
  justify-content: flex-end;
}

.hig-nav-center {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
}

.hig-nav-title {
  font-size: var(--hig-headline-size);
  font-weight: var(--hig-headline-weight);
  line-height: var(--hig-headline-lh);
  color: var(--hig-label);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hig-back-btn {
  display: inline-flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--hig-system-blue);
  font-size: var(--hig-body-size);
  font-family: var(--hig-font-stack);
  font-weight: 400;
  min-height: var(--hig-tap-target);
  padding: 0;
  margin-left: -6px;
  transition: opacity var(--hig-duration-fast) var(--hig-easing);
}

.hig-back-btn:active {
  opacity: 0.5;
}

.hig-chevron-icon {
  margin-right: -2px;
}

.hig-back-text {
  font-size: var(--hig-body-size);
  line-height: 1;
}

.hig-action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--hig-system-blue);
  min-height: var(--hig-tap-target);
  min-width: var(--hig-tap-target);
  border-radius: 50%;
  transition: opacity var(--hig-duration-fast) var(--hig-easing),
              transform var(--hig-duration-fast) var(--hig-easing),
              color var(--hig-duration-theme) var(--hig-easing);
}

.hig-action-btn:active {
  opacity: 0.5;
  transform: scale(0.92);
}

.hig-theme-btn {
  color: var(--hig-secondary-label);
}

.hig-theme-btn:hover {
  color: var(--hig-label);
}

.hig-theme-icon {
  transition: transform var(--hig-duration-theme) cubic-bezier(0.34, 1.56, 0.64, 1);
}

.hig-theme-btn:active .hig-theme-icon {
  transform: rotate(30deg) scale(0.9);
}

.hig-action-btn--large {
  margin-right: -4px;
}

.hig-large-title-wrapper {
  margin: 0 auto;
  padding-left: var(--hig-space-md);
  padding-right: var(--hig-space-md);
  padding-top: var(--hig-space-sm);
  padding-bottom: var(--hig-space-sm);
}

@media (min-width: 600px) {
  .hig-large-title-wrapper {
    padding-left: var(--hig-space-lg);
    padding-right: var(--hig-space-lg);
  }
}

@media (min-width: 960px) {
  .hig-large-title-wrapper {
    padding-left: var(--hig-space-xl);
    padding-right: var(--hig-space-xl);
  }
}

.hig-large-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hig-large-title-actions {
  display: flex;
  align-items: center;
  gap: var(--hig-space-xs);
}

.hig-large-title {
  font-size: var(--hig-large-title-size);
  font-weight: var(--hig-large-title-weight);
  line-height: var(--hig-large-title-lh);
  color: var(--hig-label);
  font-family: var(--hig-font-stack);
  letter-spacing: -0.5px;
  margin: 0;
}
</style>
