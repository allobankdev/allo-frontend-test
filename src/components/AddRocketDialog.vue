<template>
  <v-dialog
    :model-value="modelValue"
    :fullscreen="mobile"
    max-width="480"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>Add a rocket</v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field v-model="form.fullName" label="Name" required class="mb-2" />
          <v-textarea v-model="form.description" label="Description" rows="2" class="mb-2" />
          <v-text-field v-model="form.imageUrl" label="Image URL" class="mb-2" />
          <v-text-field v-model="form.launchCost" label="Cost per launch (USD)" type="number" class="mb-2" />
          <v-text-field v-model="form.countryCode" label="Country code" class="mb-2" />
          <v-text-field v-model="form.maidenFlight" label="First flight" type="date" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn @click="emit('update:modelValue', false)">Cancel</v-btn>
        <v-btn color="primary" :disabled="!form.fullName.trim()" @click="handleSubmit">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useDisplay } from 'vuetify'
import type { Rocket } from '@/types/rocket'

defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [rocket: Omit<Rocket, 'id' | 'isLocal'>]
}>()

const { mobile } = useDisplay()

const form = reactive({
  fullName: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  countryCode: '',
  maidenFlight: '',
})

function handleSubmit() {
  if (!form.fullName.trim()) return

  emit('submit', {
    fullName: form.fullName.trim(),
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    launchCost: form.launchCost ? Number(form.launchCost) : null,
    countryCode: form.countryCode.trim() || null,
    maidenFlight: form.maidenFlight.trim() || null,
  })
}
</script>