<template>
  <header
    class="app-navbar"
    role="banner"
  >
    <div class="navbar-container">

      <router-link
        to="/"
        class="brand-link"
        aria-label="AstroFleet Explorer Home"
      >
        <v-icon
          icon="mdi-rocket-launch"
          color="primary"
          class="mr-2"
          size="24"
        />
        <span class="brand-name">AstroFleet Explorer</span>
      </router-link>

      <div
        v-if="$slots.center"
        class="navbar-center"
      >
        <slot name="center" />
      </div>

      <div
        v-if="$slots.actions"
        class="navbar-actions"
      >
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<script lang="ts" setup>

</script>

<style scoped>
.app-navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  z-index: 20;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.navbar-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.brand-link:hover {
  opacity: 0.9;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0b2545;
  letter-spacing: -0.02em;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
  max-width: 560px;
}

.navbar-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

@media (max-width: 768px) {
  .navbar-container {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .navbar-center {
    max-width: 100%;
  }

  .navbar-actions {
    justify-content: flex-end;
  }
}
</style>
