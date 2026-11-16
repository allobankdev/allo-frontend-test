<script setup lang="ts">
/**
 * RocketMeta.vue
 *
 * Reusable label/value list for rocket facts. Accepts already formatted
 * values so it stays free of formatting logic.
 */

withDefaults(defineProps<{
  items: Array<{ label: string; value: string | null | undefined; icon?: string }>
  dense?: boolean
}>(), {
  dense: false,
})
</script>

<template>
  <dl
    class="rocket-meta"
    :class="{ 'rocket-meta--dense': dense }"
  >
    <div
      v-for="item in items"
      :key="item.label"
      class="rocket-meta__item"
    >
      <dt class="rocket-meta__label">
        <v-icon
          v-if="item.icon"
          :icon="item.icon"
          size="14"
        />
        <span>{{ item.label }}</span>
      </dt>
      <dd class="rocket-meta__value">
        {{ item.value || '—' }}
      </dd>
    </div>
  </dl>
</template>

<style scoped>
.rocket-meta {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  margin: 0;
}

.rocket-meta--dense {
  gap: 8px 16px;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
}

.rocket-meta__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.rocket-meta__label {
  align-items: center;
  color: rgba(var(--v-theme-on-surface), 0.6);
  display: flex;
  font-size: 0.75rem;
  gap: 4px;
  letter-spacing: 0.02em;
  text-transform: uppercase;
}

.rocket-meta__value {
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
}

.rocket-meta--dense .rocket-meta__value {
  font-size: 0.85rem;
}
</style>
