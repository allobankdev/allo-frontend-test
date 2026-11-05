<template>
  <v-app-bar
    flat
    density="comfortable"
    color="surface"
    class="border-b px-2 px-md-6"
    style="border-color: var(--titanium-border) !important;"
  >
    <div
      class="d-flex align-center cursor-pointer select-none"
      @click="goToHome"
    >
      <div class="brand-symbol me-3 d-flex align-center justify-center">
        <v-icon
          icon="mdi-navigation-variant"
          color="primary"
          size="20"
        />
      </div>
      <div>
        <div class="text-subtitle-1 font-weight-bold tracking-widest text-uppercase">
          SpaceX Flight Manifest
        </div>
        <div
          class="text-caption text-secondary font-mono"
          style="font-size: 0.68rem; margin-top: -2px;"
        >
          CONFIGURATION & TELEMETRY SYSTEM
        </div>
      </div>
    </div>

    <v-spacer />

    <!-- Live System Telemetry Status -->
    <div
      class="d-none d-md-flex align-center ga-2 me-4 px-3 py-1 bg-surface-variant rounded-sm border"
      style="border-color: var(--titanium-border);"
    >
      <span class="telemetry-dot" />
      <span
        class="font-mono text-caption text-secondary"
        style="font-size: 0.72rem;"
      >
        API v2.2.0 // NOMINAL
      </span>
    </div>

    <!-- Active Voice Registration Button -->
    <v-btn
      color="primary"
      variant="flat"
      prepend-icon="mdi-plus"
      class="text-none font-weight-bold"
      rounded="sm"
      @click="$emit('open-add-dialog')"
    >
      Register Vehicle
    </v-btn>
  </v-app-bar>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'

defineEmits<{
  (e: 'open-add-dialog'): void
}>()

const router = useRouter()

function goToHome() {
  router.push('/')
}
</script>

<style scoped>
.brand-symbol {
  width: 32px;
  height: 32px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 4px;
}

.tracking-widest {
  letter-spacing: 1.25px;
}

.telemetry-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background-color: var(--signal-emerald);
  box-shadow: 0 0 6px var(--signal-emerald);
}
</style>
