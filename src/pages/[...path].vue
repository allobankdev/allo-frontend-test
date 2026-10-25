<template>
  <v-container class="py-12">
    <v-row justify="center">
      <v-col
        class="text-center"
        cols="12"
        sm="8"
        md="6"
      >
        <v-icon
          color="disabled"
          icon="mdi-compass-off-outline"
          size="64"
        />
        <h1 class="text-h5 mt-4">
          Page not found
        </h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          The page you're looking for doesn't exist.
        </p>
        <v-btn
          class="mt-4"
          color="primary"
          prepend-icon="mdi-home"
          to="/"
          variant="flat"
        >
          Back to rocket list
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
  import { useDocumentTitle } from '@/composables/useDocumentTitle'

  useDocumentTitle('Page not found')
</script>
