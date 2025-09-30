<script setup lang="ts">
import { computed } from "vue";
import type { Rocket } from "@/composables/useRocketsStore";

const props = defineProps<{ rocket: Rocket }>();

const costCompact = computed(() => {
  const n = Number(props.rocket.cost_per_launch || 0);
  const c = new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
  return `$${c}`;
});

const img = computed(() => props.rocket.images?.[0] ?? "");

const companyLabel = "SpaceX";
</script>

<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      class="rocket-card"
      :to="`/rockets/${rocket.id}`"
      :elevation="isHovering ? 8 : 3"
    >
      <v-img class="hero" :src="img" :alt="rocket.name" height="190" cover>
        <template #placeholder>
          <div class="ph">
            <v-skeleton-loader type="image" width="100%" height="100%" />
          </div>
        </template>

        <div class="chips">
          <v-chip size="small" label prepend-icon="mdi-earth" variant="elevated">
            {{ rocket.country }}
          </v-chip>
        </div>

        <div class="overlay" :class="{ show: isHovering }">
          <div class="overlay-text">{{ rocket.description }}</div>
        </div>
      </v-img>

      <v-chip class="date" size="small" label prepend-icon="mdi-calendar" variant="elevated">
        {{ rocket.first_flight }}
      </v-chip>

      <v-card-item class="head">
        <v-card-title class="title">{{ rocket.name }}</v-card-title>
        <v-card-subtitle class="subtitle">{{ costCompact }}</v-card-subtitle>
      </v-card-item>

      <v-card-text class="excerpt">
        {{ rocket.description }}
      </v-card-text>

      <v-divider class="divider" />

      <v-card-actions class="actions">
        <div class="price">
          <v-icon class="mr-1">mdi-currency-usd</v-icon>
          <span>{{ costCompact }} / {{ companyLabel }}</span>
        </div>
        <v-spacer />
        <v-btn
          :to="`/rockets/${rocket.id}`"
          size="small"
          variant="tonal"
          append-icon="mdi-arrow-right"
        >
          Details
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<style scoped lang="scss">
$radius: 16px;

@mixin clamp($lines) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rocket-card {
  border-radius: $radius;
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease;

  &:hover { transform: translateY(-2px); }
}

.date { margin-top: 10px; left: 10px; }

.hero {
  border-top-left-radius: $radius;
  border-top-right-radius: $radius;
  position: relative;

  .ph { display: flex; align-items: center; justify-content: center; height: 100%; }

  .chips {
    position: absolute; top: 8px; left: 8px; display: flex; gap: 8px;
    :deep(.v-chip) { backdrop-filter: blur(4px); }
  }

  .overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.2) 40%, transparent 70%);
    opacity: 0; transition: opacity .18s ease;
    display: flex; align-items: flex-end; padding: 12px;

    &.show { opacity: 1; }
    .overlay-text { color: #fff; font-size: .92rem; line-height: 1.35; @include clamp(3); }
  }
}

.head {
  padding-bottom: 6px;
  .title { @include clamp(1); font-weight: 700; }
  .subtitle { opacity: .8; margin-top: 2px; }
}

.excerpt { @include clamp(2); color: rgb(var(--v-theme-on-surface)); opacity: .72; margin-bottom: 10px; }
.divider { opacity: .12; }

.actions {
  display: flex; align-items: center;
  .price { display: inline-flex; align-items: center; gap: 6px; opacity: .8; }
}

@media (hover: none) { .hero .overlay { display: none; } }
</style>
