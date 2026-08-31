<template>
  <v-dialog v-model="dialog" max-width="600" persistent>
    <v-card rounded="xl" class="pa-2">
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <div class="d-flex align-center gap-2">
          <v-icon color="primary" class="mr-2">mdi-rocket-launch-outline</v-icon>
          <span class="text-h6 font-weight-bold">Add Custom Rocket</span>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog"></v-btn>
      </v-card-title>

      <v-card-text class="px-4 py-2">
        <p class="text-caption text-medium-emphasis mb-4">
          The SpaceDevs API is read-only. Added rockets will appear in the running application state.
        </p>

        <v-form ref="formRef" v-model="isFormValid" @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name *"
            placeholder="e.g. Falcon Heavy Super Heavy"
            variant="outlined"
            density="compact"
            class="mb-3"
            :rules="[v => !!v || 'Rocket name is required']"
          ></v-text-field>

          <v-textarea
            v-model="form.description"
            label="Description (Optional)"
            placeholder="Describe rocket capabilities, stages, and payload specs..."
            variant="outlined"
            density="compact"
            rows="3"
            class="mb-3"
          ></v-textarea>

          <v-text-field
            v-model="form.image_url"
            label="Image URL (Optional)"
            placeholder="https://example.com/rocket.jpg"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-link"
            class="mb-3"
          ></v-text-field>

          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.launch_cost"
                label="Launch Cost USD (Optional)"
                placeholder="e.g. 90,000,000"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-currency-usd"
                @input="onCostInput"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model="form.country_code"
                label="Country Code (Optional)"
                placeholder="e.g. USA, IDN"
                variant="outlined"
                density="compact"
                prepend-inner-icon="mdi-flag-outline"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight Date (Optional)"
            placeholder="YYYY-MM-DD (e.g. 2026-05-15)"
            variant="outlined"
            density="compact"
            prepend-inner-icon="mdi-calendar"
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-4 pb-4 pt-0 justify-end">
        <v-btn variant="tonal" rounded="pill" @click="closeDialog">Cancel</v-btn>
        <v-btn
          color="primary"
          variant="flat"
          rounded="pill"
          prepend-icon="mdi-plus"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', payload: {
    full_name: string
    description?: string
    image_url?: string
    launch_cost?: string
    country_code?: string
    maiden_flight?: string
  }): void
}>()

const formRef = ref<any>(null)
const isFormValid = ref(false)

const dialog = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
})

function onCostInput() {
  if (!form.launch_cost) return
  const rawDigits = form.launch_cost.replace(/[^0-9]/g, '')
  if (rawDigits) {
    const num = parseFloat(rawDigits)
    form.launch_cost = new Intl.NumberFormat('en-US').format(num)
  } else {
    form.launch_cost = ''
  }
}

function closeDialog() {
  dialog.value = false
  resetForm()
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.country_code = ''
  form.maiden_flight = ''
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function handleSubmit() {
  if (!form.full_name) return
  const rawCostDigits = form.launch_cost ? form.launch_cost.replace(/[^0-9]/g, '') : ''
  emit('submit', {
    ...form,
    launch_cost: rawCostDigits ? rawCostDigits : undefined,
  })
  closeDialog()
}
</script>
