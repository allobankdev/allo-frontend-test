<template>
  <v-dialog
    v-model="isOpen"
    max-width="600"
    persistent
  >
    <template #activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        prepend-icon="mdi-plus"
        variant="elevated"
        class="text-none font-weight-bold"
      >
        Add Rocket
      </v-btn>
    </template>

    <v-card class="rounded-lg">
      <v-card-title class="pa-5 d-flex justify-space-between align-center bg-primary text-black">
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-rocket-launch"
            class="mr-2"
          />
          <span class="text-h6 font-weight-bold">Add New Rocket</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          color="black"
          size="small"
          @click="closeDialog"
        />
      </v-card-title>

      <v-card-text class="pa-5">
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4 text-caption"
        >
          Because the Launch Library 2 API is read-only, newly added rockets will be stored locally in your active session.
        </v-alert>

        <v-form v-model="isFormValid">
          <v-row dense>
            <!-- Rocket Name -->
            <v-col cols="12">
              <v-text-field
                v-model="form.full_name"
                label="Rocket Name *"
                placeholder="e.g. Starship Block 2"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-format-title"
              />
            </v-col>

            <!-- Family / Variant -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.family"
                label="Family / Series"
                placeholder="e.g. Starship / Falcon"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-tag-outline"
              />
            </v-col>

            <!-- Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="form.country_code"
                label="Country Code"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-earth"
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="form.description"
                label="Description *"
                placeholder="Describe the rocket vehicle specifications and purpose..."
                variant="outlined"
                density="comfortable"
                rows="3"
                :rules="[rules.required]"
                prepend-inner-icon="mdi-text"
              />
            </v-col>

            <!-- Image URL -->
            <v-col cols="12">
              <v-text-field
                v-model="form.image_url"
                label="Image URL"
                placeholder="https://example.com/rocket.jpg"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image-outline"
                hint="Leave blank to use a default high-res rocket image"
                persistent-hint
              />
            </v-col>

            <!-- Launch Cost -->
            <v-col
              cols="12"
              sm="6"
              class="mt-2"
            >
              <v-text-field
                v-model="form.launch_cost"
                label="Cost per Launch ($)"
                placeholder="e.g. 50000000"
                type="number"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-currency-usd"
              />
            </v-col>

            <!-- First Flight -->
            <v-col
              cols="12"
              sm="6"
              class="mt-2"
            >
              <v-text-field
                v-model="form.maiden_flight"
                label="First Flight Date"
                placeholder="YYYY-MM-DD"
                type="date"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-calendar"
              />
            </v-col>

            <!-- Active Status -->
            <v-col cols="12">
              <v-switch
                v-model="form.active"
                label="Active Status (In Service)"
                color="success"
                hide-details
                density="compact"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 bg-surface-bright">
        <v-spacer />
        <v-btn
          variant="text"
          color="medium-emphasis"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          prepend-icon="mdi-check"
          :disabled="!isFormValid"
          @click="handleSubmit"
        >
          Save Rocket
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRocketStore } from '@/stores/rocket'
import type { NewRocketInput } from '@/types/rocket'

const emit = defineEmits<{
  (e: 'created', id: string | number): void
}>()

const store = useRocketStore()
const isOpen = ref(false)
const isFormValid = ref(false)

const defaultForm: NewRocketInput = {
  full_name: '',
  description: '',
  image_url: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  active: true,
  family: 'Custom',
}

const form = reactive<NewRocketInput>({ ...defaultForm })

const rules = {
  required: (v: string) => !!v?.trim() || 'This field is required',
}

function resetForm(): void {
  Object.assign(form, defaultForm)
}

function closeDialog(): void {
  isOpen.value = false
  resetForm()
}

function handleSubmit(): void {
  if (!form.full_name.trim() || !form.description.trim()) {
    return
  }

  const created = store.addRocket({
    ...form,
  })

  isOpen.value = false
  resetForm()
  emit('created', created.id)
}
</script>
