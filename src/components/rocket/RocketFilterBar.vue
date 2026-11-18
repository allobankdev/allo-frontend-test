<script lang="ts" setup>
import type { StatusFilter } from '@/stores/rockets'

const search = defineModel<string>('search', { required: true })
const status = defineModel<StatusFilter>('status', { required: true })
</script>

<template>
  <v-row
    dense
    align="center"
  >
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        v-model="search"
        label="Search rockets"
        placeholder="Falcon, Starship, ..."
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        density="comfortable"
        hide-details
        clearable
      />
    </v-col>

    <v-col
      cols="12"
      md="6"
    >
      <div class="d-flex align-center ga-3 flex-wrap">
        <span class="text-caption text-medium-emphasis">Status</span>
        <v-btn-toggle
          v-model="status"
          mandatory
          divided
          variant="outlined"
          density="comfortable"
        >
          <v-btn
            value="all"
            size="small"
          >
            All
          </v-btn>
          <v-btn
            value="active"
            size="small"
          >
            Active
          </v-btn>
          <v-btn
            value="retired"
            size="small"
          >
            Retired
          </v-btn>
        </v-btn-toggle>
      </div>
    </v-col>
  </v-row>
</template>
