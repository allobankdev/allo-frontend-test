<template>
  <div class="filter-wrapper">
    <v-text-field
      v-model="search"
      label="Search rockets"
      placeholder="Search by name, description, or country..."
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      density="comfortable"
      hide-details
      clearable
      @click:clear="clearSearch"
    />
  </div>
</template>

<script setup lang="ts">
const search = defineModel<string>({ required: true });

function clearSearch() {
  search.value = "";
}
</script>

<style scoped>
.filter-wrapper {
  width: 100%;
  max-width: 520px;
}
</style>
