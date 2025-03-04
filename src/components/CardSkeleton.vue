<script setup lang="ts">
const props = defineProps({
    total: {
        type: Number,
        default: 4
    }
})
</script>

<template>
  <v-col
    v-for="n in props.total"
    :key="n"
    cols="12"
    md="6"
  >
    <v-skeleton-loader type="card" />
  </v-col>
</template>