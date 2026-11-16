
<template>
  <div>
    <v-btn
      color="primary"
      prepend-icon="mdi-plus"
      @click="dialog = true"
    >
      Add Rocket
    </v-btn>

    <v-dialog v-model="dialog" max-width="550">
      <v-card rounded="lg">
        <v-card-title class="text-h5 pa-5">
          Add New Rocket
        </v-card-title>

        <v-divider />

        <v-card-text class="pa-5">
          <v-form ref="formRef" @submit.prevent="submitRocket">
            <v-text-field
              v-model="form.full_name"
              label="Rocket Name"
              placeholder="Enter rocket name"
              variant="outlined"
              :rules="[requiredRule]"
              class="mb-2"
            />

            <v-textarea
              v-model="form.description"
              label="Description"
              placeholder="Enter rocket description"
              variant="outlined"
              rows="3"
              :rules="[requiredRule]"
              class="mb-2"
            />

            <!-- Image Upload -->
            <v-file-input
              :model-value="imageFile"
              label="Rocket Image"
              placeholder="Choose an image"
              prepend-icon="mdi-camera"
              accept="image/png,image/jpeg,image/webp"
              variant="outlined"
              show-size
              clearable
              @update:model-value="handleImageChange"
            />

            <v-alert
              v-if="imageError"
              type="error"
              variant="tonal"
              density="compact"
              class="mb-3"
            >
              {{ imageError }}
            </v-alert>

            <!-- Image Preview -->
            <v-img
              v-if="previewUrl"
              :src="previewUrl"
              height="180"
              rounded="lg"
              cover
              class="mb-4"
              alt="Rocket image preview"
            />

            <v-text-field
              v-model="form.country_code"
              label="Country Code"
              placeholder="Example: US"
              variant="outlined"
              hint="Optional, for example US"
              persistent-hint
            />
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-5">
          <v-spacer />

          <v-btn
            variant="text"
            @click="closeDialog"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            variant="flat"
            @click="submitRocket"
          >
            Save Rocket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';
import type { Rocket } from '@/types/rocket';

type NewRocketPayload = Omit<Rocket, 'id' | 'image_url'> & {
  imageFile: File | null;
};

const emit = defineEmits<{
  add: [rocket: NewRocketPayload];
}>();

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
];

const dialog = ref(false);
const imageFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const imageError = ref('');

const formRef = ref<{
  validate: () => Promise<{ valid: boolean }>;
} | null>(null);

const form = ref({
  full_name: '',
  description: '',
  country_code: '',
});

const requiredRule = (value: string) =>
  !!value?.trim() || 'This field is required';

// Handle image selection
function handleImageChange(value: File | File[] | null) {
  const file = Array.isArray(value)
    ? value[0] ?? null
    : value;

  imageError.value = '';

  if (!file) {
    imageFile.value = null;
    return;
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    imageFile.value = null;
    imageError.value = 'Only PNG, JPG, and WebP images are allowed.';
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    imageFile.value = null;
    imageError.value = 'Image size must not exceed 5 MB.';
    return;
  }

  imageFile.value = file;
}

// Check actual image file signature
async function isValidImageSignature(file: File): Promise<boolean> {
  const bytes = new Uint8Array(
    await file.slice(0, 12).arrayBuffer()
  );

  // PNG signature
  const isPng =
    bytes.length >= 8 &&
    [137, 80, 78, 71, 13, 10, 26, 10]
      .every((byte, index) => bytes[index] === byte);

  // JPEG signature
  const isJpeg =
    bytes.length >= 3 &&
    bytes[0] === 0xFF &&
    bytes[1] === 0xD8 &&
    bytes[2] === 0xFF;

  // WebP signature: RIFF....WEBP
  const isWebp =
    bytes.length >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP';

  return isPng || isJpeg || isWebp;
}

// Generate safe local preview URL
watch(imageFile, (file) => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }

  previewUrl.value = file
    ? URL.createObjectURL(file)
    : null;
});

// Submit new rocket
async function submitRocket() {
  const result = await formRef.value?.validate();

  if (!result?.valid) {
    return;
  }

  if (imageFile.value) {
    const validSignature = await isValidImageSignature(
      imageFile.value
    );

    if (!validSignature) {
      imageError.value = 'Invalid or corrupted image file.';
      return;
    }
  }

  const newRocket: NewRocketPayload = {
    full_name: form.value.full_name.trim(),
    description: form.value.description.trim(),
    imageFile: imageFile.value,
    launch_cost: null,
    manufacturer: {
      country_code:
        form.value.country_code.trim().toUpperCase() || null,
    },
    maiden_flight: null,
  };

  emit('add', newRocket);

  resetForm();
  dialog.value = false;
}

function resetForm() {
  form.value = {
    full_name: '',
    description: '',
    country_code: '',
  };

  imageFile.value = null;
  imageError.value = '';
}

function closeDialog() {
  resetForm();
  dialog.value = false;
}

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>
