<script setup lang="ts">
import type { FetchState } from '@/stores/launchers'

withDefaults(
  defineProps<{
    state: FetchState
    error?: string | null
    emptyMessage?: string
    /**
     * Shape of the loading placeholder: 'block' mirrors a detail page
     * (hero image + heading + paragraphs), 'grid' mirrors the rocket
     * card grid on the list page.
     */
    variant?: 'block' | 'grid'
  }>(),
  {
    error: null,
    emptyMessage: 'No items match your filter.',
    variant: 'block',
  },
)

const emit = defineEmits<{ (e: 'retry'): void }>()
</script>

<template>
  <div v-if="state === 'loading' || state === 'idle'">
    <v-skeleton-loader
      v-if="variant === 'block'"
      type="image, heading, paragraph@2"
      class="skeleton-block"
    />
    <v-row v-else>
      <v-col
        v-for="n in 8"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          variant="outlined"
          rounded="lg"
          class="h-100"
        >
          <v-skeleton-loader
            type="image, article, actions"
            class="skeleton-card"
          />
        </v-card>
      </v-col>
    </v-row>
  </div>

  <div
    v-else-if="state === 'error'"
    class="text-center py-12"
  >
    <v-icon
      size="48"
      icon="mdi-alert-circle-outline"
      color="error"
    />
    <p class="mt-4 font-weight-medium">
      Could not load.
    </p>
    <p class="text-medium-emphasis">
      {{ error || 'Unknown error.' }}
    </p>
    <v-btn
      class="mt-4"
      color="primary"
      prepend-icon="mdi-refresh"
      @click="emit('retry')"
    >
      Retry
    </v-btn>
  </div>

  <div
    v-else-if="state === 'success'"
    class="text-center py-12"
  >
    <v-icon
      size="48"
      icon="mdi-rocket-launch"
    />
    <p class="mt-4 text-medium-emphasis">
      {{ emptyMessage || 'No items match your filter.' }}
    </p>
  </div>
</template>

<style scoped>
/* Mirror the real content shapes: 420px hero on the detail page, 180px
   card image on the list grid — the swap from skeleton to data is
   seamless instead of a layout jump. */
.skeleton-block :deep(.v-skeleton-loader__image) {
  height: 420px;
  border-radius: 12px;
}
.skeleton-card :deep(.v-skeleton-loader__image) {
  height: 180px;
}
</style>
