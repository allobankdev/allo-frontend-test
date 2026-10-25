<template>
  <v-dialog
    :model-value="modelValue"
    :fullscreen="mobile"
    max-width="480"
    content-class="u-no-scrollbar"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-card-title class="text-subtitle-1 font-weight-bold">
        Add a rocket
      </v-card-title>

      <v-card-text class="u-no-scrollbar">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="form.fullName"
            label="Name"
            required
            class="mb-3"
          />
          <v-textarea
            v-model="form.description"
            label="Description"
            rows="2"
            class="mb-3"
          />
          <v-text-field
            v-model="form.imageUrl"
            label="Image URL"
            class="mb-3"
          />
          <v-text-field
            v-model="form.launchCost"
            label="Cost per launch (USD)"
            type="number"
            min="0"
            :error-messages="launchCostError"
            class="mb-3"
          />
          <v-select
            v-model="form.countryCode"
            label="Country"
            :items="countries"
            item-title="label"
            item-value="code"
            clearable
            class="mb-3"
          />

          <v-menu
            v-model="isDatePickerOpen"
            :close-on-content-click="false"
          >
            <template #activator="{ props: menuProps }">
              <v-text-field
                v-bind="menuProps"
                :model-value="form.maidenFlight"
                label="First flight"
                prepend-inner-icon="mdi-calendar"
                readonly
                clearable
                @click:clear="form.maidenFlight = ''"
              />
            </template>
            <v-date-picker
              :model-value="pickerDate"
              color="primary"
              hide-header
              @update:model-value="handlePickDate"
            />
          </v-menu>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          variant="text"
          @click="emit('update:modelValue', false)"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useDisplay } from 'vuetify'
import { COUNTRIES } from '@/utils/countries'
import type { Rocket } from '@/types/rocket'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  submit: [rocket: Omit<Rocket, 'id' | 'isLocal'>]
}>()

const { mobile } = useDisplay()

const countries = COUNTRIES.map((c) => ({
  code: c.code,
  label: `${c.flag} ${c.name}`,
}))

const isDatePickerOpen = ref(false)

const form = reactive({
  fullName: '',
  description: '',
  imageUrl: '',
  launchCost: '',
  countryCode: null as string | null,
  maidenFlight: '',
})

const isLaunchCostNegative = computed(() => {
  if (!form.launchCost) return false
  return Number(form.launchCost) < 0
})

const launchCostError = computed(() => isLaunchCostNegative.value ? ['Cost cannot be negative'] : [])

const isValid = computed(() => form.fullName.trim().length > 0 && !isLaunchCostNegative.value)

const pickerDate = computed(() => form.maidenFlight ? new Date(form.maidenFlight) : null)

function handlePickDate(value: unknown) {
  if (value instanceof Date) {
    form.maidenFlight = value.toISOString().slice(0, 10)
  }
  isDatePickerOpen.value = false
}

function resetForm() {
  form.fullName = ''
  form.description = ''
  form.imageUrl = ''
  form.launchCost = ''
  form.countryCode = null
  form.maidenFlight = ''
}

watch(() => props.modelValue, (isOpen) => {
  if (!isOpen) resetForm()
})

function handleSubmit() {
  if (!isValid.value) return

  emit('submit', {
    fullName: form.fullName.trim(),
    description: form.description.trim() || null,
    family: null,
    imageUrl: form.imageUrl.trim() || null,
    launchCost: form.launchCost ? Number(form.launchCost) : null,
    countryCode: form.countryCode,
    maidenFlight: form.maidenFlight.trim() || null,
    active: true,
    reusable: false,
  })
}
</script>