<template>
  <v-form
    ref="formRef"
    @submit.prevent="onSubmit"
  >
    <!-- Image Picker -->
    <v-file-input
      v-model="imageFile"
      :error-messages="errors.imageUrl"
      label="Rocket Image"
      accept="image/*"
      variant="outlined"
      density="comfortable"
      prepend-icon=""
      prepend-inner-icon="mdi-camera"
      class="mb-0"
      @update:model-value="onImageSelected"
    />

    <!-- Image Preview (Optional) -->
    <div
      v-if="imageUrl"
      class="mb-3"
    >
      <v-img
        :src="imageUrl"
        max-height="150"
        contain
        class="border rounded"
      />
    </div>

    <!-- Rocket Name -->
    <v-text-field
      v-model="name"
      :error-messages="errors.name"
      label="Rocket Name"
      variant="outlined"
      density="comfortable"
      class="mb-3"
    />

    <!-- Country Code -->
    <v-text-field
      v-model="countryCode"
      :error-messages="errors.countryCode"
      label="Country Code (e.g., USA)"
      variant="outlined"
      density="comfortable"
      class="mb-3"
    />

    <!-- First Flight -->
    <!-- TODO: upgrade vuetify version, can use v-date-input -->
    <v-text-field
      v-model="maidenFlight"
      :error-messages="errors.maidenFlight"
      label="First Flight Date"
      variant="outlined"
      density="comfortable"
      class="mb-3"
      type="date"
    />

    <!-- Cost per Launch -->
    <v-number-input
      v-model="launchCost"
      :error-messages="errors.launchCost"
      label="Cost per Launch"
      variant="outlined"
      density="comfortable"
      class="mb-3"
    />

    <!-- Description -->
    <v-textarea
      v-model="description"
      :error-messages="errors.description"
      label="Description"
      variant="outlined"
      density="comfortable"
      rows="3"
      class="mb-3"
    />

    <div class="d-flex justify-end gap-2 mt-4">
      <v-btn
        color="grey-darken-1"
        variant="text"
        @click="$emit('cancel')"
      >
        Cancel
      </v-btn>
      <v-btn
        color="primary"
        variant="flat"
        type="submit"
      >
        Save Rocket
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { z } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';
import type { Rocket } from '../rocket.types';
import { onUnmounted, ref } from 'vue';

const emit = defineEmits<{
  (e: 'submit', rocketData: Omit<Rocket, 'id'>): void;
  (e: 'cancel'): void;
}>();

// Define validation schema using Zod
const validationSchema = toTypedSchema(
  z.object({
    name: z.string().min(1, 'Rocket name is required'),
    countryCode: z.string()
      .trim()
      .toUpperCase()
      .length(3)
      .regex(/^[A-Z]{3}$/, "Invalid country code"),
    maidenFlight: z.string().date().optional().nullable(),
    description: z.string().min(1, 'Rocket description is required'),
    launchCost: z.number().positive().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
  })
);

// Initialize useForm from Vee-Validate with Zod schema
const { handleSubmit, errors, resetForm } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    countryCode: '',
    maidenFlight: null,
    description: '',
    launchCost: null,
    imageUrl: null,
  },
});

// Temporary state to hold the raw file object for v-file-input
const imageFile = ref<File | File[] | null>(null);

// Bind each field with useField
const { value: imageUrl } = useField<string | null>('imageUrl');
const { value: name } = useField<string>('name');
const { value: countryCode } = useField<string>('countryCode');
const { value: maidenFlight } = useField<string | null>('maidenFlight');
const { value: launchCost } = useField<number | null>('launchCost');
const { value: description } = useField<string>('description');

// Handle image selection and convert to local URL
const onImageSelected = (file: File | File[] | null) => {
  const targetFile = Array.isArray(file) ? file[0] : file;

  // Clean up memory when change file or clear file
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }

  if (targetFile) {
    // Create a local object URL (fast & lightweight)
    imageUrl.value = URL.createObjectURL(targetFile);
  } else {
    imageUrl.value = '';
  }
};

// Clean up memory when the component is unmounted or destroyed
onUnmounted(() => {
  if (imageUrl.value) {
    URL.revokeObjectURL(imageUrl.value);
  }
});

// Handle validated form submission
const onSubmit = handleSubmit((values) => {
  emit('submit', {
    name: values.name,
    description: values.description,
    countryCode: values.countryCode,
    maidenFlight: values.maidenFlight || null,
    launchCost: values.launchCost?.toString() || null,
    imageUrl: values.imageUrl || null,
  });

  resetForm();
});
</script>
