<template>
  <v-dialog
    :model-value="modelValue"
    max-width="800px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h6 d-flex justify-space-between align-center">
        Add New Rocket
        <v-btn
          icon
          @click="cancelForm"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Form Fields -->
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-row>
            <!-- Name Field -->
            <v-col cols="12">
              <v-text-field
                v-model="rocket.name"
                label="Rocket Name"
                outlined
                :error="errors.name"
                :error-messages="errors.name ? ['Name is required'] : []"
                @input="clearError('name')"
              />
            </v-col>

            <!-- Description Field -->
            <v-col cols="12">
              <v-textarea
                v-model="rocket.description"
                label="Description"
                outlined
                :error="errors.description"
                :error-messages="errors.description ? ['Description is required'] : []"
                @input="clearError('description')"
              />
            </v-col>

            <!-- Country Field -->
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="rocket.country"
                label="Country"
                outlined
              />
            </v-col>

            <!-- Cost per Launch Field -->
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="rocket.cost_per_launch"
                label="Cost per Launch"
                type="number"
                outlined
              />
            </v-col>

            <!-- First Flight Field -->
            <v-col
              cols="12"
              md="4"
            >
              <v-text-field
                v-model="rocket.first_flight"
                label="First Flight"
                outlined
                type="date"
              />
            </v-col>

            <!-- Image Upload -->
            <v-col
              cols="12"
            >
              <v-file-input
                v-model="rocket.imageFile"
                label="Rocket Image"
                accept="image/*"
                outlined
                :error="errors.image"
                :error-messages="errors.image ? ['Image is required and must be an image file'] : []"
                @change="onImageChange"
              />
            </v-col>

            <!-- Image Preview -->
            <v-col
              v-if="previewImage"
              class="mt-4 text-center"
              cols="12"
            >
              <v-img
                :src="previewImage"
                max-height="200"
                contain
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn
          text
          @click="cancelForm"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!valid"
          @click="submitForm"
        >
          Submit
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { IDataRocket } from '@/types/rocket';

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['submitted', 'cancel', 'update:modelValue']);

interface RocketFormData extends Omit<IDataRocket, 'id'> {
  imageFile: File | null;
}

const rocket = reactive<RocketFormData>({
  name: '',
  cost_per_launch: 0,
  first_flight: '',
  country: '',
  description: '',
  flickr_images: [],
  imageFile: null,
});

const errors = reactive({
  name: false,
  description: false,
  country: false,
  image: false,
});

const previewImage = ref<string | null>(null);
const valid = ref(false);

const isImageFile = (file: File | null) => {
  return file ? file.type.startsWith('image/') : false;
};

const onImageChange = () => {
  errors.image = false;

  if (rocket.imageFile && isImageFile(rocket.imageFile)) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.value = reader.result as string;
    };
    reader.readAsDataURL(rocket.imageFile);
  } else {
    previewImage.value = null;
    errors.image = true;
  }
};

const submitForm = async () => {
  errors.name = !rocket.name.trim();
  errors.description = !rocket.description.trim();
  errors.image = !rocket.imageFile || !isImageFile(rocket.imageFile);

  if (!errors.name && !errors.description && !errors.image) {
    const imageUrl = await readFileAsDataUrl(rocket.imageFile!);

    const result: Omit<IDataRocket, 'id'> = {
      name: rocket.name,
      cost_per_launch: rocket.cost_per_launch,
      first_flight: rocket.first_flight,
      country: rocket.country,
      description: rocket.description,
      flickr_images: [imageUrl],
    };
    console.log('Emitting submitted event:', result);
    emit('submitted', result);
    emit('update:modelValue', false);
    resetForm();
  }
};

const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const cancelForm = () => {
  emit('cancel');
  emit('update:modelValue', false);
  resetForm();
};

const resetForm = () => {
  rocket.name = '';
  rocket.description = '';
  rocket.country = '';
  rocket.cost_per_launch = 0;
  rocket.first_flight = '';
  rocket.flickr_images = [];
  rocket.imageFile = null;
  previewImage.value = null;
  Object.keys(errors).forEach((key) => (errors[key as keyof typeof errors] = false));
};

const clearError = (field: string) => {
  errors[field as keyof typeof errors] = false;
};
</script>
