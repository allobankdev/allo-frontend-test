<template>
  <v-card
    class="my-6 pa-4 border-line bg-surface"
    variant="outlined"
  >
    <v-row
      align="center"
      no-gutters
    >
      <v-col
        cols="auto"
        class="mr-3"
      >
        <v-icon
          icon="mdi-alert-circle-outline"
          color="primary"
          size="28"
        />
      </v-col>
      <v-col>
        <div class="font-weight-bold text-subtitle-2 text-onSurface mb-1">
          Couldn't load rocket data.
        </div>
        <div class="text-caption text-steel font-mono">
          {{ errorMessage || 'Connection or API endpoint error.' }}
        </div>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          variant="outlined"
          size="small"
          class="text-none font-weight-medium"
          @click="$emit('retry')"
        >
          <v-icon
            icon="mdi-refresh"
            class="mr-1"
            size="16"
          />
          Retry
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage?: string | null
}>()

defineEmits<{
  (e: 'retry'): void
}>()
</script>
