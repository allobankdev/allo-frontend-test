<script setup>
import { computed } from "vue";

/**
 * v-model support
 */
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const filter = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});
</script>

<template>
  <v-card class="mb-4 pa-4" elevation="1">
    <v-text-field
      v-model="filter"
      label="Search Rocket"
      prepend-inner-icon="mdi-rocket"
      clearable
      variant="outlined"
    />
  </v-card>
</template>
