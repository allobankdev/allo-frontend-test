<template>
  <v-dialog
    :model-value="modelValue"
    width="min(680px, calc(100vw - 32px))"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card
      class="add-dialog"
      variant="flat"
    >
      <div class="add-dialog__header">
        <div>
          <span class="section-kicker">Local catalog entry</span>
          <h2>Add a rocket</h2>
        </div>

        <v-btn
          aria-label="Close dialog"
          icon="mdi-close"
          size="small"
          variant="text"
          @click="close"
        />
      </div>

      <v-form
        ref="form"
        @submit.prevent="submit"
      >
        <div class="add-dialog__fields">
          <v-text-field
            v-model="values.fullName"
            autofocus
            label="Rocket name"
            maxlength="80"
            :rules="[rules.required]"
          />

          <v-textarea
            v-model="values.description"
            auto-grow
            counter="500"
            label="Description"
            maxlength="500"
            rows="3"
            variant="outlined"
          />

          <v-text-field
            v-model="values.imageUrl"
            label="Image URL"
            placeholder="https://example.com/rocket.jpg"
            :rules="[rules.url]"
            type="url"
          />

          <div class="add-dialog__row">
            <v-text-field
              v-model="values.launchCost"
              label="Launch cost (USD)"
              min="0"
              :rules="[rules.cost]"
              step="1"
              type="number"
            />

            <v-text-field
              v-model="values.countryCode"
              label="Country code"
              maxlength="3"
              placeholder="USA"
              :rules="[rules.country]"
            />
          </div>

          <v-text-field
            v-model="values.maidenFlight"
            label="First flight"
            type="date"
          />
        </div>

        <v-card-actions class="add-dialog__actions">
          <v-btn
            variant="text"
            @click="close"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
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
  import type { NewRocketInput } from '@/types/rocket'

  const props = defineProps<{
    modelValue: boolean
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    submit: [value: NewRocketInput]
  }>()

  const emptyValues = (): NewRocketInput => ({
    fullName: '',
    description: '',
    imageUrl: '',
    launchCost: '',
    countryCode: '',
    maidenFlight: '',
  })

  const values = reactive<NewRocketInput>(emptyValues())
  const form = ref<{
    validate: () => Promise<{ valid: boolean }>
    resetValidation: () => void
  } | null>(null)

  const rules = {
    required: (value: string) => Boolean(value.trim()) || 'Rocket name is required.',
    url: (value: string) => {
      if (!value.trim()) return true

      try {
        const url = new URL(value)
        return ['http:', 'https:'].includes(url.protocol) || 'Use an HTTP or HTTPS URL.'
      } catch {
        return 'Enter a valid image URL.'
      }
    },
    cost: (value: string) => {
      if (!value) return true
      return Number(value) >= 0 || 'Launch cost cannot be negative.'
    },
    country: (value: string) => {
      if (!value.trim()) return true
      return /^[a-z]{2,3}$/i.test(value.trim()) || 'Use a 2 or 3 letter code.'
    },
  }

  watch(() => props.modelValue, isOpen => {
    if (!isOpen) return

    Object.assign(values, emptyValues())
    form.value?.resetValidation()
  })

  function close () {
    emit('update:modelValue', false)
  }

  async function submit () {
    const result = await form.value?.validate()
    if (!result?.valid) return

    emit('submit', { ...values })
    close()
  }
</script>
