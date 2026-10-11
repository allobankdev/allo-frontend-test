<template>
  <v-dialog
    :model-value="modelValue"
    max-width="560"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="text-h6">
        Add new rocket
      </v-card-title>
      <v-card-subtitle>
        Saved in this session only (API is read-only)
      </v-card-subtitle>

      <v-card-text>
        <v-form
          ref="formRef"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="form.full_name"
            class="mb-2"
            label="Rocket name"
            :rules="[requiredRule]"
            variant="outlined"
          />
          <v-textarea
            v-model="form.description"
            class="mb-2"
            label="Description"
            rows="3"
            :rules="[requiredRule]"
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
            label="Cost per launch (optional)"
            placeholder="e.g. 67000000"
            variant="outlined"
          />
          <v-text-field
            v-model="form.maiden_flight"
            class="mb-2"
            label="First flight (optional)"
            type="date"
            variant="outlined"
          />
          <v-text-field
            v-model="form.country_code"
            label="Country code (optional)"
            placeholder="e.g. USA"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="px-6 pb-4">
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
  import { reactive, ref, watch } from 'vue'
  import type { NewRocketInput } from '@/types/rocket'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [payload: NewRocketInput]
  }>()

  const formRef = ref<{ validate: () => Promise<{ valid: boolean }> } | null>(null)

  const emptyForm = (): NewRocketInput => ({
    full_name: '',
    description: '',
    image_url: '',
    launch_cost: '',
    maiden_flight: '',
    country_code: '',
  })

  const form = reactive(emptyForm())

  const requiredRule = (value: string) =>
    Boolean(value?.trim()) || 'This field is required'

  function resetForm () {
    Object.assign(form, emptyForm())
  }

  function close () {
    emit('update:modelValue', false)
  }

  async function submit () {
    const result = await formRef.value?.validate()
    if (!result?.valid) return

    emit('submit', { ...form })
    close()
    resetForm()
  }

  watch(() => props.modelValue, value => {
    if (!value) resetForm()
  })
</script>
