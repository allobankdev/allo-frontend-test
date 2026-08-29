<template>
  <v-row :gap="4" class="mb-4" align="start">
    <v-col md="4">
      <v-text-field
        clearable
        label="Label"
        density="compact"
        variant="outlined"
        v-model="filterRocket.name"
      ></v-text-field>
    </v-col>
    <v-col md="4">
      <v-select
        clearable
        density="compact"
        label="Select"
        :items="[
          'California',
          'Colorado',
          'Florida',
          'Georgia',
          'Texas',
          'Wyoming',
        ]"
        variant="outlined"
      ></v-select>
    </v-col>
    <v-col md="2">
      <div class="d-flex ga-4">
        <v-btn
          color="primary"
          @click="
            rocketStore.applyFilter(filterRocket.name, filterRocket.active)
          "
        >
          Search
        </v-btn>
        <v-btn color="primary" variant="outlined" @click="resetFilter">
          Reset
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { useRocketStore } from "../../../store/rocket-store/useRocketStore";

const rocketStore = useRocketStore();
const filterRocket = ref({
  name: "",
  active: null as boolean | null,
});

const resetFilter = () => {
  filterRocket.value = {
    name: "",
    active: null,
  };
  rocketStore.resetFilter();
};
</script>
