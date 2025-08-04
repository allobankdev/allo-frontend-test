<template>
  <v-text-field
    v-model="filter"
    label="Filter rockets by name"
    @input="$emit('filter', filter)"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
const filter = ref("");
</script>
