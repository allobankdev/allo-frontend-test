<script setup lang="ts">
/**
 * RocketCardSkeleton.vue
 *
 * Loading placeholder that mirrors RocketCard's layout, so the grid does not
 * jump when the data arrives.
 */

withDefaults(defineProps<{ count?: number }>(), {
  count: 1,
})
</script>

<template>
  <v-row>
    <v-col
      v-for="index in count"
      :key="index"
      cols="12"
      md="4"
      sm="6"
    >
      <v-card
        class="h-100"
        elevation="2"
      >
        <v-skeleton-loader type="image" />
        <v-card-item>
          <v-skeleton-loader type="subtitle" />
        </v-card-item>
        <v-card-text>
          <v-skeleton-loader type="text@3" />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>
