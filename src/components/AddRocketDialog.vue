<template>
  <v-dialog v-model="model" max-width="640" scrollable>
    <v-card>
      <v-card-title class="d-flex align-center pa-6 pb-2">
        <v-icon icon="mdi-plus-circle-outline" color="primary" class="mr-3" />
        Add a rocket
      </v-card-title>

      <v-card-subtitle class="px-6 pb-4 text-wrap">
        This rocket is stored in the running app only. The Launch Library API is read-only.
      </v-card-subtitle>

      <RocketForm :key="formKey" @submit="handleSubmit" @cancel="model = false" />
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import RocketForm from '@/components/RocketForm.vue'
import type { NewRocketInput } from '@/types/rocket'

const model = defineModel<boolean>({ default: false })

const emit = defineEmits<{
  submit: [input: NewRocketInput]
}>()

const formKey = ref(0)

watch(model, (isOpen) => {
  if (isOpen) formKey.value += 1
})

function handleSubmit(input: NewRocketInput) {
  emit('submit', input)
  model.value = false
}
</script>
