<template>
  <v-row>
    <!-- Loop skeleton items to simulate a grid of loading cards -->
    <v-col v-for="n in count" :key="n" cols="12" sm="6" md="4" lg="3">
      <v-skeleton-loader
        type="image, article"
        elevation="2"
        class="rounded-lg"
      ></v-skeleton-loader>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
// Define how many skeleton cards to display
withDefaults(defineProps<{ count?: number }>(), {
  count: 8
})
</script>
