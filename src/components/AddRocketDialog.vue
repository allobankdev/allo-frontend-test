<template>
  <v-dialog
    max-width="560"
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <span class="text-h6">Add New Rocket</span>
        <v-btn
          icon="mdi-close"
          size="small"
          variant="text"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider />

      <v-form
        ref="formRef"
        @submit.prevent="handleSubmit"
      >
        <v-card-text class="pa-4">
          <v-text-field
            v-model="form.full_name"
            class="mb-2"
            label="Rocket Name *"
            placeholder="e.g. Starship V4"
            :rules="[rules.required]"
            variant="outlined"
          />

          <v-textarea
            v-model="form.description"
            class="mb-2"
            label="Description"
            placeholder="Describe this rocket..."
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="form.image_url"
            class="mb-2"
            label="Image URL (optional)"
            placeholder="https://example.com/rocket.jpg"
            variant="outlined"
          />

          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per Launch in USD (optional)"
                placeholder="e.g. 50000000"
                :rules="[rules.numericOptional]"
                type="number"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country Code (optional)"
                placeholder="e.g. USA"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight (optional)"
                type="date"
                variant="outlined"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.family"
                label="Family (optional)"
                placeholder="e.g. Falcon / Starship"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-switch
            v-model="form.active"
            color="primary"
            hide-details
            label="Active Rocket"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            type="submit"
            variant="flat"
          >
            Save Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import type { NewRocketPayload } from '@/types/rocket'

  defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [payload: NewRocketPayload]
  }>()

  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

  const form = reactive({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    country_code: 'USA',
    maiden_flight: '',
    family: 'Starship',
    active: true,
  })

  const rules = {
    required: (v: string) => Boolean(v?.trim()) || 'Rocket name is required',
    numericOptional: (v: string) => {
      if (!v) return true
      return (!Number.isNaN(Number(v)) && Number(v) >= 0) || 'Must be a valid positive number'
    },
  }

  function resetForm () {
    form.full_name = ''
    form.description = ''
    form.image_url = ''
    form.launch_cost = ''
    form.country_code = 'USA'
    form.maiden_flight = ''
    form.family = 'Starship'
    form.active = true
  }

  function closeDialog () {
    emit('update:modelValue', false)
  }

  async function handleSubmit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', {
      full_name: form.full_name,
      description: form.description,
      image_url: form.image_url || null,
      launch_cost: form.launch_cost || null,
      country_code: form.country_code || null,
      maiden_flight: form.maiden_flight || null,
      family: form.family || null,
      active: form.active,
    })

    resetForm()
    closeDialog()
  }
</script>