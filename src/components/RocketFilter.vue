<template>
  <v-row dense>
    <v-col
      cols="12"
      md="8"
    >
      <v-text-field
        v-model="model.search"
        clearable
        density="comfortable"
        hide-details
        label="Search rockets"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
    >
      <v-select
        v-model="model.country"
        clearable
        density="comfortable"
        hide-details
        :items="countries"
        label="Country"
        variant="outlined"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  import type { RocketFilter } from '@/stores/rocket'

  defineProps<{ countries: string[] }>()
  const model = defineModel<RocketFilter>({ required: true })
</script>

