<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    class="h-100 d-flex flex-column"
    hover
    rounded="lg"
  >
    <div class="rocket-card__media">
      <v-img
        v-if="rocket.imageUrl"
        :alt="rocket.fullName"
        :src="rocket.imageUrl"
        cover
        height="180"
      >
        <template #error>
          <div class="rocket-card__fallback">
            <v-icon size="48">
              mdi-rocket-outline
            </v-icon>
          </div>
        </template>
      </v-img>
      <div
        v-else
        class="rocket-card__fallback"
      >
        <v-icon size="48">
          mdi-rocket-outline
        </v-icon>
      </div>
    </div>

    <v-card-item>
      <template #title>
        <div class="d-flex align-center ga-2">
          <span class="text-truncate">{{ rocket.fullName }}</span>
          <v-chip
            v-if="rocket.isLocal"
            color="secondary"
            density="comfortable"
            size="small"
            variant="tonal"
          >
            Local
          </v-chip>
        </div>
      </template>
    </v-card-item>

    <v-card-text class="rocket-card__description flex-grow-1 text-medium-emphasis">
      {{ description }}
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
  import { computed } from "vue";
  import type { Rocket } from "@/types";
  import { displayDescription } from "@/utils";

  const props = defineProps<{
    rocket: Rocket;
  }>();

  const description = computed(() => displayDescription(props.rocket.description));
</script>

<style scoped>
  .rocket-card__media {
    background: rgba(var(--v-theme-surface-variant), 0.35);
  }

  .rocket-card__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 180px;
    color: rgba(var(--v-theme-on-surface), 0.45);
  }

  .rocket-card__description {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    overflow: hidden;
  }
</style>
