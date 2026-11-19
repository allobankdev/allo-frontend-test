<template>
  <v-dialog
    :model-value="modelValue"
    max-width="650"
    persistent
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-card rounded="lg">
      <v-toolbar
        color="primary"
        density="comfortable"
      >
        <v-icon
          icon="mdi-rocket-launch"
          class="ml-4 mr-2"
        />
        <v-toolbar-title class="font-weight-bold">
          Add New Rocket
        </v-toolbar-title>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="closeDialog"
        />
      </v-toolbar>

      <v-card-text class="pa-6">
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          class="mb-4"
          icon="mdi-information-outline"
        >
          Since the Launch Library API is read-only, this newly added rocket will immediately be displayed in your current active session.
        </v-alert>

        <v-form
          ref="formRef"
          v-model="isFormValid"
          @submit.prevent="handleSubmit"
        >
          <v-row dense>
            <!-- Rocket Full Name -->
            <v-col
              cols="12"
              sm="8"
            >
              <v-text-field
                v-model="formData.full_name"
                label="Rocket Full Name *"
                placeholder="e.g. Falcon Heavy Block 5"
                variant="outlined"
                density="comfortable"
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Short Name -->
            <v-col
              cols="12"
              sm="4"
            >
              <v-text-field
                v-model="formData.name"
                label="Short Name"
                placeholder="e.g. Falcon Heavy"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Description -->
            <v-col cols="12">
              <v-textarea
                v-model="formData.description"
                label="Description *"
                placeholder="Describe the launch vehicle, configuration, or mission capabilities..."
                variant="outlined"
                density="comfortable"
                rows="3"
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Launch Cost -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.launch_cost"
                label="Estimated Launch Cost (USD)"
                placeholder="e.g. 62000000"
                type="number"
                prefix="$"
                variant="outlined"
                density="comfortable"
                hint="Cost in USD per launch"
                persistent-hint
              />
            </v-col>

            <!-- Country Code -->
            <v-col
              cols="12"
              sm="6"
            >
              <v-text-field
                v-model="formData.country_code"
                label="Manufacturer Country"
                placeholder="e.g. USA"
                variant="outlined"
                density="comfortable"
                hint="e.g. USA, IDN, EUR"
                persistent-hint
              />
            </v-col>

            <!-- Maiden Flight -->
            <v-col
              cols="12"
              sm="6"
              class="mt-2"
            >
              <v-text-field
                v-model="formData.maiden_flight"
                label="First Flight Date"
                type="date"
                variant="outlined"
                density="comfortable"
              />
            </v-col>

            <!-- Image URL -->
            <v-col
              cols="12"
              sm="6"
              class="mt-2"
            >
              <v-text-field
                v-model="formData.image_url"
                label="Image URL"
                placeholder="https://..."
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-image"
              />
            </v-col>

            <!-- Checkboxes -->
            <v-col cols="6">
              <v-switch
                v-model="formData.active"
                label="Vehicle is Active"
                color="success"
                hide-details
                density="compact"
              />
            </v-col>
            <v-col cols="6">
              <v-switch
                v-model="formData.reusable"
                label="Reusable Stages"
                color="info"
                hide-details
                density="compact"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 bg-surface-variant">
        <v-spacer />
        <v-btn
          variant="outlined"
          @click="closeDialog"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
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
import { ref, reactive } from 'vue';
import type { Rocket } from '@/types/rocket';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'submit', rocket: Omit<Rocket, 'id'>): void;
}>();

const formRef = ref();
const isFormValid = ref(false);

const initialForm = {
  full_name: '',
  name: '',
  description: '',
  launch_cost: '',
  country_code: 'USA',
  maiden_flight: '',
  image_url: '',
  active: true,
  reusable: true,
};

const formData = reactive({ ...initialForm });

const rules = {
  required: (v: string) => !!v?.trim() || 'This field is required',
};

function resetForm() {
  Object.assign(formData, initialForm);
  if (formRef.value) {
    formRef.value.resetValidation();
  }
}

function closeDialog() {
  resetForm();
  emit('update:modelValue', false);
}

function handleSubmit() {
  if (!formData.full_name || !formData.description) return;

  const rocketPayload: Omit<Rocket, 'id'> = {
    name: formData.name || formData.full_name,
    full_name: formData.full_name,
    description: formData.description,
    launch_cost: formData.launch_cost ? formData.launch_cost : null,
    maiden_flight: formData.maiden_flight || null,
    image_url: formData.image_url || null,
    active: formData.active,
    reusable: formData.reusable,
    manufacturer: {
      name: 'SpaceX',
      country_code: formData.country_code || 'USA',
    },
  };

  emit('submit', rocketPayload);
  closeDialog();
}
</script>
