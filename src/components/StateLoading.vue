<template>
  <div class="text-center py-16 px-4">
    <v-progress-circular
      indeterminate
      color="primary"
      size="72"
      width="6"
      class="mb-6"
    />
    <h3 class="text-h5 font-weight-bold mb-2">
      {{ title }}
    </h3>
    <p class="text-body-1 text-medium-emphasis">
      {{ subtitle }}
    </p>

    <!-- Skeleton preview cards -->
    <v-row
      class="mt-8 justify-center"
      dense
    >
      <v-col
        v-for="i in 3"
        :key="i"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          type="image, article, actions"
          elevation="2"
          class="rounded-xl"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
  }>(),
  {
    title: 'Loading Rockets...',
    subtitle: 'Fetching SpaceX launch vehicles data from Launch Library 2',
  }
)
</script>
