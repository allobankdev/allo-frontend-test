<template>
  <v-row dense>
    <v-col
      v-for="spec in specs"
      :key="spec.label"
      cols="12"
      sm="4"
    >
      <v-card
        border
        class="fill-height pa-4 d-flex flex-sm-column align-center align-sm-start ga-3"
        rounded="lg"
      >
        <v-avatar
          color="primary"
          rounded="lg"
          size="36"
          variant="tonal"
        >
          <v-icon
            :icon="spec.icon"
            size="20"
          />
        </v-avatar>
        <div>
          <div class="text-caption text-medium-emphasis">
            {{ spec.label }}
          </div>
          <div
            class="text-subtitle-1 font-weight-bold"
            :class="{ 'text-disabled font-italic font-weight-regular': spec.value == null }"
          >
            {{ spec.value ?? 'Not available' }}
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { RocketSpec } from '@/types/rocket'

  defineProps<{
    specs: RocketSpec[]
  }>()
</script>
