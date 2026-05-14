<template>
  <v-row justify="center" align="center" class="my-10">
    <v-col cols="12" class="text-center">
      <v-progress-circular indeterminate color="primary" size="64" />
      <p v-if="message" class="mt-4 text-body-1 text-medium-emphasis">
        {{ message }}
      </p>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
defineProps<{
  message?: string;
}>();
</script>
