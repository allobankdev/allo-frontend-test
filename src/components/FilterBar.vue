<template>
  <v-row
    align="center"
    class="my-4"
    no-gutters
  >
    <v-col class="mr-3">
      <v-text-field
        v-model="query"
        placeholder="Filter by rocket name..."
        prepend-inner-icon="mdi-magnify"
        hide-details
        clearable
        variant="outlined"
        density="comfortable"
        class="font-mono text-body-2"
        @update:model-value="onUpdate"
      />
    </v-col>
    <v-col cols="auto">
      <v-btn
        color="primary"
        variant="flat"
        size="large"
        class="text-none font-weight-medium px-4"
        @click="$emit('open-add-dialog')"
      >
        <v-icon
          icon="mdi-plus"
          class="mr-1"
        />
        Add rocket
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'open-add-dialog'): void
}>()

const query = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    query.value = newVal
  }
)

function onUpdate(val: string | null) {
  emit('update:modelValue', val || '')
}
</script>
