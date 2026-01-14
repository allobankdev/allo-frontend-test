<template>
  <v-form v-show="true" class="mt-4">
    <v-container>
      <v-row>
        <v-col>
          <v-text-field v-model="filter.search" label="Search" clearable></v-text-field>
        </v-col>
        <v-col>
          <v-autocomplete v-model="filter.country" clearable label="Country" :items="rocket.countries"></v-autocomplete>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import {useFilterStore} from '@/stores/useFilterStore'
import {useRocketStore} from '@/stores/useRocketStore'

const filter = useFilterStore()
const rocket = useRocketStore()
</script>
