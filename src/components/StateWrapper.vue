<script lang="ts" setup>
import type { LoadStatus } from '@/stores/rockets'

withDefaults(
    defineProps<{
        status: LoadStatus
        error?: string
        skeletonCount?: number
    }>(),
    {
        error: '',
        skeletonCount: 3,
    },
)

const emit = defineEmits<{
    retry: []
}>()
</script>

<template>
  <!-- Loading -->
  <div
    v-if="status === 'idle' || status === 'loading'"
    class="state-wrapper"
  >
    <v-row>
      <v-col
        v-for="index in skeletonCount"
        :key="index"
        cols="12"
        sm="6"
        lg="4"
      >
        <v-skeleton-loader type="image, article" />
      </v-col>
    </v-row>
  </div>

  <!-- Error + retry -->
  <v-alert
    v-else-if="status === 'error'"
    type="error"
    variant="tonal"
    class="my-2"
  >
    <div class="d-flex flex-wrap align-center justify-space-between ga-4">
      <span>{{ error || 'Something went wrong while loading data.' }}</span>
      <v-btn
        color="error"
        variant="flat"
        prepend-icon="mdi-refresh"
        @click="emit('retry')"
      >
        Retry
      </v-btn>
    </div>
  </v-alert>

  <!-- Success -->
  <template v-else>
    <slot />
  </template>
</template>
