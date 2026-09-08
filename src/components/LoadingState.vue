<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <div class="text-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
        width="6"
      />
      <p class="text-body-1 mt-4 text-medium-emphasis">
        {{ message }}
      </p>
    </div>
  </v-container>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Memuat data...',
})
</script>
