<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="600"
      persistent
    >
      <template #activator="{ props: activatorProps }">
        <v-btn
          v-bind="activatorProps"
          prepend-icon="mdi-plus"
          class="add-rocket-btn"
          elevation="0"
        >
          Add Rocket
        </v-btn>
      </template>

      <v-card
        rounded="xl"
        class="pa-2"
      >
        <v-card-title class="text-h5 pa-6 pb-2 d-flex align-center">
          <v-icon
            icon="mdi-rocket-launch"
            color="primary"
            class="mr-3"
          />
          Add New Rocket
        </v-card-title>

        <v-card-text class="px-6 py-2">
          <v-form
            ref="formRef"
            v-model="formValid"
            @submit.prevent="handleSubmit"
          >
            <v-text-field
              v-model="form.full_name"
              label="Rocket Name *"
              placeholder="e.g. Starship Super Heavy"
              variant="outlined"
              density="comfortable"
              :rules="[rules.required, rules.minLength]"
              class="mb-2"
            />

            <v-textarea
              v-model="form.description"
              label="Description"
              placeholder="Detailed description of vehicle capabilities and payload capacity..."
              variant="outlined"
              density="comfortable"
              rows="3"
              class="mb-2"
            />

            <v-text-field
              v-model="form.image_url"
              label="Image URL"
              placeholder="https://images.example.com/rocket.jpg"
              variant="outlined"
              density="comfortable"
              :rules="[rules.url]"
              class="mb-2"
            />

            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <v-text-field
                  v-model="form.launch_cost"
                  label="Cost per Launch ($)"
                  placeholder="50000000"
                  variant="outlined"
                  density="comfortable"
                  :rules="[rules.number]"
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
              >
                <v-text-field
                  v-model="form.country_code"
                  label="Country Code"
                  placeholder="USA"
                  variant="outlined"
                  density="comfortable"
                  maxlength="6"
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
              >
                <v-text-field
                  v-model="form.maiden_flight"
                  label="First Flight"
                  variant="outlined"
                  density="comfortable"
                  type="date"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6 pt-2">
          <v-spacer />
          <v-btn
            variant="text"
            rounded="lg"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            rounded="lg"
            :disabled="!formValid"
            @click="handleSubmit"
          >
            Save Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success Feedback Snackbar -->
    <v-snackbar
      v-model="showSuccessSnackbar"
      color="success"
      location="top right"
      :timeout="3500"
      rounded="lg"
    >
      <div class="d-flex align-center">
        <v-icon
          icon="mdi-check-circle"
          class="mr-2"
        />
        <span>Rocket "<strong>{{ addedRocketName }}</strong>" successfully added!</span>
      </div>
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRockets } from '@/composables/useRockets'

interface FormRefType {
  validate: () => Promise<{ valid: boolean }>
  reset: () => void
  resetValidation: () => void
}

const { addRocket } = useRockets()

const dialog = ref(false)
const formRef = ref<FormRefType | null>(null)
const formValid = ref(false)
const showSuccessSnackbar = ref(false)
const addedRocketName = ref('')

const initialForm = {
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: '',
  maiden_flight: '',
}

const form = reactive({ ...initialForm })

const rules = {
  required: (v: string) => !!v?.trim() || 'Rocket name is required',
  minLength: (v: string) => (v?.trim().length >= 2) || 'Must be at least 2 characters',
  url: (v: string) => {
    if (!v || !v.trim()) return true
    try {
      const url = new URL(v)
      return url.protocol === 'http:' || url.protocol === 'https:' || 'URL must start with http:// or https://'
    } catch {
      return 'Please enter a valid URL'
    }
  },
  number: (v: string) => {
    if (!v || !v.trim()) return true
    const num = Number(v)
    return (!isNaN(num) && num >= 0) || 'Must be a positive number'
  },
}

async function handleSubmit() {
  if (formRef.value) {
    const { valid } = await formRef.value.validate()
    if (!valid) return
  }

  const name = form.full_name.trim()
  addRocket({
    full_name: name,
    description: form.description.trim() || null,
    image_url: form.image_url.trim() || null,
    launch_cost: form.launch_cost.trim() || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: {
      id: 0,
      name: 'Custom Fleet',
      country_code: form.country_code.trim().toUpperCase() || 'CUSTOM',
    },
  })

  addedRocketName.value = name
  showSuccessSnackbar.value = true
  closeDialog()
}

function closeDialog() {
  dialog.value = false
  Object.assign(form, initialForm)
  formRef.value?.resetValidation()
}
</script>

<style scoped>
.add-rocket-btn {
  background-color: #0b2545 !important;
  color: #ffffff !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  letter-spacing: normal !important;
  text-transform: none !important;
  border-radius: 8px !important;
  padding: 0 18px !important;
  height: 40px !important;
  transition: background-color 0.15s ease, transform 0.15s ease;
}

.add-rocket-btn:hover {
  background-color: #133a6b !important;
  transform: translateY(-1px);
}
</style>
