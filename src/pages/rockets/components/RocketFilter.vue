<template>
  <v-card class="mb-6">
    <v-card-title>Filters</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            :model-value="searchName"
            label="Search by name"
            prepend-inner-icon="mdi-magnify"
            clearable
            variant="outlined"
            density="compact"
            @update:model-value="$emit('update:searchName', $event)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-select
            :model-value="filterStatus"
            :items="statusOptions"
            label="Status"
            variant="outlined"
            density="compact"
            @update:model-value="$emit('update:filterStatus', $event)"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn block color="primary" @click="$emit('clear')">Clear Filters</v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  searchName: string;
  filterStatus: string;
  statusOptions: Array<{ title: string; value: string }>;
}

defineProps<Props>();

defineEmits<{
  'update:searchName': [value: string];
  'update:filterStatus': [value: string];
  clear: [];
}>();
</script>
