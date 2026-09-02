<template>
  <v-app>
    <v-app-bar
      :class="['app-bar', { 'app-bar--scrolled': isScrolled }]"
      :color="isScrolled ? undefined : 'app-bar'"
      :elevation="isScrolled ? 3 : 0"
      flat
    >
      <v-app-bar-title>
        <router-link
          class="app-title-link d-flex align-center"
          to="/"
        >
          <v-icon
            class="app-title-link__icon mr-2"
            icon="mdi-rocket-launch"
          />
          <span class="app-title-link__text" >SpaceX Rocket Explorer</span>
        </router-link>
      </v-app-bar-title>

      <v-spacer />

      <v-btn
        class="theme-toggle-btn"
        icon
        variant="text"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <transition
          mode="out-in"
          name="theme-icon"
        >
          <v-icon
            :key="isDark ? 'sun' : 'moon'"
            :icon="isDark ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          />
        </transition>
      </v-btn>
    </v-app-bar>

    <v-main>
      <ErrorState
        v-if="renderError"
        message="An unexpected error occurred while rendering this page."
        retry-label="Reload page"
        title="Something went wrong"
        @retry="reload"
      />
      <router-view
        v-else
        v-slot="{ Component }"
      >
        <transition
          mode="out-in"
          name="fade"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </v-main>

    <v-footer
      app
      border
      class="app-footer justify-center text-caption text-medium-emphasis"
    >
      Data from the Launch Library 2 API by The Space Devs
    </v-footer>
  </v-app>
</template>

<script lang="ts" setup>
  import { onErrorCaptured, onMounted, onUnmounted, ref } from 'vue'
  import ErrorState from '@/components/common/ErrorState.vue'
  import { useAppTheme } from '@/composables/useAppTheme'

  const { isDark, toggleTheme } = useAppTheme()

  // A basic error boundary: if a page throws during render, show a
  // recoverable fallback instead of a blank white screen.
  const renderError = ref(false)

  onErrorCaptured(error => {
    console.error(error)
    renderError.value = true
    return false
  })

  function reload () {
    window.location.reload()
  }

  // Toggles the app bar between a vivid gradient (at the top of the page)
  // and a frosted-glass look once the user scrolls, instead of a static bar.
  const isScrolled = ref(false)

  function handleScroll () {
    isScrolled.value = window.scrollY > 12
  }

  onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
  onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style>
.app-title-link {
  color: inherit;
  text-decoration: none;
}

.app-title-link__icon {
  animation: rocket-float 3s ease-in-out infinite;
  transition: transform 0.25s ease;
}

.app-title-link:hover .app-title-link__icon {
  transform: scale(1.15) rotate(-8deg);
}

@keyframes rocket-float {
  0%, 100% {
    transform: translateY(0) rotate(-8deg);
  }
  50% {
    transform: translateY(-3px) rotate(-8deg);
  }
}

@media (max-width: 600px) {
  .app-title-link__text {
    font-size: 14px;
  }
}

/* --- App bar: gradient at the top, frosted glass once scrolled --- */
.app-bar {
  transition:
    background-color 0.35s ease,
    background-image 0.35s ease,
    backdrop-filter 0.35s ease,
    box-shadow 0.35s ease,
    border-color 0.35s ease;
}

.app-bar:not(.app-bar--scrolled) {
  background-image: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 1) 0%,
    rgba(var(--v-theme-accent), 0.88) 100%
  );
}

.app-bar--scrolled {
  background-color: rgba(var(--v-theme-surface), 0.72) !important;
  backdrop-filter: saturate(180%) blur(14px);
  -webkit-backdrop-filter: saturate(180%) blur(14px);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.theme-toggle-btn {
  transition: transform 0.25s ease;
}

.theme-toggle-btn:hover {
  transform: rotate(12deg) scale(1.08);
}

.theme-icon-enter-active,
.theme-icon-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.theme-icon-enter-from {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.theme-icon-leave-to {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

/* --- Footer: subtle frosted strip with a gradient accent line --- */
.app-footer {
  position: relative;
  background-color: rgba(var(--v-theme-surface), 0.65) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.app-footer::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 2px;
  background-image: linear-gradient(
    90deg,
    rgba(var(--v-theme-primary), 0.8),
    rgba(var(--v-theme-accent), 0.8)
  );
}

/* --- Page transition: fade with a slight vertical drift --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
