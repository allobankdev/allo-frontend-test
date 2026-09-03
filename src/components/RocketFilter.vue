<template>
  <div class="mb-4">
    <v-row dense>
      <v-col cols="12">
        <v-text-field
          :model-value="modelValue.query"
          label="Filter rockets by name"
          prepend-inner-icon="mdi-magnify"
          :density="density"
          clearable
          hide-details
          @update:model-value="update({ query: $event ?? '' })"
        />
      </v-col>
    </v-row>

    <v-row
      dense
      class="mt-1"
    >
      <v-col cols="6">
        <v-select
          :model-value="modelValue.families"
          label="Family"
          :items="families"
          :density="density"
          multiple
          clearable
          chips
          hide-details
          @update:model-value="update({ families: $event })"
        />
      </v-col>

      <v-col cols="6">
        <v-select
          :model-value="modelValue.activeOnly"
          label="Status"
          :items="statusOptions"
          item-title="label"
          item-value="value"
          :density="density"
          hide-details
          @update:model-value="update({ activeOnly: $event })"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDisplay } from 'vuetify'

export interface RocketFilterValue {
  query: string
  families: string[]
  activeOnly: boolean
}

const props = defineProps<{
  modelValue: RocketFilterValue
  families: string[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RocketFilterValue]
}>()

const { mobile } = useDisplay()
const density = computed(() => mobile.value ? 'compact' : 'comfortable')

const statusOptions = [
  { label: 'All', value: false },
  { label: 'Active only', value: true },
]

function update(patch: Partial<RocketFilterValue>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}
</script>