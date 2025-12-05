<script setup lang="ts">
defineProps<{
  title?: string
  message?: string
  icon?: string
}>()
</script>

<template>
  <div class="d-flex flex-column align-center justify-center text-center py-10">
    <v-icon
      :color="'grey'"
      size="64"
    >
      {{ icon || 'mdi-database-off' }}
    </v-icon>
    <h3 class="mt-4 text-h6 font-weight-bold">
      {{ title || 'No Data Available' }}
    </h3>
    <p class="mt-2 text-body-2 text-grey">
      {{ message || 'Please try again later.' }}
    </p>
  </div>
</template>
