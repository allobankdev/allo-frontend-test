<template>
  <v-bottom-sheet
    v-if="isMobile"
    v-model="isOpen"
    :scrim="true"
  >
    <v-card rounded="xl" class="hig-sheet-card">
      <div class="hig-drag-handle" aria-hidden="true" />
      <div class="hig-form-wrapper">
        <div class="hig-form-header">
          <h2 class="hig-headline">Add New Rocket</h2>
          <button
            class="hig-close-btn"
            aria-label="Close dialog"
            type="button"
            @click="closeDialog"
          >
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <v-form ref="formRef" class="hig-form" @submit.prevent="submit">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            placeholder="e.g. Starship Super Heavy"
            :rules="nameRules"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Brief overview of capabilities, stages, and mission..."
            :rules="descRules"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            class="mb-2"
          />

          <v-text-field
            v-model="form.launchCost"
            label="Cost per Launch (USD) - Optional"
            placeholder="e.g. 50000000"
            type="number"
            :rules="costRules"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />

          <v-row class="mb-0">
            <v-col cols="6" class="py-0 pr-1">
              <v-text-field
                v-model="form.countryCode"
                label="Country Code - Optional"
                placeholder="e.g. USA"
                :rules="countryRules"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
            </v-col>
            <v-col cols="6" class="py-0 pl-1">
              <v-text-field
                v-model="form.maidenFlight"
                label="First Flight - Optional"
                placeholder="YYYY-MM-DD"
                :rules="dateRules"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                @input="onDateInput"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.imageUrl"
            label="Rocket Image URL - Optional"
            placeholder="https://..."
            :rules="imageRules"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          />

          <v-btn
            color="primary"
            variant="elevated"
            rounded="pill"
            block
            type="submit"
            :disabled="!isValid"
            class="hig-submit-btn"
          >
            Add Rocket
          </v-btn>
        </v-form>
      </div>
    </v-card>
  </v-bottom-sheet>

  <v-dialog
    v-else
    v-model="isOpen"
    max-width="560"
    :scrim="true"
  >
    <v-card rounded="xl" class="hig-dialog-card">
      <div class="hig-form-wrapper">
        <div class="hig-form-header">
          <h2 class="hig-headline">Add New Rocket</h2>
          <button
            class="hig-close-btn"
            aria-label="Close dialog"
            type="button"
            @click="closeDialog"
          >
            <v-icon size="20">mdi-close</v-icon>
          </button>
        </div>

        <v-form ref="formRef" class="hig-form" @submit.prevent="submit">
          <v-text-field
            v-model="form.name"
            label="Rocket Name"
            placeholder="e.g. Starship Super Heavy"
            :rules="nameRules"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />

          <v-textarea
            v-model="form.description"
            label="Description"
            placeholder="Brief overview of capabilities, stages, and mission..."
            :rules="descRules"
            variant="outlined"
            density="comfortable"
            rows="3"
            auto-grow
            class="mb-2"
          />

          <v-text-field
            v-model="form.launchCost"
            label="Cost per Launch (USD) - Optional"
            placeholder="e.g. 50000000"
            type="number"
            :rules="costRules"
            variant="outlined"
            density="comfortable"
            class="mb-2"
          />

          <v-row class="mb-0">
            <v-col cols="6" class="py-0 pr-1">
              <v-text-field
                v-model="form.countryCode"
                label="Country - Optional"
                placeholder="e.g. USA"
                :rules="countryRules"
                variant="outlined"
                density="comfortable"
                class="mb-2"
              />
            </v-col>
            <v-col cols="6" class="py-0 pl-1">
              <v-text-field
                v-model="form.maidenFlight"
                label="First Flight - Optional"
                placeholder="YYYY-MM-DD"
                :rules="dateRules"
                variant="outlined"
                density="comfortable"
                class="mb-2"
                @input="onDateInput"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.imageUrl"
            label="Rocket Image URL - Optional"
            placeholder="https://..."
            :rules="imageRules"
            variant="outlined"
            density="comfortable"
            class="mb-4"
          />

          <v-btn
            color="primary"
            variant="elevated"
            rounded="pill"
            block
            type="submit"
            :disabled="!isValid"
            class="hig-submit-btn"
          >
            Add Rocket
          </v-btn>
        </v-form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import { useDisplay } from 'vuetify'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)
const store = useRocketStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const form = reactive({
  name: '',
  description: '',
  launchCost: '',
  countryCode: 'USA',
  maidenFlight: '',
  imageUrl: '',
})

const nameRules = [
  (v: string) => !!v?.trim() || 'Rocket name is required',
  (v: string) => (v?.trim().length >= 2) || 'Rocket name must be at least 2 characters',
]

const descRules = [
  (v: string) => !!v?.trim() || 'Description is required',
  (v: string) => (v?.trim().length >= 10) || 'Description must be at least 10 characters',
]

const costRules = [
  (v: string) => !v || (Number(v) > 0) || 'Cost must be a positive number',
]

const countryRules = [
  (v: string) => !v || /^[a-zA-Z\s]{2,20}$/.test(v.trim()) || 'Enter a valid country (e.g. USA)',
]

const dateRules = [
  (v: string) => !v || /^\d{4}-\d{2}-\d{2}$/.test(v.trim()) || 'Date format must be YYYY-MM-DD',
]

const imageRules = [
  (v: string) => !v || /^https?:\/\/.+/.test(v.trim()) || 'URL must start with http:// or https://',
]

function onDateInput(e: Event) {
  const input = e.target as HTMLInputElement
  let v = input.value.replace(/\D/g, '')
  if (v.length > 8) v = v.slice(0, 8)

  if (v.length >= 6) {
    form.maidenFlight = `${v.slice(0, 4)}-${v.slice(4, 6)}-${v.slice(6)}`
  } else if (v.length >= 4) {
    form.maidenFlight = `${v.slice(0, 4)}-${v.slice(4)}`
  } else {
    form.maidenFlight = v
  }
}

const isValid = computed(() => {
  const isNameValid = form.name.trim().length >= 2
  const isDescValid = form.description.trim().length >= 10
  const isCostValid = !form.launchCost || Number(form.launchCost) > 0
  const isCountryValid = !form.countryCode || /^[a-zA-Z\s]{2,20}$/.test(form.countryCode.trim())
  const isDateValid = !form.maidenFlight || /^\d{4}-\d{2}-\d{2}$/.test(form.maidenFlight.trim())
  const isImageValid = !form.imageUrl || /^https?:\/\/.+/.test(form.imageUrl.trim())

  return isNameValid && isDescValid && isCostValid && isCountryValid && isDateValid && isImageValid
})

function closeDialog() {
  isOpen.value = false
}

function submit() {
  if (!isValid.value) return

  store.addLocalRocket({
    full_name: form.name.trim(),
    description: form.description.trim(),
    image_url: form.imageUrl.trim() || null,
    launch_cost: form.launchCost ? String(form.launchCost).trim() : null,
    maiden_flight: form.maidenFlight.trim() || null,
    manufacturer: {
      name: 'SpaceX',
      country_code: form.countryCode.trim().toUpperCase() || 'USA',
    },
  })

  form.name = ''
  form.description = ''
  form.launchCost = ''
  form.countryCode = 'USA'
  form.maidenFlight = ''
  form.imageUrl = ''
  closeDialog()
}
</script>

<style scoped>
.hig-sheet-card,
.hig-dialog-card {
  font-family: var(--hig-font-stack);
  background: var(--hig-bg-secondary);
  border: 0.5px solid var(--hig-separator);
  max-height: 90vh;
  overflow-y: auto;
}

.hig-drag-handle {
  width: 36px;
  height: 4px;
  background: var(--hig-separator);
  border-radius: var(--hig-radius-pill);
  margin: var(--hig-space-sm) auto var(--hig-space-xs);
}

.hig-form-wrapper {
  padding: var(--hig-space-md) var(--hig-space-xl) var(--hig-space-xl);
  font-family: var(--hig-font-stack);
}

.hig-form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--hig-space-lg);
}

.hig-headline {
  font-size: var(--hig-headline-size);
  font-weight: var(--hig-headline-weight);
  color: var(--hig-label);
  margin: 0;
}

.hig-close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--hig-tertiary-label);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: var(--hig-tap-target);
  min-width: var(--hig-tap-target);
  border-radius: 50%;
  transition: color var(--hig-duration-fast) var(--hig-easing);
}

.hig-close-btn:hover {
  color: var(--hig-label);
}

.hig-form {
  display: flex;
  flex-direction: column;
}

.hig-submit-btn {
  min-height: var(--hig-tap-target) !important;
  font-size: var(--hig-body-size) !important;
  font-family: var(--hig-font-stack) !important;
}
</style>
