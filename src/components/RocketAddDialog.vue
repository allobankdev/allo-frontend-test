<template>
  <v-dialog
    v-model="isOpen"
    max-width="600px"
    persistent
  >
    <v-card class="rounded-xl">
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-6">
        <div class="d-flex align-center ga-2">
          <v-icon
            color="primary"
            icon="mdi-rocket-launch"
          />
          <span class="text-h6 font-weight-bold">Add Custom Rocket</span>
        </div>
        <v-btn
          density="comfortable"
          icon="mdi-close"
          variant="text"
          @click="closeModal"
        />
      </v-card-title>

      <v-divider />

      <v-form
        ref="formRef"
        v-model="isFormValid"
        @submit.prevent="handleSubmit"
      >
        <v-card-text class="px-6 py-4">
          <v-row dense>
            <!-- Rocket Full Name -->
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                density="comfortable"
                label="Rocket Name *"
                placeholder="e.g. Starship V3 Super Heavy"
                prepend-inner-icon="mdi-format-title"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                auto-grow
                density="comfortable"
                label="Description"
                placeholder="Details regarding configuration, payload capacity, and mission history..."
                prepend-inner-icon="mdi-text"
                rows="3"
                variant="outlined"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                density="comfortable"
                label="Image URL"
                placeholder="https://example.com/rocket.jpg"
                prepend-inner-icon="mdi-image"
                variant="outlined"
              />
            </v-col>

            <!-- Launch Cost -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                density="comfortable"
                label="Cost Per Launch (USD)"
                placeholder="e.g. 50000000"
                prepend-inner-icon="mdi-currency-usd"
                type="number"
                variant="outlined"
              />
            </v-col>

            <!-- Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                density="comfortable"
                label="Country Code"
                maxlength="5"
                placeholder="e.g. USA, IDN, ESA"
                prepend-inner-icon="mdi-earth"
                variant="outlined"
              />
            </v-col>

            <!-- Maiden Flight Date -->
            <v-col cols="12">
              <v-text-field
                v-model="form.maiden_flight"
                density="comfortable"
                label="First Flight Date"
                prepend-inner-icon="mdi-calendar"
                type="date"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="px-6 py-4 bg-surface-light d-flex justify-end ga-2">
          <v-btn
            variant="text"
            @click="closeModal"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            prepend-icon="mdi-plus"
            type="submit"
            variant="flat"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRockets } from '@/composables/useRockets'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'rocket-added', id: string | number): void
}>()

const { addRocket } = useRockets()

const isOpen = ref(props.modelValue)
watch(() => props.modelValue, val => {
  isOpen.value = val
})
watch(isOpen, val => {
  emit('update:modelValue', val)
})

const formRef = ref()
const isFormValid = ref(false)

const form = reactive({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
})

const rules = {
  required: (v: string) => !!v?.trim() || 'This field is required',
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.country_code = 'USA'
  form.maiden_flight = ''
  formRef.value?.resetValidation()
}

function closeModal() {
  isOpen.value = false
  resetForm()
}

function handleSubmit() {
  if (!form.full_name.trim()) return

  const created = addRocket({
    full_name: form.full_name.trim(),
    name: form.full_name.trim(),
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    launch_cost: form.launch_cost ? Number(form.launch_cost) : null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: {
      name: 'Custom Manufacturer',
      country_code: form.country_code.trim() || null,
    },
  })

  emit('rocket-added', created.id)
  closeModal()
}
</script>
