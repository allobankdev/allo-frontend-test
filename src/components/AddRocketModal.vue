<template>
  <v-dialog
    v-model="isOpen"
    max-width="640"
    persistent
    scrollable
  >
    <div
      class="cad-frame rounded-sm overflow-hidden"
      style="background: var(--console-surface);"
    >
      <!-- Dialog Header -->
      <div
        class="d-flex align-center justify-space-between pa-4 pa-sm-5 border-b"
        style="border-color: var(--titanium-border) !important;"
      >
        <div class="d-flex align-center">
          <div class="modal-icon-wrap me-3 d-flex align-center justify-center">
            <v-icon
              icon="mdi-plus"
              color="primary"
              size="20"
            />
          </div>
          <div>
            <div class="text-subtitle-1 font-weight-bold tracking-tight">
              Register New Launch Vehicle
            </div>
            <div
              class="font-mono text-caption text-secondary"
              style="font-size: 0.7rem;"
            >
              IN-MEMORY MANIFEST REGISTRY // SPACEX FLEET
            </div>
          </div>
        </div>

        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          color="secondary"
          @click="closeModal"
        />
      </div>

      <!-- Form Body with Full Validation Feedback -->
      <div
        class="pa-4 pa-sm-5"
        style="max-height: 70vh; overflow-y: auto;"
      >
        <v-form
          ref="formRef"
          v-model="isFormValid"
          validate-on="blur"
          @submit.prevent="handleSubmit"
        >
          <v-row dense>
            <!-- Full Name -->
            <v-col cols="12">
              <label class="font-mono text-caption mb-1 d-block">
                Vehicle Full Name <span class="text-error">*</span>
              </label>
              <v-text-field
                v-model="form.full_name"
                :rules="[rules.requiredFullName]"
                placeholder="e.g. Starship Super Heavy Block 2"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2 font-mono"
              />
            </v-col>

            <!-- Short Model Name -->
            <v-col
              cols="12"
              sm="6"
            >
              <label class="font-mono text-caption mb-1 d-block">
                Model Identifier
              </label>
              <v-text-field
                v-model="form.name"
                placeholder="e.g. Starship Block 2"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2 font-mono"
              />
            </v-col>

            <!-- Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <label class="font-mono text-caption mb-1 d-block">
                Country Code
              </label>
              <v-text-field
                v-model="form.country_code"
                :rules="[rules.optionalCountry]"
                placeholder="USA"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2 font-mono"
              />
            </v-col>

            <!-- Cost Per Launch & Maiden Flight -->
            <v-col
              cols="12"
              sm="6"
            >
              <label class="font-mono text-caption mb-1 d-block">
                Cost Per Launch (USD)
              </label>
              <v-text-field
                v-model="form.launch_cost"
                :rules="[rules.optionalCost]"
                type="number"
                min="0"
                placeholder="e.g. 50000000"
                prefix="$"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2 font-mono"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <label class="font-mono text-caption mb-1 d-block">
                First Flight (Maiden Date)
              </label>
              <v-text-field
                v-model="form.maiden_flight"
                type="date"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2 font-mono"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12">
              <label class="font-mono text-caption mb-1 d-block">
                Image URL (Optional)
              </label>
              <v-text-field
                v-model="form.image_url"
                :rules="[rules.optionalUrl]"
                placeholder="https://example.com/booster.jpg"
                prepend-inner-icon="mdi-image-outline"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-1 font-mono"
              />
              <div
                class="font-mono text-caption text-secondary mb-2"
                style="font-size: 0.68rem;"
              >
                Optional: If omitted, the vehicle automatically renders our aerospace blueprint vector.
              </div>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <label class="font-mono text-caption mb-1 d-block">
                Engineering Summary &amp; Mission Profile <span class="text-error">*</span>
              </label>
              <v-textarea
                v-model="form.description"
                :rules="[rules.requiredDescription]"
                placeholder="Detail the propulsion stages, payload to orbit capabilities, and mission parameters..."
                rows="3"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
            </v-col>

            <!-- Operational Status Toggles -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-switch
                v-model="form.active"
                color="success"
                label="Operational Hardware Status"
                density="compact"
                hide-details
              />
            </v-col>
            <v-col
              cols="12"
              sm="6"
            >
              <v-switch
                v-model="form.reusable"
                color="info"
                label="Reusable Architecture"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </div>

      <!-- Actions Footer -->
      <div
        class="pa-4 pa-sm-5 border-t d-flex justify-end ga-2"
        style="border-color: var(--titanium-border) !important;"
      >
        <v-btn
          variant="text"
          color="secondary"
          class="text-none"
          rounded="sm"
          @click="closeModal"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          prepend-icon="mdi-check"
          class="text-none font-weight-bold px-5"
          rounded="sm"
          :loading="isSubmitting"
          @click="handleSubmit"
        >
          Register Vehicle
        </v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import { useRocketStore } from '@/stores/rocketStore'
import type { NewRocketPayload } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'rocket-added', name: string): void
}>()

const store = useRocketStore()
const isOpen = ref(props.modelValue)
const isFormValid = ref(false)
const isSubmitting = ref(false)
const formRef = ref()

const rules = {
  requiredFullName: (v: string) => {
    if (!v || !v.trim()) return 'Vehicle full name is required.'
    if (v.trim().length < 3) return 'Name must be at least 3 characters long.'
    return true
  },
  requiredDescription: (v: string) => {
    if (!v || !v.trim()) return 'Engineering description is required.'
    if (v.trim().length < 10) return 'Description must be at least 10 characters long.'
    return true
  },
  optionalCost: (v: string | number) => {
    if (v === '' || v === null || v === undefined) return true
    const num = Number(v)
    if (isNaN(num)) return 'Cost must be a valid number.'
    if (num < 0) return 'Launch cost cannot be negative.'
    return true
  },
  optionalUrl: (v: string) => {
    if (!v || !v.trim()) return true
    try {
      const url = new URL(v.trim())
      return (url.protocol === 'http:' || url.protocol === 'https:') || 'Must be an HTTP or HTTPS URL.'
    } catch {
      return 'Please enter a valid URL (e.g. https://example.com/booster.jpg).'
    }
  },
  optionalCountry: (v: string) => {
    if (!v || !v.trim()) return true
    if (v.trim().length > 4) return 'Country code must be 2–4 characters (e.g. USA).'
    return true
  },
}

const form = reactive<NewRocketPayload>({
  name: '',
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  maiden_flight: '',
  country_code: 'USA',
  active: true,
  reusable: true,
})

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
    if (val) {
      resetForm()
    }
  }
)

watch(
  () => isOpen.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

function resetForm() {
  form.name = ''
  form.full_name = ''
  form.description = ''
  form.image_url = ''
  form.launch_cost = ''
  form.maiden_flight = ''
  form.country_code = 'USA'
  form.active = true
  form.reusable = true
  formRef.value?.resetValidation()
}

function closeModal() {
  isOpen.value = false
}

async function handleSubmit() {
  if (!formRef.value) return

  isSubmitting.value = true
  try {
    const { valid } = await formRef.value.validate()
    if (!valid) {
      return
    }

    const registeredRocket = store.addRocket({
      ...form,
      name: form.name.trim() || form.full_name.trim(),
    })

    emit('rocket-added', registeredRocket.full_name)
    closeModal()
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.modal-icon-wrap {
  width: 32px;
  height: 32px;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 4px;
}

:deep(.v-field) {
  background-color: #0b111e !important;
}

:deep(.v-field__outline) {
  --v-field-border-opacity: 0.4 !important;
  color: #475569 !important;
}

:deep(.v-field--focused .v-field__outline) {
  --v-field-border-opacity: 1 !important;
  color: #38bdf8 !important;
}

:deep(.v-field--error .v-field__outline) {
  color: #f43f5e !important;
}

:deep(input),
:deep(textarea) {
  color: #f8fafc !important;
}

:deep(input::placeholder),
:deep(textarea::placeholder) {
  color: #94a3b8 !important;
  opacity: 1 !important;
}

:deep(.v-messages__message) {
  color: #f43f5e !important;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  margin-top: 2px;
}

label {
  color: #cbd5e1 !important;
  font-weight: 500;
}
</style>
