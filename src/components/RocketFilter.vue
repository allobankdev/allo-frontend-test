<template>
  <v-sheet color="transparent" width="300">
    <v-text-field
      v-model="model"
      label="Search Rockets"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      hide-details
      clearable
      persistent-placeholder
      rounded="lg"
      class="search-field"
      placeholder="Try 'Falcon' or 'Starship'"
    ></v-text-field>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const model = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>

<style scoped>
.search-field :deep(.v-field) {
  background-color: rgb(var(--v-theme-surface));
}
</style>
