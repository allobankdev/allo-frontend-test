<template>
  <v-dialog
    :model-value="modelValue"
    max-width="720"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl">
      <v-card-title class="px-6 pt-6 pb-2 text-h5 font-weight-bold">
        Add Rocket
      </v-card-title>

      <v-card-subtitle class="px-6 pb-4">
        Create a local rocket draft to demonstrate create flow on top of the read-only SpaceX API.
      </v-card-subtitle>

      <v-card-text class="px-6 pb-2">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.name"
                label="Rocket Name"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.country"
                label="Country"
                variant="outlined"
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                rows="4"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.image"
                label="Image URL"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model="form.firstFlight"
                hint="Format: YYYY-MM-DD"
                label="First Flight"
                persistent-hint
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-text-field
                v-model.number="form.costPerLaunch"
                label="Cost Per Launch (USD)"
                min="0"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              md="6"
            >
              <v-switch
                v-model="form.active"
                color="primary"
                inset
                label="Rocket is active"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-6 pt-0">
        <v-spacer />

        <v-btn
          variant="text"
          @click="closeDialog"
        >
          Cancel
        </v-btn>

        <v-btn
          color="primary"
          :disabled="!isFormValid"
          prepend-icon="mdi-plus"
          @click="handleSubmit"
        >
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
  import { computed, reactive, watch } from 'vue'

  import type { RocketDraft } from '@/types/rocket'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [value: RocketDraft]
  }>()

  const initialState = (): RocketDraft => ({
    name: '',
    description: '',
    image: '',
    costPerLaunch: 0,
    country: '',
    firstFlight: '',
    active: true,
  })

  const form = reactive<RocketDraft>(initialState())

  const isFormValid = computed(() => Boolean(
    form.name.trim()
    && form.description.trim()
    && form.image.trim()
    && form.country.trim()
    && form.firstFlight.trim()
    && !Number.isNaN(Number(form.costPerLaunch))
    && Number(form.costPerLaunch) >= 0,
  ))

  function resetForm() {
    Object.assign(form, initialState())
  }

  watch(
    () => props.modelValue,
    (isOpen) => {
      if (!isOpen) {
        resetForm()
      }
    },
  )

  function closeDialog() {
    emit('update:modelValue', false)
    resetForm()
  }

  function handleSubmit() {
    const payload: RocketDraft = {
      name: form.name.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      costPerLaunch: Number(form.costPerLaunch),
      country: form.country.trim(),
      firstFlight: form.firstFlight.trim(),
      active: form.active,
    }

    if (
      !payload.name ||
      !payload.description ||
      !payload.image ||
      !payload.country ||
      !payload.firstFlight ||
      Number.isNaN(payload.costPerLaunch)
      || payload.costPerLaunch < 0
    ) {
      return
    }

    emit('submit', payload)
    closeDialog()
  }
</script>
