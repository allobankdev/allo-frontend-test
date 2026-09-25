<template>
  <v-row dense>
    <v-col
      cols="12"
      md="8"
      sm="7"
    >
      <v-text-field
        v-model="search"
        bg-color="surface"
        clearable
        hide-details
        placeholder="Search by name or description"
        prepend-inner-icon="mdi-magnify"
      />
    </v-col>
    <v-col
      cols="12"
      md="4"
      sm="5"
    >
      <v-select
        v-model="country"
        bg-color="surface"
        clearable
        hide-details
        :items="countries"
        placeholder="All countries"
        prepend-inner-icon="mdi-flag-outline"
      />
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
  defineProps<{
    countries: string[]
  }>()

  const search = defineModel<string>('search', {
    required: true,
    // `clearable` sets the value to null; keep the model a string.
    set: value => value ?? '',
  })
  const country = defineModel<string | null>('country', { required: true })
</script>
