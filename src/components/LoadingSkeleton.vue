<template>
  <div class="skeleton-grid" aria-label="Loading rockets…" aria-busy="true">
    <div v-for="n in count" :key="n" class="skeleton-card">
      <div class="skeleton-img skeleton-block" />
      <div class="skeleton-body">
        <div class="skeleton-block skeleton-line skeleton-line--title" />
        <div class="skeleton-block skeleton-line" />
        <div class="skeleton-block skeleton-line skeleton-line--short" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    count?: number
  }>(),
  { count: 8 },
)
</script>

<style scoped>
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.skeleton-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.skeleton-img {
  width: 100%;
  aspect-ratio: 16 / 9;
}

.skeleton-body {
  padding: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 13px;
  border-radius: 4px;
  width: 100%;
}

.skeleton-line--title {
  height: 16px;
  width: 70%;
}

.skeleton-line--short {
  width: 40%;
}

.skeleton-block {
  background: var(--surface-raised);
  animation: pulse 1.4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
