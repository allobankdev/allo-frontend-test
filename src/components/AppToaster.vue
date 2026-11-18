<script lang="ts" setup>
import { TOAST_ICONS, useToast } from '@/hooks/useToast'

const { toasts } = useToast()
</script>

<template>
  <v-snackbar-queue
    v-model="toasts"
    location="bottom right"
    closable
  >
    <template #text="{ item }">
      <div class="d-flex align-center ga-2">
        <v-icon
          :icon="TOAST_ICONS[item.color]"
          size="20"
        />
        <span>{{ item.text }}</span>
      </div>
    </template>
  </v-snackbar-queue>
</template>
