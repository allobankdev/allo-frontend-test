<template>
  <v-dialog
    max-width="560"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title>Add New Rocket</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="form.full_name"
            class="mb-2"
            label="Rocket Name"
            required
            variant="outlined"
          />
          <v-textarea
            v-model="form.description"
            class="mb-2"
            label="Description"
            required
            rows="3"
            variant="outlined"
          />
          <v-text-field
            v-model="form.image_url"
            class="mb-2"
            label="Image URL (optional)"
            variant="outlined"
          />
          <v-text-field
            v-model="form.launch_cost"
            class="mb-2"
            label="Launch Cost (optional)"
            type="number"
            variant="outlined"
          />
          <v-text-field
            v-model="form.country_code"
            class="mb-2"
            label="Country Code (optional)"
            variant="outlined"
          />
          <v-text-field
            v-model="form.maiden_flight"
            label="First Flight (optional)"
            type="date"
            variant="outlined"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text="Cancel"
          variant="text"
          @click="close"
        />
        <v-btn
          color="primary"
          :disabled="!canSubmit"
          text="Add Rocket"
          variant="flat"
          @click="submit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { computed, reactive, watch } from 'vue'
  import type { NewRocketPayload } from '@/types/rocket'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [payload: NewRocketPayload]
  }>()

  const emptyForm = (): NewRocketPayload => ({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    maiden_flight: '',
    country_code: '',
  })

  const form = reactive(emptyForm())

  const canSubmit = computed(() =>
    form.full_name.trim().length > 0 && form.description.trim().length > 0,
  )

  watch(() => props.modelValue, (open) => {
    if (!open) {
      Object.assign(form, emptyForm())
    }
  })

  function close (): void {
    emit('update:modelValue', false)
  }

  function submit (): void {
    if (!canSubmit.value) return

    emit('submit', {
      full_name: form.full_name.trim(),
      description: form.description.trim(),
      image_url: form.image_url?.trim() || undefined,
      launch_cost: form.launch_cost?.trim() || undefined,
      maiden_flight: form.maiden_flight?.trim() || undefined,
      country_code: form.country_code?.trim() || undefined,
    })
    close()
  }
</script>
