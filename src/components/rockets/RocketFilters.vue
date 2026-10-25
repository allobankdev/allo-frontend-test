<template>
  <v-row align="center">
    <v-col
      cols="12"
      sm="7"
    >
      <v-text-field
        :model-value="search"
        label="Cari roket berdasarkan nama atau deskripsi..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
        @update:model-value="(value) => emit('update:search', value ?? '')"
      />
    </v-col>

    <v-col
      cols="12"
      sm="5"
    >
      <v-select
        :model-value="family"
        :items="familyItems"
        label="Filter keluarga roket"
        prepend-inner-icon="mdi-filter-variant"
        variant="outlined"
        density="comfortable"
        clearable
        hide-details
        @update:model-value="(value) => emit('update:family', value ?? null)"
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  search: string
  family: string | null
  families: string[]
}>()

const emit = defineEmits<{
  'update:search': [value: string]
  'update:family': [value: string | null]
}>()

const familyItems = computed(() => props.families.map((family) => ({ title: family, value: family })))
</script>
