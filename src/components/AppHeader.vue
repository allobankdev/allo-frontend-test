<template>
  <header class="app-header">
    <div class="app-header__inner">
      <RouterLink to="/rockets" class="app-header__brand" aria-label="SpaceX Rockets home">
        <span class="app-header__icon" aria-hidden="true">🚀</span>
        <span class="app-header__title">SpaceX Rockets</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 0 1rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header__inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0.875rem 0;
}

.app-header__brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text);
}

.app-header__brand:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 4px;
  border-radius: 4px;
}

.app-header__icon {
  font-size: 1.25rem;
  line-height: 1;
}

.app-header__title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
  letter-spacing: -0.01em;
}
</style>
