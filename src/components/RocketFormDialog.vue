<script setup lang="ts">
/**
 * RocketFormDialog.vue
 *
 * Modal form for adding a rocket. It only validates and emits a normalized
 * NewRocket payload; the parent decides what to do with it (the store keeps it
 * in memory because the API is read-only).
 */

// Composables
import { reactive, ref, watch } from 'vue'

// Types
import type { NewRocket } from '@/types/rocket'

const open = defineModel<boolean>({ default: false })

withDefaults(defineProps<{ title?: string }>(), {
  title: 'Add a new rocket',
})

const emit = defineEmits<{ submit: [rocket: NewRocket] }>()

interface FormState {
  full_name: string
  description: string
  image_url: string
  launch_cost: string
  country_code: string
  maiden_flight: string
}

const emptyForm = (): FormState => ({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
})

const form = reactive<FormState>(emptyForm())
const formRef = ref<{
  validate: () => Promise<{ valid: boolean }>
  resetValidation: () => void
} | null>(null)

const requiredName = (value: string) =>
  Boolean(value?.trim()) || 'Rocket name is required'

const validUrl = (value: string) => {
  if (!value?.trim()) {
    return true
  }

  try {
    const url = new URL(value.trim())
    return ['http:', 'https:'].includes(url.protocol) || 'Use an http(s) URL'
  } catch {
    return 'Enter a valid URL'
  }
}

const validCost = (value: string) => {
  if (!value?.trim()) {
    return true
  }

  return /^\d+(\.\d+)?$/.test(value.trim()) || 'Enter a number, e.g. 50000000'
}

function reset () {
  Object.assign(form, emptyForm())
  formRef.value?.resetValidation()
}

watch(open, (isOpen) => {
  if (isOpen) {
    reset()
  }
})

async function handleSubmit () {
  const result = await formRef.value?.validate()

  if (!result?.valid) {
    return
  }

  emit('submit', {
    full_name: form.full_name.trim(),
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    launch_cost: form.launch_cost.trim() || null,
    country_code: form.country_code.trim().toUpperCase() || null,
    maiden_flight: form.maiden_flight || null,
  })
}
</script>

<template>
  <v-dialog
    v-model="open"
    max-width="640"
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center ga-2">
        <v-icon
          color="primary"
          icon="mdi-rocket-launch-outline"
        />
        {{ title }}
      </v-card-title>

      <v-card-subtitle>
        The API is read-only, so this rocket is only added to the running app.
      </v-card-subtitle>

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="handleSubmit"
        >
          <v-text-field
            v-model="form.full_name"
            autofocus
            class="mb-3"
            label="Rocket name *"
            :rules="[requiredName]"
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            class="mb-3"
            label="Description"
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="form.image_url"
            class="mb-3"
            label="Image URL"
            :rules="[validUrl]"
            variant="outlined"
          />

          <v-row dense>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                class="mb-3"
                label="Cost per launch (USD)"
                :rules="[validCost]"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                class="mb-3"
                label="Country code"
                maxlength="3"
                placeholder="USA"
                variant="outlined"
                @update:model-value="form.country_code = ($event ?? '').toUpperCase()"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.maiden_flight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="open = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="flat"
          @click="handleSubmit"
        >
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
