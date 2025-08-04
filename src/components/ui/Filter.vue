<script lang="ts" setup>
import { computed } from "vue";

interface Props {
  modelValue: string;
}

interface Emits {
  (e: "update:modelValue", value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const sortOptions = [
  { title: "Newest", value: "newest" },
  { title: "Ascending By Name", value: "asc" },
  { title: "Descending By Name", value: "desc" },
];

const selectedValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>

<template>
  <v-select
    v-model="selectedValue"
    :items="sortOptions"
    label="Sort by"
    variant="outlined"
    hide-details
  />
</template>
