<template>
  <v-dialog
    v-model="isOpen"
    max-width="580"
    persistent
  >
    <v-card
      class="rounded-xl pa-2 bg-allo-card border-subtle"
      elevation="10"
    >
      <v-card-title class="d-flex align-center justify-space-between pt-4 px-4">
        <div class="d-flex align-center">
          <v-avatar
            color="#ffbc25"
            size="36"
            class="mr-3"
          >
            <v-icon
              icon="mdi-rocket-launch"
              color="#0a101d"
              size="20"
            />
          </v-avatar>
          <span class="text-h6 font-weight-bold text-white font-montserrat">Add New Rocket</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="small"
          @click="close"
        />
      </v-card-title>

      <v-card-subtitle class="px-4 text-caption text-grey">
        Add a new launcher to the running SpaceX catalog (stored in local app state).
      </v-card-subtitle>

      <v-card-text class="pt-4 px-4">
        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="submit"
        >
          <!-- Rocket Name (Required) -->
          <v-text-field
            v-model="form.full_name"
            label="Rocket Name *"
            placeholder="e.g. Starship Block 2"
            variant="outlined"
            density="comfortable"
            color="#ffbc25"
            :rules="[rules.required]"
            prepend-inner-icon="mdi-rocket"
            class="mb-2"
          />

          <!-- Description -->
          <v-textarea
            v-model="form.description"
            label="Rocket Description"
            placeholder="Overview of the launch vehicle, capabilities, and purpose..."
            variant="outlined"
            density="comfortable"
            color="#ffbc25"
            rows="3"
            prepend-inner-icon="mdi-text-box-outline"
            class="mb-2"
          />

          <v-row dense>
            <!-- Launch Cost -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Cost Per Launch (USD)"
                placeholder="e.g. 50000000"
                variant="outlined"
                density="comfortable"
                color="#ffbc25"
                type="number"
                prefix="$"
                prepend-inner-icon="mdi-currency-usd"
                class="mb-2"
              />
            </v-col>

            <!-- Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                color="#ffbc25"
                prepend-inner-icon="mdi-earth"
                class="mb-2"
              />
            </v-col>
          </v-row>

          <v-row dense>
            <!-- First Flight Date -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight Date"
                type="date"
                variant="outlined"
                density="comfortable"
                color="#ffbc25"
                prepend-inner-icon="mdi-calendar"
                class="mb-2"
              />
            </v-col>

            <!-- Image URL -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.image_url"
                label="Rocket Image URL"
                placeholder="https://..."
                variant="outlined"
                density="comfortable"
                color="#ffbc25"
                prepend-inner-icon="mdi-image"
                class="mb-2"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 justify-end ga-2">
        <v-btn
          variant="text"
          color="grey"
          @click="close"
        >
          Cancel
        </v-btn>
        <v-btn
          color="#ffbc25"
          variant="elevated"
          prepend-icon="mdi-plus"
          class="font-weight-bold text-black rounded-lg"
          :disabled="!isFormValid"
          @click="submit"
        >
          Add Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue'
import type { NewRocketInput } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created', rocket: NewRocketInput): void
}>()

const isOpen = ref(props.modelValue)
watch(
  () => props.modelValue,
  val => {
    isOpen.value = val
  }
)

const formRef = ref<{ resetValidation: () => void } | null>(null)
const isFormValid = ref(false)

const form = reactive<NewRocketInput>({
  full_name: '',
  description: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  image_url: '',
})

const rules = {
  required: (v: string) => !!v?.trim() || 'Rocket Name is required',
}

function resetForm() {
  form.full_name = ''
  form.description = ''
  form.launch_cost = ''
  form.country_code = 'USA'
  form.maiden_flight = ''
  form.image_url = ''
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

function close() {
  emit('update:modelValue', false)
  resetForm()
}

function submit() {
  if (!form.full_name?.trim()) return

  emit('created', { ...form })
  close()
}
</script>

<style scoped>
.bg-allo-card {
  background-color: #131c2e !important;
}
.border-subtle {
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
}
.font-montserrat {
  font-family: 'Montserrat', sans-serif !important;
}
</style>
