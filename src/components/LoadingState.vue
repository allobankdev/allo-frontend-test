<template>
  <div
    v-if="variant === 'detail'"
    class="skeleton-detail"
    aria-busy="true"
    aria-label="Loading launch vehicle data"
  >
    <div class="u-skeleton skeleton-detail__media" />
    <div class="skeleton-detail__data">
      <div class="u-skeleton line line--sm" />
      <div class="u-skeleton line line--xl" />
      <div class="u-skeleton line line--md" />
      <div class="u-skeleton line line--lg" />
      <div class="skeleton-detail__specs">
        <div
          v-for="n in 6"
          :key="n"
          class="skeleton-detail__row"
        >
          <div class="u-skeleton line line--sm" />
          <div class="u-skeleton line line--md" />
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    class="skeleton-grid"
    aria-busy="true"
    aria-label="Loading rocket fleet"
  >
    <div
      v-for="n in 6"
      :key="n"
      class="skeleton-card"
    >
      <div class="u-skeleton skeleton-card__media" />
      <div class="skeleton-card__body">
        <div class="u-skeleton line line--sm" />
        <div class="u-skeleton line line--lg" />
        <div class="u-skeleton line line--full" />
        <div class="u-skeleton line line--md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'list' | 'detail';
  }>(),
  {
    variant: 'list',
  }
);
</script>

<style scoped>
.line {
  height: 10px;
}

.line--sm {
  width: 28%;
}

.line--md {
  width: 52%;
}

.line--lg {
  width: 72%;
}

.line--xl {
  height: 28px;
  width: 84%;
}

.line--full {
  width: 100%;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  padding-top: 8px;
}

.skeleton-card {
  border: 1px solid var(--fleet-hairline);
  background: rgb(var(--v-theme-surface));
}

.skeleton-card__media {
  aspect-ratio: 16 / 10;
}

.skeleton-card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
}

.skeleton-detail {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 64px);
  padding-top: 8px;
}

.skeleton-detail__media {
  aspect-ratio: 4 / 3;
}

.skeleton-detail__data {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skeleton-detail__specs {
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-top: 12px;
  border-top: 1px solid var(--fleet-hairline);
}

.skeleton-detail__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--fleet-hairline);
}

@media (max-width: 1100px) {
  .skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .skeleton-detail {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
  }
}
</style>
