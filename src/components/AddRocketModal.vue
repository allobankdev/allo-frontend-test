<template>
  <v-dialog
    v-model="isOpen"
    max-width="620"
    persistent
    scrollable
  >
    <v-card
      color="surface"
      class="rounded-lg border"
      style="border-color: rgba(255, 255, 255, 0.12) !important;"
    >
      <!-- Dialog Header -->
      <v-card-title
        class="d-flex align-center justify-space-between pa-4 pa-sm-5 border-b"
        style="border-color: rgba(255, 255, 255, 0.08) !important;"
      >
        <div class="d-flex align-center">
          <v-avatar
            color="primary"
            size="32"
            class="me-3"
            rounded="sm"
          >
            <v-icon
              icon="mdi-plus"
              color="#090d16"
              size="20"
            />
          </v-avatar>
          <div>
            <div
              class="text-subtitle-1 font-weight-bold text-uppercase"
              style="letter-spacing: 1px;"
            >
              Register New Rocket
            </div>
            <div class="text-caption text-secondary">
              In-Memory Configuration (SpaceX Fleet)
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
      </v-card-title>

      <!-- Form Body -->
      <v-card-text class="pa-4 pa-sm-5">
        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-row dense>
            <!-- Full Name -->
            <v-col cols="12">
              <label class="text-caption text-secondary font-weight-medium text-uppercase mb-1 d-block">
                Rocket Full Name <span class="text-error">*</span>
              </label>
              <v-text-field
                v-model="form.full_name"
                :rules="[rules.required]"
                placeholder="e.g. Starship Super Heavy Block 2"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
            </v-col>

            <!-- Short Name -->
            <v-col
              cols="12"
              sm="6"
            >
              <label class="text-caption text-secondary font-weight-medium text-uppercase mb-1 d-block">
                Vehicle Name / Model
              </label>
              <v-text-field
                v-model="form.name"
                placeholder="e.g. Starship Block 2"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
            </v-col>

            <!-- Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <label class="text-caption text-secondary font-weight-medium text-uppercase mb-1 d-block">
                Country Code
              </label>
              <v-text-field
                v-model="form.country_code"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
            </v-col>

            <!-- Cost Per Launch & Maiden Flight -->
            <v-col
              cols="12"
              sm="6"
            >
              <label class="text-caption text-secondary font-weight-medium text-uppercase mb-1 d-block">
                Cost Per Launch (USD)
              </label>
              <v-text-field
                v-model="form.launch_cost"
                type="number"
                placeholder="e.g. 10000000"
                prefix="$"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <label class="text-caption text-secondary font-weight-medium text-uppercase mb-1 d-block">
                First Flight Date
              </label>
              <v-text-field
                v-model="form.maiden_flight"
                type="date"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12">
              <label class="text-caption text-secondary font-weight-medium text-uppercase mb-1 d-block">
                Image URL (Optional)
              </label>
              <v-text-field
                v-model="form.image_url"
                placeholder="https://example.com/rocket.jpg"
                prepend-inner-icon="mdi-image-outline"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
              <div
                class="text-caption text-secondary"
                style="margin-top: -8px; font-size: 0.72rem !important;"
              >
                Leave empty to use our custom aerospace telemetry blueprint placeholder.
              </div>
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <label class="text-caption text-secondary font-weight-medium text-uppercase mb-1 d-block">
                Vehicle Description <span class="text-error">*</span>
              </label>
              <v-textarea
                v-model="form.description"
                :rules="[rules.required]"
                placeholder="Describe the launch vehicle specs, payload capacity, and mission profile..."
                rows="3"
                variant="outlined"
                density="comfortable"
                color="primary"
                class="mb-2"
              />
            </v-col>

            <!-- Toggles for Active and Reusable -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-switch
                v-model="form.active"
                color="success"
                label="Active Launch System"
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
                label="Reusable Vehicle"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <!-- Actions -->
      <v-card-actions
        class="pa-4 pa-sm-5 border-t d-flex justify-end ga-2"
        style="border-color: rgba(255, 255, 255, 0.08) !important;"
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
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Add to Fleet
        </v-btn>
      </v-card-actions>
    </v-card>
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
  (e: 'rocket-added', rocketName: string): void
}>()

interface FormInstance {
  validate: () => Promise<{ valid: boolean }>
  resetValidation: () => void
}

const store = useRocketStore()
const formRef = ref<FormInstance | null>(null)
const isFormValid = ref(false)
const isOpen = ref(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    isOpen.value = val
  }
)

watch(
  () => isOpen.value,
  (val) => {
    emit('update:modelValue', val)
  }
)

const initialFormState: NewRocketPayload = {
  full_name: '',
  name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  active: true,
  reusable: true,
}

const form = reactive<NewRocketPayload>({ ...initialFormState })

const rules = {
  required: (v: unknown) => Boolean(v) || 'This field is required',
}

function closeModal() {
  isOpen.value = false
  resetForm()
}

function resetForm() {
  Object.assign(form, initialFormState)
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

async function handleSubmit() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const payload: NewRocketPayload = {
    full_name: form.full_name,
    name: form.name || form.full_name,
    description: form.description,
    image_url: form.image_url || null,
    launch_cost: form.launch_cost || null,
    country_code: form.country_code || 'USA',
    maiden_flight: form.maiden_flight || null,
    active: form.active,
    reusable: form.reusable,
  }

  const newRocket = store.addRocket(payload)
  emit('rocket-added', newRocket.full_name)
  closeModal()
}
</script>
