<template>
  <v-container class="py-8">
    <v-row>
      <v-col
        v-for="n in count"
        :key="n"
        cols="12"
        sm="6"
        md="4"
      >
        <v-skeleton-loader
          class="rounded-xl border"
          elevation="2"
          type="image, article, actions"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    count?: number
  }>(),
  {
    count: 6,
  }
)
</script>
