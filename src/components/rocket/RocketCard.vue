<template>
  <v-card
    :to="`/rockets/${rocket.id}`"
    rounded="lg"
    class="hig-card"
    elevation="0"
    border
  >
    <v-img
      v-if="rocket.image_url"
      :src="rocket.image_url"
      height="200"
      cover
      class="hig-card-img"
      :alt="rocket.full_name"
    >
      <template #placeholder>
        <v-skeleton-loader type="image" height="200" />
      </template>
      <template #error>
        <div class="hig-img-fallback" aria-hidden="true">
          <v-icon size="48" color="tertiary-label">mdi-rocket-launch-outline</v-icon>
        </div>
      </template>
    </v-img>
    <div v-else class="hig-img-fallback" aria-hidden="true">
      <v-icon size="48" color="tertiary-label">mdi-rocket-launch-outline</v-icon>
    </div>

    <v-card-item class="hig-card-content">
      <v-card-title class="hig-headline">
        {{ rocket.full_name }}
      </v-card-title>
      <v-card-subtitle class="hig-subhead hig-clamp-2">
        {{ rocket.description ?? 'No description available.' }}
      </v-card-subtitle>
    </v-card-item>
  </v-card>
</template>

<script setup lang="ts">
import type { Rocket } from '@/types/rocket'

defineProps<{ rocket: Rocket }>()
</script>

<style scoped>
.hig-card {
  width: 100% !important;
  height: 100% !important;
  display: flex !important;
  flex-direction: column !important;
  background: var(--hig-bg-primary);
  border-color: var(--hig-separator) !important;
  border-width: 0.5px !important;
  transition: transform var(--hig-duration-fast) var(--hig-easing),
              box-shadow var(--hig-duration-fast) var(--hig-easing);
  font-family: var(--hig-font-stack);
  cursor: pointer;
}

.hig-card:active {
  transform: scale(0.97);
}

.hig-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
}

.hig-card-img {
  height: 200px !important;
  min-height: 200px !important;
  max-height: 200px !important;
  width: 100% !important;
  flex-shrink: 0 !important;
}

.hig-img-fallback {
  height: 200px !important;
  min-height: 200px !important;
  max-height: 200px !important;
  width: 100% !important;
  flex-shrink: 0 !important;
  background: var(--hig-bg-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.v-card-item) {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  padding: var(--hig-space-md) !important;
}

:deep(.v-card-item__content) {
  flex: 1 1 auto !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: flex-start !important;
  width: 100% !important;
}

:deep(.v-card-title.hig-headline),
.hig-headline {
  font-size: var(--hig-headline-size) !important;
  font-weight: var(--hig-headline-weight) !important;
  line-height: var(--hig-headline-lh) !important;
  color: var(--hig-label) !important;
  white-space: normal !important;
  font-family: var(--hig-font-stack);
  letter-spacing: -0.2px;
  margin-bottom: var(--hig-space-xs) !important;
  padding: 0 !important;
}

:deep(.v-card-subtitle.hig-subhead),
.hig-subhead {
  font-size: var(--hig-subhead-size) !important;
  font-weight: var(--hig-subhead-weight) !important;
  line-height: 20px !important;
  height: 40px !important;
  min-height: 40px !important;
  max-height: 40px !important;
  color: var(--hig-secondary-label) !important;
  white-space: normal !important;
  opacity: 1 !important;
  font-family: var(--hig-font-stack);
  padding: 0 !important;
}

.hig-clamp-2 {
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}
</style>
