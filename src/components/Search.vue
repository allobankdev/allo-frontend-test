<script setup lang="ts">
import { useSearch } from '@/composables/useSearch'

const { search, setSearch } = useSearch()

</script>


<template>
  <div class="px-4 ">
    <v-text-field
      :model-value="search"
      placeholder="Search Rocket"
      prepend-inner-icon="mdi-magnify"
      density="compact"
      variant="outlined"
      width="200"
      hide-details
      single-line
      @input="setSearch($event.target.value)"
    />
  </div>
</template>

<style>

</style>