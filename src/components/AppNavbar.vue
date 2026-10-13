<template>
  <header class="app-navbar border-b">
    <v-container class="py-3 px-4 d-flex align-center justify-space-between">
      <!-- Brand Logo / Title -->
      <router-link
        to="/"
        class="d-flex align-center gap-3 text-decoration-none text-white brand-link"
      >
        <div class="brand-icon-box d-flex align-center justify-center">
          <v-icon
            icon="mdi-rocket"
            size="20"
            color="black"
          />
        </div>
        <div>
          <div class="brand-title">
            SPACEX // ROCKETS
          </div>
          <div class="brand-subtitle">
            Launch Library Explorer
          </div>
        </div>
      </router-link>

      <!-- Action Buttons -->
      <div class="d-flex align-center gap-2">
        <v-btn
          variant="flat"
          color="white"
          size="small"
          prepend-icon="mdi-plus"
          class="text-black font-weight-bold text-none px-3 text-caption text-sm-body-2"
          @click="$emit('open-add-dialog')"
        >
          <span class="d-none d-sm-inline">Tambah Roket</span>
          <span class="d-inline d-sm-none">Tambah</span>
        </v-btn>
      </div>
    </v-container>
  </header>
</template>

<script lang="ts" setup>
defineEmits<{
  (e: 'open-add-dialog'): void
}>()
</script>

<style scoped>
.app-navbar {
  background-color: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
}

.border-b {
  border-bottom: 1px solid #222224;
}

.brand-link {
  transition: opacity 0.2s ease;
}

.brand-link:hover {
  opacity: 0.9;
}

.brand-icon-box {
  width: 34px;
  height: 34px;
  background-color: #ffffff;
  border-radius: 6px;
}

.brand-title {
  font-size: 0.95rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  line-height: 1.2;
}

.brand-subtitle {
  font-size: 0.68rem;
  color: #71717a;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}
</style>
