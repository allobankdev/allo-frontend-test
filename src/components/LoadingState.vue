<template>
  <div>
    <div class="d-flex justify-center align-center my-8">
      <v-progress-circular indeterminate color="primary" size="48" class="mr-4" />
      <span class="text-h6 text-medium-emphasis">{{ message || 'Loading launcher configurations...' }}</span>
    </div>

    <v-row>
      <v-col v-for="n in 6" :key="n" cols="12" sm="6" md="4">
        <v-skeleton-loader
          class="rounded-lg"
          elevation="1"
          type="image, article, actions"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  message?: string;
}>();
</script>
