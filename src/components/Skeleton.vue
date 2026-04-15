<template>
  <!-- Loading Skeleton -->
  <v-container v-if="state === 'loading'">
    <!-- Detail skeleton -->
    <v-row v-if="detail">
      <v-col cols="12" md="6">
        <v-skeleton-loader type="image" height="400" />
      </v-col>
      <v-col cols="12" md="6">
        <v-skeleton-loader type="heading" class="mb-4" />
        <v-skeleton-loader type="paragraph" class="mb-6" />
        <v-skeleton-loader type="text" class="mb-3" />
        <v-skeleton-loader type="text" class="mb-3" />
        <v-skeleton-loader type="text" />
      </v-col>
    </v-row>

    <!-- List skeleton -->
    <v-row v-else>
      <v-col
        v-for="n in 4"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
        style="margin-top: -20px;"
      >
        <v-card rounded="lg" color="rgba(255, 255, 255, 0.08)" >
          <v-skeleton-loader type="image" height="200" class="mb-0" />
          <div class="pa-4" style="margin-top: -10px;">
            <v-skeleton-loader type="heading" class="mb-2" />
            <v-skeleton-loader type="text, text, text" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Error -->
  <v-container v-else-if="state === 'error'" class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="auto" class="text-center card__error">
        <v-icon size="64" color="error" class="mb-4">mdi-alert-circle-outline</v-icon>
        <p class="text-h6 mb-2">Something went wrong</p>
        <p class="text-body-2 text-medium-emphasis mb-6">{{ message }}</p>
        <v-btn color="primary" variant="flat" prepend-icon="mdi-refresh" @click="$emit('retry')">
          Retry
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <!-- Success (slot) -->
  <slot v-else-if="state === 'success'" />
</template>

<script lang="ts" setup>
import type { LoadingState } from '@/types'

defineProps<{
  state: LoadingState
  message?: string
  detail?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.card__error {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  letter-spacing: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}
</style>
