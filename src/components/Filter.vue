<script setup lang="ts">
import {useFilterStore} from "@/store/FiilterStore";

const filterStore = useFilterStore();
</script>

<template>
  <v-container>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>Filter</v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-row dense no-gutters>
            <v-col cols="2" class="pa-1">
              <v-checkbox label="Active" v-model="filterStore.filter.optionA" />
            </v-col>
            <v-col cols="2" md="3" sm="6"  class="pa-1">
              <v-checkbox label="Non-Active" v-model="filterStore.filter.optionB" />
            </v-col>
            <v-col cols="2" md="3" sm="6" class="pa-1">
              <v-checkbox label="Low Cost" v-model="filterStore.filter.optionC" />
            </v-col>
            <v-col cols="2" md="3" sm="6" class="pa-1">
              <v-checkbox label="Only US" v-model="filterStore.filter.optionD" />
            </v-col>
            <v-col cols="2" md="3" sm="6" class="pa-1">
              <v-checkbox label="Success Rate 100%" v-model="filterStore.filter.optionE" />
            </v-col>
            <v-col cols="2" md="3" sm="6" class="pa-1">
              <v-checkbox label="Fail" v-model="filterStore.filter.optionF" />
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<style scoped>

</style>
