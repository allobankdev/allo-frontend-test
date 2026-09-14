<template>
  <v-row
    class="mb-2"
    dense
  >
    <v-col
      cols="12"
      md="5"
    >
      <v-text-field
        :model-value="search"
        clearable
        hide-details
        label="Search rockets"
        prepend-inner-icon="mdi-magnify"
        @update:model-value="emit('update:search', $event ?? '')"
      />
    </v-col>
    <v-col
      cols="6"
      md="3"
    >
      <v-select
        :model-value="family"
        hide-details
        :items="familyOptions"
        label="Family"
        @update:model-value="emit('update:family', $event ?? 'all')"
      />
    </v-col>
    <v-col
      cols="6"
      md="2"
    >
      <v-select
        :model-value="status"
        hide-details
        :items="statusOptions"
        label="Status"
        @update:model-value="emit('update:status', $event ?? 'all')"
      />
    </v-col>
    <v-col
      cols="12"
      md="2"
      class="d-flex align-center"
    >
      <v-btn
        block
        color="primary"
        prepend-icon="mdi-plus"
        @click="emit('open-add')"
      >
        Add rocket
      </v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { RocketStatusFilter } from '@/types/rocket'

const props = withDefaults(defineProps<{
  search?: string
  family?: string
  status?: RocketStatusFilter
  families?: string[]
}>(), {
  search: '',
  family: 'all',
  status: 'all',
  families: () => [],
})

const emit = defineEmits<{
  'update:search': [value: string]
  'update:family': [value: string]
  'update:status': [value: RocketStatusFilter]
  'open-add': []
}>()

const familyOptions = computed(() => [
  { title: 'All families', value: 'all' },
  ...props.families.map(name => ({ title: name, value: name })),
])

const statusOptions = [
  { title: 'All statuses', value: 'all' },
  { title: 'Active', value: 'active' },
  { title: 'Inactive', value: 'inactive' },
]
</script>
