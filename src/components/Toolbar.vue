<script lang="ts" setup>
import { ref, watch } from "vue";
import { debounce } from "lodash";

const search = ref("");
const emit = defineEmits(["search"]);

const emitSearch = debounce(() => {
  emit("search", search.value);
}, 500);

watch(search, emitSearch);
</script>

<template>
  <div class="d-flex flex-column flex-md-row align-center justify-center justify-md-space-between my-4 ga-4">
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      label="Search..."
      variant="outlined"
      density="compact"
      hide-details
      class="search-filter"
    />

    <div class="d-flex align-center ga-4 flex-wrap justify-center align-center">
      <slot />
    </div>
  </div>
</template>
