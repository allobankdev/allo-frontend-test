<template>
  <div class="py-12 text-center">
    <v-progress-circular
      indeterminate
      color="amber"
      size="64"
      width="6"
      class="mb-4"
    />
    <h3 class="text-h6 font-weight-medium text-grey-lighten-1">
      {{ message }}
    </h3>
    <p class="text-caption text-grey-darken-1 mt-1">
      Connecting to Launch Library 2 API...
    </p>

    <!-- Skeleton preview cards for smooth visual perception -->
    <v-row
      class="mt-8"
      dense
    >
      <v-col
        v-for="n in count"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          class="rounded-lg"
          type="image, article, actions"
          elevation="2"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    message?: string
    count?: number
  }>(),
  {
    message: 'Loading SpaceX rockets...',
    count: 6,
  }
)
</script>
