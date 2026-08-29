<template>
  <v-container class="fill-height">
    <v-row
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        class="text-center"
      >
        <v-progress-circular
          :size="64"
          :width="6"
          color="primary"
          indeterminate
        />
        <p class="text-h6 mt-4">
          {{ message }}
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  message?: string
}>(), {
  message: 'Loading...',
})
</script>
