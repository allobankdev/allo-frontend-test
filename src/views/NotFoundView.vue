<template>
  <main id="main-content" class="not-found-view">
    <div class="nfv__inner">
      <p class="nfv__code" aria-hidden="true">404</p>
      <h1 class="nfv__title">Page Not Found</h1>
      <p class="nfv__message">The page you're looking for doesn't exist or has been moved.</p>
      <RouterLink :to="{ name: 'rocket-list' }" class="nfv__link"> ← Back to Rockets </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.not-found-view {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60dvh;
  padding: 2rem;
  text-align: center;
}

.nfv__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.nfv__code {
  font-size: 5rem;
  font-weight: 800;
  margin: 0;
  color: var(--text-subtle);
  line-height: 1;
}

.nfv__title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
}

.nfv__message {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem;
  max-width: 360px;
}

.nfv__link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
}

.nfv__link:hover {
  text-decoration: underline;
}

.nfv__link:focus-visible {
  outline: 2px solid var(--border-focus);
  outline-offset: 3px;
  border-radius: 4px;
}
</style>
