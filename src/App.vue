<script setup lang="ts">
/**
 * App shell: header + routed page.
 * `onErrorCaptured` is a last-resort boundary so a render error in one page
 * shows a recoverable message instead of a blank screen.
 */
import { onErrorCaptured, ref } from 'vue'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
import ErrorState from '@/components/state/ErrorState.vue'

const router = useRouter()
const hasCrashed = ref(false)

onErrorCaptured(error => {
  console.error(error)
  hasCrashed.value = true
  return false
})

// Leaving the broken page clears the boundary.
router.afterEach(() => { hasCrashed.value = false })

function recover (): void {
  window.location.reload()
}
</script>

<template>
  <v-app>
    <a
      href="#main-content"
      class="skip-link"
    >Skip to content</a>

    <AppHeader />

    <v-main id="main-content">
      <v-container class="page-container py-6 py-md-10">
        <ErrorState
          v-if="hasCrashed"
          message="This page failed to display. Reloading usually fixes it."
          @retry="recover"
        />
        <router-view v-else />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.skip-link {
  position: absolute;
  left: 8px;
  top: -48px;
  z-index: 2000;
  padding: 8px 16px;
  border-radius: 8px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  transition: top 0.15s ease;
}

.skip-link:focus {
  top: 8px;
}
</style>
