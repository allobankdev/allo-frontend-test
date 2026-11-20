<template>
  <router-link
    :to="`/rockets/${rocket.id}`"
    class="card"
    :aria-label="`Open dossier for ${name}`"
  >
    <div class="card__media">
      <v-img
        v-if="rocket.image_url"
        :src="rocket.image_url"
        :alt="name"
        class="card__img"
        cover
        loading="lazy"
      >
        <template #error>
          <div class="card__media-empty">
            <span class="u-mono">IMAGE UNAVAILABLE</span>
          </div>
        </template>
      </v-img>
      <div
        v-else
        class="card__media-empty"
      >
        <span class="u-mono">NO IMAGE IN ARCHIVE</span>
      </div>

      <span
        v-if="rocket.is_custom"
        class="card__tag u-mono"
      >
        CUSTOM ENTRY
      </span>
    </div>

    <div class="card__body">
      <div class="card__top u-mono">
        <span>CFG {{ indexLabel }}</span>
        <span
          class="card__status"
          :class="{ 'is-retired': rocket.active === false }"
        >
          <span class="card__dot" />
          {{ statusLabel }}
        </span>
      </div>

      <h2 class="card__title">
        {{ name }}
      </h2>

      <dl class="card__meta">
        <div>
          <dt class="u-label">
            Cost / launch
          </dt>
          <dd class="u-mono">
            {{ costLabel }}
          </dd>
        </div>
        <div>
          <dt class="u-label">
            First flight
          </dt>
          <dd class="u-mono">
            {{ firstFlightLabel }}
          </dd>
        </div>
        <div>
          <dt class="u-label">
            Origin
          </dt>
          <dd class="u-mono">
            {{ countryLabel }}
          </dd>
        </div>
      </dl>

      <p class="card__desc">
        {{ rocket.description || 'No description has been documented for this configuration.' }}
      </p>

      <span class="card__cta u-mono">
        OPEN DOSSIER
        <span
          class="card__arrow"
          aria-hidden="true"
        >→</span>
      </span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Rocket } from '@/types/rocket';

const props = defineProps<{
  rocket: Rocket;
  index?: number;
}>();

const name = computed(
  () => props.rocket.full_name || props.rocket.name || 'Unnamed configuration'
);

const indexLabel = computed(() =>
  String(props.index ?? 0).padStart(2, '0')
);

const statusLabel = computed(() => {
  if (props.rocket.active === true) return 'ACTIVE';
  if (props.rocket.active === false) return 'RETIRED';
  return 'STATUS N/A';
});

const countryLabel = computed(() => {
  const code =
    props.rocket.manufacturer?.country_code || props.rocket.manufacturer?.country;
  if (!code) return '—';
  return Array.isArray(code) ? code.join(' / ') : code;
});

const costLabel = computed(() => {
  const value = props.rocket.launch_cost;
  if (value === undefined || value === null || value === '' || value === '0') {
    return 'NOT DISCLOSED';
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return String(value);
  return `$${(parsed / 1_000_000).toFixed(1)}M`;
});

const firstFlightLabel = computed(() => {
  const value = props.rocket.maiden_flight;
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : String(date.getFullYear());
});
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--fleet-hairline);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 220ms var(--fleet-ease),
    transform 220ms var(--fleet-ease);
}

.card:hover {
  border-color: rgb(var(--v-theme-primary));
  transform: translateY(-2px);
}

.card__media {
  position: relative;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: rgb(var(--v-theme-surface-variant));
}

.card__media :deep(.v-img) {
  position: absolute;
  inset: 0;
  height: 100%;
}

.card__media :deep(.v-img__img) {
  transition: transform 600ms var(--fleet-ease);
}

.card:hover .card__media :deep(.v-img__img) {
  transform: scale(1.04);
}

.card__media-empty {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: repeating-linear-gradient(
    135deg,
    transparent 0 9px,
    rgba(var(--v-theme-on-surface), 0.05) 9px 10px
  );
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgba(var(--v-theme-on-surface), 0.58);
}

.card__tag {
  position: absolute;
  bottom: 10px;
  left: 12px;
  padding: 4px 8px;
  background: rgb(var(--v-theme-surface));
  border: 1px solid var(--fleet-hairline);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: rgb(var(--v-theme-primary));
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  padding: 16px 18px 18px;
}

.card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 10px;
  letter-spacing: 0.12em;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.card__status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
}

.card__status.is-retired .card__dot {
  background: rgba(var(--v-theme-on-surface), 0.35);
}

.card__title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.card__meta {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
  padding-top: 12px;
  border-top: 1px solid var(--fleet-hairline);
}

.card__meta dt {
  font-size: 9px;
  letter-spacing: 0.1em;
}

.card__meta dd {
  margin: 5px 0 0;
  font-size: 11.5px;
  font-weight: 500;
  white-space: nowrap;
}

.card__desc {
  margin: 0;
  flex: 1;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(var(--v-theme-on-surface), 0.62);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__cta {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
  font-size: 10px;
  letter-spacing: 0.14em;
  color: rgb(var(--v-theme-primary));
}

.card__arrow {
  transition: transform 220ms var(--fleet-ease);
}

.card:hover .card__arrow {
  transform: translateX(4px);
}
</style>
