<template>
  <v-card variant="outlined" class="mb-4">
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            :model-value="modelValue"
            label="Search rockets"
            placeholder="Search by name or description..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            clearable
            hide-details
            @update:model-value="handleInput"
          >
            <template #append-inner>
              <v-chip
                v-if="resultCount !== null"
                size="small"
                color="primary"
                variant="flat"
              >
                {{ resultCount }} {{ resultCount === 1 ? 'result' : 'results' }}
              </v-chip>
            </template>
          </v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  resultCount?: number | null
}

interface Emit {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  resultCount: null
})

const emit = defineEmits<Emit>()

function handleInput(value: string | null) {
  emit('update:modelValue', value || '')
}
</script>
