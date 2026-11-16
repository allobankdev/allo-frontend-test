<template>
  <v-dialog
    v-model="isOpen"
    max-width="640"
    persistent
  >
    <v-card class="rounded-xl">
      <v-card-title class="pa-6 pb-2 d-flex align-center justify-space-between">
        <div class="d-flex align-center">
          <v-avatar
            color="primary"
            class="mr-3"
            size="36"
          >
            <v-icon
              icon="mdi-rocket-launch-outline"
              color="white"
            />
          </v-avatar>
          <div>
            <span class="text-h6 font-weight-bold">Add New Rocket</span>
            <div class="text-caption text-medium-emphasis">
              Locally registered to current session
            </div>
          </div>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="closeDialog"
        />
      </v-card-title>

      <v-divider class="mt-2" />

      <v-form
        ref="formRef"
        v-model="isFormValid"
        @submit.prevent="handleSubmit"
      >
        <v-card-text class="pa-6">
          <v-row dense>
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Rocket Name *"
                placeholder="e.g. Falcon 9 Block 5, Starship Super Heavy"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-tag-outline"
                required
              />
            </v-col>

            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description"
                placeholder="Overview, capabilities, and launch mission notes..."
                variant="outlined"
                density="comfortable"
                rows="3"
                prepend-inner-icon="mdi-text"
              />
            </v-col>

            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Image URL"
                placeholder="https://images.unsplash.com/..."
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                hint="Leave empty to use the default rocket placeholder"
                persistent-hint
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per Launch (USD)"
                placeholder="e.g. 50000000"
                type="number"
                min="0"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                placeholder="e.g. USA, IDN"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-flag-outline"
                maxlength="5"
              />
            </v-col>

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
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <v-col
              cols="12"
              sm="6"
              class="d-flex align-center justify-space-around pt-2"
            >
              <v-switch
                v-model="form.active"
                label="Active"
                color="success"
                density="compact"
                hide-details
              />
              <v-switch
                v-model="form.reusable"
                label="Reusable"
                color="info"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4 px-6 justify-end">
          <v-btn
            variant="plain"
            @click="closeDialog"
          >
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            type="submit"
            prepend-icon="mdi-check"
            :disabled="!isFormValid"
          >
            Add Rocket
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import type { VForm } from 'vuetify/components'
import { useRocketStore } from '@/stores/rockets'
import type { CreateRocketPayload } from '@/types/rocket'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'created', rocketId: string | number): void
}>()

const store = useRocketStore()
const formRef = ref<VForm | null>(null)
const isFormValid = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

const defaultForm = (): CreateRocketPayload => ({
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  active: true,
  reusable: true,
})

const form = reactive<CreateRocketPayload>(defaultForm())

const rules = {
  required: (v: string) => !!(v && v.trim()) || 'Rocket Name is required',
}

const closeDialog = () => {
  isOpen.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(form, defaultForm())
  if (formRef.value) {
    formRef.value.resetValidation()
  }
}

const handleSubmit = async () => {
  if (!form.full_name.trim()) return

  const created = store.addRocket(form)
  emit('created', created.id)
  closeDialog()
}
</script>
