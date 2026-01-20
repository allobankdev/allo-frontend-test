<template>
  <div class="d-flex align-center gap-2">
    <span class="text-subtitle-2 text-grey-darken-1 mr-2">Filter:</span>
    <v-btn-toggle
      v-model="selectedFilter"
      mandatory
      color="primary"
      divided
      variant="outlined"
    >
      <v-btn
        :value="null"
        size="small"
      >
        <v-icon start>
          mdi-rocket
        </v-icon>
        All
      </v-btn>
      <v-btn
        :value="true"
        size="small"
      >
        <v-icon start>
          mdi-check-circle
        </v-icon>
        Active
      </v-btn>
      <v-btn
        :value="false"
        size="small"
      >
        <v-icon start>
          mdi-close-circle
        </v-icon>
        Inactive
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRocketStore } from '@/stores'

const store = useRocketStore()

const selectedFilter = computed({
  get: () => store.filterActive,
  set: (value) => store.setFilter(value)
})
</script>
