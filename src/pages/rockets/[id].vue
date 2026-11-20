<template>
  <div class="u-container detail">
    <router-link
      to="/"
      class="back u-mono"
    >
      <span aria-hidden="true">←</span> Fleet index
    </router-link>

    <LoadingState
      v-if="store.loading"
      variant="detail"
    />

    <ErrorState
      v-else-if="store.error"
      :message="store.error"
      @retry="loadRocketDetail"
    />

    <article
      v-else-if="rocket"
      class="detail__grid"
    >
      <div class="detail__media">
        <v-img
          v-if="rocket.image_url"
          :src="rocket.image_url"
          :alt="name"
          class="detail__img"
          cover
        >
          <template #error>
            <div class="detail__media-empty">
              <span class="u-mono">IMAGE UNAVAILABLE</span>
            </div>
          </template>
        </v-img>
        <div
          v-else
          class="detail__media-empty"
        >
          <span class="u-mono">NO IMAGE IN ARCHIVE</span>
        </div>

        <div class="detail__caption u-mono">
          <span
            class="detail__status"
            :class="{ 'is-retired': rocket.active === false }"
          >
            <span class="detail__dot" />
            {{ statusLabel }}
          </span>
          <span v-if="rocket.is_custom">Custom entry</span>
        </div>
      </div>

      <div class="detail__data">
        <p class="u-label">
          Configuration dossier
        </p>
        <h1>{{ name }}</h1>
        <p class="detail__desc">
          {{ rocket.description || 'No description has been documented for this configuration.' }}
        </p>

        <dl class="specs">
          <div
            v-for="spec in specs"
            :key="spec.label"
          >
            <dt class="u-label">
              {{ spec.label }}
            </dt>
            <dd class="u-mono">
              {{ spec.value }}
            </dd>
          </div>
        </dl>

        <p
          v-if="rocket.is_custom"
          class="detail__note"
        >
          This configuration was added locally and is not part of the Launch
          Library dataset.
        </p>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useRocketStore } from '@/stores/rocketStore';
import type { Manufacturer } from '@/types/rocket';

const route = useRoute();
const store = useRocketStore();

const rocket = computed(() => store.selectedRocket);
const name = computed(
  () => rocket.value?.full_name || rocket.value?.name || 'Unnamed configuration'
);

const statusLabel = computed(() => {
  if (rocket.value?.active === true) return 'Active configuration';
  if (rocket.value?.active === false) return 'Retired configuration';
  return 'Status not disclosed';
});

const specs = computed(() => {
  const vehicle = rocket.value;
  if (!vehicle) return [];

  return [
    { label: 'Cost per launch', value: formatCost(vehicle.launch_cost) },
    { label: 'Country', value: displayCountry(vehicle.manufacturer) },
    { label: 'First flight', value: displayFlightDate(vehicle.maiden_flight) },
    { label: 'Manufacturer', value: vehicle.manufacturer?.name || 'Not disclosed' },
    { label: 'Height', value: vehicle.length ? `${vehicle.length} m` : 'Not disclosed' },
    { label: 'Diameter', value: vehicle.diameter ? `${vehicle.diameter} m` : 'Not disclosed' },
    {
      label: 'LEO payload',
      value: vehicle.leo_capacity
        ? `${vehicle.leo_capacity.toLocaleString('en-US')} kg`
        : 'Not disclosed',
    },
    {
      label: 'Total launches',
      value: vehicle.total_launch_count ?? 'Not disclosed',
    },
    {
      label: 'Successful launches',
      value: vehicle.successful_launches ?? 'Not disclosed',
    },
  ];
});

onMounted(() => {
  loadRocketDetail();
});

onUnmounted(() => {
  document.title = 'SpaceX Fleet — Launch Archive';
});

watch(
  rocket,
  (vehicle) => {
    if (vehicle) {
      document.title = `${vehicle.full_name || vehicle.name} — SpaceX Fleet`;
    }
  },
  { immediate: true }
);

function loadRocketDetail() {
  const id = route.params.id as string;
  if (id) {
    store.fetchRocketDetail(id);
  }
}

function formatCost(cost?: string | number | null): string {
  if (cost === undefined || cost === null || cost === '' || cost === '0') {
    return 'Not disclosed';
  }
  const parsed = Number(cost);
  if (Number.isNaN(parsed)) return String(cost);
  return `$${parsed.toLocaleString('en-US')}`;
}

function displayCountry(manufacturer?: Manufacturer | null): string {
  const code = manufacturer?.country_code || manufacturer?.country;
  if (!code) return 'Not disclosed';
  return Array.isArray(code) ? code.join(', ') : code;
}

function displayFlightDate(dateValue?: string | null): string {
  if (!dateValue) return 'Not disclosed';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return 'Not disclosed';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
</script>

<style scoped>
.detail {
  padding-block: clamp(24px, 4vw, 40px) clamp(40px, 6vw, 80px);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: clamp(20px, 3vw, 32px);
  font-size: 10.5px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  color: rgba(var(--v-theme-on-surface), 0.62);
}

.back:hover {
  color: rgb(var(--v-theme-primary));
}

.detail__grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr);
  gap: clamp(24px, 5vw, 64px);
  align-items: start;
}

.detail__media {
  position: sticky;
  top: 88px;
  border: 1px solid var(--fleet-hairline);
  background: rgb(var(--v-theme-surface-variant));
  overflow: hidden;
}

.detail__img,
.detail__media-empty {
  aspect-ratio: 4 / 3;
  width: 100%;
}

.detail__media-empty {
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

.detail__caption {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid var(--fleet-hairline);
  font-size: 10px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.detail__status {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.detail__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
}

.detail__status.is-retired .detail__dot {
  background: rgba(var(--v-theme-on-surface), 0.35);
}

.detail__data h1 {
  margin: 14px 0 20px;
  font-size: clamp(30px, 4.4vw, 52px);
  font-weight: 600;
  line-height: 0.98;
  letter-spacing: -0.035em;
}

.detail__desc {
  margin: 0;
  max-width: 65ch;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(var(--v-theme-on-surface), 0.72);
}

.specs {
  margin: 28px 0 0;
  border-top: 1px solid var(--fleet-hairline);
}

.specs > div {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: baseline;
  gap: 16px;
  padding: 11px 0;
  border-bottom: 1px solid var(--fleet-hairline);
}

.specs dt {
  font-size: 9.5px;
  letter-spacing: 0.12em;
}

.specs dd {
  margin: 0;
  font-size: 12px;
  text-align: right;
}

.detail__note {
  margin: 20px 0 0;
  padding-left: 12px;
  border-left: 2px solid rgb(var(--v-theme-primary));
  font-size: 12.5px;
  line-height: 1.6;
  color: rgba(var(--v-theme-on-surface), 0.62);
}

@media (max-width: 900px) {
  .detail__grid {
    grid-template-columns: 1fr;
  }

  .detail__media {
    position: static;
  }
}
</style>
