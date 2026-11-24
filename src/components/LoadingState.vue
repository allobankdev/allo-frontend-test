<template>
  <div
    class="py-6"
    role="status"
  >
    <p class="text-body-2 text-medium-emphasis mb-4">
      {{ label }}
    </p>
    <v-row>
      <v-col
        v-for="item in 4"
        :key="item"
        cols="12"
        lg="3"
        md="4"
        sm="6"
      >
        <v-skeleton-loader
          class="rounded-lg"
          elevation="2"
          type="card"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    label?: string
  }>(),
  {
    label: 'Loading...',
  },
)
</script>
