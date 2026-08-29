<template>
  <v-card
    rounded="xl"
    variant="flat"
    class="filter-card"
  >
    <v-card-text class="pa-5">
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="localValue.search"
            clearable
            density="comfortable"
            hide-details
            label="Search rocket"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
          />
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-select
            v-model="localValue.status"
            :items="statusItems"
            density="comfortable"
            hide-details
            label="Status"
            variant="outlined"
          />
        </v-col>

        <v-col
          cols="12"
          sm="6"
          md="3"
        >
          <v-select
            v-model="localValue.source"
            :items="sourceItems"
            density="comfortable"
            hide-details
            label="Data Source"
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue'

  export interface RocketFilterValue {
    search: string
    status: 'all' | 'active' | 'inactive'
    source: 'all' | 'api' | 'local'
  }

  const props = defineProps<{
    modelValue: RocketFilterValue
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: RocketFilterValue]
  }>()

  const statusItems = [
    { title: 'All status', value: 'all' },
    { title: 'Active', value: 'active' },
    { title: 'Inactive', value: 'inactive' },
  ]

  const sourceItems = [
    { title: 'All sources', value: 'all' },
    { title: 'SpaceX API', value: 'api' },
    { title: 'Local draft', value: 'local' },
  ]

  const localValue = reactive({ ...props.modelValue })

  watch(
    () => props.modelValue,
    (value) => {
      localValue.search = value.search
      localValue.status = value.status
      localValue.source = value.source
    },
    { deep: true },
  )

  watch(
    localValue,
    (value) => {
      emit('update:modelValue', { ...value })
    },
    { deep: true },
  )
</script>

<style scoped>
  .filter-card {
    border: 1px solid rgba(15, 23, 42, 0.08);
  }
</style>
