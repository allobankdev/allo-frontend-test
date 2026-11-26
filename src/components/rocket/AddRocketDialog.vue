<template>
  <v-dialog
    v-model="open"
    max-width="640"
    persistent
    scrollable
  >
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <span>Add rocket</span>
        <v-spacer />
        <v-btn
          aria-label="Close"
          icon="mdi-close"
          variant="text"
          @click="close"
        />
      </v-card-title>

      <v-divider />

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.name"
                autofocus
                counter="100"
                label="Name *"
                :rules="[required('Name'), maxLength(100)]"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                auto-grow
                counter="1000"
                label="Description"
                rows="3"
                :rules="[maxLength(1000)]"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.imageUrl"
                label="Image URL"
                placeholder="https://…"
                :rules="[optionalUrl]"
                type="url"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launchCost"
                inputmode="numeric"
                label="Cost per launch (USD)"
                min="0"
                prefix="$"
                :rules="[optionalNonNegativeNumber]"
                type="number"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.countryCode"
                label="Country code"
                maxlength="3"
                placeholder="USA"
                :rules="[optionalCountryCode]"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.firstFlight"
                label="First flight"
                type="date"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-select
                v-model="form.active"
                item-title="label"
                item-value="value"
                :items="STATUS_OPTIONS"
                label="Status"
              />
            </v-col>
          </v-row>

          <!-- Lets Enter submit the form from any field. -->
          <button
            class="d-none"
            type="submit"
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
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
          Add rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue'
  import type { NewRocketInput } from '@/types/rocket'
  import {
    maxLength,
    optionalCountryCode,
    optionalNonNegativeNumber,
    optionalUrl,
    required,
  } from '@/utils/validation'

  interface FormState {
    name: string
    description: string
    imageUrl: string
    /** Bound to a number input, which yields a string (or '' when empty). */
    launchCost: string | number
    countryCode: string
    firstFlight: string
    active: boolean | null
  }

  const STATUS_OPTIONS = [
    { label: 'Unknown', value: null },
    { label: 'Active', value: true },
    { label: 'Retired', value: false },
  ]

  const open = defineModel<boolean>({ default: false })

  const emit = defineEmits<{
    submit: [rocket: NewRocketInput]
  }>()

  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)
  const form = ref<FormState>(emptyForm())

  // Start fresh every time the dialog opens.
  watch(open, isOpen => {
    if (isOpen) form.value = emptyForm()
  })

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', toInput(form.value))
    open.value = false
  }

  function close () {
    open.value = false
  }

  function emptyForm (): FormState {
    return {
      name: '',
      description: '',
      imageUrl: '',
      launchCost: '',
      countryCode: '',
      firstFlight: '',
      active: null,
    }
  }

  function toInput (state: FormState): NewRocketInput {
    const cost = String(state.launchCost).trim()
    return {
      name: state.name,
      description: state.description || null,
      imageUrl: state.imageUrl || null,
      launchCost: cost === '' ? null : Number(cost),
      countryCode: state.countryCode || null,
      firstFlight: state.firstFlight || null,
      active: state.active,
    }
  }
</script>
