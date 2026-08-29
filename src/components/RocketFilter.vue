<template>
  <v-card class="filter-card">
    <v-card-title>Filter Rockets</v-card-title>
    <v-card-text>
      <v-select
        v-model="activeFilter"
        :items="statusOptions"
        label="Status"
        clearable
        @update:model-value="updateFilters"
      ></v-select>

      <v-text-field
        v-model="countryFilter"
        label="Country"
        placeholder="Enter country name"
        clearable
        @update:model-value="updateFilters"
      ></v-text-field>

      <v-btn
        color="error"
        variant="outlined"
        @click="clearFilters"
        block
        class="mt-4"
      >
        Clear Filters
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps<{
  modelValue: {
    active: boolean | null;
    country: string;
  };
}>();

const emit = defineEmits<{
  "update:modelValue": [value: { active: boolean | null; country: string }];
}>();

const statusOptions = [
  { title: "Active", value: true },
  { title: "Inactive", value: false },
];

const activeFilter = ref<boolean | null>(props.modelValue.active);
const countryFilter = ref(props.modelValue.country);

const updateFilters = () => {
  emit("update:modelValue", {
    active: activeFilter.value,
    country: countryFilter.value,
  });
};

const clearFilters = () => {
  activeFilter.value = null;
  countryFilter.value = "";
  updateFilters();
};

watch(
  () => props.modelValue,
  (newVal) => {
    activeFilter.value = newVal.active;
    countryFilter.value = newVal.country;
  }
);
</script>
