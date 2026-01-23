<script setup lang="ts">
const modelValue = defineModel<string>();

const emitOpenCreateModal = defineEmits<{ (e: "openCreateModal"): void }>();
</script>

<template>
  <v-text-field
    v-model="modelValue"
    placeholder="Search rockets..."
    variant="outlined"
    density="comfortable"
    rounded="xl"
    hide-details
    prepend-inner-icon="mdi-magnify"
    class="search-field my-4"
  />
  <v-btn
    rounded="xl"
    class="mb-4"
    @click="emitOpenCreateModal('openCreateModal')"
  >
    Add Rocket
    <v-icon end icon="mdi-plus-circle" />
  </v-btn>
</template>
