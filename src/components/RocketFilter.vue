<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  search: string;
  country: string;
  countries: string[];
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "update:country", value: string): void;
}>();

const searchModel = computed({
  get: () => props.search,
  set: (val) => emit("update:search", val),
});

const countryModel = computed({
  get: () => props.country,
  set: (val) => emit("update:country", val),
});
</script>

<template>
  <v-row class="mt-4">
    <v-col cols="12" md="8">
      <v-text-field
        v-model="searchModel"
        label="Filter rockets"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </v-col>

    <v-col cols="12" md="4">
      <v-select
        v-model="countryModel"
        :items="countries"
        label="Filter Countries"
        variant="outlined"
        hide-details
      />
    </v-col>
  </v-row>
</template>

<style scoped>
.v-row {
  margin-bottom: 16px;
}
</style>
