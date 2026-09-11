<template>
  <v-form
    ref="formRef"
    @submit.prevent="submitForm"
  >
    <div class="mb-6">
      <div class="d-flex align-center ga-2 mb-4">
        <v-icon
          icon="mdi-text-box-outline"
          color="primary"
          size="20"
        />

        <h3 class="text-subtitle-1 font-weight-bold">
          Basic Information
        </h3>
      </div>

      <v-text-field
        v-model="form.full_name"
        label="Rocket name"
        placeholder="e.g. Falcon 9"
        variant="outlined"
        density="comfortable"
        :rules="[required, maxLength(100)]"
        counter="100"
        class="mb-3"
      />

      <v-textarea
        v-model="form.description"
        label="Description"
        placeholder="Write a short description about the rocket"
        variant="outlined"
        density="comfortable"
        :rules="[maxLength(1000)]"
        counter="1000"
        rows="4"
        auto-grow
      />
    </div>

    <v-divider class="mb-6" />

    <div class="mb-6">
      <div class="d-flex align-center ga-2 mb-4">
        <v-icon
          icon="mdi-image-outline"
          color="primary"
          size="20"
        />

        <h3 class="text-subtitle-1 font-weight-bold">
          Rocket Image
        </h3>
      </div>

      <v-file-input
        v-model="imageFile"
        label="Upload image"
        accept="image/png,image/jpeg,image/webp"
        prepend-inner-icon="mdi-upload"
        prepend-icon=""
        variant="outlined"
        density="comfortable"
        :rules="[validImage]"
        show-size
        clearable
      />

      <div
        v-if="previewUrl"
        class="image-preview mt-3"
      >
        <v-img
          :src="previewUrl"
          height="220"
          cover
          class="rounded-lg"
        />

        <div class="image-preview__label">
          <v-icon
            icon="mdi-check-circle"
            size="16"
            class="mr-1"
          />
          Image selected
        </div>
      </div>
    </div>

    <v-divider class="mb-6" />

    <div class="mb-6">
      <div class="d-flex align-center ga-2 mb-4">
        <v-icon
          icon="mdi-rocket-launch-outline"
          color="primary"
          size="20"
        />

        <h3 class="text-subtitle-1 font-weight-bold">
          Launch Information
        </h3>
      </div>

      <v-row>
        <v-col
          cols="12"
          sm="7"
        >
          <v-text-field
            v-model="form.launch_cost"
            label="Cost per launch"
            placeholder="e.g. 67000000"
            type="number"
            min="0"
            prefix="$"
            variant="outlined"
            density="comfortable"
            :rules="[nonNegativeNumber]"
          />
        </v-col>

        <v-col
          cols="12"
          sm="5"
        >
          <v-text-field
            v-model="form.country_code"
            label="Country code"
            placeholder="US"
            maxlength="2"
            variant="outlined"
            density="comfortable"
            :rules="[validCountryCode]"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="form.maiden_flight"
            label="First flight"
            type="date"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </div>

    <div class="d-flex justify-end ga-3 pt-2">
      <v-btn
        variant="text"
        size="large"
        @click="handleCancel"
      >
        Cancel
      </v-btn>

      <v-btn
        type="submit"
        color="primary"
        size="large"
        prepend-icon="mdi-plus"
      >
        Add Rocket
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { onBeforeUnmount, watch, reactive, ref } from "vue";

import type { Rocket } from "@/types/rocket";

const emit = defineEmits<{
  submit: [rocket: Rocket];
  cancel: [];
}>();

const formRef = ref();
const previewUrl = ref<string | null>(null);
const imageFile = ref<File | File[] | null>(null);

const form = reactive({
  full_name: "",
  description: "",
  launch_cost: "",
  country_code: "",
  maiden_flight: "",
});

function resetForm() {
  form.full_name = "";
  form.description = "";
  form.launch_cost = "";
  form.country_code = "";
  form.maiden_flight = "";

  imageFile.value = null;

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

  formRef.value?.resetValidation();
}

function handleCancel() {
  resetForm();
  emit("cancel");
}

const required = (value: string) => !!value?.trim() || "This field is required";

const maxLength = (max: number) => (value: string) =>
  !value || value.length <= max || `Maximum ${max} characters`;

function getSelectedFile(): File | null {
  if (!imageFile.value) {
    return null;
  }

  if (Array.isArray(imageFile.value)) {
    return imageFile.value[0] ?? null;
  }

  return imageFile.value;
}

const validImage = () => {
  const file = getSelectedFile();

  if (!file) {
    return true;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }

  const maxSize = 5 * 1024 * 1024;

  if (file.size > maxSize) {
    return "Image must be smaller than 5 MB";
  }

  return true;
};

const nonNegativeNumber = (value: string) => {
  if (!value) return true;

  const number = Number(value);

  return (
    (!Number.isNaN(number) && number >= 0) || "Cost must be a positive number"
  );
};

const validCountryCode = (value: string) => {
  if (!value) return true;

  return /^[A-Za-z]{2}$/.test(value.trim()) || "Use a 2-letter country code";
};

async function submitForm() {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  const image = getSelectedFile();

  const rocket: Rocket = {
    id: `local-${crypto.randomUUID()}`,
    full_name: form.full_name.trim(),
    description: form.description.trim() || null,
    image_url: image ? URL.createObjectURL(image) : null,
    launch_cost: form.launch_cost || null,
    maiden_flight: form.maiden_flight || null,
    manufacturer: {
      id: 0,
      name: "Custom",
      country_code: form.country_code.trim().toUpperCase() || null,
    },
  };

  emit("submit", rocket);
  resetForm();
}

watch(imageFile, () => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
    previewUrl.value = null;
  }

  const file = getSelectedFile();

  if (file) {
    previewUrl.value = URL.createObjectURL(file);
  }
});

onBeforeUnmount(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value);
  }
});
</script>

<style scoped>
.image-preview {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.image-preview__label {
  position: absolute;
  left: 12px;
  bottom: 12px;

  display: flex;
  align-items: center;

  padding: 6px 10px;
  border-radius: 8px;

  background: rgba(255, 255, 255, 0.9);
  color: rgb(var(--v-theme-on-surface));

  font-size: 12px;
  font-weight: 500;
}
</style>
