<script setup lang="ts">
/** Skeletons shaped like the final content, so nothing jumps when data arrives. */
withDefaults(defineProps<{
  variant?: 'grid' | 'detail'
  count?: number
}>(), {
  variant: 'grid',
  count: 8,
})
</script>

<template>
  <div
    aria-busy="true"
    aria-live="polite"
  >
    <span class="d-sr-only">Loading rockets…</span>

    <v-row v-if="variant === 'grid'">
      <v-col
        v-for="n in count"
        :key="n"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-skeleton-loader
          class="rounded-lg"
          color="surface"
          type="image, heading, paragraph, divider, text"
        />
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col
        cols="12"
        md="6"
      >
        <v-skeleton-loader
          class="rounded-lg"
          color="surface"
          height="360"
          type="image"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-skeleton-loader
          color="background"
          type="chip, heading, paragraph, paragraph, table-row-divider@3"
        />
      </v-col>
    </v-row>
  </div>
</template>
