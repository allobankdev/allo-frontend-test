<template>
  <v-dialog
    v-model="open"
    max-width="520"
  >
    <v-card title="Add new rocket">
      <!-- @submit.prevent stops the browser from reloading the page. -->
      <v-form
        ref="formRef"
        @submit.prevent="submit"
      >
        <v-card-text class="d-flex flex-column ga-2">
          <v-text-field
            v-model="form.name"
            label="Name *"
            :rules="[required]"
            variant="outlined"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            :rules="[optionalUrl]"
            variant="outlined"
          />
          <v-text-field
            v-model.number="form.launchCost"
            label="Cost per launch (USD)"
            :rules="[optionalPositive]"
            type="number"
            variant="outlined"
          />
          <v-text-field
            v-model="form.country"
            label="Country code (e.g. USA)"
            variant="outlined"
          />
          <v-text-field
            v-model="form.firstFlight"
            label="First flight"
            type="date"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="open = false">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="flat"
          >
            Add rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue'
  import type { NewRocketInput } from '../types/rocket'

  // v-model from the parent controls whether the dialog is open.
  const open = defineModel<boolean>({ default: false })
  // The dialog only reports the entered data; the parent decides what to do with it.
  const emit = defineEmits<{ submit: [input: NewRocketInput] }>()

  type FormState = {
    name: string
    description: string
    imageUrl: string
    launchCost: number | string | null
    country: string
    firstFlight: string
  }

  const emptyForm = (): FormState => ({
    name: '',
    description: '',
    imageUrl: '',
    launchCost: null,
    country: '',
    firstFlight: '',
  })

  // Template ref to the <v-form>, needed to call validate() on submit.
  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
  const form = reactive<FormState>(emptyForm())

  // Start with a clean form every time the dialog opens.
  watch(open, isOpen => {
    if (isOpen) Object.assign(form, emptyForm())
  })

    // --- Validation rules: return true when valid, or an error message string. ---
  const required = (value: string) => !!value?.trim() || 'Required'

  // Optional field: empty is fine, but if filled it must be a real http(s) URL.
  const optionalUrl = (value: string) => {
    if (!value) return true
    try {
      const { protocol } = new URL(value)
      return protocol === 'http:' || protocol === 'https:' || 'Must be an http(s) URL'
    } catch {
      return 'Must be a valid URL' // new URL() throws on malformed input
    }
  }

  // Optional field: empty is fine, but a filled cost cannot be negative.
  const optionalPositive = (value: number | string | null) =>
    value === null || value === '' || Number(value) >= 0 || 'Must be 0 or more'

    async function submit () {
    // Run all rules; stop here if any field is invalid (errors show in the UI).
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', {
      name: form.name,
      description: form.description,
      imageUrl: form.imageUrl,
      // An untouched cost field means "unknown", not zero.
      launchCost: form.launchCost === null || form.launchCost === ''
        ? null
        : Number(form.launchCost),
      country: form.country,
      firstFlight: form.firstFlight,
    })
    open.value = false
  }
</script>
