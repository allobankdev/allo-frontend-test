<template>
  <v-dialog
    v-model="model"
    max-width="560"
    persistent
  >
    <v-card rounded="lg">
      <v-card-title class="pa-6 pb-2 text-h5 font-weight-bold">
        Add New Rocket
      </v-card-title>
      <v-card-subtitle class="px-6 pb-4 text-wrap">
        This rocket only exists in the app and will be lost when the page is reloaded.
      </v-card-subtitle>

      <v-form
        ref="formRef"
        class="px-6"
        @submit.prevent="submit"
      >
        <v-text-field
          v-model="form.name"
          :rules="[rules.required]"
          label="Rocket name *"
          variant="outlined"
          class="mb-1"
        />
        <v-textarea
          v-model="form.description"
          label="Description"
          variant="outlined"
          rows="3"
          auto-grow
          class="mb-1"
        />
        <v-text-field
          v-model="form.imageUrl"
          :rules="[rules.optionalUrl]"
          label="Image URL"
          placeholder="https://..."
          variant="outlined"
          class="mb-1"
        />
        <v-row dense>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="form.launchCost"
              :rules="[rules.optionalCost]"
              label="Cost per launch (USD)"
              type="number"
              min="0"
              variant="outlined"
            />
          </v-col>
          <v-col
            cols="12"
            sm="6"
          >
            <v-text-field
              v-model="form.country"
              label="Country"
              variant="outlined"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="form.firstFlight"
          label="First flight"
          type="date"
          variant="outlined"
          class="mb-2"
        />
      </v-form>

      <v-card-actions class="pa-6 pt-2">
        <v-spacer />
        <v-btn
          variant="text"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="submit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const model = defineModel<boolean>({ required: true })
const emit = defineEmits<{ save: [input: NewRocketInput] }>()

interface FormState {
  name: string
  description: string
  imageUrl: string
  launchCost: string
  country: string
  firstFlight: string
}

interface FormRef {
  validate: () => Promise<{ valid: boolean }>
  resetValidation: () => void
}

const formRef = ref<FormRef | null>(null)

const blankForm = (): FormState => ({
  name: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  country: '',
  firstFlight: '',
})
const form = reactive<FormState>(blankForm())

const rules = {
  required: (value: string) => !!value.trim() || 'Rocket name is required',
  optionalUrl: (value: string) =>
    !value.trim() || /^https?:\/\/\S+$/.test(value.trim()) || 'Use a URL starting with http:// or https://',
  optionalCost: (value: string) =>
    !value.trim() || (Number(value) >= 0) || 'Enter a number 0 or greater',
}

// Start every time the dialog opens with a clean form.
watch(model, (open) => {
  if (open) {
    Object.assign(form, blankForm())
    formRef.value?.resetValidation()
  }
})

async function submit() {
  const result = await formRef.value?.validate()
  if (!result?.valid) return

  const cost = form.launchCost.trim()
  emit('save', {
    name: form.name.trim(),
    description: form.description.trim() || null,
    imageUrl: form.imageUrl.trim() || null,
    launchCost: cost ? Number(cost) : null,
    country: form.country.trim() || null,
    firstFlight: form.firstFlight || null,
  })
  model.value = false
}

function close() {
  model.value = false
}
</script>
