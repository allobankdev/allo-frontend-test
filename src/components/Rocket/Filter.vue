<script setup lang="ts">
import { ref, watch } from 'vue';

const model = defineModel<string>('');
const search = ref('');

watch(search, (val) => model.value = val);
</script>

<template>
  <v-text-field
    v-model="search"
    label="Filter Rockets"
    append-icon="mdi-magnify"
    clearable
  />
</template>
